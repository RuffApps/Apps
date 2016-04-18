# Light Intensity Sensor Driver

## Description
This is the driver for light intensity sensor e.g. DHT11

This driver provides ambient temperature and relative humidity around sensor.


## Support Devices

[DHT11](http://rap.ruff.io/devices/dht11)

## Usage

* Query temperature

```javascript
    $('dht11').getTemperature()
```

* Query relative humidity

```javascript
    $('dht11').getHumidityRelative()
```


## API

### Commands
* **getTemperature**
Get ambient temperature

	* Returns
		* (Int) temperature, unit centigrade

* **getHumidityRelative**
Get relative humidity

	* Returns
		* (Int) relative humidity, unit percentage
