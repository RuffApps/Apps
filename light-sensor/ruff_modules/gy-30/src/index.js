/*!
 * Copyright (c) 2016 Nanchao Inc.
 * All rights reserved.
 */

'use strict';

var async = require('ruff-async');
var driver = require('ruff-driver');

var Queue = async.Queue;

var ONE_TIME_H_RESOLUTION_MODE = 0x20;
var ONE_TIME_L_RESOLUTION_MODE = 0x23;

var MEASUREMENT_ACCURACY = 1.2;

var H_RESOLUTION_MEASUREMENT_TIME = 180;
var L_RESOLUTION_MEASUREMENT_TIME = 24;

var prototype = {
    _getIlluminanceHandler: function (highResolution, callback) {
        var i2c = this._i2c;

        var code;
        var delay;

        if (highResolution) {
            code = ONE_TIME_H_RESOLUTION_MODE;
            delay = H_RESOLUTION_MEASUREMENT_TIME;
        } else {
            code = ONE_TIME_L_RESOLUTION_MODE;
            delay = L_RESOLUTION_MEASUREMENT_TIME;
        }

        async.series([
            i2c.writeByte.bind(i2c, -1, code),
            function (next) {
                setTimeout(next, delay);
            }
        ], function (error) {
            if (error) {
                callback(error);
                return;
            }

            i2c.readBytes(-1, 2, function (error, values) {
                if (error) {
                    callback(error);
                    return;
                }

                var value = Math.floor((values[0] << 8 | values[1]) / MEASUREMENT_ACCURACY);
                callback(undefined, value);
            });
        });
    },
    getIlluminance: function (callback) {
        this._queue.push(this, [this._highResolution], callback);
    }
};

Object.defineProperties(prototype, {
    highResolution: {
        get: function () {
            return this._highResolution;
        },
        set: function (value) {
            this._highResolution = value;
        }
    }
});

module.exports = driver({
    attach: function (inputs, context) {
        this._i2c = inputs['i2c'];
        this._highResolution = context.args.highResolution;
        this._queue = new Queue(this._getIlluminanceHandler);
    },
    exports: prototype
});
