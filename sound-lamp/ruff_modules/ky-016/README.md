[![Build Status](https://travis-ci.org/ruff-drivers/ky-016.svg)](https://travis-ci.org/ruff-drivers/ky-016)

# LED Driver for Ruff

LED dirver with RGB control using PWM interface.

## Supported Engines

* Ruff: >=1.2.0 <1.6.0

## Supported Models

- [ky-016](https://rap.ruff.io/devices/ky-016)

## Installing

Execute following command and enter a **supported model** to install.

```sh
# Please replace `<device-id>` with a proper ID.
# And this will be what you are going to query while `$('#<device-id>')`.
rap device add <device-id>

# Then enter a supported model, for example:
# ? model: ky-016
```

## Usage

Here is the usage of this driver.

```js
$('#<device-id>').turnOn();

$('#<device-id>').turnOff();

$('#<device-id>').setRGB([0x80, 0x80, 0x80]);

$('#<device-id>').getRGB(function (error, rgb) {
    console.log(rgb);
});
```

## API References

### Methods

#### `turnOn([callback])`

Set all of RGB values to `0xff`.

#### `turnOff([callback])`

Set all of RGB values to `0x00`.

### `setRGB(...)`

Set the intensity (`0` ~ `0xff`) of red, green, and blue component.

- `setRGB(rgb, [callback])`

  For this overload, `rgb` could either be an array of three numbers or a single 24-bit number.

- `setRGB(r, g, b, [callback])`

### `getRGB(callback)`

Get the array `[r, g, b]` as the second argument in the callback which represents the intensity of red, green, and blue components respectively.

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
