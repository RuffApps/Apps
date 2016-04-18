'use strict';
/** led灯 */
var led;
/** 求救紧急按键 */
var button;


$.ready(function (error) {
    if (error) {
        console.log(error);
        return;
    }

    led = $('#led');
    button = $('#button');

    led.turnOn();

    button.on('push', function () {
        performS();
        //100毫秒的延时产生字母之间的间隙
        sleep(100);

        performO();
        //100毫秒的延时产生字母之间的间隙
        sleep(100);

        performS();
    });

});

//三个快闪烁来表示字母“S”
function performS() {
    redLed();
    sleep(150);
    blackLed();
    sleep(100);

    redLed();
    sleep(150);
    blackLed();
    sleep(100);

    redLed();
    sleep(150);
    blackLed();
    sleep(100);
}

//三个短闪烁来表示字母"O"
function performO() {
    redLed();
    sleep(400);
    blackLed();
    sleep(100);

    redLed();
    sleep(400);
    blackLed();
    sleep(100);

    redLed();
    sleep(400);
    blackLed();
    sleep(100);
}

//闪红灯
function redLed() {
    led.setRGB(255, 0, 0);
}

//熄灭
function blackLed() {
    led.setRGB(0, 0, 0);
}

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
