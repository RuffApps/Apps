var assert = require('assert');
var path = require('path');
var when = require('ruff-mock').when;

var driverPath = path.join(__dirname, '..');
var runner = require('ruff-driver-runner');

exports['test SR501 nearby'] = function() {
    var run = false;

    runner.run(driverPath, function(sr501, context) {
        sr501.on('nearby', function() {
            run = true;
        });
        var gpio = context.arg('gpio');
        when(gpio).read().thenReturn(1);
        gpio.emit('interrupt');
        assert(run);
    });
};

require('test').run(exports);