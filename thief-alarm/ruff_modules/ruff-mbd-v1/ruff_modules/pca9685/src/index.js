/*!
 * Copyright (c) 2016 Nanchao Inc.
 * All rights reserved.
 */

'use strict';

var async = require('ruff-async');
var driver = require('ruff-driver');
var util = require('util');
var assert = require('assert');

var hasOwnProperty = Object.prototype.hasOwnProperty;

var Mode1 = {
    restart: 0x80,
    externalClock: 0x40,
    autoIncrement: 0x20,
    sleep: 0x10,
    sub1: 0x08,
    sub2: 0x04,
    sub3: 0x02,
    allCall: 0x01
};

var OSCILLATOR_CLOCK = 25 * 1000 * 1000; // 25MHz
var COUNTER_END = 4096;

var MODE_REGISTER_1 = 0x00;
var MODE_1_DEFAULT = Mode1.sleep | Mode1.allCall;

var OUTPUT_0 = 0x06;

var ON_LOW_OFFSET = 0;
var ON_HIGH_OFFSET = 1;
var OFF_LOW_OFFSET = 2;
var OFF_HIGH_OFFSET = 3;

var ALL_LED_OFF_H = 0xfd;
var PRE_SCALE = 0xfe;

var DUTY_MIN = 0;
var DUTY_MAX = 1;
var FREQUENCY_MIN = 24;
var FREQUENCY_MAX = 1526;

function GET_PRESCALE_VALUE(frequency) {
    return Math.round(OSCILLATOR_CLOCK / (COUNTER_END * frequency)) - 1;
}

var OUTPUT_INDEX_MAP = {
    'pwm-0': 0,
    'pwm-1': 1,
    'pwm-2': 2,
    'pwm-3': 3,
    'pwm-4': 4,
    'pwm-5': 5,
    'pwm-6': 6,
    'pwm-7': 7
};

var Overwrite = {
    ignore: 0,
    force: 1,
    never: 2
};

function I2cPwmInterface(device, index, options, callback) {
    var that = this;

    this._device = device;
    this._index = index;

    var frequency;
    var overwrite;

    if (typeof options.frequency === 'number') {
        frequency = options.frequency;
        overwrite = Overwrite.never;
    } else {
        frequency = 200;
        overwrite = Overwrite.ignore;
    }

    async.series([
        device.setFrequency.bind(device, frequency, overwrite),
        this.setDuty.bind(this, options.duty || 0)
    ], function (error) {
        if (error) {
            callback(error);
            return;
        }

        callback(undefined, that);
    });
}

/**
 * @param {number} duty
 * @param {Function} [callback]
 */
I2cPwmInterface.prototype.setDuty = function (duty, callback) {
    this._device.setDuty(this._index, duty, callback);
};

/**
 * @param {Function} [callback]
 */
I2cPwmInterface.prototype.getDuty = function (callback) {
    this._device.getDuty(this._index, callback);
};

/**
 * @param {number} frequency
 * @param {Function} [callback]
 */
I2cPwmInterface.prototype.setFrequency = function (frequency, callback) {
    this._device.setFrequency(frequency, Overwrite.never, callback);
};

/**
 * @param {Function} [callback]
 */
I2cPwmInterface.prototype.getFrequency = function (callback) {
    this._device.getFrequency(this._index, callback);
};

I2cPwmInterface.get = function (device, index, options, callback) {
    new I2cPwmInterface(device, index, options, callback);
};

module.exports = driver({
    attach: function (inputs, context, next) {
        this.id = context.id;

        this._i2c = inputs['i2c'];
        this._interfaceMap = Object.create(null);

        var frequency = context.args.frequency;

        if (typeof frequency === 'number') {
            this.setFrequency(frequency, next);
        } else {
            next();
        }
    },
    detach: function () {
        this.allOff();
    },
    getInterface: function (name, options, callback) {
        util.assertCallback(callback);

        var interfaceMap = this._interfaceMap;

        if (name in interfaceMap) {
            util.invokeCallbackAsync(callback, undefined, interfaceMap[name]);
            return;
        }

        if (!hasOwnProperty.call(OUTPUT_INDEX_MAP, name)) {
            throw new Error('Invalid interface name "' + name + '"');
        }

        var index = OUTPUT_INDEX_MAP[name];

        I2cPwmInterface.get(this, index, options, function (error, pwmInterface) {
            if (error) {
                callback(error);
                return;
            }

            interfaceMap[name] = pwmInterface;
            callback(undefined, pwmInterface);
        });
    },
    exports: {
        /**
         * @param {number} frequency
         * @param {boolean} [overwrite=Overwrite.force]
         * @param {Function} [callback]
         */
        setFrequency: function (frequency, overwrite, callback) {
            if (typeof overwrite === 'function') {
                callback = overwrite;
                overwrite = Overwrite.force;
            } else if (overwrite === undefined) {
                overwrite = Overwrite.force;
            }

            if (typeof this._frequency === 'number') {
                if (this._frequency === frequency || overwrite === Overwrite.ignore) {
                    // TODO: queue and ensure this callback is called after setting completes.
                    util.invokeCallbackAsync(callback);
                    return;
                }

                if (overwrite === Overwrite.never) {
                    throw new Error('The frequency of device "' + this.id + '" has already been set to a different value');
                }
            }

            assert(frequency >= FREQUENCY_MIN && frequency <= FREQUENCY_MAX,
                   'Frequency should be [' + FREQUENCY_MIN + ', ' + FREQUENCY_MAX + ']');
            this._frequency = frequency;

            // eslint-disable-next-line new-cap
            var preScale = GET_PRESCALE_VALUE(frequency);

            var i2c = this._i2c;

            // The PRE_SCALE register can only be set when the SLEEP bit of MODE1 register is set to logic 1.
            i2c.writeByte(MODE_REGISTER_1, MODE_1_DEFAULT);
            i2c.writeByte(PRE_SCALE, preScale);
            i2c.writeByte(MODE_REGISTER_1, MODE_1_DEFAULT & ~Mode1.sleep, callback);
        },

        /**
         * @param {number} index
         * @param {Function} [callback]
         */
        getFrequency: function (index, callback) {
            util.assertCallback(callback);
            util.invokeCallbackAsync(callback, undefined, this._frequency);
        },

        /**
         * @param {number} index
         * @param {number} duty 0 ~ 1
         * @param {Function} [callback]
         */
        setDuty: function (index, duty, callback) {
            assert(duty >= DUTY_MIN && duty <= DUTY_MAX,
                   'duty should be [' + DUTY_MIN + ', ' + DUTY_MAX + ']');
            this._duty = duty;

            var i2c = this._i2c;

            var count = Math.round(duty * (COUNTER_END - 1));

            i2c.writeByte(OUTPUT_0 + ON_LOW_OFFSET + 4 * index, 0);
            i2c.writeByte(OUTPUT_0 + ON_HIGH_OFFSET + 4 * index, 0);
            i2c.writeByte(OUTPUT_0 + OFF_LOW_OFFSET + 4 * index, count & 0xff);
            i2c.writeByte(OUTPUT_0 + OFF_HIGH_OFFSET + 4 * index, count >> 8, callback);
        },

        /**
         * @param {number} index
         * @param {Function} [callback]
         */
        getDuty: function (index, callback) {
            util.assertCallback(callback);
            util.invokeCallbackAsync(callback, undefined, this._duty);
        },

        /**
         * @param {Function} [callback]
         */
        allOff: function (callback) {
            this._i2c.writeByte(ALL_LED_OFF_H, 0x10, callback);
        }
    }
});
