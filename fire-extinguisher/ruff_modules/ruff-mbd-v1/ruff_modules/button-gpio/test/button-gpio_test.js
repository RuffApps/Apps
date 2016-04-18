var assert = require('assert');
var path = require('path');

var driverPath = path.join(__dirname, '..');
var runner = require('ruff-driver-runner');
var when = require('ruff-mock').when;

exports = {
    'test should emit push event': function() {
        var run = false;
        runner.run(driverPath, function(button, context) {
            button.on('push', function() {
                run = true;
            });

            var gpio = context.arg('gpio');
            gpio.emit('interrupt', 0);
            assert(run);
        });
    },

    'test should emit release event': function() {
        var run = false;

        runner.run(driverPath, function(button, context) {
            button._currentState = 0;
            button.on('release', function() {
                run = true;
            });

            var gpio = context.arg('gpio');
            gpio.emit('interrupt', 1);
            assert(run);
        });
    },

    'test should return true when button is pressed': function() {
        runner.run(driverPath, function(button, context) {
            var gpio = context.arg('gpio');
            when(gpio).read().thenReturn(0);
            assert(button.isPressed());
        });
    },
    'test should return false when button is not pressed': function() {
        runner.run(driverPath, function(button, context) {
            var gpio = context.arg('gpio');
            when(gpio).read().thenReturn(1);
            assert(!button.isPressed());
        });
    }
};

require('test').run(exports);