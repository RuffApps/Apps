#  Infrared Induction Module Driver

## Description
This is the driver for inftared induction module with GPIO interface e.g. HC-SR501.

This driver will emit events when a person is presence or absence.

## Support Devices

[HC-SR501](http://rap.ruff.io/devices/HC-SR501)

## Usage

* Watch `presence` events

```javascript
    $('infrared').on('presence', function() {
        console.log('in infrared presence');
    });
```

* Watch `absence` events

```javascript
    $('infrared').on('absence', function() {
        console.log('in infrared absence');
    });

```

## API
### Events
* **presence**
Emitted when a person is presence

* **absence**
Emitted when a person is absence
