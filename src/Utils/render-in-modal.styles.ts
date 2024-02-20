import { getCSS } from 'Assets/css';
import { TransakConfig } from 'Types/sdk-config.types';

export function renderInModalStyles(config: TransakConfig) {
  const { themeColor = '1461db', widgetWidth = '480px', widgetHeight = '650px' } = config;
  const style = document.createElement('style');

  style.innerHTML = getCSS(themeColor, widgetWidth, widgetHeight);

  document.getElementsByTagName('head')[0]?.appendChild(style);

  return style;
}
