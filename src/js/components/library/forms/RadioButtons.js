import React, {Component, PropTypes} from 'react';
import {formatMessage} from '../../../utils/localizationUtils';

class RadioButton extends Component {
    constructor() {
        super();
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        const {id, name, onAction} = this.props;

        if (typeof onAction === 'function') {
            onAction(id, name);
        }
    }

    render() {
        const {isSelected, name, position} = this.props;

        return (
            <span
                className={`radio-button-item ${position} ${isSelected ? 'selected' : ''}`}
                onClick={this.handleClick}
            >
                {isSelected && <i className="fa fa-check-circle" />}
                <span>{name}</span>
            </span>
        );
    }
}

RadioButton.propTypes = {
    id: PropTypes.string.isRequired,
    isSelected: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    onAction: PropTypes.func.isRequired,
    position: PropTypes.string.isRequired
};

export default class RadioButtons extends Component {

    static propTypes = {
        action: PropTypes.func.isRequired,
        attribute: PropTypes.string.isRequired,
        options: PropTypes.arrayOf(PropTypes.string).isRequired,
        value: PropTypes.shape({
            id: PropTypes.oneOfType([
                PropTypes.number,
                PropTypes.string
            ]),
            name: PropTypes.string
        }).isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            value: props.value
        };
        this.handleClick = this.handleClick.bind(this);
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
            const isLast = index === buttonLength - 1;

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
                <RadioButton
                    id={id}
                    isSelected={isSelected}
                    key={index}
                    name={name}
                    onAction={this.handleClick}
                    position={position}
                />
            );
        });

        return (
            <div className="radio-button-component">
                {buttons}
            </div>
        );
    }
}
