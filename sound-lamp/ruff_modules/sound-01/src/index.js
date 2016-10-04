/*!
 * Copyright (c) 2016 Nanchao Inc.
 * All rights reserved.
 */

'use strict';

var Edge = require('gpio').Edge;
var driver = require('ruff-driver');

var prototype = {
    _oninterrupt: function () {
        var now = Date.now();

        if (now - this._lastEmittingTimestamp < this._interval) {
            return;
        }

        this._lastEmittingTimestamp = now;
        this.emit('sound');
    },
    enable: function (callback) {
        this._gpio.setEdge(Edge.falling, callback);
    },
    disable: function (callback) {
        this._gpio.setEdge(Edge.none, callback);
    }
};

Object.defineProperties(prototype, {
    interval: {
        set: function (value) {
            this._interval = value;
        },
        get: function () {
            return this._interval;
        }
    }
});

module.exports = driver({
    attach: function (inputs, context, next) {
        this._lastEmittingTimestamp = 0;

        this._gpio = inputs['gpio'];
        this._gpio.on('interrupt', this._oninterrupt.bind(this));

        var args = context.args;

        this._interval = args.interval;

        if (args.enabled) {
            this.enable(next);
        }
    },
    exports: prototype
});
