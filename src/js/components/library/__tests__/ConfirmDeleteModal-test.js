jest.dontMock('../ConfirmDeleteModal');
jest.dontMock('../Modal');

describe('ConfirmDeleteModal', () => {

    const React = require('react');
    const TestUtils = require('react-addons-test-utils');

    const ConfirmDeleteModal = require('../ConfirmDeleteModal');
    const formatMessage = require('../../../utils/localizationUtils').formatMessage;

    const data = {
        message: 'Confirm Delete Data'
    };

    const attribute = "name";
    const customAttribute = 'message';

    const confirmMessage = 'CONFIRM_DELETE';
    const confirmMessageWithAttribute = 'CONFIRM_DELETE_ITEM_MESSAGE';

    // required attribute
    function handleClose() {}

    // required attribute
    function handleConfirm() {}

    it('displays a custom message without an attribute', () => {

        // Render a confirm delete modal in the document
        const confirmDeleteModal = TestUtils.renderIntoDocument(
            <ConfirmDeleteModal confirmMessage={confirmMessage}
                                data={data}
                                handleClose={handleClose}
                                handleConfirm={handleConfirm} />
        );

        const confirmDeleteMessage = TestUtils.scryRenderedDOMComponentsWithTag(confirmDeleteModal, 'p');
        const messageContent = confirmDeleteMessage[0].textContent;
        const localizedMessageContent = formatMessage(confirmMessage, [data[attribute]]);
        expect(messageContent).toEqual(localizedMessageContent);
    });

    it('displays a custom message with an attribute of data to display', () => {

        // Render a confirm delete modal in the document
        const confirmDeleteModal = TestUtils.renderIntoDocument(
            <ConfirmDeleteModal attribute={customAttribute}
                                confirmMessage={confirmMessageWithAttribute}
                                data={data}
                                handleClose={handleClose}
                                handleConfirm={handleConfirm} />
        );

        const confirmDeleteMessage = TestUtils.scryRenderedDOMComponentsWithTag(confirmDeleteModal, 'p');
        const messageContent = confirmDeleteMessage[0].textContent;
        const localizedMessageContent = formatMessage(confirmMessageWithAttribute, [data[customAttribute]]);
        expect(messageContent).toEqual(localizedMessageContent);
    });

    it('displays a default message without an attribute', () => {

        // Render a confirm delete modal in the document
        const confirmDeleteModal = TestUtils.renderIntoDocument(
            <ConfirmDeleteModal data={data}
                                handleClose={handleClose}
                                handleConfirm={handleConfirm} />
        );

        const confirmDeleteMessage = TestUtils.scryRenderedDOMComponentsWithTag(confirmDeleteModal, 'p');
        const messageContent = confirmDeleteMessage[0].textContent;
        const localizedMessageContent = formatMessage(confirmMessage, [data[attribute]]);
        expect(messageContent).toEqual(localizedMessageContent);
    });

    it('displays a default message with an attribute of data to display', () => {

        // Render a confirm delete modal in the document
        const confirmDeleteModal = TestUtils.renderIntoDocument(
            <ConfirmDeleteModal attribute={customAttribute}
                                data={data}
                                handleClose={handleClose}
                                handleConfirm={handleConfirm} />
        );

        const confirmDeleteMessage = TestUtils.scryRenderedDOMComponentsWithTag(confirmDeleteModal, 'p');
        const messageContent = confirmDeleteMessage[0].textContent;
        const localizedMessageContent = formatMessage(confirmMessageWithAttribute, [data[customAttribute]]);
        expect(messageContent).toEqual(localizedMessageContent);
    });

    it('displays action irreversible message', () => {

        // Render a confirm delete modal in the document
        const confirmDeleteModal = TestUtils.renderIntoDocument(
            <ConfirmDeleteModal data={data}
                                handleClose={handleClose}
                                handleConfirm={handleConfirm} />
        );

        const irreversibleMessage = TestUtils.findRenderedDOMComponentWithClass(confirmDeleteModal, 'warning-text');
        const messageContent = irreversibleMessage.textContent;
        const localizedMessageContent = formatMessage('ACTION_IRREVERSIBLE');
        expect(messageContent).toEqual(localizedMessageContent);
    });
});
