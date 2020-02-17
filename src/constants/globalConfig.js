export default {
    ENVIRONMENT: {
        STAGING: {
            FRONTEND: 'https://staging-global.transak.com',
            BACKEND: 'https://staging-api.transak.com/api/v1',
            NAME: 'STAGING'
        },
        DEVELOPMENT: {
            FRONTEND: 'http://localhost:3000',
            BACKEND: 'http://localhost:8292/api/v1',
            NAME: 'DEVELOPMENT'
        },
        PRODUCTION: {
            FRONTEND: 'https://global.transak.com',
            BACKEND: 'https://api.transak.com/api/v1',
            NAME: 'PRODUCTION'
        }
    },
    STATUS: {
        INIT: 'init',
        TRANSAK_INITIALISED: 'transak_initialised',
    }
}