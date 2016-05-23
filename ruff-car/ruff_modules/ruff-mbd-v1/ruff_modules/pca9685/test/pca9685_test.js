var assert = require('assert');
var path = require('path');
var test = require('test');

var driverRunner = require('ruff-driver-runner');
var mock = require('ruff-mock');
var when = mock.when;
var verify = mock.verify;
var any = mock.any;

var driverPath = path.join(__dirname, '..');

var outputsKey = {
    'pwm-0': 0,
    'pwm-1': 1,
    'pwm-2': 2,
    'pwm-3': 3,
    'pwm-4': 4,
    'pwm-5': 5,
    'pwm-6': 6,
    'pwm-7': 7
};

var options = {
    getRequired: function() {
        return 200;
    },

    getOptional: function(a) {
        return a;
    }
};

module.exports = {
    'test should write data': function() {
        driverRunner.run(driverPath, function(device, context) {
            var i2c = context.arg('i2c');
            ['pwm-0', 'pwm-1', 'pwm-2', 'pwm-3', 'pwm-4', 'pwm-5', 'pwm-6', 'pwm-7'].forEach(
                function(key) {
                    var dev = device.__getDevice__(key, options);
                    dev.setDuty(20, 50);
                    verify(i2c).writeByte(6 + 4 * outputsKey[key], any());
                });
        });
    },
    'test should throw error when channel illegal': function() {
        driverRunner.run(driverPath, function(device, context) {
            assert.throws(function() {
                device.__getDevice__('pwm-9', options);
            });
        });
    }
};

test.run(module.exports);
