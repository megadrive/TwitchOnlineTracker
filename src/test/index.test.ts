
import 'mocha'
import { expect } from 'chai'
import * as dotenv from 'dotenv'

import { TwitchOnlineTracker } from '../index'
import { streams } from './twitchApi'
import { StreamData, StreamRequestData } from '../interfaces';

dotenv.config()

const tracker = new TwitchOnlineTracker({
    'debug': false,
    'pollInterval': 5,
    'client_id': process.env.TEST_CLIENT_ID || null,
    'track': process.env.TEST_STREAMS.split(',')
})

describe('TwitchOnlineTracker', () => {
    it('will start polling with an _loopIntervalId', () => {
        tracker.start()
        expect(tracker._loopIntervalId).to.not.equal(NaN)
        tracker.stop()
    })

    it('should return empty array, no new streams', async () => {
        const streamsRequestData: StreamRequestData = streams
        await tracker._loop() // cache current results

        const newStreams = await tracker._loop()
        expect(newStreams.length).to.equal(0)
    })

    it('should return an array with 1 element, 1 new stream', async () => {
        const streamsRequestData: StreamRequestData = streams
        await tracker._loop() // cache current results

        // pop one off
        tracker._cachedStreamData.pop()

        const newStreams = await tracker._loop()
        expect(newStreams.length).to.equal(1)
    })
})
