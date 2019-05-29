# A static web server with API proxy that keeps API keys confidential
This web server serves static assets and adds API key to every upstream API request. So your API key is safe and invisible.

## Currently a GIPHY proxy API server
It could be done more generic, but currently it's tailored for giphy.com API.
Put your giphy.com API key to `API_KEY` environment variable and enjoy hiding it from outer world. The proxy server will add `api_key=xxx` to your URL search string in requests to upstream API.

It currently serves only `GET` requests. All `/v1/gifs/search` requests are routed to `https://api.giphy.com/v1/gifs/search`, for the rest it tries to serve `/app` directory.

(c) MIT Mikhail Vasin