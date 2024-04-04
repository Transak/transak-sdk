import qs from 'query-string';
import pako from 'pako';
import { WebAppUrls } from 'Constants/web-app-urls';
import { TransakConfig } from 'Types/sdk-config.types';
import { Environments } from 'Constants/environments';

export function generateGlobalTransakUrl(configData: TransakConfig) {
  const { environment = Environments.STAGING } = configData;
  const queryParams = {};
  let queryString = '';

  (Object.keys(configData) as (keyof TransakConfig)[]).forEach((key) => {
    if (['environment', 'widgetWidth', 'widgetHeight'].includes(key)) return;

    if (['walletAddressesData', 'userData'].includes(key)) {
      try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        queryParams[key] = JSON.stringify(configData[key]);
      } catch (e) {
        /* empty */
      }

      return;
    }

    if (['nftData', 'sourceTokenData', 'cryptoCurrencyData', 'tokenData'].includes(key)) {
      try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        queryParams[key] = btoa(JSON.stringify(configData[key]));
      } catch (e) {
        /* empty */
      }

      return;
    }

    if (['calldata'].includes(key)) {
      try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        queryParams[key] = btoa(String.fromCharCode.apply(null, pako.deflate(configData[key])));
      } catch (e) {
        /* empty */
      }

      return;
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    queryParams[key] = configData[key];
  });

  queryString = qs.stringify(queryParams, { arrayFormat: 'comma' });

  return `${WebAppUrls[environment]}?${queryString}`;
}
