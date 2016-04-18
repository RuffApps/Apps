# Light Intensity Sensor Driver

## Description
This is the driver for light intensity sensor e.g. GY-30. 

This driver provides you light illuminance.


## Support Devices

[GY-30](http://rap.ruff.io/devices/GY-30)

## Usage

* Query light illuminance

```javascript
    $('light').getIlluminance();
```

## API

### Commands
* **getIlluminance**   
Get current light illuminance

	* Returns
		* (Int) light illuminance, from 0 to 65535, by lux unit.