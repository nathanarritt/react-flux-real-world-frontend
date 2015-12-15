import {fromJS, Map} from 'immutable';

import {parseGeneratedData, sortGeneratedData} from '../../utils/storeUtils';
import timeZones from '../../../json/generated/timeZones';

const store = Map({
    timeZones: fromJS(
        sortGeneratedData(parseGeneratedData(timeZones, ['NOT_SPECIFIED']))
    )
});

/**
 * TimeZonesStore class.
 *
 * @class TimeZonesStore
 */
class TimeZonesStore {

    /**
     * Get the entire state for this store.
     *
     * @return {object} Store state
     */
    getState() {
        return store;
    }
}

export default new TimeZonesStore();
