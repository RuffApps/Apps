/*!
 * Copyright (c) 2016 Nanchao Inc.
 * All rights reserved.
 */

'use strict';

var assert = require('assert');
var async = require('ruff-async');
var driver = require('ruff-driver');

var Message = require('./message');

var USB_DRIVER_NAME = 'ehci-platform';
var EVENTS = ['mount', 'unmount'];

function getCallback(argument) {
    if (typeof argument === 'function') {
        return argument;
    }

    return null;
}

var SysUsbDevice = driver({
    attach: function (inputs, context) {
        this._driverInstalled = false;
        this._devManagers = [];
        this._kernel = context.kernel || require('kernel-module');
        this._message = context.message || new Message();
    },
    detach: function (callback) {
        async.series([
            this._message.stop.bind(this._message),
            this._invokeDeviceDetach.bind(this),
            this._removeUsbDriver.bind(this)
        ], callback);
    },
    exports: {
        install: function () {
            var callback = getCallback(arguments[arguments.length - 1]);
            var managerLength = callback ? arguments.length - 1 : arguments.length;
            for (var i = 0; i < managerLength; i++) {
                this._devManagers.push(checkType(arguments[i], 'object'));
            }

            var that = this;

            this.on('mount', function (devPath) {
                that._devManagers.forEach(function (manager) {
                    manager.mountDevice(devPath);
                });
            });

            this.on('unmount', function (devPath) {
                that._devManagers.forEach(function (manager) {
                    manager.unmountDevice(devPath);
                });
            });

            async.series([
                this._invokeDeviceAttach.bind(this),
                this._listenUevent.bind(this),
                this._installUsbDriver.bind(this)
            ], function (error) {
                if (error) {
                    callback && callback(error);
                    return;
                }
                callback && callback();
            });
        },

        _invokeDeviceAttach: function (callback) {
            var attaches = this._devManagers.map(function (manager) {
                return manager.attach.bind(manager);
            });
            async.series(attaches, callback);
        },

        _invokeDeviceDetach: function (callback) {
            var detaches = this._devManagers.map(function (manager) {
                return manager.detach.bind(manager);
            });
            async.series(detaches, callback);
        },

        _installUsbDriver: function (callback) {
            if (this._driverInstalled) {
                callback && callback();
                return;
            }

            var that = this;
            var installDriver = this._kernel.install.bind(this._kernel, USB_DRIVER_NAME);
            syncToAsync(installDriver, function (error) {
                if (error) {
                    callback && callback(error);
                    return;
                }

                that._driverInstalled = true;
                callback && callback();
            });
        },

        _removeUsbDriver: function (callback) {
            if (!this._driverInstalled) {
                callback && callback();
                return;
            }

            var that = this;
            var removeDriver = this._kernel.remove.bind(this._kernel, USB_DRIVER_NAME);
            syncToAsync(removeDriver, function (error) {
                if (error) {
                    callback && callback(error);
                    return;
                }

                that._driverInstalled = false;
                callback && callback();
            });
        },

        _listenUevent: function (callback) {
            var that = this;
            this._message.on('uevent', function (event) {
                var action = event.action;
                if (EVENTS.indexOf(action) < 0) {
                    return;
                }

                that.emit(action, event.devPath);
            });

            this._message.start(function () {
                callback();
            });
        }
    }
});

module.exports = SysUsbDevice;

function checkType(obj, type) {
    assert.ifError(typeof obj !== type && new TypeError('Option `' + obj + '` is expected to be a ' + type));
    return obj;
}

function syncToAsync(syncFunc, callback) {
    try {
        syncFunc();
        callback();
    } catch (error) {
        callback(error);
    }
}
