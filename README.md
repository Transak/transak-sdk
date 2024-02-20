# Transak SDK

A library for decentralised applications to onboard their global user base with fiat currency.

## Example usage

```html
<div id="transakMount"></div>
```

```ts
import { TransakConfig, Transak } from '@transak/transak-sdk';

const transakConfig: TransakConfig = {
  apiKey: '<your-api-key>', // (Required)
  environment: Transak.ENVIRONMENTS.STAGING/Transak.ENVIRONMENTS.PRODUCTION, // (Required)
  containerId: 'transakMount', // Id of the element where you want to initialize the iframe
  // .....
  // For the full list of customisation options check the link below
};

let transak = new Transak(transakConfig);

transak.init();

// To get all SDK events
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
  transak.cleanup();
});
```

Refer here for the full list of [customisation options](https://docs.transak.com/docs/query-parameters)

For in-depth instructions on integrating Transak, view [our complete documentation.](https://docs.transak.com/docs/integration-options)

### Using Modal UI

If you want to use our modal UI, do not pass the `containerId` and use `transak.close()` instead of `transak.cleanup()`

### React Gotchas

Do not forget to clean up by using the `transak.cleanup()` or `transak.close()`

```ts
useEffect(() => {
  return () => {
    transak.cleanup();
  };
}, []);
```
