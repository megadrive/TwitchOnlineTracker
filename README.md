# Track when Twitch streams go online

## Quickstart

Get a Client ID. See Step 1 of the [Twitch API Introduction](https://dev.twitch.tv/docs/api/#introduction) on how to do this.

```js
const { TwitchOnlineTracker } = require('twitchtrackstreamstatus')
const tracker = new TwitchOnlineTracker({
  client_id: "your twitch app client id", // used for api requests
  track: ['channel1', 'channel2'], // all the channels you want to track
  pollInterval: 30, // how often in between polls in seconds. default 30
  debug: true, // whether to debug to console
  start: true // whether to start immediately. if you don't use this, you must call .start() later
})

// Listen to started event, it returns StreamData
tracker.on('started', streamData => {
  console.log(`${streamData.user_name} just went online!`)
})
```

**NOTE:** If you don't pass `start: true` in the options, you must call `tracker.start()` to start polling.

You can stop polling with `stop()`.

That's really all there is to it.
