'use strict';

var driver = require('ruff-driver');

var adjustVal= 2;
var adjustMax = 255 - adjustVal;
function checkAndGet(val) {
    // the device will invert value, so before setting, we invert the input value.
    // when pass 0 to the device, it will shown in white, so we can't pass 0 to it.
    if (val >= 0 && val <= 255) {
//        return adjustMax- val;
	    return val;
    }
    console.error('parameter should be within 0-255');
    //return adjustMax;
    return 0;
}


function _turnOff(led) {
    led._pwmR.setDuty(checkAndGet(0) / 255);
    led._pwmG.setDuty(checkAndGet(0) / 255);
    led._pwmB.setDuty(checkAndGet(0) / 255);
}

module.exports = driver({

    attach: function(inputs) {
        this._pwmR = inputs.getRequired('pwm-r');
        this._pwmG = inputs.getRequired('pwm-g');
        this._pwmB = inputs.getRequired('pwm-b');

        this._rgb = {
            r: 0,
            g: 0,
            b: 0
        };
        _turnOff(this);
        this._on = false;
    },

    exports: {
        turnOn: function() {
            this._pwmR.setDuty(this._rgb.r / 255);
            this._pwmG.setDuty(this._rgb.g / 255);
            this._pwmB.setDuty(this._rgb.b / 255);

            this._on = true;
        },

        turnOff: function() {
            _turnOff(this);

            this._on = false;
        },
        setRGB: function(r, g, b) {
            this._rgb = {
                r: checkAndGet(r),
                g: checkAndGet(g),
                b: checkAndGet(b)
            };
            if (this._on) {
                this._pwmR.setDuty(this._rgb.r / 255);
                this._pwmG.setDuty(this._rgb.g / 255);
                this._pwmB.setDuty(this._rgb.b / 255);
            }
        },

        getRGB: function() {
            return [adjustMax - this._rgb.r, adjustMax - this._rgb.g, adjustMax - this._rgb.b];
        },

        isOn: function() {
            return this._on;
        }
    }
});
