'use strict';

/** LCD显示器 */
var lcd;
/** 光线传感器 */
var lightSensor;

$.ready(function (error) {
    if (error) {
        console.log(error);
        return;
    }

    lcd = $('#lcd');
    lightSensor = $('#light-sensor');
    //每1秒更新一次光照强度
    setInterval(showLightIntensity, 1000);
});

function showLightIntensity() {
    lcd.clear();
    //从光照传感器获取光照强度
    var value = lightSensor.getIlluminance();

    //LCD输出亮度值
    lcd.print(value.toString());
}

$.end(function () {
    lcd = $('#lcd');
    lcd.turnOff();
});