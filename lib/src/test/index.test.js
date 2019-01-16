"use strict";
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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
var chai_1 = require("chai");
var dotenv = require("dotenv");
var index_1 = require("../index");
var twitchApi_1 = require("./twitchApi");
dotenv.config();
var tracker = new index_1.TwitchOnlineTracker({
    'debug': false,
    'pollInterval': 5,
    'client_id': process.env.TEST_CLIENT_ID || null,
    'track': process.env.TEST_STREAMS.split(',')
});
describe('TwitchOnlineTracker', function () {
    it('will start polling with an _loopIntervalId', function () {
        tracker.start();
        chai_1.expect(tracker._loopIntervalId).to.not.equal(NaN);
        tracker.stop();
    });
    it('should return empty array, no new streams', function () { return __awaiter(_this, void 0, void 0, function () {
        var streamsRequestData, newStreams;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    streamsRequestData = twitchApi_1.streams;
                    return [4 /*yield*/, tracker._loop()]; // cache current results
                case 1:
                    _a.sent(); // cache current results
                    return [4 /*yield*/, tracker._loop()];
                case 2:
                    newStreams = _a.sent();
                    chai_1.expect(newStreams.length).to.equal(0);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should return an array with 1 element, 1 new stream', function () { return __awaiter(_this, void 0, void 0, function () {
        var streamsRequestData, newStreams;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    streamsRequestData = twitchApi_1.streams;
                    return [4 /*yield*/, tracker._loop()
                        // pop one off
                    ]; // cache current results
                case 1:
                    _a.sent(); // cache current results
                    // pop one off
                    tracker._cachedStreamData.pop();
                    return [4 /*yield*/, tracker._loop()];
                case 2:
                    newStreams = _a.sent();
                    chai_1.expect(newStreams.length).to.equal(1);
                    return [2 /*return*/];
            }
        });
    }); });
});
