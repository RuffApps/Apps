/*!
 * Copyright (c) 2016 Nanchao Inc.
 * All rights reserved.
 */

'use strict';

var EventEmitter = require('events');
var async = require('ruff-async');
var driver = require('ruff-driver');
var gpio = require('gpio');
var util = require('util');

var hasOwnProperty = Object.prototype.hasOwnProperty;

var Direction = gpio.Direction;
var Level = gpio.Level;
var Edge = gpio.Edge;

var DIRECTION_OUT_LEVEL_LOW = 2;
var DIRECTION_OUT_LEVEL_HIGH = 3;

/* eslint-disable camelcase */
var DIRECTION_MAP = {
    in: Direction.in,
    out: Direction.out,
    out_low: DIRECTION_OUT_LEVEL_LOW,
    out_high: DIRECTION_OUT_LEVEL_HIGH
};
/* eslint-enable camelcase */

/* eslint-disable no-unused-vars */
var LEVEL_MAP = {
    low: Level.low,
    high: Level.high
};

var IODIR_A = 0x00;
var IODIR_B = 0x01;

var IPOL_A = 0x02;
var IPOL_B = 0x03;

var GPINTEN_A = 0x04;
var GPINTEN_B = 0x05;

var DEFVAL_A = 0x6;
var DEFVAL_B = 0x7;

var INTCON_A = 0x08;
var INTCON_B = 0x09;

var IOCON_A = 0x0a;
var IOCON_B = 0x0b;

var GPPU_A = 0x0c;
var GPPU_B = 0x0d;

var INTF_A = 0x0e;
var INTF_B = 0x0f;

var INTCAP_A = 0x10;
var INTCAP_B = 0x11;

var GPIO_A = 0x12;
var GPIO_B = 0x13;

var OLAT_A = 0x14;
var OLAT_B = 0x15;
/* eslint-enable no-unused-vars */

var OUTPUT_INDEX_MAP = {
    'io-0': 0,
    'io-1': 1,
    'io-2': 2,
    'io-3': 3,
    'io-4': 4,
    'io-5': 5,
    'io-6': 6,
    'io-7': 7,
    'io-8': 8,
    'io-9': 9,
    'io-10': 10,
    'io-11': 11,
    'io-12': 12,
    'io-13': 13,
    'io-14': 14,
    'io-15': 15
};

function I2cGpioInterface(device, index, options, callback) {
    EventEmitter.call(this);

    var that = this;

    this._device = device;
    this._index = index;

    this._activeLow = !!options.activeLow;

    this.setDirection(options.direction || Direction.in, function (error) {
        if (error) {
            callback(error);
            return;
        }

        if (that._direction !== Direction.in) {
            callback(undefined, that);
            return;
        }

        that.setEdge(options.edge || Edge.none, function (error) {
            if (error) {
                callback(error);
                return;
            }

            callback(undefined, that);
        });
    });
}

util.inherits(I2cGpioInterface, EventEmitter);

/**
 * @param {boolean} activeLow
 * @param {Function} [callback]
 */
I2cGpioInterface.prototype.setActiveLow = function (activeLow, callback) {
    this._activeLow = activeLow;
    util.invokeCallbackAsync(callback);
};

/**
 * @param {Function} callback
 */
I2cGpioInterface.prototype.getActiveLow = function (callback) {
    util.assertCallback(callback);
    util.invokeCallbackAsync(callback, undefined, this._activeLow);
};

/**
 * @param {Direction} direction
 * @param {Level} level
 * @param {Function} [callback]
 */
I2cGpioInterface.prototype.setDirection = function (direction, level, callback) {
    var that = this;

    if (typeof level === 'function') {
        callback = level;
        level = undefined;
    }

    if (typeof direction === 'string') {
        direction = DIRECTION_MAP[direction];
    }

    if (direction !== Direction.in) {
        if (direction !== Direction.out) {
            level = direction === DIRECTION_OUT_LEVEL_LOW ? Level.low : Level.high;
            direction = Direction.out;
        }

        if (typeof level === 'string') {
            level = LEVEL_MAP[level];
        }
    } else if (level !== undefined) {
        level = undefined;
    }

    this._device.setDirection(this._index, direction, function (error) {
        if (error) {
            util.invokeCallback(callback, error, undefined, true);
            return;
        }

        that._direction = direction;

        if (typeof level !== 'number') {
            util.invokeCallback(callback, undefined, undefined, true);
            return;
        }

        that._device.write(level ^ that._activeLow, callback);
    });
};

/**
 * @param {Function} callback
 */
I2cGpioInterface.prototype.getEdge = function (callback) {
    util.assertCallback(callback);
    util.invokeCallbackAsync(callback, undefined, this._edge);
};

/**
 * @param {Edge} edge
 * @param {Function} [callback]
 */
I2cGpioInterface.prototype.setEdge = function (edge, callback) {
    if (typeof edge === 'string') {
        edge = Edge[edge];
    }

    if (typeof edge !== 'number') {
        throw new TypeError('Invalid edge value');
    }

    var that = this;

    this._device.setEdge(this._index, edge, function (error) {
        if (error) {
            util.invokeCallback(error, callback);
            return;
        }

        that._edge = edge;

        util.invokeCallback(callback);
    });
};

/**
 * @param {Function} callback
 */
I2cGpioInterface.prototype.read = function (callback) {
    var readCallback = callback && function (error, value) {
        if (error) {
            callback(error);
            return;
        }

        callback(undefined, value ^ this._activeLow);
    };

    this._device.read(this._index, readCallback);
};

/**
 * @param {number} value 0 or 1
 * @param {Function} [callback]
 */
