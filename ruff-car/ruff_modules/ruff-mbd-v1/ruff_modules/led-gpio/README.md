# Led

## Description
This is the driver for LED module with GPIO interface.

This Driver turns the device on or off.

## Usage

* turn on

```javascript
    $('#led-r').turnOn();
```

* turn off

```javascript
    $('#led-r').turnOff();
```
* get current state

```javascript
    var on = $('#led-r').isOn();
```

## API

### Commands
* **turnOn**
Turns the LED on.

	* Returns
		* (undefined)

* **turnOff**
Turns the LED off.

	* Returns
		* (undefined)
* **isOn**
Get current state.

    * Returns ture if current state is on, else return false.
