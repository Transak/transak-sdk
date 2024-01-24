import { closeIcon } from 'Assets/svg/close-icon';
import { TransakConfig } from 'Types/sdk-config.types';

export function renderModal(config: TransakConfig, closeRequest: () => void) {
  const rootElement = document.createElement('div');

  Object.assign(rootElement, {
    id: 'transakRoot',
    onclick: () => closeRequest()
  })
  
  const modal = document.createElement('div');
  modal.innerHTML = `
    <div class="transak-modal">
      ${closeIcon}
    </div>
  `;

  document.getElementsByTagName('body')[0].appendChild(rootElement);
  document.getElementById('transakCloseIcon')?.addEventListener('click', () => closeRequest());

  return {
    rootElement,
    modal
  };
}
