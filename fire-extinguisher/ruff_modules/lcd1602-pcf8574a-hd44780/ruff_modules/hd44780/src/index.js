/*!
 * Copyright (c) 2016 Nanchao Inc.
 * All rights reserved.
 */

'use strict';

var async = require('ruff-async');
var driver = require('ruff-driver');
var util = require('util');

var Queue = async.Queue;

var DDRAM_ADDRESSES = [
    0x00,
    0x40,
    0x14,
    0x54
];

var Register = {
    instruction: 0,
    data: 1
};

var ReadWrite = {
    read: 1,
    write: 0
};

var Instruction = {
    clearDisplay: 0x01,
    returnHome: 0x02,
    setEntryMode: 0x04,
    setDisplayControl: 0x08,
    shiftCursor: 0x10,
    setCgramAddress: 0x40,
    setDdramAddress: 0x80
};

var DisplayControl = {
    display: 0x04,
    cursor: 0x02,
    blink: 0x01
};

var EntryMode = {
    increment: 0x02,
    shift: 0x01
};

module.exports = driver({
    attach: function (inputs, context, next) {
        this._displayControl = 0x00;

        this._rs = inputs['rs'];
        this._rw = inputs['rw'];
        this._e = inputs['e'];
        this._p3 = inputs['p3'];
        this._d4 = inputs['d4'];
        this._d5 = inputs['d5'];
        this._d6 = inputs['d6'];
        this._d7 = inputs['d7'];

        this._queue = new Queue(this._writeHandler);

        // Turn on backlight.
        this._p3.write(1);

        // Set to 8-bit function set (0b0011) with 2 lines (0b1000).
        // Skipping this would make some instructions fail if it has already been done before.
        this._writeInstruction(0x38);

        // Set to 4-bit function set (0b0010).
        this._write(Register.instruction, ReadWrite.write, 0x2);
        // Set to 4-bit function set (0b0010) again with 2 lines (0b1000).
        this._writeInstruction(0x28);

        this.turnOn();
        this.clear();

        // Sets Entry Mode to auto-increment cursor and disable shift mode.
        this._writeInstruction(Instruction.setEntryMode | EntryMode.increment);
        this._writeInstruction(Instruction.returnHome, next);
    },
    detach: function (callback) {
        this.turnOff(callback);
    },
    exports: {
        /**
         * @param {Register} rs
         * @param {ReadWrite} rw
         * @param {number} bits
         * @param {number} [delay] The device could be busy, delay several milliseconds to ensure data get processed.
         * @param {number} [callback]
         */
        _writeHandler: function (rs, rw, bits, delay, callback) {
            this._rs.write(rs);
            this._rw.write(rw);

            this._d7.write(bits >> 3 & 1);
            this._d6.write(bits >> 2 & 1);
            this._d5.write(bits >> 1 & 1);
            this._d4.write(bits & 1);

            this._e.write(1);
            this._e.write(0, function () {
                if (typeof delay === 'number') {
                    setTimeout(done, delay);
                } else {
                    done();
                }
            });

            function done() {
                util.invokeCallback(callback);
            }
        },
        /**
         * @param {Register} rs
         * @param {ReadWrite} rw
         * @param {number} bits
         * @param {number} [delay] The device could be busy, delay several milliseconds to ensure data get processed.
         * @param {number} [callback]
         */
        _write: function (rs, rw, bits, delay, callback) {
            if (typeof delay === 'function') {
                callback = delay;
                delay = undefined;
            }

            this._queue.push(this, [rs, rw, bits, delay], callback);
        },
        /**
         * @param {number} bits
         * @param {number} [delay]
         * @param {Function} [callback]
         */
        _writeInstruction: function (bits, delay, callback) {
            if (typeof delay === 'function') {
                callback = delay;
                delay = undefined;
            }

            this._write(Register.instruction, ReadWrite.write, bits >> 4, delay);
            this._write(Register.instruction, ReadWrite.write, bits, delay, callback);
        },
        /**
         * @param {DisplayControl} control
         * @param {boolean} toggle
         * @param {Function} [callback]
         */
        _setDisplayControl: function (control, toggle, callback) {
            if (toggle) {
                this._displayControl |= control;
            } else {
                this._displayControl &= ~control;
            }

            this._writeInstruction(Instruction.setDisplayControl | this._displayControl, callback);
        },
        /*
         * @param {string} text
         * @param {Function} [callback]
         */
        print: function (text, callback) {
            for (var i = 0; i < text.length; i++) {
                var bits = text.charCodeAt(i);

                this._write(Register.data, ReadWrite.write, bits >> 4);
                this._write(Register.data, ReadWrite.write, bits, i === text.length - 1 ? callback : undefined);
            }
        },
        /*
         * @param {Function} [callback]
         */
        clear: function (callback) {
            this._writeInstruction(Instruction.clearDisplay, 10, callback);
        },
        /*
         * Set cursor coordinates, (0, 0) refer to the first character of the first line.
         * @param {number} x
         * @param {number} y
         * @param {Function} [callback]
         */
        setCursor: function (x, y, callback) {
            var bits = Instruction.setDdramAddress | (DDRAM_ADDRESSES[y] + x);
            this._writeInstruction(bits, callback);
        },
        /*
         * @param {Function} [callback]
         */
        showCursor: function (callback) {
            this._setDisplayControl(DisplayControl.cursor, true, callback);
        },
        /*
         * @param {Function} [callback]
         */
        hideCursor: function (callback) {
            this._setDisplayControl(DisplayControl.cursor, false, callback);
        },
        /*
         * @param {Function} [callback]
         */
        blinkOn: function (callback) {
            this._setDisplayControl(DisplayControl.blink, true, callback);
        },
        /*
         * @param {Function} [callback]
         */
        blinkOff: function (callback) {
            this._setDisplayControl(DisplayControl.blink, false, callback);
        },
        /*
         * @param {Function} [callback]
         */
        turnOn: function (callback) {
            this._setDisplayControl(DisplayControl.display, true, callback);
        },
        /*
         * @param {Function} [callback]
         */
        turnOff: function (callback) {
            this._setDisplayControl(DisplayControl.display, false, callback);
        }
    }
});
