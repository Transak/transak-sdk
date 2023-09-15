import { Environments } from 'Constants/environments';
import { QueryParams } from 'Types/query-params.types';

export type TransakConfig = {
  environment: Environments.STAGING | Environments.PRODUCTION;
  widgetWidth?: string;
  widgetHeight?: string;
} & QueryParams;
