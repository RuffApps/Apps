'use strict';

/** 继电器 */
var relay;
/** 声音传感器 */
var soundSensor;

$.ready(function (error) {
    if (error) {
        console.log(error);
        return;
    }

    relay = $('#relay');
    soundSensor = $('#sound-sensor');

    soundSensor.on('recieve', function () {
        //继电器打开，控制相应的灯泡打开
        relay.turnOn();

        //若10秒钟内没有声音，则关闭继电器
        setTimeout( function () {
            relay.turnOff();
        }, 10000);
    });
});

$.end(function () {
    relay.turnOff();
});
