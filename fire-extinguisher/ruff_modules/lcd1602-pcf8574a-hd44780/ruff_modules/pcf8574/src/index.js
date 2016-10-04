/*!
 * Copyright (c) 2016 Nanchao Inc.
 * All rights reserved.
 */

'use strict';

var driver = require('ruff-driver');

var hasOwnProperty = Object.prototype.hasOwnProperty;

var OUTPUT_INDEX_MAP = {
    'gpio-0': 0,
    'gpio-1': 1,
    'gpio-2': 2,
    'gpio-3': 3,
    'gpio-4': 4,
    'gpio-5': 5,
    'gpio-6': 6,
    'gpio-7': 7
};

function I2cGpioInterface(device, index) {
    this._device = device;
    this._index = index;
}

/**
 * @param {number} value 0 or 1
 * @param {Function} [callback]
 */
I2cGpioInterface.prototype.write = function (value, callback) {
    this._device.write(this._index, value, callback);
};

/**
 * @param {Function} callback
 */
I2cGpioInterface.prototype.read = function (callback) {
    this._device.read(this._index, callback);
};

module.exports = driver({
    attach: function (inputs) {
        this._i2c = inputs['i2c'];
        this._data = 0;

        this._interfaceMap = Object.create(null);
    },

    getInterface: function (name) {
        var interfaceMap = this._interfaceMap;

        if (name in interfaceMap) {
            return interfaceMap[name];
        }

        if (!hasOwnProperty.call(OUTPUT_INDEX_MAP, name)) {
            throw new Error('Invalid interface name "' + name + '"');
        }

        var index = OUTPUT_INDEX_MAP[name];
        var gpioInterface = new I2cGpioInterface(this, index);

        interfaceMap[name] = gpioInterface;

        return gpioInterface;
    },

    exports: {
        /**
         * @param {number} index
         * @param {number} value 0 or 1
         * @param {Function} [callback]
         */
        write: function (index, value, callback) {
            var data = this._data;

            if (value) {
                data |= 1 << index;
            } else {
                data &= ~(1 << index);
            }

            if (data === this._data) {
                invokeCallback(callback);
                return;
            }

            this._data = data;
            this._i2c.writeByte(-1, data, callback);
        },
        /**
         * @param {number} index
         * @param {Function} callback
         */
        read: function (index, callback) {
            assertCallback(callback);

            this._i2c.readByte(function (error, data) {
                if (error) {
                    callback(error);
                    return;
                }

                callback(undefined, (data & (1 << index)) >> index);
            });
        }
    }
});

function assertCallback(callback) {
    if (typeof callback !== 'function') {
        throw new TypeError('The `callback` is expected to be a function');
    }
}

function invokeCallback(callback, error, value, sync) {
    if (typeof callback !== 'function') {
        if (error) {
            throw error;
        } else {
            return;
        }
    }

    if (sync) {
        callback(error, value);
    } else {
        setImmediate(callback, error, value);
    }
}
