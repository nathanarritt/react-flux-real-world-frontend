jest.dontMock('../countriesStore');
jest.dontMock('../../../utils/storeUtils');

describe('countriesStore', () => {

    const countriesStore = require('../countriesStore');
    const generatedCountries = require('../../../../json/generated/countries');
    const {parseGeneratedData} = require('../../../utils/storeUtils');

    it('is initialized with data', () => {
        const filteredGeneratedCountries = parseGeneratedData(generatedCountries, ['NONE']);

        const countries = countriesStore.getState().get('countries').toJS();
        expect(countries).toEqual(filteredGeneratedCountries);
    });

});
