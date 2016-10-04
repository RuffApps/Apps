'use strict';

/** lcd显示器 */
var lcd;
/** 继电器 */
var relay;
/** 火焰传感器 */
var flameSensor;

$.ready(function (error) {
    if (error) {
        console.log(error);
        return;
    }

    lcd = $('#lcd');
    relay = $('#relay');
    flameSensor = $('#flame-sensor');

    flameSensor.on('fire', function () {
        //清除LCD上次显示的内容
        lcd.clear();

        //安保监控室内的显示器显示火焰警告
        lcd.print('caution!');
        //设置lcd第二行显示
        lcd.setCursor(0, 1);
        lcd.print('fire alarm');

        //relay打开，相应的灭火器打开
        relay.turnOn();
    });

    flameSensor.on('none', function () {
        //清除LCD上次显示的内容
        lcd.clear();
        //安保监控室内的显示器显示安全
        lcd.print('safe');
        //relay关闭，灭火器关闭
        relay.turnOff();
    });
});

$.end(function () {
    lcd.turnOff();
    relay.turnOff();
});
