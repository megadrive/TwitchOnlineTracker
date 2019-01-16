"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
require("mocha");
var dotenv = require("dotenv");
var index_1 = require("../index");
dotenv.config();
var tracker = new index_1.TwitchOnlineTracker({
    'debug': Boolean(process.env.TEST_DEBUG) || false,
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
});
