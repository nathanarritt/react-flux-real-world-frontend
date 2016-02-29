import React, {Component, PropTypes} from 'react';

export default class Checkbox extends Component {

    static propTypes = {
        checkboxId: PropTypes.number,
        isChecked: PropTypes.bool,
        key: PropTypes.number,
        label: PropTypes.string,
        onAction: PropTypes.func.isRequired,
        withPadding: PropTypes.bool
    };

    constructor() {
        super();
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event) {
        const {onAction} = this.props;

        if (typeof onAction === 'function') {
            onAction(event);
        }
    }

    render() {
        const {checkboxId, isChecked, key, label, withPadding} = this.props;

        return (
            <div
                className={`checkbox-component ${withPadding ? 'with-padding' : ''}`}
                data-checkbox-id={checkboxId}
                key={key}
                onClick={this.handleClick}
            >
                <span className="checkbox-field">
                    {isChecked && <i className="fa fa-check" />}
                </span>
                {label && <span className="checkbox-label">{label}</span>}
            </div>
        );
    }
}
