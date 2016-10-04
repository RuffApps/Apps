/*!
 * Copyright (c) 2016 Nanchao Inc.
 * All rights reserved.
 */

'use strict';

var driver = require('ruff-driver');

module.exports = driver({
    attach: function (inputs) {
        this._pwmR = inputs['pwm-r'];
        this._pwmG = inputs['pwm-g'];
        this._pwmB = inputs['pwm-b'];
    },
    exports: {
        setRGB: function (rgb, callback) {
            if (typeof callback === 'number') {
                this._r = arguments[0];
                this._g = arguments[1];
                this._b = arguments[2];
                callback = arguments[3];
            } else if (typeof rgb === 'number') {
                this._r = rgb >> 16 & 0xff;
                this._g = rgb >> 8 & 0xff;
                this._b = rgb & 0xff;
            } else if (Array.isArray(rgb)) {
                this._r = rgb[0];
                this._g = rgb[1];
                this._b = rgb[2];
            } else {
                throw new TypeError('No signature found that matches arguments given');
            }

            this._pwmR.setDuty(this._r / 0xff);
            this._pwmG.setDuty(this._g / 0xff);
            this._pwmB.setDuty(this._b / 0xff, callback);
        },
        getRGB: function (callback) {
            return setImmediate(callback, undefined, [this._r, this._g, this._b]);
        },
        turnOn: function (callback) {
            this.setRGB([0xff, 0xff, 0xff], callback);
        },
        turnOff: function (callback) {
            this.setRGB([0x00, 0x00, 0x00], callback);
        }
    }
});
