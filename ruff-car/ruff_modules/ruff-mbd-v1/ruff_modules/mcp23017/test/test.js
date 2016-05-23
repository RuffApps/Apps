var assert = require('assert');
var path = require('path');
var test = require('test');

var driverRunner = require('ruff-driver-runner');
var mock = require('ruff-mock');

var when = require('ruff-mock').when;
var verify = mock.verify;

var driverPath = path.join(__dirname, '..');

module.exports = {
    'test should build driver': function () {
        driverRunner.run(driverPath, function(device, context) {
            // ...
        });
    }
};

test.run(module.exports);
