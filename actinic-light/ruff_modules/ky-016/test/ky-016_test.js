var assert = require('assert');
var path   = require('path');
var test   = require('test');
var mock = require('ruff-mock');
var verify = mock.verify;
var twice = mock.twice;

var driverRunner = require('ruff-driver-runner');

var driverPath = path.join(__dirname, '..');

var adjustMax = 253;
module.exports = {

    'test should is off when start': function () {
        driverRunner.run(driverPath, function (device, context) {
            assert(!device.isOn());
        });
    },

    'test should set and get rgb': function () {
        driverRunner.run(driverPath, function (device, context) {
            device.setRGB(90, 80, 70);
            var rgb = device.getRGB();

            assert.equal(rgb[0], 90);
            assert.equal(rgb[1], 80);
            assert.equal(rgb[2], 70);
        });
    },

    'test should on when turnOn': function () {
        driverRunner.run(driverPath, function (device, context) {
            device.turnOn();

            assert.equal(device.isOn(), true);
        });
    },

    'test should not on when turnOff': function () {
        driverRunner.run(driverPath, function (device, context) {
            device.turnOn();
            device.turnOff();

            assert.equal(device.isOn(), false);
        });
    },

    'test should turnOn': function () {
        driverRunner.run(driverPath, function (device, context) {
            var pwmR = context.arg('pwm-r');
            var pwmG = context.arg('pwm-g');
            var pwmB = context.arg('pwm-b');

            device.turnOn();

            verify(pwmR).setDuty(0);
            verify(pwmG).setDuty(0);
            verify(pwmB).setDuty(0);
        });
    },

    'test should turnOff': function () {
        driverRunner.run(driverPath, function (device, context) {
            var pwmR = context.arg('pwm-r');
            var pwmG = context.arg('pwm-g');
            var pwmB = context.arg('pwm-b');

            device.turnOff();

            verify(pwmR,twice()).setDuty(adjustMax / 255);
            verify(pwmG,twice()).setDuty(adjustMax / 255);
            verify(pwmB,twice()).setDuty(adjustMax / 255);
        });
    }
};

test.run(module.exports);
