jest.dontMock('../Error');

describe('Error', () => {

    const React = require('react');
    const TestUtils = require('react-addons-test-utils');

    const Error = require('../Error');
    const formatMessage = require('../../../utils/localizationUtils').formatMessage;

    const errorData = {
        code: 'ERROR_CODE',
        message: 'Error data'
    };

    it('displays the error data', () => {

        // Render a error in the document
        const error = TestUtils.renderIntoDocument(
            <Error response={errorData} />
        );

        const errorHeader = TestUtils.findRenderedDOMComponentWithClass(error, 'error-header');
        expect(errorHeader.textContent).toEqual(formatMessage(errorData.code));

        const errorMessage = TestUtils.scryRenderedDOMComponentsWithTag(error, 'p');
        expect(errorMessage[0].textContent).toEqual(errorData.message);
    });
});
