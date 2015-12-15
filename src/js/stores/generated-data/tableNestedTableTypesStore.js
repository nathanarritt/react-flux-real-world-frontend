import {fromJS, Map} from 'immutable';

import {parseGeneratedData, sortGeneratedData} from '../../utils/storeUtils';
import tableNestedTableTypes from '../../../json/generated/tableNestedTableTypes';

const store = Map({
    tableNestedTableTypes: fromJS(
        sortGeneratedData(parseGeneratedData(tableNestedTableTypes, ['ANY', 'NONE']))
    )
});

/**
 * TableNestedTableTypesStore class.
 *
 * @class TableNestedTableTypesStore
 */
class TableNestedTableTypesStore {

    /**
     * Get the entire state for this store.
     *
     * @return {object} Store state
     */
    getState() {
        return store;
    }
}

export default new TableNestedTableTypesStore();
