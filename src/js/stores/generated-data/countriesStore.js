import {fromJS, Map} from 'immutable';

import {parseGeneratedData} from '../../utils/storeUtils';
import countries from '../../../json/generated/countries';

const store = Map({
    countries: fromJS(parseGeneratedData(countries, ['NONE']))
});

/**
 * CountriesStore class.
 *
 * @class CountriesStore
 */
class CountriesStore {

    /**
     * Get the entire state for this store.
     *
     * @return {object} Store state
     */
    getState() {
        return store;
    }
}

export default new CountriesStore();
