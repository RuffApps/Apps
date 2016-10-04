'use strict';

/** LCD显示器 */
var lcd;
/** 继电器 */
var relay;
/** 按键开关 */
var button;
/** 红外人体感应器 */
var infraredSensor;

$.ready(function (error) {
    if (error) {
        console.log(error);
        return;
    }

    lcd = $('#lcd');
    relay = $('#relay');
    button = $('#button');
    infraredSensor = $('#infrared-induction');

    infraredSensor.on('presence', function () {
        //如果红外人体感应检测到人
        console.log('in InfraredInduction presence');
        lcd.clear();
        //屋内的LCD显示屏提示屋外有人
        lcd.print('people outside');
    });

    button.on('push', function () {
        console.log('in button key push');
        relay.turnOn();
        lcd.clear();
        //LCD显示门正在打开中
        lcd.print('opening the door.');
    });

    button.on('release', function () {
        console.log('in button key release');
        relay.turnOff();
        lcd.clear();
        //LCD显示门正在关闭
        lcd.print('shutting the door');
    });

    infraredSensor.on('absence', function () {
        console.log('in InfraredInduction absence');
        lcd.clear();
        //LCD显示屋外没有人
        lcd.print('no people outside');
    });

});

$.end(function () {
    relay.turnOff();
    lcd.turnOff();
});


