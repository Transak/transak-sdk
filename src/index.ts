import { EventEmitter } from "events"
import { config, EVENTS } from "./constants"
import { IQueryParams } from "./interfaces"
import { generateURL } from "./utils"
import { closeSVGIcon } from "./assets/svg"
import { getCSS } from "./assets/css"
// @ts-ignore
import { version } from "../package.json"

const eventEmitter = new EventEmitter()

function TransakSDK(partnerData: IQueryParams) {
  // @ts-ignore
  this.sdkVersion = version
  // @ts-ignore
  this.partnerData = partnerData
}

enum eventTypes {
  ALL_EVENTS = "*",
  TRANSAK_WIDGET_INITIALISED = "TRANSAK_WIDGET_INITIALISED",
  TRANSAK_WIDGET_OPEN = "TRANSAK_WIDGET_OPEN",
  TRANSAK_WIDGET_CLOSE_REQUEST = "TRANSAK_WIDGET_CLOSE_REQUEST",
  TRANSAK_WIDGET_CLOSE = "TRANSAK_WIDGET_CLOSE",
  TRANSAK_ORDER_CREATED = "TRANSAK_ORDER_CREATED",
  TRANSAK_ORDER_CANCELLED = "TRANSAK_ORDER_CANCELLED",
  TRANSAK_ORDER_FAILED = "TRANSAK_ORDER_FAILED",
  TRANSAK_ORDER_SUCCESSFUL = "TRANSAK_ORDER_SUCCESSFUL",
  TRANSAK_ERROR = "TRANSAK_ERROR",
}

TransakSDK.prototype.on = function (type: eventTypes, cb: any) {
  if (type === eventTypes.ALL_EVENTS) {
    for (const eventName in EVENTS) {
      if (EVENTS.hasOwnProperty(eventName)) {
        // @ts-ignore
        eventEmitter.on(EVENTS[eventName], cb)
      }
    }
  }
  // @ts-ignore
  if (EVENTS[type]) eventEmitter.on(type, cb)
  if (type === eventTypes.TRANSAK_ERROR) eventEmitter.on(eventTypes.TRANSAK_ERROR, cb)
}

TransakSDK.prototype.init = function () {
  this.modal(this)
}

TransakSDK.prototype.close = async function () {
  const modal = document.getElementById("transakFiatOnOffRamp")
  if (modal && modal.style) {
    modal.style.display = "none"
    modal.innerHTML = ""
    await modal.remove()
  }
}

TransakSDK.prototype.closeRequest = function () {
  const iframeEl = document.getElementById("transakOnOffRampWidget")
  if (iframeEl) {
    // @ts-ignore
    iframeEl.contentWindow.postMessage(
      {
        event_id: EVENTS.TRANSAK_WIDGET_CLOSE_REQUEST,
        data: true,
      },
      "*"
    )
  }
}

TransakSDK.prototype.modal = async function () {
  try {
    if (this.partnerData) {
      const { url, width, height } = await generateURL({ ...this.partnerData, sdkVersion: this.sdkVersion })
      const wrapper = document.createElement("div")
      wrapper.id = "transakFiatOnOffRamp"
      wrapper.innerHTML = `<div class="transak_modal-overlay" id="transak_modal-overlay"></div><div class="transak_modal" id="transak_modal"><div class="transak_modal-content"><span class="transak_close">${closeSVGIcon}</span><div class="transakContainer"><iframe id="transakOnOffRampWidget" allow="camera;fullscreen;accelerometer;gyroscope;magnetometer" allowFullScreen src="${url}" style="width: ${width}; height: ${height}"></iframe></div></div></div>`
      let container = document.getElementsByTagName("body")
      if (!container) {
        // @ts-ignore
        container = document.getElementsByTagName("html")
      }
      if (!container) {
        // @ts-ignore
        container = document.getElementsByTagName("div")
      }
      await container[0].appendChild(wrapper)
      await setStyle(this.partnerData.themeColor, width, height)
      const modal = document.getElementById("transakFiatOnOffRamp")
      const span = document.getElementsByClassName("transak_close")[0]

      // Prevent background scrolling when overlay appears
      document.documentElement.style.overflow = "hidden"
      // @ts-ignore
      document.body.scroll = "no"

      if (modal && modal.style) modal.style.display = "block"
      eventEmitter.emit(EVENTS.TRANSAK_WIDGET_INITIALISED, {
        status: true,
        eventName: EVENTS.TRANSAK_WIDGET_INITIALISED,
      })
      // When the user clicks on <span> (x), close the modal
      // @ts-ignore
      span.onclick = () => {
        return this.closeRequest()
      }
      // When the user clicks anywhere outside of the modal, close it
      window.onclick = (event) => {
        if (event.target === document.getElementById("transak_modal-overlay")) this.closeRequest()
      }
      if (window.addEventListener) window.addEventListener("message", handleMessage)
      else {
        // @ts-ignore
        window.attachEvent("onmessage", handleMessage)
      }
    }
  } catch (e) {
    throw e
  }
}

