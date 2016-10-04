"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
require('promise');
var FS = require('fs');
var HTTP = require('http');
var Path = require('path');
var QueryString = require('querystring');
var URL = require('url');
var Response = (function () {
    function Response() {
    }
    return Response;
}());
exports.Response = Response;
var ExpectedError = (function () {
    function ExpectedError(message, statusCode) {
        if (statusCode === void 0) { statusCode = 500; }
        this.message = message;
        this.statusCode = statusCode;
    }
    return ExpectedError;
}());
exports.ExpectedError = ExpectedError;
var NotFoundError = (function (_super) {
    __extends(NotFoundError, _super);
    function NotFoundError(message, path) {
        _super.call(this, message, 404);
        this.path = path;
    }
    return NotFoundError;
}(ExpectedError));
exports.NotFoundError = NotFoundError;
var hop = Object.prototype.hasOwnProperty;
var mimeMap = require('../mime.json');
var voidPromise = Promise.resolve();
var Server = (function () {
    function Server(_a) {
        var _this = this;
        var _b = _a === void 0 ? {} : _a, _c = _b.views, views = _c === void 0 ? Path.resolve('views') : _c, _d = _b.errorViewsFolder, errorViewsFolder = _d === void 0 ? 'error' : _d;
        this.server = HTTP.createServer();
        this.routes = [];
        this._templateCache = {};
        this.views = views;
        this.errorViewsFolder = errorViewsFolder;
        this.server.on('request', function (req, res) {
            _this._handleRequest(req, res);
        });
    }
    Server.prototype._handleRequest = function (req, res) {
        var _this = this;
        var urlStr = req.url;
        var _a = URL.parse(urlStr), pathname = _a.pathname, queryStr = _a.query;
        req.path = pathname;
        req.query = QueryString.parse(queryStr);
        var routes = this.routes;
        var index = 0;
        var next = function () {
            var route = routes[index++];
            if (!route) {
                _this._handleError(req, res, new NotFoundError('Page Not Found', pathname));
                return;
            }
            var method = route.method;
            if ((method && method !== req.method) || (pathname !== route.path &&
                (!route.extend || pathname.indexOf(route.pathWithEndingSlash) !== 0))) {
                next();
                return;
            }
            var resultResolvable;
            try {
                resultResolvable = route.middleware(req, res);
            }
            catch (error) {
                _this._handleError(req, res, error);
                return;
            }
            if (resultResolvable === req) {
                next();
            }
            else {
                Promise
                    .resolve(resultResolvable)
                    .then(function (result) {
                    if (result === req) {
                        next();
                    }
                    else {
                        _this._handleResult(req, res, result);
                    }
                }, function (reason) {
                    _this._handleError(req, res, reason);
                });
            }
        };
        next();
    };
    Server.prototype.add = function (options) {
        var route = options;
        var path = options.path;
        if (path === '/') {
            route.path = path;
            route.pathWithEndingSlash = path;
        }
        else if (/\/$/.test(path)) {
            route.path = path.substr(0, path.length - 1);
            route.pathWithEndingSlash = path;
        }
        else {
            route.path = path;
            route.pathWithEndingSlash = path + '/';
        }
        this.routes.push(route);
    };
    Server.prototype.use = function (path, middleware) {
        this.add({
            method: undefined,
            path: path,
            extend: true,
            middleware: middleware
        });
    };
    Server.prototype.get = function (path, middleware) {
        this.add({
            method: 'GET',
            path: path,
            extend: false,
            middleware: middleware
        });
    };
    Server.prototype.post = function (path, middleware) {
        this.add({
            method: 'POST',
            path: path,
            extend: false,
            middleware: middleware
        });
    };
    Server.prototype.listen = function (port, hostname) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.server.listen(port, hostname, function (error) {
                if (error) {
                    reject(error);
                }
                else {
                    resolve();
                }
            });
        });
    };
    Server.prototype._handleResult = function (req, res, result) {
        if (res._headerSent) {
            return;
        }
        if (result instanceof Response) {
            result.applyTo(res);
        }
        else {
            var html = this._render(req.path, result);
            if (html === undefined) {
                var json = JSON.stringify(result);
                if (json) {
                    res.setHeader('Content-Type', 'application/json');
                    res.write(json);
                }
                res.end();
            }
            else {
                res.setHeader('Content-Type', 'text/html');
                res.write(html);
                res.end();
            }
        }
    };
    Server.prototype._handleError = function (req, res, error) {
        if (res._headerSent) {
            return;
        }
        var html;
        var statusCode;
        if (error instanceof ExpectedError) {
            statusCode = error.statusCode;
            html = this._render(this.errorViewsFolder + "/" + statusCode, error) ||
                error.message;
        }
        else {
            statusCode = 500;
            html = 'Server Error';
        }
        res.statusCode = statusCode;
        res.setHeader('Content-Type', 'text/html');
        res.write(html);
        res.end();
        console.error(error);
    };
    Server.prototype._render = function (view, data) {
        if (view === '/') {
            view += 'index';
        }
        var template;
        if (hop.call(this._templateCache, view)) {
            template = this._templateCache[view];
            if (!template) {
                return undefined;
            }
        }
        else {
            var viewPath = Path.join(this.views, view + '.html');
            if (FS.existsSync(viewPath)) {
                template = FS.readFileSync(viewPath, 'utf-8');
                this._templateCache[view] = template;
            }
            else {
                this._templateCache[view] = undefined;
                return undefined;
            }
        }
        data = data || Object.create(null);
        return template.replace(/\{([$\w\d.-]+)\}/g, function (text, expression) {
            var keys = expression.split('.');
            var node = data;
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var key = keys_1[_i];
                node = node[key];
                if (node === undefined) {
                    return text;
                }
            }
            return node;
        });
    };
    Server.static = function (path, defaultPath) {
        if (defaultPath === void 0) { defaultPath = '/index.html'; }
        return function (req, res) {
            return new Promise(function (resolve, reject) {
                if (defaultPath && defaultPath[0] !== '/') {
                    defaultPath = '/' + defaultPath;
                }
                var urlPath = req.path === '/' ? defaultPath : req.path;
                var filePath = Path.join(path, urlPath);
                var candidates = [
                    {
                        path: filePath + ".gz",
                        gzipped: true
                    },
                    {
                        path: filePath,
                        gzipped: false
                    }
                ];
                var target = findAndMerge(candidates, function (candidate) {
                    try {
                        var stats = FS.statSync(candidate.path);
                        return stats.isFile() ?
                            { size: stats.size } : undefined;
                    }
                    catch (error) {
                        return undefined;
                    }
                });
                if (!target) {
                    resolve(req);
                    return;
                }
                if (target.gzipped) {
                    res.setHeader('Content-Encoding', 'gzip');
                }
                res.setHeader('Content-Length', target.size.toString());
                var extname = Path.extname(filePath);
                res.setHeader('Content-Type', hop.call(mimeMap, extname) ?
                    mimeMap[extname] : 'application/octet-stream');
                try {
                    var stream = FS.createReadStream(target.path);
                    stream.pipe(res);
                    stream.on('error', reject);
                    res.on('error', reject);
                    res.on('end', function () { return resolve(); });
                }
                catch (error) {
                    reject(error);
                }
            });
        };
    };
    return Server;
}());
exports.Server = Server;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Server;
function findAndMerge(items, filter) {
    for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
        var item = items_1[_i];
        var ret = filter(item);
        if (ret) {
            return assign(item, ret);
        }
    }
    return undefined;
}
function assign(target, source) {
    for (var _i = 0, _a = Object.keys(source); _i < _a.length; _i++) {
        var key = _a[_i];
        if (!(key in target)) {
            target[key] = source[key];
        }
    }
    return target;
}
//# sourceMappingURL=index.js.map