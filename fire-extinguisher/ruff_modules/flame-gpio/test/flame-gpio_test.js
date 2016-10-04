var assert = require('assert');
var path = require('path');
var test = require('test');

var driverRunner = require('ruff-driver-runner');
var mock = require('ruff-mock');

var when = require('ruff-mock').when;
var verify = mock.verify;

var driverPath = path.join(__dirname, '..');

module.exports = {
    'test should emit fire when read 1': function() {
        var run = false;
        driverRunner.run(driverPath, function(device, context) {
            device.on('fire', function() {
                run = true;
            });

            var gpio = context.arg('gpio');
            when(gpio).read().thenReturn(0);
            gpio.emit('interrupt');
            assert(run);
        });
    },

    'test should emit none when read 0': function() {
        var run = false;
        driverRunner.run(driverPath, function(device, context) {
            device.on('none', function() {
                run = true;
            });

            var gpio = context.arg('gpio');
            when(gpio).read().thenReturn(1);
            gpio.emit('interrupt');
            assert(run);
        });
    },

    'test should return true while call isBurning when read 1': function() {
        driverRunner.run(driverPath, function(device, context) {
            var gpio = context.arg('gpio');
            when(gpio).read().thenReturn(0);
            assert(device.isBurning());
        });
    },

    'test should return false while call isBurning when read 0': function() {
        driverRunner.run(driverPath, function(device, context) {
            var gpio = context.arg('gpio');
            when(gpio).read().thenReturn(1);
            assert(!device.isBurning());
        });
    }
};

test.run(module.exports);
