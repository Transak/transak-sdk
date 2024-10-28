import events from 'events';
import { Environments } from 'Constants/environments';
import { Events } from 'Constants/events';
import { renderIframeInCustomContainer } from 'Components/custom-container/render-iframe-in-custom-container';
import { makeHandleEvents } from 'Utils/handle-events';
import { renderIframeInModal } from 'Components/modal/render-iframe-in-modal';
import { TransakConfig } from 'Types/sdk-config.types';

const eventEmitter = new events.EventEmitter();

class Transak {
  readonly #config: TransakConfig;

  #styleElement?: HTMLStyleElement;

  #rootElement?: HTMLDivElement;

  #iframeElement?: HTMLIFrameElement;

  #handleMessage: (event: MessageEvent<{ event_id: unknown; data: unknown }>) => void;

  #isInitialized = false;

  static readonly ENVIRONMENTS = Environments;

  static readonly EVENTS = Events;

  constructor(transakConfig: TransakConfig) {
    if (!transakConfig?.apiKey) throw new Error('[Transak SDK] => Please enter your API Key');

    this.#config = transakConfig;
    this.#handleMessage = makeHandleEvents(eventEmitter);
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
    this.#styleElement?.remove();
    this.#removeEventListener();
    this.#iframeElement?.remove();
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
      const { styleElement, iframeElement } = renderIframeInCustomContainer(this.#config);

      this.#styleElement = styleElement;
      this.#iframeElement = iframeElement;
    } else {
      const { styleElement, rootElement, iframeElement } = renderIframeInModal(this.#config, this.#closeRequest);

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
