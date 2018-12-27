'use strict'

import * as dotenv from 'dotenv'
import axios from 'axios'
import * as EventEmitter from 'events'

import {
  UserData,
  UserRequestData,
  StreamData,
  StreamRequestData,
  StreamsApiEndPointOptions,
  TwitchOnlineTrackerOptions,
  UsersApiEndpointOptions
} from './interfaces'

dotenv.config({path: `./${process.env.NODE_ENV}.env`})

/**
 * Twitch Online Tracker
 *
 * @class TwitchOnlineTracker
 */
export class TwitchOnlineTracker extends EventEmitter {
  options: TwitchOnlineTrackerOptions

  tracked: Set<string>

  _cachedStreamData: StreamData[]
  _loopIntervalId: any

  /**
   *Creates an instance of TwitchOnlineTracker.
   * @param {TwitchOnlineTrackerOptions} options Options to pass
   * @memberof TwitchOnlineTracker
   */
  constructor (options: TwitchOnlineTrackerOptions) {
    super()
    this.tracked = new Set()
    this._cachedStreamData = []
    this.options = options

    if (this.options.client_id === undefined || typeof this.options.client_id !== 'string') {
      throw new Error('`client_id` must be set and a string for TwitchOnlineTracker to work.')
    }

    if (this.options.debug === undefined) {
      this.options.debug = false
    }

    if (this.options.pollInterval === undefined) {
      this.options.pollInterval = 30
    }

    if (this.options.track === undefined) {
    } else {
      this.track(this.options.track)
    }

    if (this.options.start) {
      this.start()
    }
  }

  /**
   * Log something to console.
   *
   * @param {*} rest
   * @memberof TwitchOnlineTracker
   */
  log (...rest) {
    if (this.options.debug) console.log(...rest)
  }

  /**
   * Gets the version number.
   *
   * @returns {string} The version number
   * @memberof TwitchOnlineTracker
   */
  version () {
    return require('./package.json').version
  }

  /**
   * Make a request on the Twitch Helix API. Used internally but can be used for something custom.
   *
   * @param {string} endpoint The endpoint, plus parameters.
   * @returns The response JSON data, unaltered from Twitch.
   * @memberof TwitchOnlineTracker
   */
  async api (endpoint: string) {
    try {
      const twitchApiBase: string = 'https://api.twitch.tv/helix/'
      this.log(`[tot] making a request: ${twitchApiBase}${endpoint}`)
      const response = await axios(twitchApiBase + endpoint, {
        headers: {
          'Client-ID': this.options.client_id
        }
      })
      let rv = {}
      if (response.data) {
        return response.data
      }
      return rv
    } catch (err) {
      throw new Error(err)
    }
  }

  /**
   * Make a /users Twitch API request.
   * 
   * Either `id` or `login` must be used.
   *
   * @param {UsersApiEndpointOptions} params The API parameters.
   * @returns The response JSON data, unaltered from Twitch.
   * @memberof TwitchOnlineTracker
   */
  async users (params: UsersApiEndpointOptions) {
    try {
      if (!params.id && !params.login) {
        throw new Error(`[tot] Need login or id for Users endpoint.`)
      }

      let paramString = ''
      if (params.id) {
        params.id.forEach((id, idx) => {
          paramString += `id=${id}`
          if (idx < params.id.length) paramString += '&'
        })
      }

      if (params.id && params.login) paramString += '&'

      if (params.login) {
        params.login.forEach((login, idx) => {
          paramString += `login=${login}&`
        })
      }
      paramString = paramString.slice(0, -1)

      return await this.api(`users?${paramString}`)
    } catch (e) {
      throw new Error(e)
    }
  }

  /**
   * Make a /streams API request.
   *
   * @param {StreamsApiEndPointOptions} params The API parameters.
   * @returns The response JSON data, unaltered from Twitch.
   * @memberof TwitchOnlineTracker
   */
  async streams (params: StreamsApiEndPointOptions) {
    try {
      let paramString = ''

      for (let param in params) {
        if (Array.isArray(params[param])) {
          const join = `&${param}=`
          paramString += `${param}=${params[param].join(join)}`
          paramString.slice(0, -(join.length))
        }
      }

      return await this.api(`streams?${paramString}`)
    } catch (e) {
      throw new Error(e)
    }      
  }

  /**
   * Begin tracking a stream
   *
   * @param {string[]} loginNames An array of login names of streamers
   * @memberof TwitchOnlineTracker
   */
  track (loginNames: string[]) {
    this.log(`[tot] tracking ${loginNames.join(', ')}`)
    loginNames.forEach(login => {
      this.tracked.add(login.toLowerCase())
    })
  }

  /**
   * Stop tracking a stream
   *
   * @param {string[]} loginNames An array of login names of streamers
   * @memberof TwitchOnlineTracker
   */
  untrack (loginNames: string[]) {
    this.log(`[tot] untracking ${loginNames.join(', ')}`)
    loginNames.forEach(login => {
      this.tracked.delete(login.toLowerCase())
    })
  }

  /**
   * Start making requests.
   *
   * @memberof TwitchOnlineTracker
   */
  start () {
    this.log(`[tot] starting to poll at ${this.options.pollInterval}s intervals`)
    this._loopIntervalId = setInterval(() => {
      this._loop()
    }, this.options.pollInterval * 1000)
    return this
  }

  /**
   * Stops polling.
   *
   * @memberof TwitchOnlineTracker
   */
  stop () {
    this.log('[tot] forcefully stopping polling')
    clearInterval(this._loopIntervalId)
    this._loopIntervalId = 0
  }

  /**
   * The internal loop.
   *
   * @memberof TwitchOnlineTracker
   */
  async _loop () {
    try {
      if (this.tracked.size) {
        const _streamDataJson = await this.streams({user_login: Array.from(this.tracked)})
        const streamRequestData: StreamRequestData = _streamDataJson

        // has a stream started? check on cached
        const started = []
        streamRequestData.data.forEach(stream => {
          // for each stream, check if it's cached already. if not, it is a new stream.
          const isCached = this._cachedStreamData.filter(cached => cached.user_id === stream.user_id).length > 0
          
          if (!isCached) {
            // announce
            this._announce(stream)
            started.push(stream.user_name)
          }
        })

        if (started.length) this.log(`${started.length} new streams`)

        this._cachedStreamData = streamRequestData.data
      }
    } catch (e) {
      // unauthorized
      if (e.message.includes('401')) {
        this.emit('error', Error('Twitch returned with an Unauthorized response. Your client_id probably wrong. Stopping.'))
      } else {
        this.emit('error', e)
      }
      this.stop()
    }
  }

  /**
   * Emit an event when a stream starts
   * @fires TwitchOnlineTracker#started
   * @memberof TwitchOnlineTracker
   */
  _announce (streamData: StreamData) {
    /**
     * @event TwitchOnlineTracker#live
     * @param {StreamData} channel The stream that has started
     */
    this.emit('live', streamData)
  }
}
