'use strict';

var driver = require('ruff-driver');
var pwm = require('pwm');

var MODE1 = 0;
var LED0_ON_L = 6;
var LED0_ON_H = 7;
var LED0_OFF_L = 8;
var LED0_OFF_H = 9;
var ALL_LED_OFF_H = 0xFD;
var PRE_SCALE = 254;
var outputsKey = {
    'pwm-0': 0,
    'pwm-1': 1,
    'pwm-2': 2,
    'pwm-3': 3,
    'pwm-4': 4,
    'pwm-5': 5,
    'pwm-6': 6,
    'pwm-7': 7
};

function setFrequency(freq, pca) {
    var prescale = Math.round(25000000 / (freq * 4096)) - 1;
    var oldMode = pca._i2c.readByte(MODE1) & 0x7f;
    var newMode = oldMode | 0x10;
    pca._i2c.writeByte(MODE1, newMode);
    pca._i2c.writeByte(PRE_SCALE, prescale);
    pca._i2c.writeByte(MODE1, oldMode);
}

function setDuty(i2c, channel, pulseon, pulseoff) {
    i2c.writeByte(LED0_ON_L + 4 * channel, pulseon & 0xFF);
    i2c.writeByte(LED0_ON_H + 4 * channel, pulseon >> 8);
    i2c.writeByte(LED0_OFF_L + 4 * channel, pulseoff & 0xFF);
    i2c.writeByte(LED0_OFF_H + 4 * channel, pulseoff >> 8);
}

function getChannel(channel, adapter) {
    return pwm.driver({
        attach: function() {
            this._channel = channel;
            this._adapter = adapter;
        },

        exports: {
            setFrequency: function(freq) {
                setFrequency(freq, this._adapter);
            },

            setDuty: function(rate) {
                setDuty(this._adapter._i2c, this._channel, 0, rate * 4096);
            }
        }
    });
}

module.exports = driver({
    attach: function(inputs) {
        this._i2c = inputs.getRequired('i2c');
        this._i2c.writeByte(MODE1, 0x80);
        this._i2c.writeByte(ALL_LED_OFF_H, 0x10);
    },

    getDevice: function(key, options) {
        var freq = options.getRequired('frequency');
        setFrequency(freq, this);
        var channel = outputsKey[key];
        if (channel === undefined) {
            throw new Error('channel must in [pwm-0, pwm-1, pwm-2, pwm-3, pwm-4, pwm-5, pwm-6, pwm-7]');
        }
        var PwmClass = getChannel(outputsKey[key], this);
        return new PwmClass(options);
    }
});