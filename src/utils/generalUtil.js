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

let serialize = function(obj) {
  var str = [];
  for (var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
}

export async function Request(host, uri, params, method = 'GET') {

  const options = {
    method,
    headers: {
      'Content-Type': 'application/json' // we will be sending JSON
    }
  };

  // if params exists and method is GET, add query string to uri
  // otherwise, just add params as a "body" property to the options object
  if (params) {
    if (method === 'GET') {
      uri += '?' + serialize(params);
    } else {
      options.body = JSON.stringify(params); // body should match Content-Type in headers option
    }
  }

  const response = await fetch(host + uri, options);
  const result = await response.json();

  return result;

}

export default {Request, UrlEncode}
