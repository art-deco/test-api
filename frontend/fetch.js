/* eslint-env browser */
export default function(url, callback, options = {}) {
  const {
    method = 'get',
    headers: requestHeaders = {},
    credentials,
    body = null,
  } = options
  const request = new XMLHttpRequest()
  request.open(method, url, true)

  for (let i in requestHeaders) {
    request.setRequestHeader(i, requestHeaders[i])
  }

  request.withCredentials = credentials == 'include'

  request.onload = () => {
    callback(null, response())
  }

  request.onerror = () => {
    callback(`Could not load the resource at ${url}.`)
  }
  request.send(body)

  function response() {
    let keys = [],
      all = [],
      headers = {},
      header

    request.getAllResponseHeaders().replace(/^(.*?):[^\S\n]*([\s\S]*?)$/gm, (m, key, value) => {
      keys.push(key = key.toLowerCase())
      all.push([key, value])
      header = headers[key]
      headers[key] = header ? `${header},${value}` : value
    })

    return {
      ok: (request.status/100|0) == 2,    // 200-299
      status: request.status,
      statusText: request.statusText,
      url: request.responseURL,
      clone: response,
      text: () => request.responseText,
      json: () => JSON.parse(request.responseText),
      blob: () => new Blob([request.response]),
      headers: {
        keys: () => keys,
        entries: () => all,
        get: n => headers[n.toLowerCase()],
        has: n => n.toLowerCase() in headers,
      },
    }
  }
}