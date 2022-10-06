export default {
    ENVIRONMENT: {
        STAGING: {
            FRONTEND: 'https://global-stg.transak.com',
            BACKEND: 'https://api-stg.transak.com/api/v2',
            NAME: 'STAGING'
        },
        LOCAL_DEVELOPMENT: {
            FRONTEND: 'http://localhost:5005',
            BACKEND: 'https://api-stg.transak.com/api/v2',
            NAME: 'LOCAL_DEVELOPMENT'
        },
        PRODUCTION: {
            FRONTEND: 'https://global.transak.com',
            BACKEND: 'https://api.transak.com/api/v2',
            NAME: 'PRODUCTION'
        }
    },
    STATUS: {
        INIT: 'init',
        TRANSAK_INITIALISED: 'transak_initialised',
    }
}
