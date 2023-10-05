import events from 'events';
import { Environments } from 'Constants/environments';
import { Events } from 'Constants/events';
import { setStyle } from 'Utils/set-style';
import { renderModal } from 'Utils/render-modal';
import { makeHandleMessage } from 'Utils/handle-message';
import { TransakConfig } from 'Types/sdk-config.types';

const eventEmitter = new events.EventEmitter();

class Transak {
  readonly #config: TransakConfig;

  #styleElement?: HTMLStyleElement;

  #rootElement?: HTMLDivElement;

  #iframeElement?: HTMLIFrameElement;

  #isInitialized = false;

  static readonly ENVIRONMENTS = Environments;

  static readonly EVENTS = Events;

  constructor(transakConfig: TransakConfig) {
    if (!transakConfig?.apiKey) throw new Error('[Transak SDK] => Please enter your API Key');

    this.#config = transakConfig;
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
      this.openModal();
      this.#isInitialized = true;
    }
  };

  openModal = () => {
    window.addEventListener('message', makeHandleMessage(eventEmitter, this.close));

    this.#styleElement = setStyle(this.#config);
    this.#rootElement = renderModal(this.#config, this.#closeRequest);
    this.#iframeElement = document.getElementById('transakIframe') as HTMLIFrameElement;
  };

  close = () => {
    this.#styleElement?.remove();
    this.#rootElement?.remove();
    this.#isInitialized = false;
  };

  #closeRequest = () => {
    this.#iframeElement?.contentWindow?.postMessage(
      {
        event_id: Events.TRANSAK_WIDGET_CLOSE_REQUEST,
        data: true,
      },
      '*',
    );
  };
}

export { Transak };
