'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv = require("dotenv");
var axios_1 = require("axios");
var EventEmitter = require("events");
dotenv.config({ path: "./" + process.env.NODE_ENV + ".env" });
/**
 * Twitch Online Tracker
 *
 * @class TwitchOnlineTracker
 */
var TwitchOnlineTracker = /** @class */ (function (_super) {
    __extends(TwitchOnlineTracker, _super);
    /**
     *Creates an instance of TwitchOnlineTracker.
     * @param {TwitchOnlineTrackerOptions} options Options to pass
     * @memberof TwitchOnlineTracker
     */
    function TwitchOnlineTracker(options) {
        var _this = _super.call(this) || this;
        _this.tracked = [];
        _this._cachedStreamData = [];
        _this.options = options;
        if (_this.options.client_id === undefined || typeof _this.options.client_id !== 'string') {
            throw new Error('`client_id` must be set and a string for TwitchOnlineTracker to work.');
        }
        if (_this.options.debug === undefined) {
            _this.options.debug = false;
        }
        if (_this.options.pollInterval === undefined) {
            _this.options.pollInterval = 30;
        }
        if (_this.options.track === undefined) {
        }
        else {
            _this.track(_this.options.track);
        }
        if (_this.options.start) {
            _this.start();
        }
        return _this;
    }
    /**
     * Log something to console.
     *
     * @param {*} rest
     * @memberof TwitchOnlineTracker
     */
    TwitchOnlineTracker.prototype.log = function () {
        var rest = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            rest[_i] = arguments[_i];
        }
        if (this.options.debug)
            console.log.apply(console, rest);
    };
    /**
     * Gets the version number.
     *
     * @returns {string} The version number as a string.
     * @memberof TwitchOnlineTracker
     */
    TwitchOnlineTracker.prototype.version = function () {
        return require('./package.json').version;
    };
    /**
     * Make a request on the Twitch Helix API. Used internally but can be used for something custom.
     *
     * @param {string} endpoint The endpoint, plus parameters.
     * @returns The response JSON data, unaltered from Twitch.
     * @memberof TwitchOnlineTracker
     */
    TwitchOnlineTracker.prototype.api = function (endpoint) {
        return __awaiter(this, void 0, void 0, function () {
            var twitchApiBase, response, rv, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        twitchApiBase = 'https://api.twitch.tv/helix/';
                        this.log("[tot] making a request: " + twitchApiBase + endpoint);
                        return [4 /*yield*/, axios_1.default(twitchApiBase + endpoint, {
                                headers: {
                                    'Client-ID': this.options.client_id
                                }
                            })];
                    case 1:
                        response = _a.sent();
                        rv = {};
                        if (response.data) {
                            return [2 /*return*/, response.data];
                        }
                        return [2 /*return*/, rv];
                    case 2:
                        err_1 = _a.sent();
                        throw new Error(err_1);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Make a /users Twitch API request.
     *
     * Either `id` or `login` must be used.
     *
     * @param {UsersApiEndpointOptions} params The API parameters.
     * @returns The response JSON data, unaltered from Twitch.
     * @memberof TwitchOnlineTracker
     */
    TwitchOnlineTracker.prototype.users = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var paramString_1, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!params.id && !params.login) {
                            throw new Error("[tot] Need login or id for Users endpoint.");
                        }
                        paramString_1 = '';
                        if (params.id) {
                            params.id.forEach(function (id, idx) {
                                paramString_1 += "id=" + id;
                                if (idx < params.id.length)
                                    paramString_1 += '&';
                            });
                        }
                        if (params.id && params.login)
                            paramString_1 += '&';
                        if (params.login) {
                            params.login.forEach(function (login, idx) {
                                paramString_1 += "login=" + login + "&";
                            });
                        }
                        paramString_1 = paramString_1.slice(0, -1);
                        return [4 /*yield*/, this.api("users?" + paramString_1)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        e_1 = _a.sent();
                        throw new Error(e_1);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Make a /streams API request.
     *
     * @param {StreamsApiEndPointOptions} params The API parameters.
     * @returns The response JSON data, unaltered from Twitch.
     * @memberof TwitchOnlineTracker
     */
    TwitchOnlineTracker.prototype.streams = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var paramString, param, join, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        paramString = '';
                        for (param in params) {
                            if (Array.isArray(params[param])) {
                                join = "&" + param + "=";
                                paramString += param + "=" + params[param].join(join);
                                paramString.slice(0, -(join.length));
                            }
                        }
                        return [4 /*yield*/, this.api("streams?" + paramString)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        e_2 = _a.sent();
                        throw new Error(e_2);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Begin tracking a Stream's status
     *
     * @param {string[]} loginNames An array of login names of streamers
     * @memberof TwitchOnlineTracker
     */
    TwitchOnlineTracker.prototype.track = function (loginNames) {
        this.log("[tot] tracking " + loginNames.join(', '));
        this.tracked = this.tracked.concat(loginNames.map(function (login) { return login.toLowerCase(); }));
    };
    /**
     * Start making requests.
     *
     * @memberof TwitchOnlineTracker
     */
    TwitchOnlineTracker.prototype.start = function () {
        var _this = this;
        this.log("[tot] starting to poll at " + this.options.pollInterval + "s intervals");
        this._loopIntervalId = setInterval(function () {
            _this._loop();
        }, this.options.pollInterval * 1000);
        return this;
    };
    /**
     * Stops polling.
     *
     * @memberof TwitchOnlineTracker
     */
    TwitchOnlineTracker.prototype.stop = function () {
        this.log('[tot] forcefully stopping polling');
        clearInterval(this._loopIntervalId);
        this._loopIntervalId = 0;
    };
    /**
     * The internal loop.
     *
     * @memberof TwitchOnlineTracker
     */
    TwitchOnlineTracker.prototype._loop = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _streamDataJson, streamRequestData, started_1, e_3;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        if (!this.tracked.length) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.streams({ user_login: this.tracked })];
                    case 1:
                        _streamDataJson = _a.sent();
                        streamRequestData = _streamDataJson;
                        started_1 = [];
                        streamRequestData.data.forEach(function (stream) {
                            // for each stream, check if it's cached already. if not, it is a new stream.
                            var isCached = _this._cachedStreamData.filter(function (cached) { return cached.user_id === stream.user_id; }).length > 0;
                            if (!isCached) {
                                // announce
                                _this._announce(stream);
                                started_1.push(stream.user_name);
                            }
                        });
                        if (started_1.length)
                            this.log(started_1.length + " new streams");
                        this._cachedStreamData = streamRequestData.data;
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                    case 3:
                        e_3 = _a.sent();
                        throw new Error(e_3);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Emit an event when a stream starts
     * @fires TwitchOnlineTracker#started
     * @memberof TwitchOnlineTracker
     */
    TwitchOnlineTracker.prototype._announce = function (streamData) {
        /**
         * @event TwitchOnlineTracker#started
         * @param {StreamData} channel The stream that has started
         */
        this.emit('started', streamData);
    };
    return TwitchOnlineTracker;
}(EventEmitter));
exports.TwitchOnlineTracker = TwitchOnlineTracker;
