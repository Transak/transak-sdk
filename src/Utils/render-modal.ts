import { closeIcon } from 'Assets/svg/close-icon';
import { generateURL } from 'Utils/generate-url';
import { TransakConfig } from 'Types/sdk-config.types';

export function renderModal(config: TransakConfig, closeRequest: () => void) {
  const url = generateURL(config);
  const modal = document.createElement('div');

  modal.id = 'transakRoot';
  modal.innerHTML = `
    <div class="transak-modal">
      ${closeIcon}
      <iframe id="transakIframe" allow="camera;microphone;payment" src="${url}"></iframe>
    </div>
  `;
  modal.onclick = () => closeRequest();

  document.getElementsByTagName('body')[0].appendChild(modal);

  document.getElementById('transakCloseIcon')?.addEventListener('click', () => closeRequest());

  return modal;
}
