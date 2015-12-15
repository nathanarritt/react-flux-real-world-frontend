import React, {Component, PropTypes} from 'react';
import ReactDom from 'react-dom';

import sessionActions from '../actions/sessionActions';
import sessionStore from '../stores/sessionStore';

import Checkbox from './library/forms/Checkbox';
import Error from './library/Error';
import Loader from './library/Loader';
import {formatMessage} from '../utils/localizationUtils';
import localStorageUtils from '../utils/localStorageUtils';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = sessionStore.getState().toJS();
        this.handleStateChange = this.handleStateChange.bind(this);
    }

    componentWillMount() {
        sessionStore.addChangeListener(this.handleStateChange);

        if (this.state.isAuthenticated) {
            sessionActions.logout();
        }
    }

    componentDidMount() {
        if (!this.state.hasError) {
            const contentHeight = ReactDom.findDOMNode(this).offsetHeight;
            const loginFormHeight = this.refs.loginForm.offsetHeight;
            const marginTop = (contentHeight - loginFormHeight) / 2;

            sessionActions.updateMarginTop(marginTop);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.isAuthenticated) {
            this.handleRedirect();
            return false;
        }

        return true;
    }

    componentWillUnmount() {
        sessionStore.removeChangeListener(this.handleStateChange);
    }

    handleRedirect() {
        const {history, params, location} = this.props;

        // Use setTimeout to fix Invariant Violation - https://github.com/rackt/react-router/issues/950
        window.setTimeout(() => {
            if (location.state) {
                history.replaceState('/login', location.state, params);
            } else {
                history.replaceState('/login', '/');
            }
        }, 0);
    }

    handleRememberUsername() {
        sessionActions.setRememberUsername(!this.state.rememberUsername);
    }

    handleStateChange() {
        this.setState(sessionStore.getState().toJS());
    }

    handleSubmit(event) {
        event.preventDefault();

        const username = this.refs.username.value;
        const password = this.refs.password.value;

        const loginData = {
            apiKey: '0fggjg88Gg7G',
            username,
            password
        };

        sessionActions.login(loginData);
    }

    render() {
        const {
            hasError, isInvalid, isLoading, marginTop, rememberUsername, username
        } = this.state;

        const errorResponse = this.state.errorResponse || {};

        return (
            <div className="login-component">
                {hasError ? (
                    <Error response={errorResponse} />
                ) : (
                    <div className="login-form" ref="loginForm" style={{marginTop}}>
                        <div className="login-header">
                            {formatMessage('SIGN_IN_TO_YOUR_ACCOUNT')}
                        </div>
                        <div className="login-body">
                            <form onSubmit={this.handleSubmit.bind(this)}>
                                {isInvalid && (
                                    <p className="login-error">
                                        {formatMessage('INVALID_USERNAME_OR_PASSWORD')}
                                    </p>
                                )}
                                <label className="form-label" htmlFor="login-form-username">
                                    {formatMessage('EMAIL_ADDRESS')}
                                </label>
                                <input autoFocus={!rememberUsername || !username ? 'true' : null}
                                       className="form-input-text"
                                       defaultValue={rememberUsername && username ? username : null}
                                       id="login-form-username"
                                       placeholder={formatMessage('TYPE_YOUR_EMAIL')}
                                       ref="username"
                                       type="text" />
                                <label className="form-label" htmlFor="login-form-password">
                                    {formatMessage('PASSWORD')}
                                </label>
                                <input autoFocus={rememberUsername && username ? 'true' : null}
                                       className="form-input-text"
                                       id="login-form-password"
                                       placeholder={formatMessage('TYPE_YOUR_PASSWORD')}
                                       ref="password"
                                       type="password" />
                                {localStorageUtils.isEnabled && (
                                    <Checkbox action={this.handleRememberUsername.bind(this)}
                                              isChecked={rememberUsername}
                                              label={formatMessage('REMEMBER_MY_EMAIL_ADDRESS')} />
                                )}
                                <button className="login-button" type="submit"></button>
                            </form>
                        </div>
                        <div className="login-footer">
                            <span className="button primary" onClick={this.handleSubmit.bind(this)}>
                                {formatMessage('SIGN_IN')}
                            </span>
                            <div className="login-language">
                                <label>{formatMessage('LANGUAGE')} </label>
                                <span>{'English (US)'}</span>
                            </div>
                        </div>
                        {isLoading && <Loader />}
                    </div>
                )}
            </div>
        );
    }
}

Login.propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired
};
