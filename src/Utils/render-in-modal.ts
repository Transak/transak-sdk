import { closeIcon } from 'Assets/svg/close-icon';
import { createIframe } from 'Utils/create-iframe';
import { renderInModalStyles } from 'Utils/render-in-modal.styles';
import { TransakConfig } from 'Types/sdk-config.types';

export function renderInModal(config: TransakConfig, closeRequest: () => void) {
  const styleElement = renderInModalStyles(config);
  const rootElement = document.createElement('div');
  const modal = document.createElement('div');
  const iframeElement = createIframe(config);

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
