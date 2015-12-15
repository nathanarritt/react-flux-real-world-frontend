import React, {Component, PropTypes} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import ReactDom from 'react-dom';

import componentsConfig from '../../config/componentsConfig';
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
 * children {array of elements | element} An array of React elements or a single
 *     React element. This is the content that populates the `modal-body`.
 * disableSave {boolean} Disable Save button when necessary such as form errors.
 * handleAlert {function} A method that handles the alert action. If this method
 *     is provided, the modal type is `alert`.
 * handleClose {function} A method that handles the close action.
 * handleConfirm {function} A method that handles the confirm action. If this
 *     method is provided, the modal type is `confirm`.
 * handleSave {function} A method that handles the save action.
 * isLoading {boolean} The isLoading state from the view where state is managed.
 * title {string} (required) Localization key or text to use as the title.
 *
 * @example <caption>Example usage:</caption>
 *
 *          <Modal handleClose={handleClose}
 *                 handleConfirm={this.handleConfirm.bind(this)}
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
    constructor(props) {
        super(props);
        this.state = {
            bodyHeight: 'auto',
            bodyOverflowY: 'visible',
            contentMarginTop: 0
        };
    }

    componentDidMount() {
        this.setDisplayState();
    }

    componentDidUpdate() {
        this.setDisplayState();
    }

    handleSave() {
        const {disableSave, handleSave} = this.props;

        if (!disableSave) {
            handleSave();
        }
    }

    setDisplayState() {
        const componentHeight = ReactDom.findDOMNode(this).offsetHeight;

        const bodyChildrenHeight = this.refs.modalBodyChildren.offsetHeight;
        const footerHeight = this.refs.modalFooter.offsetHeight;
        const headerHeight = this.refs.modalHeader.offsetHeight;

        const {
            bodyPaddingTopAndBottom, componentPaddingTopAndBottom
        } = componentsConfig.modal;

        const contentHeight = bodyChildrenHeight + bodyPaddingTopAndBottom +
                              footerHeight + headerHeight;

        let bodyHeight;
        let bodyOverflowY;

        if (contentHeight >= (componentHeight - componentPaddingTopAndBottom)) {

            // display scrollbar
            bodyHeight = componentHeight - componentPaddingTopAndBottom -
                         footerHeight - headerHeight;
            bodyOverflowY = 'auto';
        } else {
            bodyHeight = 'auto';
            bodyOverflowY = 'visible';
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
            newState.bodyOverflowY = bodyOverflowY;
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
            children, disableSave, handleAlert, handleClose, handleConfirm,
            handleSave, isLoading, title
        } = this.props;

        let type = 'form';

        if (handleAlert) {
            type = 'alert';
        } else if (handleConfirm) {
            type = 'confirm';
        }

        const modalContentStyle = {
            marginTop: this.state.contentMarginTop
        };

        const modalBodyStyle = {
            height: this.state.bodyHeight,
            overflowY: this.state.bodyOverflowY
        };

        const {
            transitionAppear, transitionAppearTimeout,
            transitionEnterTimeout, transitionLeaveTimeout
        } = componentsConfig.modal;

        return (
            <div className={`modal-component ${type}`}>
                <ReactCSSTransitionGroup
                    transitionAppear={transitionAppear}
                    transitionAppearTimeout={transitionAppearTimeout}
                    transitionEnterTimeout={transitionEnterTimeout}
                    transitionLeaveTimeout={transitionLeaveTimeout}
                    transitionName="modal">

                    <div className="modal-content" style={modalContentStyle}>
                        <div className="modal-header" ref="modalHeader">
                            <span className="modal-title">
                                {formatMessage(title)}
                            </span>
                            {handleClose &&
                                <i className="fa fa-remove modal-close-icon" onClick={handleClose} />
                            }
                        </div>
                        <div className="modal-body" style={modalBodyStyle}>
                            <div className="modal-body-children" ref="modalBodyChildren">
                                {children}
                            </div>
                        </div>
                        <div className="modal-footer" ref="modalFooter">
                            {handleAlert &&
                                <span className="button primary" onClick={handleAlert}>
                                    {formatMessage('OK')}
                                </span>
                            }
                            {handleConfirm &&
                                <span className="button primary" onClick={handleConfirm}>
                                    {formatMessage('CONFIRM')}
                                </span>
                            }
                            {handleSave &&
                                <span
                                    className={`button primary ${disableSave ? 'disabled' : ''}`}
                                    onClick={this.handleSave.bind(this)}>

                                    {formatMessage('SAVE')}
                                </span>
                            }
                            {handleClose &&
                                <span className="button" onClick={handleClose}>
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

Modal.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.element),
        PropTypes.element
    ]),
    disableSave: PropTypes.bool,
    handleAlert: PropTypes.func,
    handleClose: PropTypes.func,
    handleConfirm: PropTypes.func,
    handleSave: PropTypes.func,
    isLoading: PropTypes.bool,
    title: PropTypes.string.isRequired
};
