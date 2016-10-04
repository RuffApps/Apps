/*!
 * Copyright (c) 2016 Nanchao Inc.
 * All rights reserved.
 */

'use strict';

var Level = require('gpio').Level;
var driver = require('ruff-driver');

module.exports = driver({
    attach: function (inputs) {
        this._gpio = inputs['gpio'];
    },
    exports: {
        turnOn: function (callback) {
            this._gpio.write(Level.high, callback);
        },
        turnOff: function (callback) {
            this._gpio.write(Level.low, callback);
        },
        isOn: function (callback) {
            var readCallback = callback && function (error, value) {
                if (error) {
                    callback(error);
                    return;
                }

                callback(undefined, !!value);
            };

            this._gpio.read(readCallback);
        }
    }
});
