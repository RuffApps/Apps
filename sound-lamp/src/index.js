'use strict';

/** 继电器 */
var led;
/** 声音传感器 */
var soundSensor;

$.ready(function (error) {
    if (error) {
        console.log(error);
        return;
    }

    led = $('#led');
    soundSensor = $('#sound');

    soundSensor.on('sound', function () {
        led.turnOn();
        //继电器打开，控制相应的灯泡打开
        led.setRGB([0x80, 0x80, 0x80]);

        //若10秒钟内没有声音，则关闭继电器
        setTimeout( function () {
            led.turnOff();
        }, 10000);
    });
});

$.end(function () {
    led.turnOff();
});
