[![Build Status](https://travis-ci.org/ruff-drivers/ruff-v1-sys-usb.svg)](https://travis-ci.org/ruff-drivers/ruff-v1-sys-usb)

# Sys-usb Driver for Ruff

sys-usb provides a USB interface driver for USB devices. This driver works only for [Ruff MBD V1](https://rap.ruff.io/raps/ruff-mbd-v1).

This driver follows [USB Manager](https://rap.ruff.io/raps/usb-manager) framework.

## Supported Engines

* Ruff: >=1.4.0 <1.6.0

## Installing

This driver has been integrated in [Ruff MBD V1](https://rap.ruff.io/raps/ruff-mbd-v1).

## Usage

Here is the basic usage of this driver.

```js
var cameraManager = new CameraManager();
var audioManager = new AudioManger();
$('#usb').install(cameraManager, audioManager);

cameraManager.on('mount', function (camera)) {
    // camera is mounted, invoke methods of camera
});

cameraManager.on('unmount', function (camera)) {
    // camera is unmounted
});

audioManager.on('mount', function (audio)) {
    // audio is mounted, invoke methods of audio
});

audioManager.on('unmount', function (audio)) {
    // audio is unmounted
});
```

## API References

### Methods

#### `install(...managers[, callback])`

Install USB device managers

- **managers:** the USB devices managers which receives USB events to emit its own event with specific device instance. The managers should follow [USB Manager](https://rap.ruff.io/raps/usb-manager) framework.

- **callback:** The callback will be invoked when the `install` is finished, this argument is optional. The callback will be given an argument  `(err)`, which specifies a possible error.

Take a camera manager as example. When a camera is plugged into USB interface, a `mount` event with camera instance will be emitted. Once the camera is unplugged, `unmount` event with the camera instance will be emitted. Visit [USB Manager](https://rap.ruff.io/raps/usb-manager) for detailed usage.

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
