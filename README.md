# Track when Twitch streams go online

## Quickstart

Install: `npm install --save twitchonlinetracker`

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

# TwitchOnlineTracker API

## const tracker = new TwitchOnlineTracker(options: TwitchOnlineTrackerOptions)

Create a new `TwitchOnlineTracker` instance. It takes a TwitchOnlineTrackerOptions interface:

- `client_id` *string* **required** Your Twitch app's client id
- `track` *string[]* An array of the channels you wish to track on startup
- `pollInterval` *number* The amount of time in seconds between polls
- `debug` *boolean* If true, output debug information to console
- `start` *boolean* If true, start polling immediately

## tracker.start()

Starts polling the Twitch API for stream changes.

## tracker.stop()

Stops polling the Twitch API for stream changes.

## tracker.track(usernamesToTrack: string[])

Adds more people to track. `usernamesToTrack` expects an array of strings.

## tracker.on('started', function (streamData: StreamData) { })

When a stream is found to be live, fires this event. The callback function provides a [StreamData](https://github.com/megadrive/TwitchOnlineTracker/blob/12505f0bfe16129d4a125c93a021c41510db452c/src/interfaces.ts#L36-L48) parameter.

Example:
```js
tracker.on('started', function (streamData) {
  console.log(`${streamData.user_name} has started streaming with the title ${streamData.title} at https://twitch.tv/${streamData.user_name} for ${streamData.viewer_count} viewers!`)
})
```
