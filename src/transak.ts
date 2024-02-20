import events from 'events';
import { Environments } from 'Constants/environments';
import { Events } from 'Constants/events';
import { createIframe } from 'Utils/create-iframe';
import { makeHandleMessage } from 'Utils/handle-message';
import { renderInModal } from 'Utils/render-in-modal';
import { TransakConfig } from 'Types/sdk-config.types';

const eventEmitter = new events.EventEmitter();

class Transak {
  readonly #config: TransakConfig;

  #styleElement?: HTMLStyleElement;

  #rootElement?: HTMLDivElement;

  #iframeElement?: HTMLIFrameElement;

  #handleMessage: (event: MessageEvent<{ event_id: Events; data: unknown }>) => void;

  #isInitialized = false;

  static readonly ENVIRONMENTS = Environments;

  static readonly EVENTS = Events;

  constructor(transakConfig: TransakConfig) {
    if (!transakConfig?.apiKey) throw new Error('[Transak SDK] => Please enter your API Key');

    this.#config = transakConfig;
    this.#handleMessage = makeHandleMessage(eventEmitter, this.close);
  }

  static on = (type: '*' | keyof typeof Events, cb: (data: unknown) => void) => {
    if (type === '*') {
      (Object.keys(Events) as (keyof typeof Events)[]).forEach((eventName) => {
        eventEmitter.on(Events[eventName], cb);
      });
    } else if (Events[type]) {
      eventEmitter.on(type, cb);
    }
  };

  init = () => {
    if (!this.#isInitialized) {
      this.#renderIframe();
      this.#isInitialized = true;
    }
  };

  cleanup = () => {
    this.#removeEventListener();
    this.#iframeElement = undefined;
    this.#isInitialized = false;
  };

  close = () => {
    this.#styleElement?.remove();
    this.#rootElement?.remove();
    this.#removeEventListener();
    this.#iframeElement = undefined;
    this.#isInitialized = false;
  };

  getUser = () => {
    this.#iframeElement?.contentWindow?.postMessage({ event_id: Events.TRANSAK_GET_USER_REQUEST }, '*');
  };

  logoutUser = () => {
    this.#iframeElement?.contentWindow?.postMessage({ event_id: Events.TRANSAK_LOGOUT_USER_REQUEST }, '*');
  };

  #renderIframe = () => {
    window.addEventListener('message', this.#handleMessage);

    if (this.#config.containerId) {
      const containerIdElement = document.getElementById(this.#config.containerId) as HTMLElement;
      this.#iframeElement = createIframe(this.#config);

      if (containerIdElement) {
        containerIdElement.appendChild(this.#iframeElement);
      } else {
        throw new Error('[Transak SDK] => Please enter a valid containerId');
      }
    } else {
      const { styleElement, rootElement, iframeElement } = renderInModal(this.#config, this.#closeRequest);
      this.#styleElement = styleElement;
      this.#rootElement = rootElement;
      this.#iframeElement = iframeElement;
    }
  };

  #closeRequest = () => {
    this.#iframeElement?.contentWindow?.postMessage({ event_id: Events.TRANSAK_WIDGET_CLOSE_REQUEST }, '*');
  };

  #removeEventListener = () => {
    eventEmitter.removeAllListeners();
    window.removeEventListener('message', this.#handleMessage);
  };
}

export { Transak };
