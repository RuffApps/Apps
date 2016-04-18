var assert = require('assert');
var path = require('path');
var test = require('test');

var driverRunner = require('ruff-driver-runner');
var when = require('ruff-mock').when;

var driverPath = path.join(__dirname, '..');

module.exports = {
    'test should get illuminance': function() {
        driverRunner.run(driverPath, function(device, context) {
            var i2c = context.arg('i2c');
            when(i2c).readBytes(0x20, 2).thenReturn([0x01, 0x02]);
            assert.equal(device.getIlluminance(), 215);
        });
    }
};

test.run(module.exports);