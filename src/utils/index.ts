import { IConfig, IGenerateURLReturn } from "../interfaces"
import { config, errorsLang } from "../constants"
import { stringify } from "query-string"

async function generateURL(configData: IConfig) {
  const partnerData = { hostURL: window.location.origin } as IGenerateURLReturn
  let environment = "development"
  let queryString = ""
  let width = "100%"
  let height = "100%"
  if (configData) {
    if (configData.apiKey) {
      if (configData.environment) {
        if (config.ENVIRONMENT[configData.environment]) environment = config.ENVIRONMENT[configData.environment].NAME
      }
      try {
        environment = environment.toUpperCase()
        partnerData.apiKey = configData.apiKey
        if (configData.sdkVersion) partnerData.sdkVersion = configData.sdkVersion
        if (configData.cryptoCurrencyCode) partnerData.cryptoCurrencyCode = configData.cryptoCurrencyCode
        if (configData.defaultCryptoCurrency) partnerData.defaultCryptoCurrency = configData.defaultCryptoCurrency
        if (configData.walletAddress) partnerData.walletAddress = configData.walletAddress
        if (configData.themeColor) partnerData.themeColor = configData.themeColor.replace("#", "")
        if (configData.walletAddress) partnerData.walletAddress = configData.walletAddress
        if (configData.fiatAmount) partnerData.fiatAmount = configData.fiatAmount
        if (configData.defaultFiatAmount) partnerData.defaultFiatAmount = configData.defaultFiatAmount
        if (configData.defaultCryptoAmount) partnerData.defaultCryptoAmount = configData.defaultCryptoAmount
        if (configData.walletAddressesData && (configData.walletAddressesData.networks || configData.walletAddressesData.coins)) {
          const walletAddressesData = {
            ...(configData.walletAddressesData.networks ? { networks: configData.walletAddressesData.networks } : {}),
            ...(configData.walletAddressesData.coins ? { coins: configData.walletAddressesData.coins } : {}),
          }
          partnerData.walletAddressesData = JSON.stringify(walletAddressesData)
        }
        if (configData.fiatCurrency) partnerData.fiatCurrency = configData.fiatCurrency
        if (configData.countryCode) partnerData.countryCode = configData.countryCode
        if (configData.paymentMethod) partnerData.paymentMethod = configData.paymentMethod
        if (configData.defaultPaymentMethod) partnerData.defaultPaymentMethod = configData.defaultPaymentMethod
        if (configData.isAutoFillUserData) partnerData.isAutoFillUserData = configData.isAutoFillUserData
        if (configData.isFeeCalculationHidden) partnerData.isFeeCalculationHidden = configData.isFeeCalculationHidden
        if (configData.disablePaymentMethods) partnerData.disablePaymentMethods = configData.disablePaymentMethods
        if (configData.email) partnerData.email = configData.email
        if (configData.userData) partnerData.userData = JSON.stringify(configData.userData)
        if (configData.partnerOrderId) partnerData.partnerOrderId = configData.partnerOrderId
        if (configData.partnerCustomerId) partnerData.partnerCustomerId = configData.partnerCustomerId
        if (configData.exchangeScreenTitle) partnerData.exchangeScreenTitle = configData.exchangeScreenTitle
        if (configData.hideMenu) partnerData.hideMenu = configData.hideMenu
        if (configData.accessToken) partnerData.accessToken = configData.accessToken
        if (configData.hideExchangeScreen) partnerData.hideExchangeScreen = configData.hideExchangeScreen
        if (configData.isDisableCrypto) partnerData.isDisableCrypto = configData.isDisableCrypto
        if (configData.redirectURL) partnerData.redirectURL = configData.redirectURL
        if (configData.disableWalletAddressForm) partnerData.disableWalletAddressForm = configData.disableWalletAddressForm
        if (configData.cryptoCurrencyList) partnerData.cryptoCurrencyList = configData.cryptoCurrencyList.split(",")
        if (configData.networks) partnerData.networks = configData.networks.split(",")
        if (configData.defaultNetwork) partnerData.defaultNetwork = configData.defaultNetwork
        if (configData.network) partnerData.network = configData.network
        queryString = stringify(partnerData, { arrayFormat: "comma" })
      } catch (e) {
        throw e
      }
    } else throw errorsLang.ENTER_API_KEY
    if (configData.widgetWidth) width = `${configData.widgetWidth}`
    if (configData.widgetHeight) height = `${configData.widgetHeight}`
  }
  // @ts-ignore
  return { width, height, partnerData, url: `${config.ENVIRONMENT[environment].FRONTEND}?${queryString}` }
}

export { generateURL }
