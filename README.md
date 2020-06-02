# Transak SDK
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

For the advance customization, view our [query parameter documentation.](https://integrate.transak.com/Query-Parameters-9ec523df3b874ec58cef4fa3a906f238)

### Example usage
```sh
import transakSDK from '@transak/transak-sdk'

let transak = new transakSDK({
    apiKey: '4fcd6904-706b-4aff-bd9d-77422813bbb7',  // Your API Key (Required)
    environment: 'STAGING', // STAGING/PRODUCTION (Required)
    defaultCryptoCurrency: 'ETH',
    walletAddress: '', // Your customer wallet address
    themeColor: '000000', // App theme color in hex
    email: '', // Your customer email address (Optional)
    redirectURL: '',
    hostURL: window.location.origin, // Required field
    widgetHeight: '550px',
    widgetWidth: '450px'
});

transak.init();

// To get all the events
transak.on(transak.ALL_EVENTS, (data) => {
		console.log(data)
});

// This will trigger when the user closed the widget
transak.on(transak.EVENTS.TRANSAK_WIDGET_CLOSE, (orderData) => {
    transak.close();
});

// This will trigger when the user marks payment is made.
transak.on(transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (orderData) => {
    console.log(orderData);
    transak.close();
});
```

For in-depth instructions on integrating Transak, view [our complete documentation.](https://integrate.transak.com)
