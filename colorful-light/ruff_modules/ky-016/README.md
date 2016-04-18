# PWM RGB LED Module Driver

## Description
This is the driver for RGB LED module with PWM interface e.g. KY-016. 

This Driver controls RGB LED with RBG values. 

The actual color effect depends on your specific device. The RGB value you specify will be a approximate value.

## Support Devices

[KY-016](http://rap.ruff.io/devices/KY-016)

## Usage

* Turn the LED on 

```javascript
    $('led').turnOn();
```

* Set LED with specific colors

```javascript
    $('led').setRGB(90, 80, 60);
```

* Turn the LED off

```javascript
    $('led').turnOff();
```

* Query whether the LED is on

```javascript
    $('led').isOn();
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

* **setRGB**   
Sets the LED's colors based on a provided RGB color

	* Params
		* r (int) red value, range from 0 to 255
		* g (int) green value, range from 0 to 255
		* b (int) blue value, range from 0 to 255
		
	* Returns
		* (undefined)

* **getRGB**   
Get the LED's colors.
		
	* Returns
		* (Array) [red value, green value, blue value]


* **isOn**   
Returns whether or not the RGB LED is currently on		
	* Returns
		* (Boolean) true if the LED is on, otherwise, false will be returned.