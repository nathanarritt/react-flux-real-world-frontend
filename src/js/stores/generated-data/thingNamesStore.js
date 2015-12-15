import {fromJS, Map} from 'immutable';

import {parseGeneratedData, sortGeneratedData} from '../../utils/storeUtils';
import thingNames from '../../../json/generated/thingNames';

const store = Map({
    thingNames: fromJS(
        sortGeneratedData(parseGeneratedData(thingNames, ['ANY', 'NONE']))
    )
});

/**
 * ThingNamesStore class.
 *
 * @class ThingNamesStore
 */
class ThingNamesStore {

    /**
     * Get the entire state for this store.
     *
     * @return {object} Store state
     */
    getState() {
        return store;
    }
}

export default new ThingNamesStore();
