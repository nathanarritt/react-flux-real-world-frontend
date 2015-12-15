jest.dontMock('../timeZonesStore');
jest.dontMock('../../../utils/storeUtils');

describe('timeZonesStore', () => {

    const timeZonesStore = require('../timeZonesStore');
    const generatedTimeZones = require('../../../../json/generated/timeZones');
    const {parseGeneratedData, sortGeneratedData} = require('../../../utils/storeUtils');

    it('is initialized with data', () => {
        const filteredGeneratedTimeZones = sortGeneratedData(
            parseGeneratedData(generatedTimeZones, ['NOT_SPECIFIED'])
        );

        const timeZones = timeZonesStore.getState().get('timeZones').toJS();
        expect(timeZones).toEqual(filteredGeneratedTimeZones);
    });

});
