export function getCSS(themeColor: string, width: string, height: string) {
  const closeIconHeight = 36;
  const closeIconHeightOnePart = 36 / 3;
  const closeIconHeightTwoParts = (36 / 3) * 2;

  return `
    #transakRoot {
      z-index: 9997;
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background: rgba(0, 0, 0, 0.6);
    }

    .transak-modal {
      z-index: 9998;
      position: fixed;
      width: ${width};
      height: calc(${height} - ${closeIconHeightTwoParts}px);
      top: 50%;
      left: 50%;
      transform: translate(-50%, calc(-50% - ${closeIconHeightOnePart}px));
      margin-top: ${closeIconHeightTwoParts}px;
    }

    #transakCloseIcon {
      z-index: 9999;
      position: absolute;
      width: 36px;
      height: ${closeIconHeight}px;
      top: -${closeIconHeightTwoParts}px;
      right: 0;
      transition: 0.5s;
      color: #${themeColor};
      background: white;
      border-radius: 50%;
    }

    #transakCloseIcon:hover,
    #transakCloseIcon:focus {
      color: white;
      background: #${themeColor};
      cursor: pointer;
    }

    #transakIframe{
      width: 100%;
      height: 100%;
      border: none;
      border-radius: 10px;
      background: white;
    }

    @media screen and (max-width: 600px) {
      .transak-modal {
        width: 100%;
        height: calc(100% - ${closeIconHeightTwoParts}px);
      }

      #transakIframe{
        border-radius: 10px 10px 0 0;
      }
    }
  `;
}
