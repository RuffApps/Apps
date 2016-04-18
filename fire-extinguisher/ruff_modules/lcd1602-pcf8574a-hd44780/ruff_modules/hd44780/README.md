# HD44780 LCD module

## Description

This is the driver for LCD module e.g. HD44780


## Support Devices

[HD44780](http://rap.ruff.io/devices/hd44780)

## Usage
The following program will show on LCD screen
> hello world
> hello ruff

```javascript
    $('hd').print('hello world');
    $('hd').setCursor(0, 1);
    $('hd').print('hello ruff');
```
## default config
* cursor enabled
* blink disabled

## API
**print(val)**

Converts val to string and writes it to the display

* `val` The string to print on screen

**clear()**

Clears display and returns cursor to the home position

**turnOn()**

Turn on display

**turnOff()**

Turn off display

**setCursor(x, y)**

set cursor to pos, top left = 0,0

* `x` column index, valid range [0, 15]
* `y` row index, valid range [0, 1]

**cursorOn()**

Enable cursor

**cursorOff()**

Disable cursor

**blinkOn()**

Enable blink

**blinkOff()**

Disable blink
