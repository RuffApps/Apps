'use strict';

var Gpio   = require('gpio');
var driver = require('ruff-driver');

module.exports = driver({

    attach: function (inputs) {
        var _this = this;
        this.gpio = inputs.getRequired('gpio');

        this.gpio.setDirection(Gpio.IN);
        this.gpio.setEdge(Gpio.EDGE_BOTH);

        this.gpio.on('interrupt', function () {
            var data = _this.gpio.read();
            if (data === 1) {
                _this.emit('presence');
            } else {
                _this.emit('absence');
            }
        });
    },

    events: {
        presence: 'event when a person is presence',
        absence: 'event when a person is absence'
    }
});
