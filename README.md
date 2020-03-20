# Transak SDK
[![Build](https://travis-ci.org/joemccann/dillinger.svg)]()
 A JavaScript library for decentralised applications to onboard their global user base with fiat currency.
### Installation
To use the Transak widget with your javascript application, you will need to use `[@transak/transak-sdk](https://www.npmjs.com/package/@transak/transak-sdk)` (Transak’s  JavaScript SDK).
Add the Transak SDK as a dependency using `yarn` or `npm`:
```sh
# Using yarn
$ yarn add @transak/transak-sdk

# Using npm
$ npm install @transak/transak-sdk
```
### Example usage
```sh
import transakSDK from '@transak/transak-sdk'

let transak = new transakSDK({
    apiKey: '4fcd6904-706b-4aff-bd9d-77422813bbb7',  // Your API Key
    environment: 'STAGING', // STAGING/PRODUCTION
    defaultCryptoCurrency: 'ETH',
    walletAddress: '', // Your customer wallet address
    themeColor: '000000', // App theme color in hex
    fiatCurrency: '', // INR/GBP
    email: '', // Your customer email address
    redirectURL: '',
    hostURL: window.location.origin,
    widgetHeight: '550px',
    widgetWidth: '450px'
});

transak.init();

// To get all the events
transak.on(transak.ALL_EVENTS, (data) => {
		console.log(data)
});

// This will trigger when the user marks payment is made.
transak.on(transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (orderData) => {
    console.log(orderData);
    transak.close();
});
```

For in-depth instructions on integrating Transak, view [our complete documentation.](https://transak.com/integrate)