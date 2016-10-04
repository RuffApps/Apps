[![Build Status](https://travis-ci.org/vilic/ruff-home.svg)](https://travis-ci.org/vilic/ruff-home)

# Home (Web Framework) for Ruff

GitHub <https://github.com/vilic/ruff-home>

## Install

```sh
rap install home
```

## Usage

Here's a simple example (code available [here](./examples/device-information)):

**src/index.js**

```js
'use strict';

var Path = require('path');
var Server = require('home').Server;

var server = new Server();

server.use('/', Server.static('static'));

server.get('/', function (req) {
    return {
        sn: process.ruff.sn,
        time: Date.now()
    };
});

server.listen(80);
```

**views/index.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Device Information</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>Device Information</h1>
    <ul>
        <li>SN: {sn}</li>
        <li>Time: {time}</li>
    </ul>
</body>
</html>
```

**static/style.css**

```css
body {
    font-family: sans-serif;
    color: #666;
}

h1 {
    font-weight: normal;
    color: #333;
}
```

## API References

Home provides a simple middleware mechanism based on promise:

```js
// Matches all request with path `/*`.
server.use('/', function (req) {
    // ...

    // If `req` (or a promise with it as value) is returned,
    // otherwise the request stops here.
    return req;
});
```

### Hosting Static Files

Just like Express, Home provides a built-in (but tiny) `static` middleware for hosting static files:

```js
server.use('/', Server.static('static'));
```

The first `'/'` means that we will try to find a static file for request that matches `/*`, and `'static'` means we are going to find that file under `static` folder (it could also be an absolute path).

### Handling Requests

By returning an object or a promise with an object as its value, Home will response with the correspondent JSON.

```js
// Matches GET requests with path `/`.
server.get('/', function (req) {
    return {
        value: 123
    };
});
```

But if a view file is found for the request path, Home will render the view instead:

* For `/foo/bar`, it will look for `${viewsDir}/foo/bar.html`.
* For `/`, it will look for `${viewsDir}/index.html`.

Home also provides an `ExpectedError` class with a `statusCode` property.
When an error of this class is thrown, Home will update the response status code according to the error.

Error views should be named after the status code and put into `${viewsDir}/${errorViewsFolder}`.

### Response

If you want to handle the response yourself, you can either process the `res` object directly (following `req` parameter) or create a concrete class of `Response` and implement method `applyTo(res: ServerResponse): void`.
If you are going to handle `res` object directly, make sure headers get sent before the function returns.

## License

MIT License.
