[![Build Status](https://travis-ci.org/ruff-drivers/ltc2309.svg)](https://travis-ci.org/ruff-drivers/ltc2309)

# LTC2309 I2C-ADC Driver for Ruff

The LTC2309 is a low noise, low power, 8-channel, 12-bit successive approximation ADC with an I2C compatible serial interface.

## Supported Engines

* Ruff: >=1.2.0 <1.6.0

## Supported Models

- ltc2309

## Installing

Device `pca9685` is now part of `ruff-mbd-v1` and will be added automatically if your application board is set as `ruff-mbd-v1`.

## Usage

Device `pca9685` exports ADC interfaces, and here's the basic usage of the exported interfaces:

```js
adc.getVoltage(function (error, voltage) {
	// Get voltage (usually 0 ~ 5, if the voltage reference is 5v).
});
```

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
