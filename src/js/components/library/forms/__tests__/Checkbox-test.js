jest.dontMock('../Checkbox');

import React from 'react';
import TestUtils from 'react-addons-test-utils';

describe('Checkbox', () => {

    const Checkbox = require('../Checkbox').default;

    const label = 'Checkbox Test';

    it('handles action when any element is clicked', () => {

        let clicked = false;

        function simulateClick() {
            clicked = true;
        }

        // Render a checkbox in the document
        const checkbox = TestUtils.renderIntoDocument(
            <Checkbox isChecked={true} label={label} onAction={simulateClick} />
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
            <Checkbox label={label} onAction={() => {}} />
        );

        const checkboxLabel = TestUtils.findRenderedDOMComponentWithClass(checkbox, 'checkbox-label');
        expect(checkboxLabel.textContent).toEqual(label);
    });

    it('is checked', () => {

        // Render a checkbox in the document
        const checkbox = TestUtils.renderIntoDocument(
            <Checkbox isChecked={true} onAction={() => {}} />
        );

        const checkMark = TestUtils.findRenderedDOMComponentWithClass(checkbox, 'fa-check');
        expect(TestUtils.isDOMComponent(checkMark)).toBe(true);
    });

    it('has padding', () => {

        // Render a checkbox in the document
        const checkbox = TestUtils.renderIntoDocument(
            <Checkbox onAction={() => {}} withPadding={true} />
        );

        const checkboxComponent = TestUtils.findRenderedDOMComponentWithClass(checkbox, 'with-padding');
        expect(TestUtils.isDOMComponent(checkboxComponent)).toBe(true);
    });

    it('is not checked and does not have padding', () => {

        // Render a checkbox in the document
        const checkbox = TestUtils.renderIntoDocument(
            <Checkbox onAction={() => {}} />
        );

        const checkMark = TestUtils.scryRenderedDOMComponentsWithClass(checkbox, 'fa-check');
        expect(checkMark[0]).toBeUndefined();

        const checkboxComponent = TestUtils.scryRenderedDOMComponentsWithClass(checkbox, 'with-padding');
        expect(checkboxComponent[0]).toBeUndefined();
    });
});
