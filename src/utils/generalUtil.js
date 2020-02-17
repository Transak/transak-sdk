export function UrlEncode(data, encodeornot) {
    if (typeof (data) == 'object') {
        let out = []
        for (let key in data) {
            out.push(key + '=' + (encodeornot ? encodeURIComponent(data[key]) : data[key]));
        }
        let finalStr = out.join('&');
        return (finalStr)
    } else {
        console.warn('error occur');
    }
};

export default {UrlEncode}