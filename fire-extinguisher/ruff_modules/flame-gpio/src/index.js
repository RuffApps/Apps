'use strict';

var driver = require('ruff-driver');

module.exports = driver({
    attach: function (inputs) {
        var _this  = this;
        this._gpio = inputs.getRequired('gpio');

        this._gpio.on('interrupt', function () {
            var data = _this._gpio.read();
            _this.emit(data === 0 ? 'fire' : 'none');
        });
    },

    exports: {
        isBurning: function () {
            return this._gpio.read() === 0;
        }
    },

    events: {
        fire: 'event for fire',
        none: 'event for none'
    }
});
