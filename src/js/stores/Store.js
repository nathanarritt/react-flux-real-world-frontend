import {EventEmitter} from 'events';

const CHANGE_EVENT = 'change';

/**
 * Store class.
 *
 * @class Store
 */
export default class Store extends EventEmitter {

    /**
     * Store constructor.
     *
     * @constructs Store
     * @return {object} New instance object
     */
    constructor() {
        super();

        /**
         * The token returned by `AppDispatcher.register(..)`
         * Can be used by `AppDispatcher.waitFor()`
         *
         * @member Store#dispatchToken
         */
        this.dispatchToken = null;
    }

    /**
     * Emits change event to all registered event listeners.
     *
     * @return {Boolean} Indication if we've emitted an event.
     */
    emitChange() {
        return this.emit(CHANGE_EVENT);
    }

    /**
     * Register a new change event listener.
     *
     * @param {function} callback Callback function.
     * @return {undefined} No return value needed
     */
    addChangeListener(callback) {
        this.on(CHANGE_EVENT, callback);
    }

    /**
     * Remove change event listener.
     *
     * @param {function} callback Callback function.
     * @return {undefined} No return value needed
     */
    removeChangeListener(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
}
