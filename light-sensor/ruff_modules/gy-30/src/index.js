'use strict';

var driver = require('ruff-driver');

module.exports = driver({
    attach: function(inputs) {
        this._i2c = inputs.getRequired('i2c');
    },

    exports: {
        getIlluminance: function() {
            var data = this._i2c.readBytes(0x20, 2);
            uv.mdelay(180); //jshint ignore:line
            data = this._i2c.readBytes(0x20, 2);
            // reference to datasheet: bh1750fvi-e.pdf
            return Math.floor(((data[0] << 8) + (data[1] & 0xFF)) / 1.2);
        }
    }
});