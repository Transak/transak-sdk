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
  tokenID: string[];
  collectionAddress: string;
  price: number[];
  quantity: number;
  nftType: string;
  nftName?: string;
  imageURL?: string;
};

type ColorMode = 'LIGHT' | 'DARK';

type SourceTokenData = {
  sourceTokenCode: string;
  sourceTokenAmount: number;
};

type CryptoCurrencyData = {
  cryptoCurrencyCode: string;
  cryptoCurrencyName: string;
  cryptoCurrencyImageURL: string;
};

type TokenData = {
  tokenID: string[];
  collectionAddress: string;
  marketplace: string;
  normalizeRoyalties: boolean;
  nftName?: string;
  imageURL?: string;
};

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
  sourceTokenData?: SourceTokenData[];
  cryptoCurrencyData?: CryptoCurrencyData[];
  contractId?: string;
  tokenData?: TokenData[];
  isTransakStreamOffRamp?: boolean;
};
