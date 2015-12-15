jest.dontMock('../thingNamesStore');
jest.dontMock('../../../utils/storeUtils');

describe('thingNamesStore', () => {

    const thingNamesStore = require('../thingNamesStore');
    const generatedThingNames = require('../../../../json/generated/thingNames');
    const {parseGeneratedData, sortGeneratedData} = require('../../../utils/storeUtils');

    it('is initialized with data', () => {
        const filteredGeneratedThingNames = sortGeneratedData(
            parseGeneratedData(generatedThingNames, ['ANY', 'NONE'])
        );

        const thingNames = thingNamesStore.getState().get('thingNames').toJS();
        expect(thingNames).toEqual(filteredGeneratedThingNames);
    });

});
