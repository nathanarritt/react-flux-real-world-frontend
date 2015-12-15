jest.dontMock('../tableNestedTableTypesStore');
jest.dontMock('../../../utils/storeUtils');

describe('tableNestedTableTypesStore', () => {

    const tableNestedTableTypesStore = require('../tableNestedTableTypesStore');
    const generatedTableNestedTableTypes = require('../../../../json/generated/tableNestedTableTypes');
    const {parseGeneratedData, sortGeneratedData} = require('../../../utils/storeUtils');

    it('is initialized with data', () => {
        const filteredGeneratedTableNestedTableTypes = sortGeneratedData(
            parseGeneratedData(generatedTableNestedTableTypes, ['ANY', 'NONE'])
        );

        const tableNestedTableTypes = tableNestedTableTypesStore.getState().get('tableNestedTableTypes').toJS();
        expect(tableNestedTableTypes).toEqual(filteredGeneratedTableNestedTableTypes);
    });

});
