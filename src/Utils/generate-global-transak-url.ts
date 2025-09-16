import qs from 'query-string';
import packageJson from 'package.json';
import { validateURL, isValidURL } from 'Utils/validate-url';
import { TransakConfig } from 'Types/sdk-config.types';

export function generateGlobalTransakUrl(configData: TransakConfig) {
  const { name: sdkName, version: sdkVersion } = packageJson;
  const { referrer, widgetUrl } = configData || {};

  if (!isValidURL(referrer) || !isValidURL(widgetUrl)) {
    throw new Error('referrer and widgetUrl are required and must be valid URLs');
  }

  const urlString = qs.stringifyUrl(
    {
      url: widgetUrl,
      query: { sdkName, sdkVersion },
    },
    { arrayFormat: 'comma' },
  );

  return validateURL(urlString);
}
