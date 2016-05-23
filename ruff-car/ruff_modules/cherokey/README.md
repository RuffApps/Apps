# Cherokey 4WD Mobile Car

## Description
This is the driver for Cherokey 4WD Mobile Robot

This driver provides the ability to control Cherokey 4WD Mobile Car.


## Support Devices

[cherokey](https://rap.ruff.io/devices/cherokey)

## Usage

* forward

```javascript
    $('#cherokey').forward();
```

* backward

```javascript
    $('#cherokey').backward();
```

* turnLeft

```javascript
	$('#cherokey').turnLeft();
```

* turnRight

```javascript
	$('#cherokey').turnRight();
```

* stop

```javascript
	$('#cherokey').stop();
```

* accelerate

```javascript
	$('#cherokey').accelerate();
```

* setSpeed

```javascript
	$('#cherokey').setSpeed();
```

* getSpeed

```javascript
	$('#cherokey').getSpeed();
```


## API

### Commands
* **forward**
control car to forward

* **backward**
control car to backward

* **turnLeft**
control car to turnLeft

* **turnRight**
control car to turnRight

* **stop**
control car to stop

* **accelerate**
control car to accelerate

* **setSpeed**
set speed of the car

* **getSpeed**
get the speed of the car

	* Returns
		* (Int) leftSpeed,rightSpeed
