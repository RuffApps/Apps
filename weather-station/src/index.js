'use strict';

/** LCD显示器 */
var lcd;
/** 控制空调的继电器 */
var temperatureRelay;
/** 控制加湿器的继电器 */
var humidityRelay;
/** 温度湿度传感器 */
var dht;

var timer;

$.ready(function (error) {
    if (error) {
        console.log(error);
        return;
    }

    lcd = $('#lcd');
    temperatureRelay = $('#temprature-relay');
    humidityRelay = $('#humidity-relay');
    dht = $('#dht');

    //人体舒适温度上限
    var temperatureUpperBound = 25;
    //人体舒适温度下限
    var temperatureLowerBound = 20;
    //人体舒适湿度上限
    var humidityUpperBound = 70;
    //人体舒适湿度下限
    var humidityLowerBound = 40;

    timer = setInterval(function () {
        //从传感器获取温度和湿度
        var temperature = dht.getTemperature();
        var humidity = dht.getHumidityRelative();

        lcd.clear();
        lcd.print('Temprature:' + temperature.toString());
        lcd.setCursor(0, 1);
        lcd.print('Humidity:' + humidity.toString());

        //如果温度高于温度上限，则打开控制空调的继电器
        if (temperature > temperatureUpperBound) {
            temperatureRelay.turnOn();
        } else if (temperature < temperatureLowerBound) {
            //如果温度低于温度下限，则关闭继电器
            temperatureRelay.turnOff();
        }

        //如果湿度低于湿度下限,则控制打开加湿器的继电器
        if (humidity < humidityLowerBound) {
            humidityRelay.turnOn();
        } else if (humidity > humidityUpperBound) {
            //如果温度高于湿度上限，则关闭继电器
            humidityRelay.turnOff();
        }
    }, 5000);
});

$.end(function () {
    lcd.turnOff();
    temperatureRelay.turnOff();
    humidityRelay.turnOff();

    clearInterval(timer);
});
