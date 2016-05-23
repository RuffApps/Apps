'use strict';

var car;
var infrared;

var Server = require('home').Server;
var server = new Server();

var url = require('url');
var queryString = require('querystring');

server.get('/forward', function () {
    car.forward();
});

server.get('/backward', function () {
    car.backward();
});

server.get('/turn-left', function () {
    car.turnLeft();
});

server.get('/turn-right', function () {
    car.turnRight();
});

server.get('/stop', function () {
    car.stop();
});

server.get('/set-speed', function (req) {
    var urlObj = url.parse(req.url);
    var queryObj = queryString.parse(urlObj.query);
    var speed = parseFloat(queryObj.value);

    console.log(speed);
    car.setSpeed(speed, speed);
});




$.ready(function (error) {
    if (error) {
        console.log(error);
        return;
    }
    car = $('#car');
    car.init();
    infrared = $('#infrared-induction');

    infrared.on('presence', function () {
        console.log('in presence');
        car.turnRight();
    });

    infrared.on('absence', function () {
        console.log('in absence');
        car.forward();
    });

    server.listen(6318);



    $('#led-r').turnOn();
});

$.end(function () {
    $('#led-r').turnOff();
});
