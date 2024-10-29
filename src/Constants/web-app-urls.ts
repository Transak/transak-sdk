import { Environments } from './environments';

export const WebAppUrls = {
  [Environments.DEVELOPMENT]: 'https://localhost:5005/',
  [Environments.STAGING]: 'https://global-stg.transak.com',
  [Environments.PRODUCTION]: 'https://global.transak.com',
  [Environments.STAGING_ORDERS]: 'https://global-stg.transak.com/user/orders',
  [Environments.PRODUCTION_ORDERS]: 'https://global.transak.com/user/orders',
  [Environments.STAGING_ORDERS_NOT_LOGGED_IN]: 'https://global-stg.transak.com/login/otp',
  [Environments.PRODUCTION_ORDERS_NOT_LOGGED_IN]: 'https://global.transak.com/login/otp',
};
