import React, {Component, PropTypes} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import ReactDom from 'react-dom';

import styleConfig from '../../config/styleConfig';
import Loader from './Loader';
import {formatMessage} from '../../utils/localizationUtils';

/*
 * Modal class.
 *
 * @class Modal
 *
 * The Modal supports the following types:
 *     - alert
 *     - confirm
 *     - form (default)
 *
 * The following props are supported:
 *
 * bodyHeight {number} Set a specific height for the modal.
 * children {array of elements | element} An array of React elements or a single
 *     React element. This is the content that populates the `modal-body`.
 * disableSave {boolean} Disable Save button when necessary such as form errors.
 * onAlert {function} A method that handles the alert action. If this method
 *     is provided, the modal type is `alert`.
 * onClose {function} A method that handles the close action.
 * onConfirm {function} A method that handles the confirm action. If this
 *     method is provided, the modal type is `confirm`.
 * onSave {function} A method that handles the save action.
 * isLoading {boolean} The isLoading state from the view where state is managed.
 * title {string} (required) Localization key or text to use as the title.
 *
 * @example <caption>Example usage:</caption>
 *
 *          <Modal onClose={onClose}
 *                 onConfirm={this.handleConfirm}
 *                 isLoading={isLoading}
 *                 title={title ? localizationUtils.formatMessage(title, [data[attribute]]) : defaultTitle}
 *                 type="confirm">
 *              <div className="confirm-delete-modal-component">
 *                  {confirmMessage ? localizationUtils.formatMessage(confirmMessage, [data[attribute]]) : defaultConfirmMessage}
 *                  <p className="warning-text">{localizationUtils.formatMessage('ACTION_IRREVERSIBLE')}</p>
 *              </div>
 *          </Modal>
 *
 */
export default class Modal extends Component {

    static propTypes = {
        bodyHeight: PropTypes.number,
        children: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.element,
            PropTypes.string
        ]),
        disableSave: PropTypes.bool,
        isLoading: PropTypes.bool,
        onAlert: PropTypes.func,
        onClose: PropTypes.func,
        onConfirm: PropTypes.func,
        onSave: PropTypes.func,
        title: PropTypes.string.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            bodyHeight: 'auto',
            contentMarginTop: 0
        };
        this.handleSave = this.handleSave.bind(this);
    }

    componentDidMount() {
        this.setDisplayState();
    }

    handleSave() {
        const {disableSave, onSave} = this.props;

        if (!disableSave) {
            // destructuring onSave breaks the build for some reason
            onSave();
        }
    }

    setDisplayState() {
        const componentHeight = ReactDom.findDOMNode(this).offsetHeight;

        const bodyChildrenHeight = this.modalBodyChildren.offsetHeight;
        const footerHeight = this.modalFooter.offsetHeight;
        const headerHeight = this.modalHeader.offsetHeight;

        const {
            modal: {bodyPaddingTopAndBottom, componentPaddingTopAndBottom},
            form: {sectionLastChildBottomMargin: formSectionLastChildBottomMargin}
        } = styleConfig;

        let bodyHeight = this.props.bodyHeight;
        let contentHeight;

        if (bodyHeight) {
            contentHeight = bodyHeight + footerHeight + headerHeight;
        } else {
            contentHeight = bodyChildrenHeight + bodyPaddingTopAndBottom +
                              footerHeight + headerHeight;
        }

        if (!bodyHeight) {
            if (contentHeight >= (componentHeight - componentPaddingTopAndBottom)) {

                // display scrollbar
                bodyHeight = componentHeight - componentPaddingTopAndBottom -
                             footerHeight - headerHeight;
            } else {
                bodyHeight = bodyChildrenHeight + bodyPaddingTopAndBottom +
                             formSectionLastChildBottomMargin;
            }
        }

        // vertically center content
        let contentMarginTop = ((componentHeight - componentPaddingTopAndBottom) -
                                contentHeight) / 2;

        if (!contentMarginTop || contentMarginTop < 0) {
            contentMarginTop = 0;
        }

        const isBodyHeightChanged = bodyHeight !== this.state.bodyHeight;
        const isContentMarginTopChanged = contentMarginTop !== this.state.contentMarginTop;

        const newState = {};

        if (isBodyHeightChanged) {
            newState.bodyHeight = bodyHeight;
        }

        if (isContentMarginTopChanged) {
            newState.contentMarginTop = contentMarginTop;
        }

        if (isBodyHeightChanged || isContentMarginTopChanged) {
            this.setState(newState);
        }
    }

    render() {
        const {
            children, disableSave, isLoading, onAlert, onClose, onConfirm,
            onSave, title
        } = this.props;

        let type = 'form';

        if (onAlert) {
            type = 'alert';
        } else if (onConfirm) {
            type = 'confirm';
        }

        const modalContentStyle = {
            marginTop: this.state.contentMarginTop
        };

        const modalBodyStyle = {
            height: this.state.bodyHeight
        };

        const {
            transitionAppear, transitionAppearTimeout,
            transitionEnterTimeout, transitionLeaveTimeout
        } = styleConfig.modal;

        return (
            <div className={`modal-component ${type}`}>
                <ReactCSSTransitionGroup
                    transitionAppear={transitionAppear}
                    transitionAppearTimeout={transitionAppearTimeout}
                    transitionEnterTimeout={transitionEnterTimeout}
                    transitionLeaveTimeout={transitionLeaveTimeout}
                    transitionName="modal"
                >
                    <div
                        className="modal-content"
                        style={modalContentStyle}
                    >
                        <div
                            className="modal-header"
                            ref={c => (this.modalHeader = c)}
                        >
                            <span className="modal-title">
                                {formatMessage(title)}
                            </span>
                            {onClose &&
                                <i
                                    className="fa fa-remove modal-close-icon"
                                    onClick={onClose}
                                />
                            }
                        </div>
                        <div
                            className="modal-body"
                            style={modalBodyStyle}
                        >
                            <div
                                className="modal-body-children"
                                ref={c => (this.modalBodyChildren = c)}
                            >
                                {children}
                            </div>
                        </div>
                        <div
                            className="modal-footer"
                            ref={c => (this.modalFooter = c)}
                        >
                            {onAlert &&
                                <span
                                    className="button primary"
                                    onClick={onAlert}
                                >
                                    {formatMessage('OK')}
                                </span>
                            }
                            {onConfirm &&
                                <span
                                    className="button primary"
                                    onClick={onConfirm}
                                >
                                    {formatMessage('CONFIRM')}
                                </span>
                            }
                            {onSave &&
                                <span
                                    className={`button primary ${disableSave ? 'disabled' : ''}`}
                                    onClick={this.handleSave}
                                >
                                    {formatMessage('SAVE')}
                                </span>
                            }
                            {onClose &&
                                <span
                                    className="button"
                                    onClick={onClose}
                                >
                                    {formatMessage('CANCEL')}
                                </span>
                            }
                        </div>
                        {isLoading && <Loader />}
                    </div>
                </ReactCSSTransitionGroup>
            </div>
        );
    }
}
