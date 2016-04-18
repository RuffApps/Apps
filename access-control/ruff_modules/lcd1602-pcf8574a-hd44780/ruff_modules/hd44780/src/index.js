/*
 * Copyright (c) 2015 Nanchao Inc. All rights reserved.
 */
'use strict';

var driver = require('ruff-driver');
var LcdCommand = {};

LcdCommand.CLEARDISPLAY = 0x01;
LcdCommand.RETURNHOME = 0x02;
LcdCommand.ENTRYMODESET = 0x04;
LcdCommand.DISPLAYCONTROL = 0x08;
LcdCommand.CURSORSHIFT = 0x10;
LcdCommand.FUNCTIONSET = 0x20;
LcdCommand.SETCGRAMADDR = 0x40;
LcdCommand.SETDDRAMADDR = 0x80;

//# flags for display entry mode
LcdCommand.ENTRYRIGHT = 0x00;
LcdCommand.ENTRYLEFT = 0x02;
LcdCommand.ENTRYSHIFTINCREMENT = 0x01;
LcdCommand.ENTRYSHIFTDECREMENT = 0x00;

//# flags for display on/off control
LcdCommand.DISPLAYON = 0x04;
LcdCommand.DISPLAYOFF = 0x00;
LcdCommand.CURSORON = 0x02;
LcdCommand.CURSOROFF = 0x00;
LcdCommand.BLINKON = 0x01;
LcdCommand.BLINKOFF = 0x00;

//# flags for display/cursor shift
LcdCommand.DISPLAYMOVE = 0x08;
LcdCommand.CURSORMOVE = 0x00;
LcdCommand.MOVERIGHT = 0x04;
LcdCommand.MOVELEFT = 0x00;

module.exports = driver({
    attach: function (inputs) {
        this._displayCmd = 0;
        this._rs = inputs.getRequired('rs');
        this._rw = inputs.getRequired('rw');
        this._cs = inputs.getRequired('cs');
        this._p3 = inputs.getRequired('p3');
        this._d4 = inputs.getRequired('d4');
        this._d5 = inputs.getRequired('d5');
        this._d6 = inputs.getRequired('d6');
        this._d7 = inputs.getRequired('d7');

        //enable write
        this._rw.write(0);
        this._rs.write(1);
        this._rs.write(0);
        this._cs.write(0);
        //enable back light
        this._p3.write(1);
    /*
     * 0x33 — Function set to 8-bit mode.
     * insert additional 2ms delay after first command write.
     * 0x32 — Function set to 8-bit mode again.
     * 0x28 — Set function to 4-bit mode, indicate LcdCommand has two lines.
     * 0x0F — Turn display on, cursor on and blink cursor.
     * 0x01 — Clear display.
     * 0x06 — Sets Entry Mode to auto-increment cursor and disable shift mode.
     * 0x02 — send the cursor to the home position.
     */

        this.write(0x33,1);
        this.write(0x32,1);
        this.write(0x28,1);
        //0xF
        this._displayCmd = LcdCommand.DISPLAYCONTROL | LcdCommand.ENTRYMODESET | LcdCommand.RETURNHOME;
        this.write(this._displayCmd, 1);
        this.write(0x01, 1);
        this.write(0x06, 1);
        this.write(0x02, 1);
    },

    detach: function () {
        //do clean work here
    },

    exports : {
        write : function (x, isCommand) {
            this._rs.write((!isCommand + 0));
            this._d7.write(x>>7 & 0x1);
            this._d6.write(x>>6 & 0x1);
            this._d5.write(x>>5 & 0x1);
            this._d4.write(x>>4 & 0x1);
            this._cs.write(1);
            this._cs.write(0);
            this._d7.write(x>>3 & 0x1);
            this._d6.write(x>>2 & 0x1);
            this._d5.write(x>>1 & 0x1);
            this._d4.write(x>>0 & 0x1);
            this._cs.write(1);
            this._cs.write(0);
        },

        _updateDisplayCmd : function(newValue) {
            this.write(newValue | LcdCommand.DISPLAYCONTROL, 1);
        },
        /*
         *  clear screen
         */
        clear : function() {
            this.write(0x1, 1);
        },

        /*
         *  print string on screen
         */
        print : function(str) {
            for (var i=0;i<str.length;i++) {
                this.write(str.charCodeAt(i), 0);
            }
        },

       _blinkOn : function(isOn) {
            if (isOn) {
                this._displayCmd = this._displayCmd | LcdCommand.BLINKON;
            } else {
                this._displayCmd = this._displayCmd & (~LcdCommand.BLINKON);
            }
            this._updateDisplayCmd(this._displayCmd);
        },

        /*
         * enalbe blink
         */
        blinkOn : function() {
            this._blinkOn(true);
        },

        /*
         * disable blink
         */

        blinkOff : function() {
            this._blinkOn(false);
        },

        _cursorOn : function(isOn) {
            if (isOn) {
                this._displayCmd = this._displayCmd | LcdCommand.CURSORON;
            } else {
                this._displayCmd = this._displayCmd & (~LcdCommand.CURSORON);
            }

            this._updateDisplayCmd(this._displayCmd);
        },

        /*
         * enable cursor
         */
        cursorOn : function() {
            this._cursorOn(true);
        },

        /*
         * disable cursor
         */
        cursorOff : function() {
            this._cursorOn(false);
        },

        /*
         *  set cursor pos, top left = 0,0
         */

        setCursor : function(x, y) {
            var l = [0x00,0x40,0x14,0x54];
            var data = l[y] + x;
            data = data | LcdCommand.SETDDRAMADDR;

            this.write(data, 1);
        },

        _turnOn : function(isOn) {
            if (!isOn) {
                this._displayCmd = this._displayCmd & (~LcdCommand.DISPLAYON);
            } else {
                this._displayCmd = this._displayCmd | LcdCommand.DISPLAYON;
            }
            this._updateDisplayCmd(this._displayCmd);
        },
        /*
         * turn on display
         */
        turnOn : function() {
            this._turnOn(true);
        },

        /*
         * turn off display
         */
        turnOff: function() {
            this._turnOn(false);
        }
    }
});
