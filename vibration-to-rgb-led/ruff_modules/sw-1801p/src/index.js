'use strict';

var driver = require('ruff-driver');

module.exports = driver({

    attach: function (inputs) {
        var _this  = this;
        this._gpio = inputs.getRequired('gpio');

        this._gpio.on('interrupt', function () {
            _this.emit('shock');
        });
    },

    events: {
        shock: 'message when device shocks'
    }
});
