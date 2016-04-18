'use strict';
var kernelModule = require('kernel-module');
var driver = require('ruff-driver');

function readFromSysFile(fd) {
    var data;
    try {
        data = parseInt(uv.fs_read(fd, 16, 0).toString()); // jshint ignore:line
    } catch(error) {
        data = -1;
    }
    return data;
}

module.exports = driver({
    attach: function (inputs) { // jshint ignore:line
        var mode = parseInt('0666', 8);
        kernelModule.install('dht11');
        this.tmpFd = uv.fs_open('/sys/devices/dht11/iio\:device0/in_temp_input', 'r', mode); // jshint ignore:line
        this.humidityFd = uv.fs_open('/sys/devices/dht11/iio\:device0/in_humidityrelative_input', 'r', mode); // jshint ignore:line
    },

    detach: function () {
        uv.fs_close(this.tmpFd); // jshint ignore:line
        uv.fs_close(this.humidityFd); // jshint ignore:line
        kernelModule.remove('dht11');
    },

    exports: {
        getTemperature: function() {
            return readFromSysFile(this.tmpFd) / 1000;
        },

        getHumidityRelative: function() {
            return readFromSysFile(this.humidityFd) / 1000;
        }
    }
});
