# express-cache-response
[![npm version](https://badge.fury.io/js/express-cache-response.svg)](https://badge.fury.io/js/express-cache-response)<br>
Caches the response in memory of GET requests which do not have a query specified. The first time a requested path is executed, express-cache-response will hook into the response to cache it for future requests to the same url path. This can drastically improve the performance of your nodejs webserver on compiled content that doesn't change per request.<br>

Things to look out for:
 * There is currently no way to filter what paths are cached, unless you use a regex path in `app.use(path, cache())`.
 * There is currently no way to clear, expire, or refresh cached content.
 * There is currently no way to specify max memory usage, and it does not check to see if it is out of memory. <b>Use with care in production.</b>

## Installation
```bash
npm install --save express-cache-response
```
The add it to your application:
```javascript
const cache = require('express-cache-response');
...
// Add cache middleware to app:
app.use(cache());

// Everything after the middleware can be cached, like below:
app.get('', function (req, res) {
    res.send('Hello World!');
});
```

## Options
TODO: No options exist at the moment.
```javascript
cache({
});
```

## Roadmap
 * Add way to filter content to cache.
 * Add way to remove cached content via api.
 * Add way to expire cached content by a certain time or duration.
 * Add way to specify max memory usage. Least hit cached content are removed first when memory is full.
 * Add way to determine maximum amount of memory usage allowed to be used to prevent out of memory issues.
 * Add way to add custom storage engines.

## License
[MIT](https://raw.githubusercontent.com/Dillonu/express-cache-response/master/LICENSE)
