/*
 * Copyright (c) 2015 Nanchao Inc. All rights reserved.
 */
'use strict';
var driver = require('ruff-driver');
var Gpio = require('gpio');
var mixin = require('util').mixin;

var outputsKey =
    [
        'io-0', 'io-1', 'io-2',  'io-3',  'io-4',  'io-5',  'io-6',  'io-7',
        'io-8', 'io-9', 'io-10', 'io-11', 'io-12', 'io-13', 'io-14', 'io-15'
    ];

var McpGpio = function(inputs, adapter, pin) {
    this._pin      = pin;
    this._adapter  = adapter;
    this._isActiveLow = 0;

    var dirStr     = inputs.getOptional('direction', 'in');
    var edgeText   = inputs.getOptional('edge', 'none');
    var edge       = Gpio.toEdge(edgeText);
    var isActiveLow = inputs.getOptional('activeLow', false);

    this._direction = Gpio.toDirection(dirStr);

    if (isActiveLow) {
        this.setActiveLow(true);
    }
    if (this._direction === Gpio.IN) {
        this._adapter.setGpioInput(this._pin);
        this.setEdge(edge);
    } else {
        this._adapter.setGpioOutput(this._pin);
        if (this._direction === Gpio.OUT_LOW) {
            this.write(0);
        } else if (this._direction === Gpio.OUT_HIGH) {
            this.write(1);
        }
    }
};

McpGpio.prototype.setDirection = function(direction) {
    if (direction === Gpio.IN) {
        this._adapter.setGpioInput(this._pin);
    } else {
        this._adapter.setGpioOutput(this._pin);
    }
};

McpGpio.prototype.setEdge = function(edge) { // jshint ignore:line
    this._adapter.setEdge(this._pin, edge);
    this._gpioEdge = edge;
};

McpGpio.prototype.read = function() {
    return this._adapter.readPin(this._pin);
};

McpGpio.prototype.write = function(value) {
    var data = value ^ this._isActiveLow;

    if (data === 1) {
        return this._adapter.setPinHigh(this._pin);
    } else {
        return this._adapter.setPinLow(this._pin);
    }
};

McpGpio.prototype.setActiveLow = function(isActiveLow) { // jshint ignore:line
    if (isActiveLow) {
        this._isActiveLow = 1;
    } else {
        this._isActiveLow = 0;
    }
};

