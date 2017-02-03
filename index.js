// Use memory-cache as our way to store responses:
const cache = require('memory-cache');

// Export our middleware:
module.exports = function (options = {}) {
    // No options are used in this version. It's there as a placeholder.
    return function (req, res, next) {
        // Save end and write, they will be overwritten below:
        const _end = res.end;
        const _write = res.write;
        // Create a chunk list to rebuild body at the end:
        let chunks = [];

        // Don't utilize this middleware if url has query or is not a GET:
        if (req.path !== req.originalUrl || req.method.toUpperCase() !== 'GET') return next();

        // Check to see if response has been cached, if so use it:
        const prevResponse = cache.get(req.path);

        if (prevResponse) {
            // This path is cached, so send it:
            res.set(prevResponse.headers); // Set headers
            res.send(prevResponse.body); // Send body
            return;
        }

        function processChunk(chunk, encoding) {
            // Check if chunk is not null:
            if (chunk) {
                // Coerce chunk into a buffer:
                if (!Buffer.isBuffer(chunk) && encoding !== 'buffer') {
                    chunk = Buffer.from(chunk, encoding);
                }
                // Add chunk to chunk list:
                chunks.push(chunk);
            }
        }

        // Overwrite write to grab chunk:
        res.write = function (chunk, encoding) {
            // Intercept chunk:
            processChunk(chunk, encoding);
            // Send chunk:
            _write.apply(res, arguments);
        };

        // Overwrite end to cache body:
        res.end = function (chunk, encoding) {
            // Get final chunk of body:
            processChunk(chunk, encoding);
            // Send body before caching to make use of async io:
            _end.apply(res, arguments);
            // Cache response if 200:
            if (res.statusCode === 200) {
                cache.put(req.path, {
                    body: Buffer.concat(chunks), // Merge chunks
                    // Store headers that were set:
                    headers: Object.keys(res._headers).reduce((headers, name) => {
                        // Resolve HeaderName: value
                        headers[res._headerNames[name]] = res._headers[name];
                        return headers;
                    }, {})
                });
            }
        };

        // Go to next middleware:
        next();
    };
};
