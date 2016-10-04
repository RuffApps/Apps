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
        buzzer.turnOn(function (error) {
            if (error) {
                console.error(error);
                return;
            }
            console.log('buzzer turned on');
        });
    });

    infraredSensor.on('absence', function () {
        //如果红外人体感应没有检测到人，则蜂鸣器不再响起
        buzzer.turnOff(function (error) {
            if (error) {
                console.error(error);
                return;
            }
            console.log('buzzer turned off');
        });
    });
});

$.end(function () {
    buzzer.turnOff(function (error) {
        if (error) {
            console.error(error);
            return;
        }
        console.log('app stoped, buzzer turned off');
    });
});