module.exports = driver({
    attach: function (inputs) {
        this._gpios = [];
        this._gpioEdgeMask = 0;
        this._int  = inputs.getOptional('gpio', null);
        this._i2c  = inputs.getRequired('i2c');
        this._HIGH = inputs.getOptional('HIGH', 1);
        this._LOW  = 1 - this._HIGH;
        this._IN   = inputs.getOptional('IN', 1);
        this._OUT  = 1 - this._IN;

        this._cacheDirA  = 0xFF;
        this._cacheDirB  = 0xFF;
        this._cacheAOut  = 0;
        this._cacheBOut  = 0;

        this._IODIR_A = 0x00;
        this._IODIR_B = 0x01;

    // GPIO port reg
        this._GPIO_A = 0x12;
        this._GPIO_B = 0x13;

    // Output LAT reg
        this._OLAT_A = 0x14;
        this._OLAT_B = 0x15;

        this._GPINTEN_A = 0x4;
        this._GPINTEN_B = 0x5;

        this._DEFVAL_A = 0x6;
        this._DEFVAL_B = 0x7;

        this._INTCON_A  = 0x8;
        this._INTCON_B  = 0x9;

        this._IOCON_A = 0xA;
        this._IOCON_B = 0xB;

        this._INTF_A   = 0xE;
        this._INTF_B   = 0xF;

        this._INTCAP_A = 0x10;
        this._INTCAP_B = 0x11;

        var interruptHandle = function(adapter) {
            var i;
            var gpio;
            var mask  = (adapter._i2c.readByte(adapter._INTF_B) << 8) |  adapter._i2c.readByte(adapter._INTF_A);
            var capValue = (adapter._i2c.readByte(adapter._INTCAP_B) << 8) | adapter._i2c.readByte(adapter._INTCAP_A);
            for (i = 0;  i < 16; i++) {
                gpio = adapter._gpios[i];
                if ((mask & (1 << i)) && gpio) {
                    var gpioValue = (capValue >> i) & 0x1;
                    if (gpio._gpioEdge === Gpio.EDGE_FALLING) {
                        if (gpioValue === 1) {
                            return;
                        }
                    }
                    if (gpio._gpioEdge === Gpio.EDGE_RISING) {
                        if (gpioValue === 0) {
                            return;
                        }
                    }
                    gpio.emit('interrupt', gpioValue);
                }
            }
        };

        if (this._int) {
            this._int.setDirection(Gpio.IN);
            this._int.setEdge(Gpio.EDGE_BOTH);
            this._int.on('interrupt', interruptHandle.bind(this, this));
        }

        this.reset();
        this.enableIntMirror(true);
    },

    detach: function() {
        this.reset();
    },

    getDevice: function(key, inputs) {
        var index = outputsKey.indexOf(key);
        inputs.setValue('pin', index);
        function Template() {
        }

        mixin(Template, [McpGpio]);
        var GpioClass = Gpio.driver({
            attach: function(inputs, adapter, index) {
                McpGpio.call(this, inputs, adapter, index);
            },

            exports: Template.prototype
        });
        var gpio = new GpioClass(inputs, this, index);
        this._gpios[index] = gpio;

        return gpio;
    },

    exports : {
        write: function(offset, value) {
            return this._i2c.writeByte(offset, value);
        },

        read: function (offset) {
            return this._i2c.readByte(offset);
        },

        // reset all pins to output and pull them down.
        reset: function() {
            this._cacheDirA = 0xFF;
            this._cacheDirB = 0xFF;
            this._cacheAOut = 0x0;
            this._cacheBOut = 0x0;

            this.write(this._IODIR_A, this._cacheDirA);
            this.write(this._OLAT_A,  this._cacheAOut);
            this.write(this._IODIR_B, this._cacheDirB);
            this.write(this._OLAT_B,  this._cacheBOut);
            //clear interrupt
            this.read(this._INTF_A);
            this.read(this._INTF_B);
            this.read(this._INTCAP_A);
            this.read(this._INTCAP_B);
        },

        enableIntMirror: function(isEnable) {
            var data;

            data = this._i2c.readByte(this._IOCON_A);
            if (isEnable) {
                data |= 1 << 6;
            } else {
                data &= ~ (1 << 6);
            }
            data &= ~6;
            this._i2c.writeByte(this._IOCON_A, data);

            data = this._i2c.readByte(this._IOCON_B);
            if (isEnable) {
                data |= 1 << 6;
            } else {
                data &= ~ (1 << 6);
            }
            data &= ~6;
            this._i2c.writeByte(this._IOCON_B, data);
        },

        _setGpioDir: function (pin, dir) {
            var gpDir = pin < 8 ? this._cacheDirA : this._cacheDirB;
            var mask = 1 << (pin < 8 ? pin : pin - 8);

            //0 -> output, 1 -> input
            if ( (dir === this._OUT && (gpDir & mask) === mask) ||
                 (dir === this._IN  && (gpDir & mask) !== mask)) {
                if (pin < 8) {
                    this._cacheDirA = (gpDir ^ mask);
                    this.write(this._IODIR_A, this._cacheDirA);
                } else {
                    this._cacheDirB = (gpDir ^ mask);
                    this.write(this._IODIR_B, this._cacheDirB);
                }
            }
        },

        _setGpioData: function (pin, value) {
            var gp = pin < 8 ? this._cacheAOut : this._cacheBOut;
            var mask = 1 << (pin < 8 ? pin : pin - 8);

            if ((value === this._LOW  && (gp & mask) === mask) ||
                (value === this._HIGH && (gp & mask) !== mask)) {
                if (pin < 8) {
                    this._cacheAOut = gp ^ mask;
                    this.write(this._OLAT_A, this._cacheAOut);
                } else {
                    this._cacheBOut = gp ^ mask;
                    this.write(this._OLAT_B, this._cacheBOut);
                }
            }
        },

        // public methods and members
        setGpioOutput: function(pin) {
            this._setGpioDir(pin, this._OUT);
        },

        setGpioInput: function(pin) {
            this._setGpioDir(pin, this._IN);
        },

        setPinLow: function(pin) {
            this._setGpioData(pin, this._LOW);
        },

        setPinHigh: function(pin) {
            this._setGpioData(pin, this._HIGH);
        },

        readPin: function(pin) {
            var offset =  pin < 8 ? this._GPIO_A : this._GPIO_B;
            var mask = 1 << (pin < 8 ? pin : pin -8);

            if (this._i2c.readByte(offset) & mask) {
                return 1;
            } else {
                return 0;
            }
        },

        _toOffset: function(pin) {
            return pin < 8 ? 0 : 1;
        },

        _toBit: function(pin) {
            return pin < 8 ? pin : (pin - 8);
        },

        setEdge: function(pin, edge) {
            var offset = this._toOffset(pin);
            var bit    = this._toBit(pin);
            var intValue = this._i2c.readByte(this._GPINTEN_A + offset);

            if (edge === Gpio.EDGE_NONE) {
                intValue &= ~(1 << bit);
            } else {
                intValue |= 1 << bit;
            }
            this._i2c.writeByte(this._GPINTEN_A + offset, intValue);
            var intConValue = this._i2c.readByte(this._INTCON_A + offset);
            intConValue &= ~(1 << bit);
            this._i2c.writeByte(this._INTCON_A + offset, intConValue);
        },

        setEdgeWithLevel: function(pin, edge) {
            var offset = this._toOffset(pin);
            var bit    = this._toBit(pin);
            var intValue = this._i2c.readByte(this._GPINTEN_A + offset);

            if (edge === Gpio.EDGE_NONE) {
                intValue &= ~(1 << bit);
            } else{
                intValue |= 1 << bit;
                var intConValue = this._i2c.readByte(this._INTCON_A + offset);
                if (edge === Gpio.EDGE_BOTH) {
                    intConValue &= ~(1 << bit);
                } else {
                    intConValue |= 1 << bit;
                    var defValue = this._i2c.readByte(this._DEFVAL_A + offset);
                    if (edge === Gpio.EDGE_FALLING) {    //from 1 -> 0
                        defValue |= 1 << bit;
                    } else {    //from 0 -> 1
                        defValue &= ~(1 << bit);
                    }
                    this._i2c.writeByte(this._DEFVAL_A + offset, defValue);
                }
                this._i2c.writeByte(this._INTCON_A + offset, intConValue);
            }
            this._i2c.writeByte(this._GPINTEN_A + offset, intValue);
        }
    }
});

