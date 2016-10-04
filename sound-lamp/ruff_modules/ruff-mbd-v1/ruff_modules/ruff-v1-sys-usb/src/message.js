/*!
 * Copyright (c) 2016 Nanchao Inc.
 * All rights reserved.
 */

'use strict';

var EventEmitter = require('events');
var dgram = require('dgram');
var util = require('util');
var fs = require('fs');
var path = require('path');

var LOCAL_PORT = 9999;
var LOCAL_IP = '127.0.0.1';

var SCRIPT_NAME = '10-ruff-usb';
var SCRIPT_TARGET_PATH = '/etc/hotplug.d/usb';

var scriptSrcPath = path.join(__dirname, SCRIPT_NAME);
var scriptDestPath = path.join(SCRIPT_TARGET_PATH, SCRIPT_NAME);

function Message() {
    EventEmitter.call(this);
    this._socket = null;
}
util.inherits(Message, EventEmitter);

function loadScript(callback) {
    fs.readFile(scriptSrcPath, function (error, data) {
        if (error) {
            callback && callback(error);
            return;
        }
        fs.writeFile(scriptDestPath, data, function (error) {
            if (error) {
                callback && callback(error);
                return;
            }
            callback && callback();
        });
    });
}

function deleteScript(callback) {
    fs.unlink(scriptDestPath, callback);
}

Message.prototype.start = function (callback) {
    this._socket = dgram.createSocket();
    this._socket.on('error', function (error) {
        throw error;
    });

    this._socket.on('listening', function () {
    });

    this._socket.on('message', this._onMessage.bind(this));

    this._socket.bind(LOCAL_PORT, LOCAL_IP, loadScript.bind(null, callback));
};

function parseMessage(message) {
    var msgStr = message.toString();
    return JSON.parse(msgStr.substr(0, msgStr.length - 1));
}

Message.prototype._onMessage = function (message) {
    var event = parseMessage(message);
    this.emit('uevent', event);
};

Message.prototype.stop = function (callback) {
    var that = this;
    if (!this._socket) {
        callback && callback();
        return;
    }

    this.removeAllListeners('uevent');
    this._socket.close(function (error) {
        if (error) {
            callback && callback(error);
            return;
        }
        that._socket = null;
        deleteScript(callback);
    });
};

module.exports = Message;
