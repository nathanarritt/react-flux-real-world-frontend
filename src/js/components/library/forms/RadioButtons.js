import React, {Component, PropTypes} from 'react';
import {formatMessage} from '../../../utils/localizationUtils';

export default class RadioButtons extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.value
        };
    }

    handleClick(id, name) {
        const value = this.state.value;
        const {action, attribute} = this.props;

        if (id !== value.id) {
            const newValue = {
                id,
                name
            };

            this.setState({
                value: newValue
            });

            action({
                attribute,
                value: newValue
            });
        }
    }

    render() {
        const value = this.state.value;

        const options = this.props.options;
        const buttonLength = options.length;

        const buttons = options.map((button, index) => {
            const isFirst = index === 0;
            const isLast = index === (buttonLength - 1);

            let position = 'middle';

            if (isFirst) {
                position = 'first';
            } else if (isLast) {
                position = 'last';
            }

            const isSelected = button === value.id;

            const id = button;
            const name = formatMessage(button);

            return (
                <span className={`radio-button-item ${position} ${isSelected ? 'selected' : ''}`}
                      key={index}
                      onClick={this.handleClick.bind(this, id, name)}>
                    {isSelected && <i className="fa fa-check-circle" />}
                    <span>{name}</span>
                </span>
            );
        });

        return (
            <div className="radio-button-component">
                {buttons}
            </div>
        );
    }
}

RadioButtons.propTypes = {
    action: PropTypes.func.isRequired,
    attribute: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    value: PropTypes.object.isRequired
};
