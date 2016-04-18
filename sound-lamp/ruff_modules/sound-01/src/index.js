'use strict';

var driver = require('ruff-driver');
var Gpio   = require('gpio');

module.exports = driver({
    attach: function (inputs) {
        var _this  = this;
        this._gpio = inputs.getRequired('gpio');
        var emitInterval = inputs.getRequired('interval');

        var lastEmitTime = 0;
        this._gpio.on('interrupt', function () {
            var now = Date.now();
            if (now - lastEmitTime < emitInterval) {
                return;
            }
            lastEmitTime = now;
            _this.emit('receive');
            _this._gpio.setEdge(Gpio.EDGE_NONE);
            setTimeout(function () {
                _this._gpio.setEdge(Gpio.EDGE_FALLING);
            }, 100);
        });
    },

    events: {
        receive: 'event when capture a sound'
    }
});
