import React, {Component, PropTypes} from 'react';

import {formatMessage} from '../../../utils/localizationUtils';

export default class ArrayTextarea extends Component {
    handleAction() {}

    render() {
        const {
            action, attribute, defaultAction, id, placeholder, textareaValue
        } = this.props;

        return (
            <textarea
                id={id}
                name={attribute}
                onChange={action || defaultAction}
                placeholder={formatMessage(placeholder)}
                value={textareaValue} />
        );
    }
}

ArrayTextarea.propTypes = {
    action: PropTypes.func,
    attribute: PropTypes.string.isRequired,
    defaultAction: PropTypes.func,
    id: PropTypes.string,
    placeholder: PropTypes.string,
    textareaValue: PropTypes.array
};
