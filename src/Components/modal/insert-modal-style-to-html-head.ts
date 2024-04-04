import { TransakConfig } from 'Types/sdk-config.types';
import { generateModalCss } from './generate-modal-css';

export function insertModalStyleToHtmlHead(config: TransakConfig) {
  const { themeColor = '1461db', widgetWidth = '480px', widgetHeight = '650px' } = config;
  const style = document.createElement('style');

  style.innerHTML = generateModalCss(themeColor, widgetWidth, widgetHeight);

  document.getElementsByTagName('head')[0]?.appendChild(style);

  return style;
}
