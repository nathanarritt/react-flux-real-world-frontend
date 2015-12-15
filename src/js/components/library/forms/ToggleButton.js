import React, {Component, PropTypes} from 'react';

export default class ToggleButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.value
        };
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

        return (
            <div className={`toggle-button-component ${value ? 'on' : 'off'}`}
                 onClick={this.handleClick.bind(this)}>
                <div className="toggle-button-switch" />
                <div className="toggle-button-icon">
                    <i className={`fa fa-${value ? 'check' : 'times'}`} />
                </div>
            </div>
        );
    }
}

ToggleButton.propTypes = {
    action: PropTypes.func.isRequired,
    attribute: PropTypes.string,
    value: PropTypes.bool.isRequired
};