async function setStyle(themeColor: string, width: any, height: any) {
  const style = await document.createElement("style")
  style.innerHTML = getCSS(themeColor, height, width)
  const modal = document.getElementById("transakFiatOnOffRamp")
  if (modal) await modal.appendChild(style)
}

function handleMessage(event: any) {
  let environment
  if (event.origin === config.ENVIRONMENT.LOCAL_DEVELOPMENT.FRONTEND) environment = config.ENVIRONMENT.LOCAL_DEVELOPMENT.NAME
  else if (event.origin === config.ENVIRONMENT.PRODUCTION.FRONTEND) environment = config.ENVIRONMENT.PRODUCTION.NAME
  else if (event.origin === config.ENVIRONMENT.STAGING.FRONTEND) environment = config.ENVIRONMENT.STAGING.NAME
  else if (event.origin === config.ENVIRONMENT.DEVELOPMENT.FRONTEND) environment = config.ENVIRONMENT.DEVELOPMENT.NAME

  if (environment) {
    if (event && event.data && event.data.event_id) {
      switch (event.data.event_id) {
        case EVENTS.TRANSAK_WIDGET_CLOSE: {
          eventEmitter.emit(EVENTS.TRANSAK_WIDGET_CLOSE, {
            status: true,
            eventName: EVENTS.TRANSAK_WIDGET_CLOSE,
          })

          // enable background scrolling when overlay appears
          document.documentElement.style.overflow = "scroll"
          // @ts-ignore
          document.body.scroll = "yes"
          const modal = document.getElementById("transakFiatOnOffRamp")
          if (modal && modal.style) {
            modal.style.display = "none"
            modal.innerHTML = ""
            modal.remove()
          }
          break
        }
        case EVENTS.TRANSAK_ORDER_CREATED: {
          eventEmitter.emit(EVENTS.TRANSAK_ORDER_CREATED, {
            status: event.data.data,
            eventName: EVENTS.TRANSAK_ORDER_CREATED,
          })
          break
        }
        case EVENTS.TRANSAK_ORDER_CANCELLED: {
          eventEmitter.emit(EVENTS.TRANSAK_ORDER_CANCELLED, {
            status: event.data.data,
            eventName: EVENTS.TRANSAK_ORDER_CANCELLED,
          })
          break
        }
        case EVENTS.TRANSAK_ORDER_FAILED: {
          eventEmitter.emit(EVENTS.TRANSAK_ORDER_FAILED, {
            status: event.data.data,
            eventName: EVENTS.TRANSAK_ORDER_FAILED,
          })
          break
        }
        case EVENTS.TRANSAK_ORDER_SUCCESSFUL: {
          eventEmitter.emit(EVENTS.TRANSAK_ORDER_SUCCESSFUL, {
            status: event.data.data,
            eventName: EVENTS.TRANSAK_ORDER_SUCCESSFUL,
          })
          break
        }
        case EVENTS.TRANSAK_WIDGET_OPEN: {
          eventEmitter.emit(EVENTS.TRANSAK_WIDGET_OPEN, {
            status: true,
            eventName: EVENTS.TRANSAK_WIDGET_OPEN,
          })
          break
        }
        default: {
          break
        }
      }
    }
  }
}

export default TransakSDK
