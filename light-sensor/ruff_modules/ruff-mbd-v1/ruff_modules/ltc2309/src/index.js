'use strict';

var driver = require('ruff-driver');
var adc = require('adc');

var outputKeys = {
    'an-0': 0x80,
    'an-1': 0xC0,
    'an-2': 0x90,
    'an-3': 0xD0,
    'an-4': 0xA0,
    'an-5': 0xE0,
    'an-6': 0xB0,
    'an-7': 0xF0
};

function read(i2c, addr) {
    var data = i2c.readBytes(addr | 0x08, 2); //Discard first reading .
    data = i2c.readBytes(addr | 0x08, 2);
    return (data[0] << 8 | (data[1])) >> 4;
}

function channel(addr, i2c) {
    return adc.driver({
        attach: function() {
            this._addr = addr;
            this._i2c = i2c;
        },

        exports: {
            getRawValue: function() {
                return read(this._i2c, this._addr);
            },

            getResolution: function() {
                return 12;
            }
        }
    });
}

module.exports = driver({
    attach: function(inputs) {
        this._i2c = inputs.getRequired('i2c');
    },

    getDevice: function(key, options) {
        var addr = outputKeys[key];
        if (!addr) {
            throw new Error('channel must in [an-0, an-1, an-2, an-3, an-4, an-5, an-6, an-7]');
        }
        var AdcClass = channel(addr, this._i2c);
        return new AdcClass(options);
    }
});