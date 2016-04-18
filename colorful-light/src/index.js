'use strict';
/** led灯 */
var led;
$.ready(function (error) {
    if (error) {
        console.log(error);
        return;
    }

    led = $('#led');
    led.turnOn();

    var r, g, b;
    setInterval(function () {
        //产生0-255的随机颜色值
        r = Math.random() * 255;
        g = Math.random() * 255;
        b = Math.random() * 255;

        led.setRGB(r, g, b);
        sleep(1000);
    }, 1000);
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
