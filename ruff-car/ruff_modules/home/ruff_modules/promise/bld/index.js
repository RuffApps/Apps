"use strict";
var State;
(function (State) {
    State[State["pending"] = 0] = "pending";
    State[State["fulfilled"] = 1] = "fulfilled";
    State[State["rejected"] = 2] = "rejected";
})(State || (State = {}));
exports.options = {
    disableUnrelayedRejectionWarning: false,
    logger: {
        log: console.log,
        warn: console.warn,
        error: console.error
    }
};
function noop() { }
var setImmediate = global.setImmediate || setTimeout;
var Promise = (function () {
    function Promise(resolver) {
        var _this = this;
        this._state = 0;
        this._handled = false;
        try {
            resolver(function (resolvable) { return _this._resolve(resolvable); }, function (reason) { return _this._reject(reason); });
        }
        catch (error) {
            this._reject(error);
        }
    }
    Promise.prototype._grab = function (previousState, previousValueOrReason) {
        if (this._state !== 0) {
            return;
        }
        var handler;
        if (previousState === 1) {
            handler = this._onPreviousFulfilled;
        }
        else if (previousState === 2) {
            handler = this._onPreviousRejected;
        }
        if (handler) {
            this._run(handler, previousValueOrReason);
        }
        else {
            this._relay(previousState, previousValueOrReason);
        }
    };
    Promise.prototype._run = function (handler, previousValueOrReason) {
        var _this = this;
        setImmediate(function () {
            var resolvable;
            try {
                resolvable = handler(previousValueOrReason);
            }
            catch (error) {
                _this._relay(2, error);
                return;
            }
            _this._unpack(resolvable, function (state, valueOrReason) {
                _this._relay(state, valueOrReason);
            });
        });
    };
    Promise.prototype._unpack = function (value, callback) {
        var _this = this;
        if (this === value) {
            callback(2, new TypeError('The promise should not return itself'));
        }
        else if (value instanceof Promise) {
            if (value._state === 0) {
                if (value._handledPromise) {
                    value._handledPromises = [value._handledPromise, this];
                    value._handledPromise = undefined;
                }
                else if (value._handledPromises) {
                    value._handledPromises.push(this);
                }
                else {
                    value._handledPromise = this;
                }
            }
            else {
                callback(value._state, value._valueOrReason);
                value._handled = true;
            }
        }
        else if (value) {
            switch (typeof value) {
                case 'object':
                case 'function':
                    try {
                        var then = value.then;
                        if (typeof then === 'function') {
                            then.call(value, function (value) {
                                if (callback) {
                                    _this._unpack(value, callback);
                                    callback = undefined;
                                }
                            }, function (reason) {
                                if (callback) {
                                    callback(2, reason);
                                    callback = undefined;
                                }
                            });
                            break;
                        }
                    }
                    catch (e) {
                        if (callback) {
                            callback(2, e);
                            callback = undefined;
                        }
                        break;
                    }
                default:
                    callback(1, value);
                    break;
            }
        }
        else {
            callback(1, value);
        }
    };
    Promise.prototype._relay = function (state, valueOrReason) {
        var _this = this;
        if (this._state !== 0) {
            return;
        }
        this._state = state;
        this._valueOrReason = valueOrReason;
        if (this._chainedPromise) {
            this._chainedPromise._grab(state, valueOrReason);
        }
        else if (this._chainedPromises) {
            for (var _i = 0, _a = this._chainedPromises; _i < _a.length; _i++) {
                var promise = _a[_i];
                promise._grab(state, valueOrReason);
            }
        }
        if (this._handledPromise) {
            this._handledPromise._relay(state, valueOrReason);
        }
        else if (this._handledPromises) {
            for (var _b = 0, _c = this._handledPromises; _b < _c.length; _b++) {
                var promise = _c[_b];
                promise._relay(state, valueOrReason);
            }
        }
        setImmediate(function () {
            if (state === 2 && !_this._handled) {
                _this._handled = true;
                var relayed = !!(_this._chainedPromise || _this._chainedPromises || _this._handledPromise || _this._handledPromises);
                if (!relayed && !exports.options.disableUnrelayedRejectionWarning) {
                    var error = valueOrReason && (valueOrReason.stack || valueOrReason.message) || valueOrReason;
                    exports.options.logger.warn("An unrelayed rejection happens:\n" + error);
                }
            }
            _this._relax();
        });
    };
    Promise.prototype._relax = function () {
        if (this._onPreviousFulfilled) {
            this._onPreviousFulfilled = undefined;
        }
        if (this._onPreviousRejected) {
            this._onPreviousRejected = undefined;
        }
        if (this._chainedPromise) {
            this._chainedPromise = undefined;
        }
        else {
            this._chainedPromises = undefined;
        }
        if (this._handledPromise) {
            this._handledPromise = undefined;
        }
        else {
            this._handledPromises = undefined;
        }
    };
    Promise.prototype._resolve = function (resolvable) {
        var _this = this;
        this._unpack(resolvable, function (state, valueOrReason) { return _this._grab(state, valueOrReason); });
    };
    Promise.prototype._reject = function (reason) {
        this._grab(2, reason);
    };
    Promise.prototype.then = function (onfulfilled, onrejected) {
        var promise = new Promise(noop);
        if (typeof onfulfilled === 'function') {
            promise._onPreviousFulfilled = onfulfilled;
        }
        if (typeof onrejected === 'function') {
            promise._onPreviousRejected = onrejected;
        }
        if (this._state === 0) {
            if (this._chainedPromise) {
                this._chainedPromises = [this._chainedPromise, promise];
                this._chainedPromise = undefined;
            }
            else if (this._chainedPromises) {
                this._chainedPromises.push(promise);
            }
            else {
                this._chainedPromise = promise;
            }
        }
        else {
            if (!this._handled) {
                this._handled = true;
            }
            promise._grab(this._state, this._valueOrReason);
        }
        return promise;
    };
    Promise.prototype.catch = function (ReasonType, onrejected) {
        if (typeof onrejected === 'function') {
            return this.then(undefined, function (reason) {
                if (reason instanceof ReasonType) {
                    return onrejected(reason);
                }
                else {
                    throw reason;
                }
            });
        }
        else {
            onrejected = ReasonType;
            return this.then(undefined, onrejected);
        }
    };
    Promise.resolve = function (resolvable) {
        if (resolvable instanceof Promise) {
            return resolvable;
        }
        else {
            var promise = new Promise(noop);
            promise._resolve(resolvable);
            return promise;
        }
    };
    Promise.reject = function (reason) {
        var promise = new Promise(noop);
        promise._reject(reason);
        return promise;
    };
    Promise.all = function (resolvables) {
        if (!resolvables.length) {
            return Promise.resolve([]);
        }
        var resultsPromise = new Promise(noop);
        var results = [];
        var remaining = resolvables.length;
        var rejected = false;
        resolvables.forEach(function (resolvable, index) {
            Promise
                .resolve(resolvable)
                .then(function (result) {
                if (rejected) {
                    return;
                }
                results[index] = result;
                if (--remaining === 0) {
                    resultsPromise._resolve(results);
                }
            }, function (reason) {
                if (rejected) {
                    return;
                }
                rejected = true;
                resultsPromise._reject(reason);
                results = undefined;
            });
        });
        return resultsPromise;
    };
    Promise.race = function (resolvables) {
        var promise = new Promise(noop);
        for (var _i = 0, resolvables_1 = resolvables; _i < resolvables_1.length; _i++) {
            var resolvable = resolvables_1[_i];
            promise._resolve(resolvable);
        }
        return promise;
    };
    return Promise;
}());
exports.Promise = Promise;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Promise;
if (typeof global.Promise === 'undefined') {
    Object.defineProperty(global, 'Promise', {
        value: Promise
    });
}
//# sourceMappingURL=index.js.map