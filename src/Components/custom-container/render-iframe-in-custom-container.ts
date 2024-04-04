import { generateGlobalTransakUrl } from 'Utils/generate-global-transak-url';
import { createIframe } from 'Utils/create-iframe';
import { TransakConfig } from 'Types/sdk-config.types';
import { insertCustomContainerStyleToHtmlHead } from './insert-custom-container-style-to-html-head';

export function renderIframeInCustomContainer(config: TransakConfig) {
  const styleElement = insertCustomContainerStyleToHtmlHead();
  const iframeElement = createIframe(generateGlobalTransakUrl(config));

  if (config.containerId) {
    const containerIdElement = document.getElementById(config.containerId);

    if (containerIdElement) {
      containerIdElement.appendChild(iframeElement);
    } else {
      throw new Error('[Transak SDK] => Please enter a valid containerId');
    }
  }

  return { styleElement, iframeElement };
}
