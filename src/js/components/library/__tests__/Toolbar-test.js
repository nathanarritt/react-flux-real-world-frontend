jest.dontMock('../Toolbar');

describe('Toolbar', () => {

    const React = require('react');
    const TestUtils = require('react-addons-test-utils');

    const Toolbar = require('../Toolbar');
    const formatMessage = require('../../../utils/localizationUtils').formatMessage;

    let linkClicked = false;

    function simulateClick(data) {
        linkClicked = data === null;
    }

    const linkData = [
        {
            action: simulateClick,
            icon: 'fa fa-plus-circle',
            label: 'ADD_NEW_LINK_WITH_ICON',
            type: 'link'
        }
    ];

    const linkWithoutIconOrLabel = [
        {
            action: simulateClick,
            type: 'link'
        }
    ];

    it('handles the toolbar link action for all link elements', () => {

        // Render a toolbar in the document
        const toolbar = TestUtils.renderIntoDocument(
            <Toolbar config={linkData} />
        );

        const toolbarLink = TestUtils.findRenderedDOMComponentWithClass(toolbar, 'link');
        TestUtils.Simulate.click(toolbarLink);
        expect(linkClicked).toBe(true);

        // reset to false
        linkClicked = false;

        const toolbarLinkIcon = TestUtils.findRenderedDOMComponentWithTag(toolbar, 'i');
        TestUtils.Simulate.click(toolbarLinkIcon);
        expect(linkClicked).toBe(true);

        // reset to false
        linkClicked = false;

        const toolbarLinkText = TestUtils.findRenderedDOMComponentWithTag(toolbar, 'span');
        TestUtils.Simulate.click(toolbarLinkText);
        expect(linkClicked).toBe(true);
    });

    it('displays a toolbar link item without an icon or label', () => {

        // Render a toolbar in the document
        const toolbar = TestUtils.renderIntoDocument(
            <Toolbar config={linkWithoutIconOrLabel} />
        );

        const toolbarLink = TestUtils.findRenderedDOMComponentWithClass(toolbar, 'link');
        expect(TestUtils.isDOMComponent(toolbarLink)).toBe(true);

        const toolbarLinkIcon = TestUtils.scryRenderedDOMComponentsWithTag(toolbar, 'i');
        expect(toolbarLinkIcon[0]).toBeUndefined();

        const toolbarLinkText = TestUtils.scryRenderedDOMComponentsWithTag(toolbar, 'span');
        expect(toolbarLinkText[0]).toBeUndefined();
    });

    it('displays a toolbar link item with an icon and label', () => {

        // Render a toolbar in the document
        const toolbar = TestUtils.renderIntoDocument(
            <Toolbar config={linkData} />
        );

        const toolbarLink = TestUtils.findRenderedDOMComponentWithClass(toolbar, 'link');
        expect(TestUtils.isDOMComponent(toolbarLink)).toBe(true);

        const toolbarLinkIcon = TestUtils.findRenderedDOMComponentWithTag(toolbar, 'i');
        expect(TestUtils.isDOMComponent(toolbarLinkIcon)).toBe(true);

        const toolbarLinkText = TestUtils.findRenderedDOMComponentWithTag(toolbar, 'span');
        expect(TestUtils.isDOMComponent(toolbarLinkText)).toBe(true);

        const textContent = toolbarLinkText.textContent;
        const localizedText = formatMessage(linkData[0].label);
        expect(textContent).toEqual(localizedText);
    });
});
