'use strict';

var driver = require('ruff-driver');

module.exports = driver({
    attach: function (inputs) {
        this._gpio = inputs.getRequired('gpio');
    },
    exports: {
        turnOn: function () {
            this._gpio.write(0);
        },

        turnOff: function () {
            this._gpio.write(1);
        },

        isOn: function () {
            return this._gpio.read() === 0;
        }
    }
});