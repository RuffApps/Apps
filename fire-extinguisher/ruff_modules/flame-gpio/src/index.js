/*!
 * Copyright (c) 2016 Nanchao Inc.
 * All rights reserved.
 */

'use strict';

var driver = require('ruff-driver');

var FireState = {
    none: 0,
    fire: 1
};

var prototype = {};

Object.defineProperties(prototype, {
    none: {
        get: function () {
            return this._state === FireState.none;
        }
    },
    fire: {
        get: function () {
            return this._state === FireState.fire;
        }
    }
});

module.exports = driver({
    attach: function (inputs) {
        var that = this;

        this._gpio = inputs['gpio'];
        this._state = FireState.none;

        this._gpio.on('interrupt', function (state) {
            if (that._state === state) {
                return;
            }

            that._state = state;

            if (state === FireState.none) {
                that.emit('none');
            } else {
                that.emit('fire');
            }
        });
    },
    exports: prototype
});
