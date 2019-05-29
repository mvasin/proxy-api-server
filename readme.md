# A static web server with API proxy that keeps API keys confidential
This web server serves static assets and adds API key to every upstream API request. So your API key is safe and invisible.

## Currently a GIPHY proxy API server
It could be done more generic, but currently it's tailored for giphy.com API.

## How to start
1. Install dependencies: `yarn`
2. Compile TypeScript files: `./node_modules/.bin/tsc`
3. Install the front-end app:
- Clone https://github.com/mvasin/giphy-client
- Install dependencies: `yarn`
- Build: `yarn build`
- Copy output of this command:
  ```
  echo `pwd`/build
  ```
  to use it later as STATIC_DIR environment variable
4. `cd` back to directory of this repo and start the API proxy server with API key and path to compiled front-end app:
```
API_KEY=XXXXXXXX STATIC_DIR=/Users/John/giphy-client/build/ yarn prod
```
5. Navigate to `localhost:3000`

## How to use
The proxy server will add `api_key=xxx` to your URL search string in requests to upstream API.

It currently serves only `GET` requests. All `/v1/gifs/search` requests are routed to `https://api.giphy.com/v1/gifs/search`, for the rest it tries to serve `/app` directory.

(c) MIT Mikhail Vasin