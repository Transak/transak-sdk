import { generateURL } from 'Utils/generate-url';
import { TransakConfig } from 'Types/sdk-config.types';

export function renderIframe(container: HTMLElement, config: TransakConfig) {
  const url = generateURL(config);
  const iframe = document.createElement('iframe');

  Object.assign(iframe, {
    id: 'transakIframe',
    allow: 'camera;microphone;payment',
    src: url
  })

  return container.appendChild(iframe);
}
