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
 * onClose {function} A method bound to the view where state is managed that handles the close action.
 * onConfirm {function} (required) A method bound to the view where state is managed that handles the delete action. The
 *                                     data object is passed back to this method.
 * isLoading {boolean} The isLoading state from the view where state is managed.
 * title {string} Localization key for the title.
 *
 * @example <caption>Example usage:</caption>
 *
 *     <ConfirmDeleteModal
 *         attribute="name"
 *         confirmMessage="CONFIRM_DELETE_ITEM_MESSAGE"
 *         data={this.state.actionData}
 *         isLoading={this.state.isLoading}
 *         onClose={this.handleClose}
 *         onConfirm={this.handleDelete}
 *         title="CONFIRM_DELETE_ITEM"
 *     />
 *
 */
export default class ConfirmDeleteModal extends Component {

    static propTypes = {
        attribute: PropTypes.string,
        confirmMessage: PropTypes.string,
        data: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
        disableWarning: PropTypes.bool,
        isLoading: PropTypes.bool,
        onClose: PropTypes.func.isRequired,
        onConfirm: PropTypes.func.isRequired,
        title: PropTypes.string
    };

    constructor(props) {
        super(props);
        this.state = {
            warningEnabled: !props.disableWarning
        };
        this.handleConfirm = this.handleConfirm.bind(this);
    }

    handleConfirm() {
        const {data, onConfirm} = this.props;

        onConfirm(data);
    }

    render() {
        const {confirmMessage, data, isLoading, onClose, title} = this.props;
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
            <Modal
                isLoading={isLoading}
                onClose={onClose}
                onConfirm={this.handleConfirm}
                title={title ? formatMessage(title, [data[attribute]]) : defaultTitle}
            >
                <div className="confirm-delete-modal-component">
                    <p>
                        {confirmMessage ? formatMessage(confirmMessage, [data[attribute]]) : defaultConfirmMessage}
                    </p>
                    {this.state.warningEnabled &&
                        <p className="warning-text">
                            {formatMessage('ACTION_IRREVERSIBLE')}
                        </p>
                    }
                </div>
            </Modal>
        );
    }
}
