# ltc2309

8-Channel, 12-Bit SAR ADC With I2C Interface 

## Install

````bash
$ rap device add ltc2309
````

## Usage

```javascript
var ltc2309 = $('ltc2309');
for(var i=0; i<8; i++) {
	var adc = ltc2309.getDev('adc'+i);
	console.log(adc.read()); // ep: 45520
}
```
