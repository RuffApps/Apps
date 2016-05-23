var assert = require('assert');
var path = require('path');
var test = require('test');

var driverRunner = require('ruff-driver-runner');
var mock = require('ruff-mock');

var when = mock.when;
var any = mock.any;

var driverPath = path.join(__dirname, '..');

var testChannels = {
    'an-0': 0x80,
    'an-1': 0xC0,
    'an-2': 0x90,
    'an-3': 0xD0,
    'an-4': 0xA0,
    'an-5': 0xE0,
    'an-6': 0xB0,
    'an-7': 0xF0
};

function Options(args) {
    this._args = args;
}

Options.prototype.getRequired = function(key) {
    var value = this._args[key];
    if (value === undefined) {
        throw new Error(key + ' undefined');
    }
    return value;
};

module.exports = {
    'test should read analog input': function() {
        driverRunner.run(driverPath, function(device, context) {
            var i2c = context.arg('i2c');
            for (var key in testChannels) {
                when(i2c).readBytes(testChannels[key] | 0x08, 2).thenReturn([testChannels[key], 0x02]);
                var dev = device.__getDevice__(key, new Options({
                    type: "voltage",
                    min: 0, 
                    max: 5,
                    resolution: 10
                }));
                assert.deepEqual(dev.getRawValue(), (testChannels[key] << 8 | 0x02) >> 4);
            }
        });
    }
};

test.run(module.exports);