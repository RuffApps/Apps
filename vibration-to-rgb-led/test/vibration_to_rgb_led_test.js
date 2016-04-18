var assert = require('assert');
var path = require('path');
var test = require('test');

var appRunner = require('ruff-app-runner');
var mock = require('ruff-mock');

var verify = mock.verify;

var appPath = path.join(__dirname, '..');

module.exports = {
    'when virbratingSensor has a signal,RGB LED should be bright':function(){
        appRunner.run(appPath,function(){
            $('#VibratingSensor').emit('shock');
            verify($('#LED').setRGB(255, 1, 1));
        })
    }
};

test.run(module.exports);
