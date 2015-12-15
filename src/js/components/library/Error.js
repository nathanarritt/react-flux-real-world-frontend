import React, {Component, PropTypes} from 'react';
import ReactDom from 'react-dom';

import {formatMessage} from '../../utils/localizationUtils';

export default class Error extends Component {
    constructor(props) {
        super(props);
        this.state = {
            marginTop: 0
        };
    }

    componentDidMount() {
        this.setMarginTop();
    }

    handleReload() {
        window.location.reload();
    }

    setMarginTop() {
        const componentHeight = ReactDom.findDOMNode(this).offsetHeight;
        const contentHeight = this.refs.errorContent.offsetHeight;
        const marginTop = ((componentHeight - contentHeight) / 2);

        this.setState({
            marginTop
        });
    }

    render() {
        const {code, message} = this.props.response;

        return (
            <div className="error-component">
                <div
                    className="error-content"
                    ref="errorContent"
                    style={{marginTop: this.state.marginTop}}>

                    <div className="error-header">
                        {formatMessage(code)}
                    </div>
                    <div className="error-body">
                        <p>{message}</p>
                        <p>
                            {formatMessage('PLEASE_TRY_AGAIN')}
                            <span
                                className="error-refresh"
                                onClick={this.handleReload.bind(this)}>

                                {formatMessage('REFRESH')}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}

Error.propTypes = {
    response: PropTypes.object.isRequired
};
