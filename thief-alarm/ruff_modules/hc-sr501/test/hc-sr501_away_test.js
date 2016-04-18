var assert = require('assert');
var path = require('path');
var when = require('ruff-mock').when;

var driverPath = path.join(__dirname, '..');
var runner = require('ruff-driver-runner');

exports['test should build driver'] = function() {
    var run = false;

    runner.run(driverPath, function(sr501, context) {
        sr501.on('away', function() {
            run = true;
        });
        var gpio = context.arg('gpio');
        when(gpio).read().thenReturn(0);
        gpio.emit('interrupt');
        assert(run);
    });
};

exports['test should run once for each interrupt'] = function() {
    var run0 = 0;
    var run1 = 0;

    runner.run(driverPath, function(sr501, context) {
        sr501.on('away', function() {
            run0 += 1;
        });
        var gpio = context.arg('gpio');
        when(gpio).read().thenReturn(0);
        gpio.emit('interrupt');
        assert.equal(run0, 1);
    });

    runner.run(driverPath, function(sr501, context) {
        sr501.on('away', function() {
            run1 += 1;
        });
        var gpio = context.arg('gpio');
        when(gpio).read().thenReturn(0);
        gpio.emit('interrupt');
        assert.equal(run1, 1);
    });

};

require('test').run(exports);