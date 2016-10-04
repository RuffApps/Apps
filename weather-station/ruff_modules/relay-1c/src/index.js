/*!
 * Copyright (c) 2016 Nanchao Inc.
 * All rights reserved.
 */

'use strict';

var driver = require('ruff-driver');
var Level = require('gpio').Level;

module.exports = driver({
    attach: function (inputs) {
        this._gpio = inputs['gpio'];
    },
    exports: {
        turnOn: function (callback) {
            this._gpio.write(Level.low, callback);
        },

        turnOff: function (callback) {
            this._gpio.write(Level.high, callback);
        },

        isOn: function (callback) {
            var readCallback = callback && function (error, value) {
                if (error) {
                    callback(error);
                    return;
                }

                callback(undefined, !value);
            };

            this._gpio.read(readCallback);
        }
    }
});
