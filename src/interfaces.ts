enum environments {
  PRODUCTION = "PRODUCTION",
  STAGING = "STAGING",
  DEVELOPMENT = "DEVELOPMENT",
}

export interface IConfigBasic {
  apiKey: string
  environment: environments
  cryptoCurrencyCode?: string
  fiatCurrencyCode?: string
  themeColor?: string
  defaultCryptoCurrency?: string
  defaultFiatCurrency?: string
  walletAddress?: string
  fiatAmount?: number
  defaultFiatAmount?: number
  defaultCryptoAmount?: number
  fiatCurrency?: string
  countryCode?: string
  paymentMethod?: string
  defaultPaymentMethod?: string
  isAutoFillUserData?: boolean
  isFeeCalculationHidden?: boolean
  email?: string
  disablePaymentMethods?: string
  partnerOrderId?: string
  partnerCustomerId?: string
  exchangeScreenTitle?: string
  hideMenu?: boolean
  accessToken?: string
  hideExchangeScreen?: boolean
  isDisableCrypto?: boolean
  redirectURL?: string
  disableWalletAddressForm?: boolean
  defaultNetwork?: string
  network?: string
  widgetWidth?: string | number
  widgetHeight?: string | number
}
export interface IQueryParams extends IConfigBasic {
  networks?: string
  cryptoCurrencyList?: string
  userData?: {
    firstName: string
    lastName: string
    email: string
    mobileNumber: string
    dob: string
    address: {
      addressLine1: string
      addressLine2: string
      city: string
      state: string
      postCode: string
      countryCode: string
    }
  }
  walletAddressesData?: {
    networks?: {
      [key: string]: { address: string; addressAdditionalData?: string }
    }
    coins?: {
      [key: string]: { address: string; addressAdditionalData?: string }
    }
  }
}
export interface IGenerateURLReturn extends IConfigBasic {
  userData: string
  hostURL: string
  sdkVersion: string
  walletAddressesData: string
  networks: string[]
  cryptoCurrencyList: string[]
}
export interface IConfig extends IQueryParams {
  sdkVersion: string
}
