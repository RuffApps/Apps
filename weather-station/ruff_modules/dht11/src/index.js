/*!
 * Copyright (c) 2016 Nanchao Inc.
 * All rights reserved.
 */

'use strict';

var async = require('ruff-async');
var driver = require('ruff-driver');
var fs = require('fs');
var kernelModule = require('kernel-module');
var util = require('util');

var Queue = async.Queue;

var MODE_666 = parseInt('666', 8);
var CHUNK_SIZE = 16;

var TEMPERATURE_PATH = '/sys/devices/dht11/iio:device0/in_temp_input';
var HUMIDITY_PATH = '/sys/devices/dht11/iio:device0/in_humidityrelative_input';

var kernelModuleInstalled = false;

function ensureKernelModuleInstallation() {
    if (kernelModuleInstalled) {
        return;
    }

    kernelModule.install('dht11');
    kernelModuleInstalled = true;
}

module.exports = driver({
    attach: function (inputs, context, callback) {
        var that = this;

        ensureKernelModuleInstallation();

        this._queue = new Queue(this._readHandler);

        async.series([
            function (next) {
                fs.open(TEMPERATURE_PATH, 'r', MODE_666, function (error, fd) {
                    if (error) {
                        next(error);
                        return;
                    }

                    that._temperatureFd = fd;
                    next();
                });
            },
            function (next) {
                fs.open(HUMIDITY_PATH, 'r', MODE_666, function (error, fd) {
                    if (error) {
                        next(error);
                        return;
                    }

                    that._humidityFd = fd;
                    next();
                });
            }
        ], callback);
    },
    detach: function (callback) {
        async.series([
            fs.close.bind(fs, this._temperatureFd),
            fs.close.bind(fs, this._humidityFd)
        ], function () {
            kernelModule.remove('dht11');
            callback();
        });
    },
    exports: {
        _readHandler: function (fd, callback) {
            var buffer = new Buffer(CHUNK_SIZE);

            fs.read(fd, buffer, 0, CHUNK_SIZE, 0, function (error, length) {
                if (error) {
                    callback(error);
                    return;
                }

                var value = Number(buffer.toString('utf-8', 0, length)) / 1000;

                if (isNaN(value)) {
                    callback(new Error('Read results in invalid value'));
                    return;
                }

                callback(undefined, value);
            });
        },
        _read: function (fd, callback) {
            util.assertCallback(callback);
            this._queue.push(this, [fd], callback);
        },
        getTemperature: function (callback) {
            this._read(this._temperatureFd, callback);
        },
        getRelativeHumidity: function (callback) {
            this._read(this._humidityFd, callback);
        }
    }
});
