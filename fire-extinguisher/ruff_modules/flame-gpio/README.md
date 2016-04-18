# GPIO Flame Sensor Driver

## Description

This is the driver for flame sensor with GPIO interface e.g. flame-01.

It will emit events when fire and none and provides whether in the burning status currently.

## Support Devices

[FLAME-01](http://rap.ruff.io/devices/FLAME-01)

## Usage

* Query current burning status

```javascript
    $('flame').isBurning();
```

* Watch `fire` events

```javascript
    $('flame').on('fire', function() {
        console.log('in flame fire');
    });
```

* Watch `none` events

```javascript
    $('flame').on('none', function() {
        console.log('in flame none');
    });

```

## API
### Events
* **fire**
Emitted when fire

* **none**
Emitted when none

### Commands
* **isBurning**
Get current burning status

	* Returns
		* (Boolean) whether or not is burning
