import { EventEmitter } from 'events';
import { Events } from 'Constants/events';

export function makeHandleEvents(eventEmitter: EventEmitter) {
  return function handleEvents(event: MessageEvent<{ event_id: unknown; data: unknown }>) {
    if (event?.data?.event_id) {
      // eslint-disable-next-line default-case
      switch (event.data.event_id) {
        case Events.TRANSAK_WIDGET_INITIALISED: {
          eventEmitter.emit(Events.TRANSAK_WIDGET_INITIALISED, {
            eventName: Events.TRANSAK_WIDGET_INITIALISED,
            status: true,
          });

          break;
        }

        case Events.TRANSAK_LOGIN_USER_REQUEST: {
          eventEmitter.emit(Events.TRANSAK_LOGIN_USER_REQUEST, {
            eventName: Events.TRANSAK_LOGIN_USER_REQUEST,
            status: true,
          });

          break;
        }

        case Events.TRANSAK_ORDER_CREATED: {
          eventEmitter.emit(Events.TRANSAK_ORDER_CREATED, {
            eventName: Events.TRANSAK_ORDER_CREATED,
            status: event.data.data,
          });

          break;
        }

        case Events.TRANSAK_ORDER_SUCCESSFUL: {
          eventEmitter.emit(Events.TRANSAK_ORDER_SUCCESSFUL, {
            eventName: Events.TRANSAK_ORDER_SUCCESSFUL,
            status: event.data.data,
          });

          break;
        }

        case Events.TRANSAK_ORDER_CANCELLED: {
          eventEmitter.emit(Events.TRANSAK_ORDER_CANCELLED, {
            eventName: Events.TRANSAK_ORDER_CANCELLED,
            status: event.data.data,
          });

          break;
        }

        case Events.TRANSAK_ORDER_FAILED: {
          eventEmitter.emit(Events.TRANSAK_ORDER_FAILED, {
            eventName: Events.TRANSAK_ORDER_FAILED,
            status: event.data.data,
          });

          break;
        }

        case Events.TRANSAK_WALLET_REDIRECTION: {
          eventEmitter.emit(Events.TRANSAK_WALLET_REDIRECTION, {
            eventName: Events.TRANSAK_WALLET_REDIRECTION,
            status: event.data.data,
          });

          break;
        }

        case Events.TRANSAK_WIDGET_CLOSE: {
          eventEmitter.emit(Events.TRANSAK_WIDGET_CLOSE, {
            eventName: Events.TRANSAK_WIDGET_CLOSE,
            status: true,
          });
          break;
        }

        case Events.TRANSAK_USER_INFO_RECEIVED: {
          eventEmitter.emit(Events.TRANSAK_USER_INFO_RECEIVED, {
            eventName: Events.TRANSAK_USER_INFO_RECEIVED,
            status: event.data.data,
          });

          break;
        }
        default: {
          // Handle unknown event_id
          eventEmitter.emit('UNKNOWN_EVENT_ID', {
            eventName: 'UNKNOWN_EVENT_ID',
            eventId: event.data.event_id,
            data: event.data.data,
          });
          console.log('Unknown event id:', event.data.event_id);
          console.log('Unknown event data:', event.data.data);
        }
      }
    }
  };
}
