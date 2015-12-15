jest.dontMock('../Checkbox');

describe('Checkbox', () => {

    const React = require('react');
    const TestUtils = require('react-addons-test-utils');

    const Checkbox = require('../Checkbox');

    const label = 'Checkbox Test';

    it('handles action when any element is clicked', () => {

        let clicked = false;

        function simulateClick() {
            clicked = true;
        }

        // Render a checkbox in the document
        const checkbox = TestUtils.renderIntoDocument(
            <Checkbox action={simulateClick} isChecked={true} label={label} />
        );

        const checkboxComponent = TestUtils.findRenderedDOMComponentWithClass(checkbox, 'checkbox-component');
        TestUtils.Simulate.click(checkboxComponent);
        expect(clicked).toBe(true);

        // reset clicked
        clicked = false;

        const checkboxField = TestUtils.findRenderedDOMComponentWithClass(checkbox, 'checkbox-field');
        TestUtils.Simulate.click(checkboxField);
        expect(clicked).toBe(true);

        // reset clicked
        clicked = false;

        const checkMark = TestUtils.findRenderedDOMComponentWithClass(checkbox, 'fa-check');
        TestUtils.Simulate.click(checkMark);
        expect(clicked).toBe(true);

        // reset clicked
        clicked = false;

        const checkboxLabel = TestUtils.findRenderedDOMComponentWithClass(checkbox, 'checkbox-label');
        TestUtils.Simulate.click(checkboxLabel);
        expect(clicked).toBe(true);
    });

    it('displays the label', () => {

        // Render a checkbox in the document
        const checkbox = TestUtils.renderIntoDocument(
            <Checkbox action={() => {}} label={label} />
        );

        const checkboxLabel = TestUtils.findRenderedDOMComponentWithClass(checkbox, 'checkbox-label');
        expect(checkboxLabel.textContent).toEqual(label);
    });

    it('is checked', () => {

        // Render a checkbox in the document
        const checkbox = TestUtils.renderIntoDocument(
            <Checkbox action={() => {}} isChecked={true} />
        );

        const checkMark = TestUtils.findRenderedDOMComponentWithClass(checkbox, 'fa-check');
        expect(TestUtils.isDOMComponent(checkMark)).toBe(true);
    });

    it('has padding', () => {

        // Render a checkbox in the document
        const checkbox = TestUtils.renderIntoDocument(
            <Checkbox action={() => {}} withPadding={true} />
        );

        const checkboxComponent = TestUtils.findRenderedDOMComponentWithClass(checkbox, 'with-padding');
        expect(TestUtils.isDOMComponent(checkboxComponent)).toBe(true);
    });

    it('is not checked and does not have padding', () => {

        // Render a checkbox in the document
        const checkbox = TestUtils.renderIntoDocument(
            <Checkbox action={() => {}} />
        );

        const checkMark = TestUtils.scryRenderedDOMComponentsWithClass(checkbox, 'fa-check');
        expect(checkMark[0]).toBeUndefined();

        const checkboxComponent = TestUtils.scryRenderedDOMComponentsWithClass(checkbox, 'with-padding');
        expect(checkboxComponent[0]).toBeUndefined();
    });
});
