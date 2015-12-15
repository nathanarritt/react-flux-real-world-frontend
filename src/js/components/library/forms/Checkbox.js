import React, {Component, PropTypes} from 'react';

export default class Checkbox extends Component {
    render() {
        return (
            <div className={`checkbox-component ${this.props.withPadding ? 'with-padding' : ''}`}
                 key={this.props.key}
                 onClick={this.props.action}>
                <span className="checkbox-field">
                    {this.props.isChecked && <i className="fa fa-check" />}
                </span>
                {this.props.label && <span className="checkbox-label">{this.props.label}</span>}
            </div>
        );
    }
}

Checkbox.propTypes = {
    action: PropTypes.func.isRequired,
    isChecked: PropTypes.bool,
    key: PropTypes.number,
    label: PropTypes.string,
    withPadding: PropTypes.bool
};
