import { closeIcon } from 'Assets/svg/close-icon';
import { generateGlobalTransakUrl } from 'Utils/generate-global-transak-url';
import { createIframe } from 'Utils/create-iframe';
import { TransakConfig } from 'Types/sdk-config.types';
import { insertModalStyleToHtmlHead } from './insert-modal-style-to-html-head';

export function renderIframeInModal(config: TransakConfig, closeRequest: () => void) {
  const styleElement = insertModalStyleToHtmlHead(config);
  const rootElement = document.createElement('div');
  const modal = document.createElement('div');
  const iframeElement = createIframe(generateGlobalTransakUrl(config));

  Object.assign(modal, {
    id: 'transakModal',
    innerHTML: closeIcon,
  });

  modal.appendChild(iframeElement);

  Object.assign(rootElement, {
    id: 'transakRoot',
    onclick: () => closeRequest(),
  });

  rootElement.appendChild(modal);

  document.getElementsByTagName('body')[0].appendChild(rootElement);

  document.getElementById('transakCloseIcon')?.addEventListener('click', () => closeRequest());

  return { styleElement, rootElement, iframeElement };
}
