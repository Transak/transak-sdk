import { generateURL } from 'Utils/generate-url';
import { TransakConfig } from 'Types/sdk-config.types';

export function createIframe(config: TransakConfig) {
  const src = generateURL(config);
  const iframe = document.createElement('iframe');

  Object.assign(iframe, {
    id: 'transakIframe',
    allow: 'camera;microphone;payment',
    src,
  });

  return iframe;
}
