type User = {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  dob: string;
  address: {
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postCode: string;
    countryCode: string;
  };
};

type WalletAddresses = {
  networks?: Record<string, { address: string; addressAdditionalData?: string }>;
  coins?: Record<string, { address: string; addressAdditionalData?: string }>;
};

type NFT = {
  imageURL?: string;
  nftName?: string;
  collectionAddress: string;
  tokenID: string[] | number[];
  price: number[];
  quantity: number;
  nftType: string;
};

type ColorMode = 'LIGHT' | 'DARK';

export type QueryParams = {
  apiKey: string;
  exchangeScreenTitle?: string;
  productsAvailed?: string | string[];
  defaultFiatCurrency?: string;
  fiatCurrency?: string;
  countryCode?: string;
  excludeFiatCurrencies?: string | string[];
  defaultNetwork?: string;
  network?: string;
  networks?: string | string[];
  defaultPaymentMethod?: string;
  paymentMethod?: string;
  disablePaymentMethods?: string | string[];
  defaultCryptoAmount?: number;
  defaultCryptoCurrency?: string;
  cryptoCurrencyCode?: string;
  cryptoCurrencyList?: string | string[];
  isFeeCalculationHidden?: boolean;
  hideExchangeScreen?: boolean;
  email?: string;
  userData?: User;
  isAutoFillUserData?: boolean;
  themeColor?: string;
  hideMenu?: boolean;
  redirectURL?: string;
  partnerOrderId?: string;
  partnerCustomerId?: string;
  defaultFiatAmount?: number;
  fiatAmount?: number;
  walletAddress?: string;
  walletAddressesData?: WalletAddresses;
  disableWalletAddressForm?: boolean;
  isNFT?: boolean;
  tokenId?: number;
  tradeType?: string;
  contractAddress?: string;
  calldata?: string;
  smartContractAddress?: string;
  nftData?: NFT[];
  estimatedGasLimit?: number;
  cryptoAmount?: number;
  walletRedirection?: boolean;
  referrerDomain?: string;
  colorMode?: ColorMode;
  backgroundColors?: string | string[];
  textColors?: string | string[];
  borderColors?: string | string[];
  isTransakOne?: boolean;
  sourceTokenData?: string;
  cryptoCurrencyData?: string;
};
