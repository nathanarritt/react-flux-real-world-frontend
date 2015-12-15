jest.dontMock('../Modal');
jest.dontMock('../Loader');

describe('Modal', () => {

    const React = require('react');
    const TestUtils = require('react-addons-test-utils');

    const Modal = require('../Modal');
    const formatMessage = require('../../../utils/localizationUtils').formatMessage;

    it('displays the children', () => {

        const childrenContent = 'Children Content';

        // Render a modal in the document
        const modal = TestUtils.renderIntoDocument(
            <Modal title="TITLE">
                <div className="modal-children">{childrenContent}</div>
            </Modal>
        );

        const modalChildren = TestUtils.findRenderedDOMComponentWithClass(modal, 'modal-children');
        expect(modalChildren.textContent).toEqual(childrenContent);
    });

    it('handles alert', () => {

        let clicked = false;

        function simulateClick() {
            clicked = true;
        }

        // Render a modal in the document
        const modal = TestUtils.renderIntoDocument(
            <Modal handleAlert={simulateClick} title="TITLE" />
        );

        const modalType = TestUtils.findRenderedDOMComponentWithClass(modal, 'alert');
        expect(TestUtils.isDOMComponent(modalType)).toBe(true);

        const alertButton = TestUtils.findRenderedDOMComponentWithClass(modal, 'button');
        TestUtils.Simulate.click(alertButton);
        expect(clicked).toBe(true);
        expect(alertButton.textContent).toBe('OK');
    });

    it('handles close', () => {

        let clicked = false;

        function simulateClick() {
            clicked = true;
        }

        // Render a modal in the document
        const modal = TestUtils.renderIntoDocument(
            <Modal handleClose={simulateClick} title="TITLE" />
        );

        const modalType = TestUtils.findRenderedDOMComponentWithClass(modal, 'form');
        expect(TestUtils.isDOMComponent(modalType)).toBe(true);

        const closeIcon = TestUtils.findRenderedDOMComponentWithClass(modal, 'modal-close-icon');
        TestUtils.Simulate.click(closeIcon);
        expect(clicked).toBe(true);

        // reset for next test item
        clicked = false;

        const closeButton = TestUtils.findRenderedDOMComponentWithClass(modal, 'button');
        TestUtils.Simulate.click(closeButton);
        expect(clicked).toBe(true);
        expect(closeButton.textContent).toBe('Cancel');
    });

    it('handles confirm', () => {

        let clicked = false;

        function simulateClick() {
            clicked = true;
        }

        // Render a modal in the document
        const modal = TestUtils.renderIntoDocument(
            <Modal handleConfirm={simulateClick} title="TITLE" />
        );

        const modalType = TestUtils.findRenderedDOMComponentWithClass(modal, 'confirm');
        expect(TestUtils.isDOMComponent(modalType)).toBe(true);

        const confirmButton = TestUtils.findRenderedDOMComponentWithClass(modal, 'button');
        TestUtils.Simulate.click(confirmButton);
        expect(clicked).toBe(true);
        expect(confirmButton.textContent).toBe('Confirm');
    });

    it('handles save', () => {

        let clicked = false;

        function simulateClick() {
            clicked = true;
        }

        // Render a modal in the document
        const modal = TestUtils.renderIntoDocument(
            <Modal handleSave={simulateClick} title="TITLE" />
        );

        const modalType = TestUtils.findRenderedDOMComponentWithClass(modal, 'form');
        expect(TestUtils.isDOMComponent(modalType)).toBe(true);

        const saveButton = TestUtils.findRenderedDOMComponentWithClass(modal, 'button');
        TestUtils.Simulate.click(saveButton);
        expect(clicked).toBe(true);
        expect(saveButton.textContent).toBe('Save');
    });

    it('is loading', () => {

        // Render a modal in the document
        const modal = TestUtils.renderIntoDocument(
            <Modal isLoading={true} title="TITLE" />
        );

        const loader = TestUtils.findRenderedDOMComponentWithClass(modal, 'loader-component');
        expect(TestUtils.isDOMComponent(loader)).toBe(true);
    });

    it('displays the title, is not loading, and does not display action buttons', () => {

        const title = 'TITLE';

        // Render a modal in the document
        const modal = TestUtils.renderIntoDocument(
            <Modal title={title} />
        );

        const modalType = TestUtils.findRenderedDOMComponentWithClass(modal, 'form');
        expect(TestUtils.isDOMComponent(modalType)).toBe(true);

        const modalTitle = TestUtils.findRenderedDOMComponentWithClass(modal, 'modal-title');
        expect(modalTitle.textContent).toEqual(formatMessage(title));

        const loader = TestUtils.scryRenderedDOMComponentsWithClass(modal, 'loader-component');
        expect(loader[0]).toBeUndefined();

        // covers all buttons except for the close icon
        const button = TestUtils.scryRenderedDOMComponentsWithClass(modal, 'button');
        expect(button[0]).toBeUndefined();

        const closeIcon = TestUtils.scryRenderedDOMComponentsWithClass(modal, 'modal-close-icon');
        expect(closeIcon[0]).toBeUndefined();
    });
});
