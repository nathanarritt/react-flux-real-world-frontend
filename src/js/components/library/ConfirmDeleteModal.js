import React, {Component, PropTypes} from 'react';

import {formatMessage} from '../../utils/localizationUtils';
import Modal from '../library/Modal';

/*
 * ConfirmDeleteModal class.
 *
 * @class ConfirmDeleteModal
 *
 * The following props are supported:
 *
 * attribute {string} Model attribute with text to display. Default is `name`.
 * confirmMessage {string} Localization key for main message text. This can accept one argument of `data[attribute]`.
 * data {object} (required) Model data object for data being deleted.
 * handleClose {function} A method bound to the view where state is managed that handles the close action.
 * handleConfirm {function} (required) A method bound to the view where state is managed that handles the delete action. The
 *                                     data object is passed back to this method.
 * isLoading {boolean} The isLoading state from the view where state is managed.
 * title {string} Localization key for the title.
 *
 * @example <caption>Example usage:</caption>
 *
 *     <ConfirmDeleteModal attribute="name"
 *                         confirmMessage="CONFIRM_DELETE_ITEM_MESSAGE"
 *                         data={this.state.actionData}
 *                         handleClose={this.handleActionClose.bind(this)}
 *                         handleConfirm={this.handleDelete.bind(this)}
 *                         isLoading={this.state.isLoading}
 *                         title="CONFIRM_DELETE_ITEM" />
 *
 */
export default class ConfirmDeleteModal extends Component {
    handleConfirm() {
        this.props.handleConfirm(this.props.data);
    }

    render() {
        const {confirmMessage, data, handleClose, isLoading, title} = this.props;
        const attribute = this.props.attribute || 'name';

        let defaultTitle;

        if (!title) {
            if (data[attribute] != null) { // eslint-disable-line no-eq-null
                defaultTitle = formatMessage('CONFIRM_DELETE_ITEM', data[attribute]);
            } else {
                defaultTitle = 'DELETE_RESOURCE';
            }
        }

        let defaultConfirmMessage;

        if (!confirmMessage) {
            if (data[attribute] != null) { // eslint-disable-line no-eq-null
                defaultConfirmMessage = formatMessage('CONFIRM_DELETE_ITEM_MESSAGE', [data[attribute]]);
            } else {
                defaultConfirmMessage = formatMessage('CONFIRM_DELETE');
            }
        }

        return (
            <Modal handleClose={handleClose}
                   handleConfirm={this.handleConfirm.bind(this)}
                   isLoading={isLoading}
                   title={title ? formatMessage(title, [data[attribute]]) : defaultTitle}>
                <div className="confirm-delete-modal-component">
                    <p>{confirmMessage ? formatMessage(confirmMessage, [data[attribute]]) : defaultConfirmMessage}</p>
                    <p className="warning-text">{formatMessage('ACTION_IRREVERSIBLE')}</p>
                </div>
            </Modal>
        );
    }
}

ConfirmDeleteModal.propTypes = {
    attribute: PropTypes.string,
    confirmMessage: PropTypes.string,
    data: PropTypes.object.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleConfirm: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
    title: PropTypes.string
};
