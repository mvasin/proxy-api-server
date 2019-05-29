import http, {RequestListener} from 'http';
import https from 'https';

const port = 4000

const GIPHY_API_KEY = process.env.GIPHY_API_KEY;

console.log('hey')

if (!GIPHY_API_KEY) {
  throw Error('GIPHY_API_KEY environment variable is not set');
}

const requestListener: RequestListener = (request, response) => {
  const params = getParams(request);
  params.set('api_key', GIPHY_API_KEY);
  const giphy_url = `https://api.giphy.com/v1/gifs/search?${params}`;
  https.get(giphy_url, (resp) => {
    let data = '';

    // TBD: incoming stream should be routed directly to the outgoing stream
    resp.on('data', (chunk) => {
      data += chunk;
    });
  
    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      response.end(data)});
  
  }).on("error", err => {throw err});
}

const server = http.createServer(requestListener)

server.on('error', e => {
  console.log(e);
});

server.listen(port, () => {
    console.log(`server is listening on ${port}`)
})

function getParams(request: http.IncomingMessage): URLSearchParams {
  if (!request.url) throw Error('Invalid URL');
  const arr = request.url.split('?');
  arr.shift();
  const str = arr.join('');
  return new URLSearchParams(str);
}