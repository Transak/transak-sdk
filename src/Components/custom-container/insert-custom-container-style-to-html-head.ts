import { generateCustomContainerCss } from './generate-custom-container-css';

export function insertCustomContainerStyleToHtmlHead() {
  const style = document.createElement('style');

  style.innerHTML = generateCustomContainerCss();

  document.getElementsByTagName('head')[0]?.appendChild(style);

  return style;
}
