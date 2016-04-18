# ADC Sound Sensor Driver

## Description
This is the driver for sound sensor with ADC interface e.g. SOUND-01. 

This driver will emit event when it receives a sound.

## Support Devices

[SOUND-01](http://rap.ruff.io/devices/SOUND-01)

## Usage

* Watch `receive` events

```javascript
    $('sound').on('receive', function() {
        console.log('in sound receive');
    });
```

## Configuration
When sound sensor receives a sound, it will cause many interrupts, so we provide 'interval' args in 'driver.json' to avoid this.

You can modify following section in 'driver.json' to adjust this feature.

```javascript
  "args": {
    "interval": {
      "type": "number",
      "default": 1000
    }
  }
```

## API
### Events
* **receive**   
Emitted when receive a sound
