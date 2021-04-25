export default {
    ENVIRONMENT: {
        STAGING: {
            FRONTEND: 'https://staging-global.transak.com',
            BACKEND: 'https://staging-api.transak.com/api/v1',
            NAME: 'STAGING'
        },
        LOCAL_DEVELOPMENT: {
            FRONTEND: 'http://localhost:3000',
            BACKEND: 'http://localhost:8292/api/v2',
            NAME: 'LOCAL_DEVELOPMENT'
        },
        DEVELOPMENT: {
            FRONTEND: 'https://development-global.transak.com',
            BACKEND: 'https://development-api.transak.com/api/v2',
            NAME: 'DEVELOPMENT'
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