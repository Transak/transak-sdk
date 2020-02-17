import request from "request";
export function fetchAPIKey(apiKey, apiURl) {
    return new Promise((resolve, reject) => {
        request({url: `${apiURl}/partners/${apiKey}`, json: true}, function (error, response, body) {
            // Do more stuff with 'body' here
            if (error) reject(error);
            if (body) {
                if (body && body.error && body.error.message === "No data found") reject('[Transak SDK] => Invalid API Key')
                else if (body.response && body.response.status !== 'active') reject('[Transak SDK] => Your Transak partner account is not active. Please contact us at hello@transak.com or https://discordapp.com/invite/KeT6QZV')
                else resolve(body);
            } else reject(false);
        });
    });
}