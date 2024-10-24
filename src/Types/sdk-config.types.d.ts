import { Environments } from 'Constants/environments';
import { QueryParams } from 'Types/query-params.types';

export type TransakConfig = {
  environment:
    | Environments.STAGING
    | Environments.PRODUCTION
    | Environments.STAGING_ORDERS_NOT_LOGGED_IN
    | Environments.PRODUCTION_ORDERS_NOT_LOGGED_IN
    | Environments.STAGING_ORDERS
    | Environments.PRODUCTION_ORDERS;
  widgetWidth?: string;
  widgetHeight?: string;
  containerId?: string;
} & QueryParams;
