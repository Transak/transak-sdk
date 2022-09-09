export default {
    ENVIRONMENT: {
        STAGING: {
            FRONTEND: 'https://global-stg.transak.com',
            BACKEND: 'https://staging-api.transak.com/api/v1',
            NAME: 'STAGING'
        },
        LOCAL_DEVELOPMENT: {
            FRONTEND: 'http://localhost:3000',
            BACKEND: 'http://localhost:8292/api/v2',
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
