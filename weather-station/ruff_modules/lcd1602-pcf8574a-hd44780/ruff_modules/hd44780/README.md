[![Build Status](https://travis-ci.org/ruff-drivers/hd44780.svg)](https://travis-ci.org/ruff-drivers/hd44780)

# HD44780 LCD Controller Driver

HD44780 LCD Controller Driver for Ruff.

## Supported Engines

* Ruff: >=1.2.0 <1.6.0

## Supported Models

- hd44780

## Installing

> If you are using an LCD device with `HD44780` built-in,
> you should probably use the LCD model (for example `LCD1602-02`) instead of built-in `HD44780` device model.

Execute following command and enter a **supported model** to install.

```sh
# Please replace `<device-id>` with a proper ID.
# And this will be what you are going to query while `$('#<device-id>')`.
rap device add <device-id>

# Then enter a supported model, for example:
# ? model: hd44780
```

## API References

### Methods

#### `print(text, [callback])`

Print text at current cursor.

#### `clear([callback])`

Clear the display.

#### `setCursor(x, y, [callback])`

Set cursor coordinates, (0, 0) refer to the first character of the first line.

#### `showCursor([callback])`

Show cursor.

#### `hideCursor([callback])`

Hide cursor.

#### `blinkOn([callback])`

Turn on cursor blink.

#### `blinkOff([callback])`

Turn off cursor blink.

#### `turnOn([callback])`

Turn on the display.

#### `turnOff([callback])`

Turn off the display.

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
