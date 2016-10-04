[![Build Status](https://travis-ci.org/ruff-drivers/buzzer-gpio.svg)](https://travis-ci.org/ruff-drivers/buzzer-gpio)

# Buzzer Driver for Ruff

Buzzer driver with GPIO interface.

## Supported Engines

* Ruff: >=1.2.0 <1.6.0

## Supported Models

- [fc-49](https://rap.ruff.io/devices/fc-49)
- [mh-fmg](https://rap.ruff.io/devices/mh-fmg)

## Installing

Execute following command and enter a **supported model** to install.

```sh
# Please replace `<device-id>` with a proper ID.
# And this will be what you are going to query while `$('#<device-id>')`.
rap device add <device-id>

# Then enter a supported model, for example:
# ? model: fc-49
```

## Usage

Here is the basic usage of this driver.

```js
$('#<device-id>').turnOn(function (error) {
    if (error) {
        console.error(error);
        return;
    }

    console.log('turned on');
});

$('#<device-id>').turnOff(function (error) {
    if (error) {
        console.error(error);
        return;
    }

    console.log('turned off');
});

$('#<device-id>').isOn(function (error, on) {
    if (error) {
        console.error(error);
        return;
    }

    console.log('status:', on ? 'on' : 'off');
});
```

## API References

### Methods

#### `turnOn([callback])`

Turn on the buzzer.

- **callback:** No argument other than a possible error is given to the completion callback.

#### `turnOff([callback])`

Turn off the buzzer.

- **callback:** No argument other than a possible error is given to the completion callback.

#### `isOn(callback)`

Get the working state of the buzzer.

- **callback:** The callback has two arguments `(error, on)` where `on` is boolean that indicates whether this buzzer is turned on.

## Contributin

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
