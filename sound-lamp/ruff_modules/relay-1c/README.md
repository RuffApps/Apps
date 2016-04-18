# Relay Module Driver

## Description

This is the driver for relay moudle with GPIO interface e.g. relay-01. 

This driver controls relay's on and off. 

## Support Devices

[RELAY-1C](http://rap.ruff.io/devices/RELAY-1C)

## Usage

* Turn the relay on

```javascript
    $('relay').turnOn();
```

* Turn the relay off

```javascript
    $('relay').turnOff();
```

* Query current status

```javascript
    $('relay').isOn();
```

## API

### Commands
* **turnOn**   
Turn the Relay on.

	* Returns
		* (undefined) 

* **turnOff**   
Turn the Relay off.

	* Returns
		* (undefined) 

* **isOn**   
Query current status

	* Returns
		* (Boolean) true when relay is on, false when realy is off. 