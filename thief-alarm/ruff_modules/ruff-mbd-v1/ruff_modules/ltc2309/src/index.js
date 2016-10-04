/*!
 * Copyright (c) 2016 Nanchao Inc.
 * All rights reserved.
 */

'use strict';

var driver = require('ruff-driver');

var UNIPOLAR_MODE = 0x08;

var CHANNEL_MAP = {
    'an-0': 0x80,
    'an-1': 0xc0,
    'an-2': 0x90,
    'an-3': 0xd0,
    'an-4': 0xa0,
    'an-5': 0xe0,
    'an-6': 0xb0,
    'an-7': 0xf0
};

function I2cAdcInterface(device, channel) {
    this._device = device;
    this._channel = channel;
}

/**
 * @param {Function} callback
 */
I2cAdcInterface.prototype.getVoltage = function (callback) {
    var vref = this._device._vref;

    var readCallback = callback && function (error, value) {
        if (error) {
            callback(error);
            return;
        }

        var voltage = value / ((2 << 15) - 1) * vref;
        callback(undefined, voltage);
    };

    this._device.read(this._channel, readCallback);
};

module.exports = driver({
    attach: function (inputs, context) {
        this._i2c = inputs['i2c'];
        this._vref = context.args.voltageReference || 5;

        this._interfaceMap = Object.create(null);
    },
    getInterface: function (name) {
        var interfaceMap = this._interfaceMap;

        if (name in interfaceMap) {
            return interfaceMap[name];
        }

        if (!hasOwnProperty.call(CHANNEL_MAP, name)) {
            throw new Error('Invalid interface name "' + name + '"');
        }

        var channel = CHANNEL_MAP[name];
        var adcInterface = new I2cAdcInterface(this, channel);

        interfaceMap[name] = adcInterface;

        return adcInterface;
    },
    exports: {
        /**
         * @param {number} channel
         * @param {Function} callback
         */
        read: function (channel, callback) {
            var readCallback = callback && function (error, values) {
                if (error) {
                    callback(error);
                    return;
                }

                callback(undefined, values[0] << 8 | values[1]);
            };

            this._i2c.readBytes(channel | UNIPOLAR_MODE, 2, readCallback);
        }
    }
});
