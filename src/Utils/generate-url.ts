import qs from 'query-string';
import Pako from 'pako';
import { WebAppUrls } from 'Constants/web-app-urls';
import { TransakConfig } from 'Types/sdk-config.types';
import { Environments } from 'Constants/environments';

export function generateURL(configData: TransakConfig) {
  const { environment = Environments.STAGING } = configData;
  const partnerData = {};
  let queryString = '';

  // TODO: Remove this logic after enforcing strict alignment to Query Param docs
  Object.keys(configData).forEach((key) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (['walletAddressesData', 'userData', 'nftData'].includes(key)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      partnerData[key] = JSON.stringify(configData[key]);
      if (key === 'nftData') {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        partnerData[key] = btoa(configData[key]);
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    } else partnerData[key] = configData[key];
  });

  if (configData && configData.calldata) {
    const compressCallData = Pako.deflate(configData.calldata);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    partnerData.calldata = compressCallData.toLocaleString();
  }

  queryString = qs.stringify(partnerData, { arrayFormat: 'comma' });

  return `${WebAppUrls[environment]}?${queryString}`;
}
