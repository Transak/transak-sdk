import qs from 'query-string';
import { WebAppUrls } from 'Constants/web-app-urls';
import { TransakConfig } from 'Types/sdk-config.types';
import { Environments } from 'Constants/environments';

export function generateURL(configData: TransakConfig) {
  const { environment = Environments.STAGING } = configData;
  const partnerData = {};
  let queryString = '';

  // TODO: Remove this logic after enforcing strict alignment to Query Param docs
  Object.keys(configData).forEach((key) => {
    if(key === 'email'){
      // @ts-ignore
      configData[key] = encodeURIComponent(configData[key]);
    }

    if(key === 'redirectURL'){
      // @ts-ignore
      configData[key] = encodeURIComponent(configData[key]);
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (configData[key] instanceof Object) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      partnerData[key] = JSON.stringify(configData[key]);
      if(key === 'userData'){
      // @ts-ignore
        partnerData[key] = encodeURIComponent(partnerData[key]);
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    } else partnerData[key] = configData[key];
  });

  queryString = qs.stringify(partnerData, { arrayFormat: 'comma' });

  return `${WebAppUrls[environment]}?${queryString}`;
}
