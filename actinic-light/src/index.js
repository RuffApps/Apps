'use strict';
/** led灯 */
var led;
/** 光线传感器 */
var lightSensor;
$.ready(function (error) {
    if (error) {
        console.log(error);
        return;
    }

    led = $('#led');
    lightSensor = $('#light-sensor');
    led.turnOn();

    //获取环境的光照值
    var value = lightSensor.getIlluminance();

    for (var i = 0; i < 256; i += 5) {
        //梯度更新led灯的颜色值
        led.setRGB(i, i, i);
        //根据环境的亮度值来设定颜色值更新的频率
        sleep(value * 20);
    }
});

//睡眠函数
function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}

$.end(function () {
    led.turnOff();
});
