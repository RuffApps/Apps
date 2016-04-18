var assert = require('assert');
var path = require('path');
var test = require('test');

var appRunner = require('ruff-app-runner');
var mock = require('ruff-mock');

var verify = mock.verify;

var appPath = path.join(__dirname, '..');

module.exports = {
    'test should run application': function () {
        appRunner
            .run(appPath, function () {
                verify($('#led-r')).turnOn();
            })
            .end(function () {
                verify($('#led-r')).turnOff();
            });
    }
};

test.run(module.exports);
