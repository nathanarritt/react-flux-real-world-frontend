import React, {Component, PropTypes} from 'react';

export default class ToggleButton extends Component {

    static propTypes = {
        action: PropTypes.func.isRequired,
        attribute: PropTypes.string,
        error: PropTypes.string,
        value: PropTypes.bool.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            value: props.value
        };
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        const value = this.state.value;
        const {action, attribute} = this.props;

        this.setState({
            value: !value
        });

        action({
            attribute,
            value: !value
        });
    }

    render() {
        const value = this.state.value;
        const error = this.props.error;

        return (
            <div className={`toggle-button-component ${error ? 'has-error' : ''}`}>
                <div
                    className={`toggle-button-element ${value ? 'on' : 'off'}`}
                    onClick={this.handleClick}
                >
                    <div className="toggle-button-switch" />
                    <div className="toggle-button-icon">
                        <i className={`fa fa-${value ? 'check' : 'times'}`} />
                    </div>
                </div>
                {error &&
                    <div className="form-column-item-error-icon">
                        <i className="fa fa-times-circle" />
                    </div>
                }
                {error &&
                    <div className="form-column-item-error-message">
                        {error}
                    </div>
                }
            </div>
        );
    }
}
