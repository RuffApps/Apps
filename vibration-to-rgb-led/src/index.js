'use strict';

/** 震动传感器 */
var vibrationSensor;
/** LED灯 */
var led;

$.ready(function (error) {
    if (error) {
        console.log(error);
        return;
    }

    vibrationSensor = $('#vibration-sensor');
    led = $('#led');

    vibrationSensor.on('shock', function () {
        led.turnOn();
        console.log('shocking');

        //点亮RGB LED
        start();
    });

    //跑马灯的状态
    var states = [
        {
            r: 255,
            g: 1,
            b: 1
        },
        {
            r: 1,
            g: 255,
            b: 1
        },
        {
            r: 1,
            g: 1,
            b: 255
        }
    ];
    //状态的索引
    var currentStateIndex = 0;

    //获取下一个状态
    function nextState() {
        if (currentStateIndex == 2) {
            currentStateIndex = 0;
        }
        currentStateIndex++;
    }

    function start() {
        nextState();
        //从状态中获取颜色值
        var r = states[currentStateIndex].r;
        console.log(r);
        var g = states[currentStateIndex].g;
        console.log(g);
        var b = states[currentStateIndex].b;
        console.log(b);
        led.setRGB(r, g, b);
    }
});

$.end(function () {
    led.turnOff();
});
