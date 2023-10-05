# Transak SDK

A library for decentralised applications to onboard their global user base with fiat currency.

## Installation

```sh
# Using yarn
$ yarn add @transak/transak-sdk

# Using npm
$ npm install @transak/transak-sdk
```

## Example usage

```ts
import { TransakConfig, Transak } from '@transak/transak-sdk';

const transakConfig: TransakConfig = {
  apiKey: '<your-api-key>', // (Required)
  environment: Transak.ENVIRONMENTS.STAGING/Transak.ENVIRONMENTS.PRODUCTION, // (Required)
  // .....
  // For the full list of customisation options check the link below
};

let transak = new Transak(transakConfig);

transak.init();

// To get all the events
Transak.on('*', (data) => {
  console.log(data);
});

// This will trigger when the user closed the widget
Transak.on(Transak.EVENTS.TRANSAK_WIDGET_CLOSE, () => {
  console.log('Transak SDK closed!');
});

/*
* This will trigger when the user has confirmed the order
* This doesn't guarantee that payment has completed in all scenarios
* If you want to close/navigate away, use the TRANSAK_ORDER_SUCCESSFUL event
*/
Transak.on(Transak.EVENTS.TRANSAK_ORDER_CREATED, (orderData) => {
  console.log(orderData);
});

/*
* This will trigger when the user marks payment is made
* You can close/navigate away at this event
*/
Transak.on(Transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (orderData) => {
  console.log(orderData);
  transak.close();
});
```

Refer here for the full list of [customisation options](https://docs.transak.com/docs/query-parameters)

For in-depth instructions on integrating Transak, view [our complete documentation.](https://docs.transak.com/docs/integration-options)

## Migration Guide for v2

[This guide](https://github.com/Transak/transak-sdk/wiki/Migration-Guide-for-v2) will help you to upgrade to v2 successfully!
