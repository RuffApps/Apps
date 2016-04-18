/*
 * Copyright (c) 2015 Nanchao Inc. All rights reserved.
 */

'use strict';

var driver = require('ruff-driver');
var Gpio   = require('gpio');
var outputsKey = ['gpio0', 'gpio1', 'gpio2', 'gpio3',
                  'gpio4', 'gpio5', 'gpio6', 'gpio7'];

function I2cGpio(inputs, adapter, pin) {
    this._index   = pin;
    this._adapter = adapter;
}

I2cGpio.prototype.setDirection = function() {
    return;
};

I2cGpio.prototype.setEdge = function() {
    console.log('PCF8574 do not support setEdge');
    return -1;
};

I2cGpio.prototype.write = function(value) {
    return this._adapter.write(this._index, value);
};

I2cGpio.prototype.read = function() {
    return this._adapter.read(this._index);
};

I2cGpio.prototype.setActiveLow = function() {
    //to implement
};

module.exports = driver({
    attach: function(inputs) {
        this._i2c    = inputs.getRequired('i2c');
        this._data   = 0;
        this._offset = 0;
    },

    getDevice: function(key, inputs) { // jshint ignore:line
        var index = outputsKey.indexOf(key);
        inputs.setValue('pin', index);
        var GpioClass = Gpio.driver({
            attach: function(inputs, adapter, index) {
                I2cGpio.call(this, inputs, adapter, index);
            },
            exports: I2cGpio.prototype
        });

        return new GpioClass(inputs, this, index);
    },

    exports: {
        write: function(index, value) {
            var mask = 0;

            if (value === 1) {
                mask = this._data | (1 << index);
            } else {
                mask = this._data & ~( 1 << index);
            }

            if (mask !== this._data) {
                this._i2c.writeByte(-1, mask);
                this._data = mask;
            }

            return this._data;
        },

        read : function(index) {
            var data = this._i2c.readByte();
            data = (data & (1 << index)) >> index;
            return data;
        }
    }
});
