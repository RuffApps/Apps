# Vibrating Sensor Driver

## Description
This is the driver for vibrating sensor with GPIO interface e.g. SW-1801P.

This driver will emit event when device shocks.

## Support Devices

[SW-1801P](http://rap.ruff.io/devices/SW-1801P)

## Usage

* Watch `shock` events

```javascript
    $('vibrating').on('shock', function() {
        console.log('shocking');
    });
```

## API
### Events
* **shock**
Emitted when shocking
