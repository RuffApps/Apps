var assert = require('assert');
var path   = require('path');
var test   = require('test');

var driverRunner = require('ruff-driver-runner');
var mock         = require('ruff-mock');

var verify = mock.verify;
var when = mock.when;

var driverPath = path.join(__dirname, '..');

module.exports = {
    'test should gpio write 0 when device turn on': function () {
        driverRunner.run(driverPath, function (device, context) {
            device.turnOn();
            verify(context.arg('gpio')).write(0);
        });
    },

    'test should gpio write 1 when device turn off': function () {
        driverRunner.run(driverPath, function (device, context) {
            device.turnOff();
            verify(context.arg('gpio')).write(1);
        });
    },

    'test should isOn when gpio read 0': function () {
        driverRunner.run(driverPath, function (device, context) {
            var gpio = context.arg('gpio');
            when(gpio).read().thenReturn(0);

            assert(device.isOn());
        });
    }
};

test.run(module.exports);