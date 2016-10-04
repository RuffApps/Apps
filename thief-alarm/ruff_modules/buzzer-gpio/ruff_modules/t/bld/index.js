"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
if (typeof Promise !== 'function') {
    require('promise');
}
var Path = require('path');
var Util = require('util');
var utils_1 = require('./utils');
(function (TestState) {
    TestState[TestState["pending"] = 0] = "pending";
    TestState[TestState["passed"] = 1] = "passed";
    TestState[TestState["failed"] = 2] = "failed";
    TestState[TestState["skipped"] = 3] = "skipped";
})(exports.TestState || (exports.TestState = {}));
var TestState = exports.TestState;
var fulfilled = Promise.resolve();
var pending = new Promise(function () { });
exports.options = {
    timeout: 2000
};
var ErrorCollector = (function () {
    function ErrorCollector() {
        this.items = [];
    }
    ErrorCollector.prototype.add = function (description, error) {
        return this.items.push({
            description: description,
            error: error
        });
    };
    ErrorCollector.prototype.print = function () {
        var items = this.items;
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            console.log('\n' + utils_1.indent((i + 1) + ") " + item.description, 1));
            console.log('\n' + utils_1.indent(utils_1.stylize(getErrorOutput(item.error), 'gray'), 1));
        }
    };
    Object.defineProperty(ErrorCollector.prototype, "empty", {
        get: function () {
            return this.items.length === 0;
        },
        enumerable: true,
        configurable: true
    });
    return ErrorCollector;
}());
exports.ErrorCollector = ErrorCollector;
var Runnable = (function () {
    function Runnable(upper) {
        this.upper = upper;
        this.depth = upper && upper.depth + 1 || 0;
    }
    Runnable.prototype.print = function () {
        var objects = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            objects[_i - 0] = arguments[_i];
        }
        if (objects.length) {
            var first = objects[0];
            if (typeof first === 'string') {
                first = utils_1.indent(first, this.depth);
            }
            console.log.apply(console, [first].concat(objects.slice(1)));
        }
        else {
            console.log('');
        }
    };
    Object.defineProperty(Runnable.prototype, "fullDescription", {
        get: function () {
            var descriptions = [];
            var node = this;
            while (node.upper) {
                descriptions.unshift(node.description);
                node = node.upper;
            }
            return descriptions.join(' > ');
        },
        enumerable: true,
        configurable: true
    });
    return Runnable;
}());
exports.Runnable = Runnable;
var Test = (function (_super) {
    __extends(Test, _super);
    function Test(scope, handler, description) {
        _super.call(this, scope);
        this.handler = handler;
        this.description = description;
        this.state = 0;
    }
    Test.prototype.run = function (index, runnables) {
        var _this = this;
        return new Promise(function (resolve) {
            var timer = setTimeout(function () { return handleError(new Error('Test timed out')); }, _this.upper.timeout);
            var handleSuccess = function () {
                if (_this.state !== 0) {
                    return;
                }
                clearTimeout(timer);
                _this.state = 1;
                _this.print(utils_1.stylize('>', 'green'), utils_1.stylize(_this.description, 'gray'));
                resolve();
            };
            var handleError = function (error) {
                if (_this.state === 2) {
                    return;
                }
                clearTimeout(timer);
                _this.state = 2;
                var count = _this.upper.errorCollector.add(_this.fullDescription, error);
                _this.print(utils_1.stylize(count + ')', 'red'), utils_1.stylize(_this.description, 'red'));
                resolve();
            };
            activeUncaughtExceptionHandler = handleError;
            var handler = _this.handler;
            if (handler.length) {
                var called_1 = false;
                try {
                    handler(function (error) {
                        if (called_1) {
                            handleError(new Error('Callback `done` is called multiple times'));
                            return;
                        }
                        called_1 = true;
                        if (error) {
                            handleError(error);
                        }
                        else {
                            handleSuccess();
                        }
                    });
                }
                catch (error) {
                    handleError(error);
                }
            }
            else {
                var resolvableResult = void 0;
                try {
                    resolvableResult = handler();
                    if (resolvableResult === undefined) {
                        handleSuccess();
                    }
                    else {
                        Promise
                            .resolve(resolvableResult)
                            .then(function () {
                            handleSuccess();
                        }, function (reason) {
                            handleError(reason);
                        });
                    }
                }
                catch (error) {
                    handleError(error);
                }
            }
        });
    };
    return Test;
}(Runnable));
exports.Test = Test;
var Scope = (function (_super) {
    __extends(Scope, _super);
    function Scope(upper, errorCollector, description) {
        _super.call(this, upper);
        this.errorCollector = errorCollector;
        this.description = description;
        this.runnables = [];
        this.timeout = exports.options.timeout;
    }
    Object.defineProperty(Scope.prototype, "stats", {
        get: function () {
            var passed = 0;
            var failed = 0;
            for (var _i = 0, _a = this.runnables; _i < _a.length; _i++) {
                var runnable = _a[_i];
                if (runnable instanceof Scope) {
                    var stats = runnable.stats;
                    passed += stats.passed;
                    failed += stats.failed;
                }
                else {
                    switch (runnable.state) {
                        case 1:
                            passed++;
                            break;
                        case 2:
                            failed++;
                            break;
                    }
                }
            }
            return {
                passed: passed,
                failed: failed
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Scope.prototype, "hasTests", {
        get: function () {
            for (var _i = 0, _a = this.runnables; _i < _a.length; _i++) {
                var runnable = _a[_i];
                if (runnable instanceof Scope) {
                    if (runnable.hasTests) {
                        return true;
                    }
                }
                else {
                    return true;
                }
            }
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Scope.prototype.run = function (index, runnables) {
        var _this = this;
        if (this.upper && this.hasTests) {
            this.print(utils_1.stylize(this.description, 'bold'));
        }
        return fulfilled
            .then(function () { return invokeOptionalGeneralCallback(_this._beforeHandler); })
            .then(function () {
            return _this.runnables.reduce(function (promise, runnable, index, runnables) {
                return promise
                    .then(function () { return invokeOptionalGeneralCallback(_this._beforeEachHandler); })
                    .catch(function (reason) { return exitWithError(reason); })
                    .then(function () { return runnable.run(index, runnables); })
                    .then(function () { return invokeOptionalGeneralCallback(_this._afterEachHandler); })
                    .catch(function (reason) { return exitWithError(reason); });
            }, fulfilled);
        })
            .then(function () { return invokeOptionalGeneralCallback(_this._afterHandler); });
    };
    Scope.prototype.describe = function (description, handler) {
        if (activeScope !== this) {
            throw new Error('Cannot create a child scope as current scope is not active');
        }
        var originalScope = this;
        activeScope = new Scope(this, this.errorCollector, description);
        this.runnables.push(activeScope);
        handler(activeScope);
        activeScope = this;
    };
    Scope.prototype.it = function (description, handler) {
        if (activeScope !== this) {
            throw new Error('Cannot add a test as current scope is not active');
        }
        this.runnables.push(new Test(this, handler, description));
    };
    Scope.prototype.before = function (handler) {
        if (this._beforeHandler) {
            throw new Error('`before` handler already set');
        }
        this._beforeHandler = handler;
    };
    Scope.prototype.beforeEach = function (handler) {
        if (this._beforeEachHandler) {
            throw new Error('`beforeEach` handler already set');
        }
        this._beforeEachHandler = handler;
    };
    Scope.prototype.after = function (handler) {
        if (this._afterHandler) {
            throw new Error('`after` handler already set');
        }
        this._afterHandler = handler;
    };
    Scope.prototype.afterEach = function (handler) {
        if (this._afterEachHandler) {
            throw new Error('`afterEach` handler already set');
        }
        this._afterEachHandler = handler;
    };
    return Scope;
}(Runnable));
exports.Scope = Scope;
var activeScope;
var activeUncaughtExceptionHandler;
process.on('uncaughtException', function (error) {
    if (activeUncaughtExceptionHandler) {
        try {
            activeUncaughtExceptionHandler(error);
        }
        catch (error) {
            exitWithError(error);
        }
    }
    else {
        exitWithError(error);
    }
});
function describe(description, handler) {
    activeScope.describe(description, handler);
}
exports.describe = describe;
function it(description, handler) {
    activeScope.it(description, handler);
}
exports.it = it;
function before(handler) {
    activeScope.before(handler);
}
exports.before = before;
function beforeEach(handler) {
    activeScope.beforeEach(handler);
}
exports.beforeEach = beforeEach;
function after(handler) {
    activeScope.after(handler);
}
exports.after = after;
function afterEach(handler) {
    activeScope.afterEach(handler);
}
exports.afterEach = afterEach;
var globalExports = ['describe', 'it', 'before', 'beforeEach', 'after', 'afterEach'];
for (var _i = 0, globalExports_1 = globalExports; _i < globalExports_1.length; _i++) {
    var key = globalExports_1[_i];
    Object.defineProperty(global, key, { value: exports[key] });
}
var errorCollector = new ErrorCollector();
var rootScope = new Scope(undefined, errorCollector, 'ROOT');
activeScope = rootScope;
var started = false;
setTimeout(start, 0);
function start() {
    started = true;
    console.log('');
    return activeScope
        .run(0, [rootScope])
        .then(function () { return utils_1.delay(200); })
        .then(function () {
        console.log('\n');
        var _a = rootScope.stats, passed = _a.passed, failed = _a.failed;
        if (passed || !failed) {
            console.log(utils_1.indent(utils_1.stylize(passed + " passing", 'green'), 1));
        }
        if (failed) {
            console.log(utils_1.indent(utils_1.stylize(failed + " failing", 'red'), 1));
        }
        rootScope.errorCollector.print();
        console.log('\n');
    })
        .then(function () {
        if (rootScope.errorCollector.empty) {
            process.exit(0);
        }
        else {
            process.exit(1);
        }
    });
}
function queue(path) {
    if (started) {
        exitWithError(new Error('Test has already been started'));
        return;
    }
    require(Path.resolve(path));
}
exports.queue = queue;
function invokeOptionalGeneralCallback(handler) {
    if (handler) {
        if (handler.length) {
            return new Promise(function (resolve, reject) {
                handler(function (error) {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve();
                    }
                });
            });
        }
        else {
            return fulfilled.then(function () { return handler(); });
        }
    }
    else {
        return fulfilled;
    }
}
function exitWithError(error) {
    console.error(getErrorOutput(error));
    process.exit(1);
}
function getErrorOutput(error) {
    if (error instanceof Error) {
        return error.stack;
    }
    else {
        return Util.inspect(error);
    }
}
//# sourceMappingURL=index.js.map