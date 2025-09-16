import events from 'events';
import { Events } from 'Constants/events';
import { renderIframeInCustomContainer } from 'Components/custom-container/render-iframe-in-custom-container';
import { renderIframeInModal } from 'Components/modal/render-iframe-in-modal';
import { TransakConfig } from 'Types/sdk-config.types';

const eventEmitter = new events.EventEmitter();

class Transak {
  readonly #config: TransakConfig;

  #styleElement?: HTMLStyleElement;

  #rootElement?: HTMLDivElement;

  #iframeElement?: HTMLIFrameElement;

  #isInitialized = false;

  static readonly EVENTS = Events;

  constructor(transakConfig: TransakConfig) {
    if (!transakConfig?.widgetUrl) throw new Error('[Transak SDK] => widgetUrl is required');

    this.#config = transakConfig;
  }

  static on = (type: keyof typeof Events, cb: (data: unknown) => void) => {
    if (Events[type]) {
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

  #handleMessage = (event: MessageEvent<{ event_id: Events; data: unknown }>) => {
    if (event?.data?.event_id && this.#isInitialized) {
      eventEmitter.emit(event.data.event_id, event.data.data);
    }
  };
}

export { Transak };
