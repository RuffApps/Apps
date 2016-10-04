[![Build Status](https://travis-ci.org/ruff-drivers/sound-01.svg)](https://travis-ci.org/ruff-drivers/sound-01)

# Sound Sensor Driver for Ruff

Sound Sensor driver with GPIO interface.

## Supported Engines

* Ruff: >=1.2.0 <1.6.0

## Supported Models

- [sound-01](https://rap.ruff.io/devices/sound-01)

## Installing

1. Execute following command and enter a **supported model** to install.

```sh
# Please replace `<device-id>` with a proper ID.
# And this will be what you are going to query while `$('#<device-id>')`.
rap device add <device-id>

# Then enter a supported model, for example:
# ? model: sound-01
# ? value (number) for argument "interval": (1000)
# ? value (boolean) for argument "enabled": (Y/n)
```

### Arguments

#### `interval`

Minimum interval between two `sound` events, defaults to `1000` milliseconds.

#### `enabled`

Whether to enable this device once it gets loaded, defaults to `true`.

## Usage

Here is the basic usage of this driver.

```js
$('#<device-id>').on('sound', function() {
    console.log('sound detected');
});
```

## API References

### Methods

#### `enable([callback])`

Enable the sound sensor.

- **callback:** No argument other than a possible error is given to the completion callback.

#### `disable([callback])`

Disable the sound sensor.

- **callback:** No argument other than a possible error is given to the completion callback.

### Properties

#### `interval`

Minimum interval between two `sound` events.

### Events

#### `sound`

Emitted when sound detected.

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
