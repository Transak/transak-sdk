# Transak SDK

A JavaScript SDK for decentralized applications to onboard their global user base with fiat currency.

## Migrating from v2.x

- 🔗 **Widget URL Mandatory**: This SDK now only supports API-based Transak Widget URL. Please refer the detailed migration guide [here](https://docs.transak.com/docs/migration-to-api-based-transak-widget-url).

## Installation

```sh
npm i @transak/transak-sdk
```

## Example usage

```html
<div id="transakMount"></div>
```

```ts
import { TransakConfig, Transak } from '@transak/transak-sdk';

// Complete example with session URL
const initializeTransak = async () => {
  const transakConfig: TransakConfig = {
    widgetUrl: 'api-generated-widgetUrl', // Required
    referrer: 'https://your-app.com', // Required - Must be a valid URL
    containerId: 'transakMount', // Id of the element where you want to initialize the iframe
    widgetWidth: '100%', // Optional widget dimensions
    widgetHeight: '600px',
  };

  let transak = new Transak(transakConfig);
  transak.init();

  return transak;
};

// Initialize the widget
const transak = await initializeTransak();

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

## TransakConfig

| Property       | Type   | Required | Description                                                                                                              |
|:---------------|:-------|:---------|:-------------------------------------------------------------------------------------------------------------------------|
| widgetUrl      | string | Yes      | [API generated widgetUrl](https://docs.transak.com/docs/migration-to-api-based-transak-widget-url#widget-url-generation) |
| referrer       | string | Yes      | Valid URL of your app/website (e.g., https://your-app.com)                                                               |
| `containerId`  | string | No       | HTML element ID to mount the widget (omit for modal)                                                                     |
| `widgetWidth`  | string | No       | Widget width (e.g., '100%', '400px')                                                                                     |
| `widgetHeight` | string | No       | Widget height (e.g., '600px', '100vh')                                                                                   |

### Using Modal UI

If you want to use our modal UI, do not pass the `containerId` and use `transak.close()` instead of `transak.cleanup()`

### React Gotchas

Remember to clean up by using the `transak.cleanup()` or `transak.close()`

```ts
useEffect(() => {
  return () => {
    transak.cleanup();
  };
}, []);
```

## License

ISC Licensed. Copyright (c) Transak Inc.
