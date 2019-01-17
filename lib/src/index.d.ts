/// <reference types="node" />
import * as EventEmitter from 'events';
import { StreamData, StreamsApiEndPointOptions, TwitchOnlineTrackerOptions, UsersApiEndpointOptions } from './interfaces';
/**
 * Twitch Online Tracker
 *
 * @class TwitchOnlineTracker
 */
export declare class TwitchOnlineTracker extends EventEmitter {
    options: TwitchOnlineTrackerOptions;
    tracked: Set<string>;
    _cachedStreamData: StreamData[];
    _loopIntervalId: any;
    /**
     *Creates an instance of TwitchOnlineTracker.
     * @param {TwitchOnlineTrackerOptions} options Options to pass
     * @memberof TwitchOnlineTracker
     */
    constructor(options: TwitchOnlineTrackerOptions);
    /**
     * Log something to console.
     *
     * @param {*} rest
     * @memberof TwitchOnlineTracker
     */
    log(...rest: any[]): void;
    /**
     * Gets the version number.
     *
     * @returns {string} The version number
     * @memberof TwitchOnlineTracker
     */
    version(): any;
    /**
     * Make a request on the Twitch Helix API. Used internally but can be used for something custom.
     *
     * @param {string} endpoint The endpoint, plus parameters.
     * @returns The response JSON data, unaltered from Twitch.
     * @memberof TwitchOnlineTracker
     */
    api(endpoint: string): Promise<any>;
    /**
     * Make a /users Twitch API request.
     *
     * Either `id` or `login` must be used.
     *
     * @param {UsersApiEndpointOptions} params The API parameters.
     * @returns The response JSON data, unaltered from Twitch.
     * @memberof TwitchOnlineTracker
     */
    users(params: UsersApiEndpointOptions): Promise<any>;
    /**
     * Make a /streams API request.
     *
     * @param {StreamsApiEndPointOptions} params The API parameters.
     * @returns The response JSON data, unaltered from Twitch.
     * @memberof TwitchOnlineTracker
     */
    streams(params: StreamsApiEndPointOptions): Promise<any>;
    /**
     * Begin tracking a stream
     *
     * @param {string[]} loginNames An array of login names of streamers
     * @memberof TwitchOnlineTracker
     */
    track(loginNames: string[]): void;
    /**
     * Stop tracking a stream
     *
     * @param {string[]} loginNames An array of login names of streamers
     * @memberof TwitchOnlineTracker
     */
    untrack(loginNames: string[]): void;
    /**
     * Start making requests.
     *
     * @memberof TwitchOnlineTracker
     */
    start(): this;
    /**
     * Stops polling.
     *
     * @memberof TwitchOnlineTracker
     */
    stop(): void;
    /**
     * The internal loop.
     *
     * @memberof TwitchOnlineTracker
     */
    _loop(): Promise<StreamData[]>;
    /**
     * Emit an event when a stream starts
     * @fires TwitchOnlineTracker#started
     * @memberof TwitchOnlineTracker
     */
    _announce(streamData: StreamData): void;
    /**
     * Emit an event when a stream stops
     * @fires TwitchOnlineTracker#offline
     * @param {string} channelName the channel name of the stream that has stopped
     * @memberof TwitchOnlineTracker
     */
    _offline(channelName: string): void;
}
