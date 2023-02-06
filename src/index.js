import events from 'events';
import queryStringLib from 'query-string';
import { config, errorsLang, EVENTS } from './constants';
import { closeSVGIcon } from './assets/svg';
import { getCSS } from './assets/css';
import { version } from '../package.json';

const eventEmitter = new events.EventEmitter();

function TransakSDK(partnerData) {
  this.sdkVersion = version;
  this.partnerData = partnerData;
  this.isInitialised = false;
  this.EVENTS = EVENTS;
  this.ALL_EVENTS = '*';
  this.ERROR = 'TRANSAK_ERROR';
}

TransakSDK.prototype.on = function (type, cb) {
  if (type === this.ALL_EVENTS) {
    for (let eventName in EVENTS) {
      eventEmitter.on(EVENTS[eventName], cb);
    }
  }
  if (EVENTS[type]) eventEmitter.on(type, cb);
  if (type === this.ERROR) eventEmitter.on(this.ERROR, cb);
};
TransakSDK.prototype.init = function () {
  this.modal(this);
};
TransakSDK.prototype.close = async function () {
  let modal = document.getElementById('transakFiatOnOffRamp');
  if (modal && modal.style) {
    modal.style.display = 'none';
    modal.innerHTML = '';
    await modal.remove();
  }
};
TransakSDK.prototype.closeRequest = function () {
  let iframeEl = document.getElementById('transakOnOffRampWidget');
  if (iframeEl) iframeEl.contentWindow.postMessage({
    event_id: EVENTS.TRANSAK_WIDGET_CLOSE_REQUEST,
    data: true
  }, '*');
};
TransakSDK.prototype.modal = async function () {
  try {
    if (this.partnerData) {
      let { url, width, height, partnerData } = await generateURL({ ...this.partnerData, sdkVersion: this.sdkVersion });
      let wrapper = document.createElement('div');
      wrapper.id = 'transakFiatOnOffRamp';
      wrapper.innerHTML = `<div class="transak_modal-overlay" id="transak_modal-overlay"></div><div class="transak_modal" id="transak_modal"><div class="transak_modal-content"><span class="transak_close">${closeSVGIcon}</span><div class="transakContainer"><iframe id="transakOnOffRampWidget" allow="camera;microphone;fullscreen;payment" allowFullScreen src="${url}" style="width: ${width}; height: ${height}"></iframe></div></div></div>`;
      let container = document.getElementsByTagName('body');
      if (!container) container = document.getElementsByTagName('html');
      if (!container) container = document.getElementsByTagName('div');
      await container[0].appendChild(wrapper);
      await setStyle(this.partnerData.themeColor, width, height);
      let modal = document.getElementById('transakFiatOnOffRamp');
      let span = document.getElementsByClassName('transak_close')[0];

      //Prevent background scrolling when overlay appears
      document.documentElement.style.overflow = 'hidden';
      document.body.scroll = 'no';

      if (modal && modal.style) modal.style.display = 'block';
      this.isInitialised = true;
      eventEmitter.emit(EVENTS.TRANSAK_WIDGET_INITIALISED, {
        status: true,
        eventName: EVENTS.TRANSAK_WIDGET_INITIALISED
      });
      // When the user clicks on <span> (x), close the modal
      span.onclick = () => {
        return this.closeRequest()
      }
      // When the user clicks anywhere outside of the modal, close it
      window.onclick = (event) => {
        if (event.target === document.getElementById('transak_modal-overlay')) this.closeRequest()
      }
      if (window.addEventListener) window.addEventListener('message', handleMessage);
      else window.attachEvent('onmessage', handleMessage);
    }
  } catch (e) {
    throw (e)
  }
};

