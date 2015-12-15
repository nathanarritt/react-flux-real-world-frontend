jest.dontMock('../Search');

describe('Search', () => {

    const React = require('react');
    const TestUtils = require('react-addons-test-utils');

    const Search = require('../Search');
    const formatMessage = require('../../../utils/localizationUtils').formatMessage;

    it('handles search with icon click', () => {

        let clicked = null;

        function simulateClick(value) {
            clicked = value;
        }

        // Render a error in the document
        const search = TestUtils.renderIntoDocument(
            <Search action={simulateClick} />
        );

        const input = TestUtils.findRenderedDOMComponentWithTag(search, 'input');
        input.value = 'test';
        const searchIcon = TestUtils.findRenderedDOMComponentWithClass(search, 'fa-search');
        TestUtils.Simulate.click(searchIcon, {type: 'click'});
        expect(clicked).toEqual(input.value);
    });

    it('handles search with enter key', () => {

        let keyUp = null;

        function simulateKeyUp(value) {
            keyUp = value;
        }

        // Render a error in the document
        const search = TestUtils.renderIntoDocument(
            <Search action={simulateKeyUp} />
        );

        const input = TestUtils.findRenderedDOMComponentWithTag(search, 'input');
        input.value = 'test';
        TestUtils.Simulate.keyUp(input, {key: "Enter", keyCode: 13, which: 13});
        expect(keyUp).toEqual(input.value);
    });

    it('handles search with allowKeyUp', () => {

        let keyUp = null;

        function simulateKeyUp(value) {
            keyUp = value;
        }

        // Render a error in the document
        const search = TestUtils.renderIntoDocument(
            <Search action={simulateKeyUp} allowKeyUp={true} />
        );

        const input = TestUtils.findRenderedDOMComponentWithTag(search, 'input');
        input.value = 'test';
        TestUtils.Simulate.keyUp(input, {type: 'keyup'});
        expect(keyUp).toEqual(input.value);
    });

    it('has default placeholder text', () => {

        // required attribute
        function simulateClick() {}

        // Render a error in the document
        const search = TestUtils.renderIntoDocument(
            <Search action={simulateClick} />
        );

        const input = TestUtils.findRenderedDOMComponentWithTag(search, 'input');
        expect(input.getAttribute('placeholder')).toEqual(formatMessage('SEARCH'));
    });

    it('has custom placeholder text', () => {

        const placeholder = 'PLACEHOLDER';

        // required attribute
        function simulateClick() {}

        // Render a error in the document
        const search = TestUtils.renderIntoDocument(
            <Search action={simulateClick} placeholder={placeholder} />
        );

        const input = TestUtils.findRenderedDOMComponentWithTag(search, 'input');
        expect(input.getAttribute('placeholder')).toEqual(formatMessage(placeholder));
    });
});
