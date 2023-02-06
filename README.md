# Transak SDK

A JavaScript library for decentralised applications to onboard their global user base with fiat currency.

## Installation

```sh
# Using yarn
$ yarn add @transak/transak-sdk

# Using npm
$ npm install @transak/transak-sdk
```

## Example usage

Refer here for the full list of [customisation options](https://docs.transak.com/docs/query-parameters)

```js
import transakSDK from '@transak/transak-sdk';

let transak = new transakSDK({
  apiKey: '<your-api-key>', // (Required)
  environment: '<environment: STAGING/PRODUCTION>', // (Required)
  // .....
  // For the full list of customisation options check the link above
});

transak.init();

// To get all the events
transak.on(transak.ALL_EVENTS, (data) => {
  console.log(data);
});

// This will trigger when the user closed the widget
transak.on(transak.EVENTS.TRANSAK_WIDGET_CLOSE, (orderData) => {
  transak.close();
});

// This will trigger when the user marks payment is made
transak.on(transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (orderData) => {
  console.log(orderData);
  transak.close();
});
```

For in-depth instructions on integrating Transak, view [our complete documentation.](https://docs.transak.com)
