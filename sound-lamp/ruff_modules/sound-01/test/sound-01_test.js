var assert = require('assert');
var path   = require('path');
var test   = require('test');

var runner = require('ruff-driver-runner');

var driverPath = path.join(__dirname, '..');

module.exports = {
    'test should emit receive event': function() {
        var run = false;
        runner.run(driverPath, function(sound, context) {
            sound.on('receive', function() {
                run = true;
            });

            var gpio = context.arg('gpio');
            gpio.emit('interrupt', 0);
            assert(run);
        });
    }
};

test.run(module.exports);
