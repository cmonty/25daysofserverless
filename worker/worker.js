/**
 * Helper functions that when passed a request will return a
 * boolean indicating if the request uses that HTTP method,
 * header, host or referrer.
 */
const Method = method => req =>
  req.method.toLowerCase() === method.toLowerCase()
const Connect = Method('connect')
const Delete = Method('delete')
const Get = Method('get')
const Head = Method('head')
const Options = Method('options')
const Patch = Method('patch')
const Post = Method('post')
const Put = Method('put')
const Trace = Method('trace')

const Header = (header, val) => req => req.headers.get(header) === val
const Host = host => Header('host', host.toLowerCase())
const Referrer = host => Header('referrer', host.toLowerCase())

const Path = regExp => req => {
  const url = new URL(req.url)
  const path = url.pathname
  const match = path.match(regExp) || []
  return match[0] === path
}

/**
 * The Router handles determines which handler is matched given the
 * conditions present for each request.
 */
class Router {
  constructor() {
    this.routes = []
  }

  handle(conditions, handler) {
    this.routes.push({
      conditions,
      handler,
    })
    return this
  }

  connect(url, handler) {
    return this.handle([Connect, Path(url)], handler)
  }

  delete(url, handler) {
    return this.handle([Delete, Path(url)], handler)
  }

  get(url, handler) {
    return this.handle([Get, Path(url)], handler)
  }

  head(url, handler) {
    return this.handle([Head, Path(url)], handler)
  }

  options(url, handler) {
    return this.handle([Options, Path(url)], handler)
  }

  patch(url, handler) {
    return this.handle([Patch, Path(url)], handler)
  }

  post(url, handler) {
    return this.handle([Post, Path(url)], handler)
  }

  put(url, handler) {
    return this.handle([Put, Path(url)], handler)
  }

  trace(url, handler) {
    return this.handle([Trace, Path(url)], handler)
  }

  all(handler) {
    return this.handle([], handler)
  }

  route(req) {
    const route = this.resolve(req)

    if (route) {
      return route.handler(req)
    }

    return new Response('resource not found', {
      status: 404,
      statusText: 'not found',
      headers: {
        'content-type': 'text/plain',
      },
    })
  }

  /**
   * resolve returns the matching route for a request that returns
   * true for all conditions (if any).
   */
  resolve(req) {
    return this.routes.find(r => {
      if (!r.conditions || (Array.isArray(r) && !r.conditions.length)) {
        return true
      }

      if (typeof r.conditions === 'function') {
        return r.conditions(req)
      }

      return r.conditions.every(c => c(req))
    })
  }
}

/**
 * Example of how router can be used in an application
 *  */
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const r = new Router()
  const { driedel_spin } = wasm_bindgen;
  await wasm_bindgen(wasm);
  const headers = { "content-type": "text/html;charset=UTF-8" };

  // Replace with the approriate paths and handlers
  r.get('/1', () => {
    const spin = driedel_spin();
    return new Response(
      `<html><title>25 days of serverless</title><body style="background-color:#09239b"><h1 style="color:white; text-align:center; font-weight:normal; font-size: 10em">${spin}</h1></body></html>`,
      { headers, status: 200 }
    );
  }) // return a default message for the root route

  const resp = await r.route(request)
  return resp
}