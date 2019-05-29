

import http, {RequestListener, RequestOptions} from 'http';
import https from 'https';
import serveHandler from 'serve-handler';


const PROXY_PORT = 8080;
const {API_KEY, STATIC_DIR} = process.env;
if (!API_KEY) {
  throw Error('API_KEY environment variable is not set!');
}

if (!STATIC_DIR) {
  throw Error('API_KEY environment variable is not set!');
}

const requestListener: RequestListener = (proxyRequest, proxyResponse) => {
  try {
    if (proxyRequest.method !== 'GET') {
      proxyResponse.statusCode = 405;
      proxyResponse.setHeader('Content-Type', 'application/json');
      proxyResponse.end(JSON.stringify({error: "Method not allowed"}))
      return;
    }

    if (proxyRequest.url && proxyRequest.url.startsWith('/api')) {
      const upstreamOptions = getUpstreamOptions(proxyRequest);
      const connector = https.request(upstreamOptions, upstreamResponse => upstreamResponse.pipe(proxyResponse))
      proxyRequest.pipe(connector);
      return;
    }

    // static files from /app folder
    serveHandler(proxyRequest, proxyResponse, {
      public: STATIC_DIR,
      cleanUrls: true
    })
  } catch(error) {
    console.error(error);
    proxyResponse.statusCode = 404;
    proxyResponse.setHeader('Content-Type', 'application/json');
    proxyResponse.end(JSON.stringify({error: "Server error"}))
  }
}

http.createServer(requestListener).listen(PROXY_PORT, () => {
    console.log(`Started to listen on port ${PROXY_PORT}`);
})

/**
 * Generate response similar to incoming request, but routes to upstream
 * server and sets `apy_key=${API_KEY}` query param.
 */
function getUpstreamOptions(request: http.IncomingMessage): RequestOptions {
  if (!request.url) throw Error('Invalid URL');
  const arr = request.url.split('?');
  arr.shift();
  const str = arr.join('');
  const params = new URLSearchParams(str);
  params.set('api_key', API_KEY as string);

  const pathWithQuery = ['/v1/gifs/search', params].join('?')
  const upstreamOptions = {
    protocol: 'https:',
    host: 'api.giphy.com',
    family: 4,
    port: 443,
    method: 'GET',
    path: pathWithQuery,
    headers: {Accept: "application/json"},
    timeout: 1000
  };
  return upstreamOptions;
}