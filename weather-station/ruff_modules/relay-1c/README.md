[![Build Status](https://travis-ci.org/ruff-drivers/relay-1c.svg)](https://travis-ci.org/ruff-drivers/relay-1c)

# Relay driver

A Relay is an electrically operated switch, use an electromagnet to mechanically operate the switch.

## Supported Engines

* Ruff: >=1.2.0 <1.6.0

## Supported Models

- [relay-1c](https://rap.ruff.io/devices/relay-1c)

## Installing

Execute following command and enter a **supported model** to install.

```sh
# Please replace `<device-id>` with a proper ID.
# And this will be what you are going to query while `$('#<device-id>')`.
rap device add <device-id>

# Then enter a supported model, for example:
# ? model: relay-1c
```

## Usage

Here is the basic usage of this driver.

```js
$('#<device-id>').turnOn(function () {
    console.log('turn on');
});
$('#<device-id>').turnOff(function () {
    console.log('turn off');
});
$('#<device-id>').isOn(function (error, state) {
    console.log('the state is ' + state);
});
```

## API References

### Methods

#### `turnOn([callback])`

Turn on the relay.

- **callback:** No arguments other than a possible exception are given to the completion callback.

#### `turnOff([callback])`

Turn off the relay.

- **callback:** No arguments other than a possible exception are given to the completion callback.

#### `isOn(callback)`

Get the working state of the relay

- **callback:** The callback gets two arguments `(error, state)` where `state` is boolean.
when `state` is true, the relay is turned on, otherwise, is turned off.

## Contributing

Contributions to this project are warmly welcome. But before you open a pull request, please make sure your changes are passing code linting and tests.

You will need the latest [Ruff SDK](https://ruff.io/) to install rap dependencies and then to run tests.

### Installing Dependencies

```sh
npm install
rap install
```

### Running Tests

```sh
npm test
```

## License

The MIT License (MIT)

Copyright (c) 2016 Nanchao Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
