# Button GPIO Driver

This is the driver for button sensor with GPIO interface e.g. CK002. 

It will emit events when button is pressed and released.

## Support Devices

[CK002](http://rap.ruff.io/devices/CK002)

## Usage

* Watch button `push` events

```javascript
    $('button').on('push', function() {
        console.log('in button key push');
    });
```

* Watch button `release` events

```javascript
    $('button').on('release', function() {
        console.log('in button key release');
    });

```

## API
### Events
* **push**   
Emitted when button is pressed

* **release**   
Emitted when button is released