I2cGpioInterface.prototype.write = function (value, callback) {
    this._device.write(this._index, value ^ this._activeLow, callback);
};

I2cGpioInterface.get = function (device, index, options, callback) {
    new I2cGpioInterface(device, index, options, callback);
};

module.exports = driver({
    attach: function (inputs, context, next) {
        this._interfaces = [];

        this._gpio = inputs['gpio'];
        this._i2c = inputs['i2c'];

        this._gpio.on('interrupt', this._oninterrupt.bind(this));

        this.reset();

        // IOCON mirror (0b01000000).
        this._i2c.writeByte(IOCON_A, 0x40);
        this._i2c.writeByte(IOCON_B, 0x40, function () {
            next();
        });
    },
    detach: function (callback) {
        this.reset(callback);
    },
    getInterface: function (name, options, callback) {
        if (!hasOwnProperty.call(OUTPUT_INDEX_MAP, name)) {
            throw new Error('Invalid interface name "' + name + '"');
        }

        util.assertCallback(callback);

        var index = OUTPUT_INDEX_MAP[name];

        var interfaces = this._interfaces;

        if (index in interfaces) {
            util.invokeCallbackAsync(callback, undefined, interfaces[index]);
        } else {
            I2cGpioInterface.get(this, index, options, function (error, gpioInterface) {
                if (error) {
                    callback(error);
                    return;
                }

                interfaces[index] = gpioInterface;
                callback(undefined, gpioInterface);
            });
        }
    },
    exports: {
        _oninterrupt: function () {
            var i2c = this._i2c;
            var gpios = this._interfaces;

            async.series([
                i2c.readByte.bind(i2c, INTF_A),
                i2c.readByte.bind(i2c, INTF_B),
                i2c.readByte.bind(i2c, INTCAP_A),
                i2c.readByte.bind(i2c, INTCAP_B)
            ], function (error, values) {
                if (error) {
                    return;
                }

                var interruptionBits = values[0] | values[1] << 8;
                var valueBits = values[2] | values[3] << 8;

                for (var i = 0; i < gpios.length; i++) {
                    if (interruptionBits & (1 << i) && i in gpios) {
                        var gpio = gpios[i];
                        var value = (valueBits >> i) & 1;
                        var edge = gpio._edge;

                        if (
                            value && edge === Edge.falling ||
                            !value && edge === Edge.rising
                        ) {
                            continue;
                        }

                        gpio.emit('interrupt', value);
                    }
                }
            });
        },
        /**
         * @param {Function} [callback]
         */
        reset: function (callback) {
            this._dataA = 0x00;
            this._dataB = 0x00;

            this._dirDataA = 0xff;
            this._dirDataB = 0xff;

            this._edgeDataA = 0x00;
            this._edgeDataB = 0x00;

            var i2c = this._i2c;

            i2c.writeByte(IODIR_A, this._dirDataA);
            i2c.writeByte(IODIR_B, this._dirDataB);

            i2c.writeByte(GPINTEN_A, this._edgeDataA);
            i2c.writeByte(GPINTEN_B, this._edgeDataB);

            i2c.writeByte(OLAT_A, this._dataA);
            i2c.writeByte(OLAT_B, this._dataB);

            i2c.writeByte(INTCON_A, 0x00);
            i2c.writeByte(INTCON_B, 0x00, callback);
        },
        /**
         * @param {number} index
         * @param {number} value 0 or 1
         * @param {Function} [callback]
         */
        write: function (index, value, callback) {
            var dataKey;
            var address;

            if (index < 8) {
                dataKey = '_dataA';
                address = OLAT_A;
            } else {
                dataKey = '_dataB';
                address = OLAT_B;
            }

            index %= 8;

            if (value) {
                this[dataKey] |= 1 << index;
            } else {
                this[dataKey] &= ~(1 << index);
            }

            this._i2c.writeByte(address, this[dataKey], callback);
        },
        /**
         * @param {number} index
         * @param {Function} callback
         */
        read: function (index, callback) {
            var readCallback = callback && function (error, value) {
                if (error) {
                    callback(error);
                    return;
                }

                callback(undefined, value >> index % 8 & 1);
            };

            var offset = index < 8 ? GPIO_A : GPIO_B;

            this._i2c.readByte(offset, readCallback);
        },
        /**
         * @param {number} index
         * @param {Direction} direction
         * @param {Function} [callback]
         */
        setDirection: function (index, direction, callback) {
            var dataKey;
            var address;

            if (index < 8) {
                dataKey = '_dirDataA';
                address = IODIR_A;
            } else {
                dataKey = '_dirDataB';
                address = IODIR_B;
            }

            index %= 8;

            // The Direction enum has `in` as `0` and `out` as `1`,
            // but we are expecting `in` as `1` and `out` as `0`.
            if (direction) {
                this[dataKey] &= ~(1 << index);
            } else {
                this[dataKey] |= 1 << index;
            }

            this._i2c.writeByte(address, this[dataKey], callback);
        },
        /**
         * @param {number} index
         * @param {Edge} edge
         * @param {Function} callback
         */
        setEdge: function (index, edge, callback) {
            var dataKey;
            var address;

            if (index < 8) {
                dataKey = '_edgeDataA';
                address = GPINTEN_A;
            } else {
                dataKey = '_edgeDataB';
                address = GPINTEN_B;
            }

            index %= 8;

            if (edge === Edge.none) {
                this[dataKey] &= ~(1 << index);
            } else {
                this[dataKey] |= 1 << index;
            }

            this._i2c.writeByte(address, this[dataKey], callback);
        }
    }
});
