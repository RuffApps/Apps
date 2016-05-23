# Home (Web Framework) for Ruff

GitHub <https://github.com/vilic/ruff-home>

## Install

```sh
rap install home
```

## Usage

Here's a simple example:

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

Comming soon...

## License

MIT License.
