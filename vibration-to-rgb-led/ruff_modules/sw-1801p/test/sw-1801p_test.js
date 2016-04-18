var assert = require('assert');
var path = require('path');
var when = require('ruff-mock').when;

var driverPath = path.join(__dirname, '..');
var runner = require('ruff-driver-runner');

exports['test should emit shock when read 1'] = function() {
    var run = false;

    runner.run(driverPath, function(ky002, context) {
        ky002.on('shock', function() {
            run = true;
        });

        var gpio = context.arg('gpio');
        gpio.emit('interrupt');
        assert(run);
    });
};

require('test').run(exports);