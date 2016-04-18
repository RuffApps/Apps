'use strict';
/** 红外人体感应器 */
var infraredSensor;
/** 蜂鸣器 */
var buzzer;

$.ready(function (error) {
    if (error) {
        console.log(error);
        return;
    }

    infraredSensor = $('#infrared-induction');
    buzzer = $('#buzzer');

    infraredSensor.on('presence', function () {
        //如果红外人体感应检测到人,则蜂鸣器响起
        buzzer.buzz();
    });

    infraredSensor.on('absence', function () {
        //如果红外人体感应没有检测到人，则蜂鸣器不再响起
        buzzer.unbuzz();
    });
});

$.end(function () {
    buzzer.turnOff();
});
