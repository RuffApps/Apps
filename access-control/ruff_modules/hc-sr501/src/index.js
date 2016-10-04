'use strict';

var Level = require('gpio').Level;
var driver = require('ruff-driver');

var SensorState = {
    absence: Level.low,
    presence: Level.high
};

module.exports = driver({
    attach: function (inputs) {
        var that = this;

        this._gpio = inputs['gpio'];

        this._gpio.on('interrupt', function (state) {
            if (state === this._state) {
                return;
            }

            this._state = state;

            if (state === SensorState.presence) {
                that.emit('presence');
            } else {
                that.emit('absence');
            }
        });
    }
});