async function generateURL(configData) {
  let partnerData = {}, environment = 'development', queryString = '', width = '100%', height = '100%';

  if (configData) {
    configData.hostURL = window.location.origin;
    if (configData.apiKey) {
      if (configData.environment) {
        if (config.ENVIRONMENT[configData.environment]) environment = config.ENVIRONMENT[configData.environment].NAME
      }
      try {
        environment = environment.toUpperCase();
        Object.keys(configData).map((key) => {
          if (configData[key] instanceof Object) {
            partnerData[key] = JSON.stringify(configData[key]);
          } else partnerData[key] = configData[key];
        });
        queryString = queryStringLib.stringify(partnerData, { arrayFormat: 'comma' });
      } catch (e) {
        throw (e)
      }
    } else throw (errorsLang.ENTER_API_KEY);
    if (configData.widgetWidth) width = configData.widgetWidth;
    if (configData.widgetHeight) height = configData.widgetHeight;
  }
  return { width, height, partnerData, url: `${config.ENVIRONMENT[environment].FRONTEND}?${queryString}` }
}

async function setStyle(themeColor, width, height) {
  let style = await document.createElement('style');
  style.innerHTML = getCSS(themeColor, height, width);
  let modal = document.getElementById('transakFiatOnOffRamp');
  if (modal) await modal.appendChild(style);
}

function handleMessage(event) {
  let environment;
  if (event.origin === config.ENVIRONMENT.LOCAL_DEVELOPMENT.FRONTEND) environment = config.ENVIRONMENT.LOCAL_DEVELOPMENT.NAME;
  else if (event.origin === config.ENVIRONMENT.PRODUCTION.FRONTEND) environment = config.ENVIRONMENT.PRODUCTION.NAME;
  else if (event.origin === config.ENVIRONMENT.STAGING.FRONTEND) environment = config.ENVIRONMENT.STAGING.NAME;

  if (environment) {
    if (event && event.data && event.data.event_id) {
      switch (event.data.event_id) {
        case EVENTS.TRANSAK_WIDGET_CLOSE: {
          eventEmitter.emit(EVENTS.TRANSAK_WIDGET_CLOSE, {
            status: true,
            eventName: EVENTS.TRANSAK_WIDGET_CLOSE
          });

          //enable background scrolling when overlay appears
          document.documentElement.style.overflow = 'scroll';
          document.body.scroll = 'yes';
          let modal = document.getElementById('transakFiatOnOffRamp');
          if (modal && modal.style) {
            modal.style.display = 'none';
            modal.innerHTML = '';
            modal.remove();
          }
          break;
        }
        case EVENTS.TRANSAK_ORDER_CREATED: {
          eventEmitter.emit(EVENTS.TRANSAK_ORDER_CREATED, {
            status: event.data.data,
            eventName: EVENTS.TRANSAK_ORDER_CREATED
          });
          break;
        }
        case EVENTS.TRANSAK_ORDER_CANCELLED: {
          eventEmitter.emit(EVENTS.TRANSAK_ORDER_CANCELLED, {
            status: event.data.data,
            eventName: EVENTS.TRANSAK_ORDER_CANCELLED
          });
          break;
        }
        case EVENTS.TRANSAK_ORDER_FAILED: {
          eventEmitter.emit(EVENTS.TRANSAK_ORDER_FAILED, {
            status: event.data.data,
            eventName: EVENTS.TRANSAK_ORDER_FAILED
          });
          break;
        }
        case EVENTS.TRANSAK_ORDER_SUCCESSFUL: {
          eventEmitter.emit(EVENTS.TRANSAK_ORDER_SUCCESSFUL, {
            status: event.data.data,
            eventName: EVENTS.TRANSAK_ORDER_SUCCESSFUL
          });
          break;
        }
        case EVENTS.TRANSAK_WIDGET_OPEN: {
          eventEmitter.emit(EVENTS.TRANSAK_WIDGET_OPEN, {
            status: true,
            eventName: EVENTS.TRANSAK_WIDGET_OPEN
          });
          break;
        }
        default: {
        }
      }
    }
  }
}

export default TransakSDK;
