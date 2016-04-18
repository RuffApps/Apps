'use strict';

var driver = require('ruff-driver');

var ButtonState = {
    pushed: 0,
    released: 1
};

module.exports = driver({
    attach: function(inputs) {
        var _this = this;
        this._gpio = inputs.getRequired('gpio');
        this._currentState = ButtonState.released;

        this._gpio.on('interrupt', function(state) {
            if (_this._currentState === state) {
                return;
            }

            _this._currentState = state;

            if (state === ButtonState.pushed) {
                _this.emit('push');
            } else {
                _this.emit('release');
            }
        });
    },
    exports: {
        isPressed: function() {
            return ButtonState.pushed === this._gpio.read();
        }
    },

    events: {
        push: 'message when button is pushed',
        release: 'message when button is released'
    },
});