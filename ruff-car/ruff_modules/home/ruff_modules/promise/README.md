<a href="http://promises-aplus.github.com/promises-spec">
    <img src="http://promises-aplus.github.com/promises-spec/assets/logo-small.png" alt="Promises/A+ logo" align="right" />
</a>

ES6 Promise based on [ThenFail](https://github.com/vilic/thenfail) v0.4.

GitHub <https://github.com/vilic/ruff-promise>

## Install

```sh
rap install promise
```

## Usage

By requiring this module, it will try to attach `Promise` constructor to `global` if it's not present.

```js
require('promise');

var promise = new Promise(function (resolve) {
    setTimeout(function () {
        resolve('Hello, Ruff!');
    });
});

promise.then(function (message) {
    console.log(message);
});
```

## License

MIT License.
