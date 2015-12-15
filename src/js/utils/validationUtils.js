import _ from 'lodash';

import {formatMessage} from './localizationUtils';

// Regular expressions are pre-compiled here for performance.
const patterns = {
    ipAddress: /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/,

    ipAddressCidr: /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(\/([1-2]\d|3[0-2]|\d)){0,1}$/,

    ipAddressRange: /^((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))[\s]*-[\s]*((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))$/
};

function notRequired(val) {
    return val == null || Array.isArray(val) || val === ''; // eslint-disable-line no-eq-null
}

// Matches the validator name and any parameters (if specified).
const validatorRegex = /(\w+)(?:\(([^\)]+)\)?)?/;

const validators = {

    // Checks if the string value is a valid IP address
    ipAddress(val) {
        if (notRequired(val) || (this.string(val) === '' && patterns.ipAddress.test(val) === true)) {
            return '';
        }
        return 'VALIDATION_ERROR_INVALID_IP_ADDRESS_ONLY';
    },

    // Checks if the string value is a valid IP address CIDR block
    ipAddressCidr(val) {
        if (notRequired(val) ||
            (this.string(val) === '' &&
             ((patterns.ipAddressCidr.test(val) === true)))) {
            return '';
        }
        return 'VALIDATION_ERROR_INVALID_IP_ADDRESS_CIDR';
    },

    // Checks if the string value is a valid IP address, IP address range, or IP address CIDR block
    ipAddressAny(val) {
        if (notRequired(val) ||
            (this.string(val) === '' &&
             ((patterns.ipAddressCidr.test(val) === true) || (patterns.ipAddressRange.test(val) === true)))) {
            return '';
        }
        return 'VALIDATION_ERROR_INVALID_IP_ADDRESS';
    },

    required(val, message = 'VALIDATION_ERROR_REQUIRED') {
        if (val == null) { // eslint-disable-line no-eq-null
            return message;
        } else if (typeof val === 'string' && val.trim().length === 0) {
            return message;
        } else if (Array.isArray(val) && val.length === 0) {
            return message;
        }
        return '';
    },

    // Calls required if condition is met.
    requiredIf(val, condition, message) {
        if (condition) {
            if (typeof condition === 'function') {
                if (condition()) {
                    return this.required(val, message);
                }
                return '';
            }

            return this.required(val, message);
        }
        return '';
    },

    // Checks if the value is a string.
    string(val) {
        if (notRequired(val) || typeof val === 'string') {
            return '';
        }
        return 'VALIDATION_ERROR_STRING';
    }
};

function parseValidations(validations) {
    const temp = {};

    _.each(validations, (validation, attrName) => {
        const attrValidations = validation.split(/\b\)?\s+\b/);
        const validationFuncs = [];

        _.each(attrValidations, attrValidation => {
            const matches = validatorRegex.exec(attrValidation);

            if (matches) {
                const validationName = matches[1];
                let validationArgs = [];

                if (matches[2]) {
                    validationArgs = matches[2].split(/\s*,\s*/);
                }

                validationFuncs.push((value, model) => {
                    const interpolatedValidationArgs = _.map(validationArgs, validationArg => {
                        if (_.has(model, validationArg)) {
                            return model[validationArg];
                        } else if (this[validationArg]) {
                            if (typeof this[validationArg] === 'function') {
                                return this[validationArg].bind(this);
                            }

                            return this[validationArg];
                        }

                        return validationArg;
                    });

                    let validatorFunc;
                    let validatorFuncScope;

                    if (typeof this[validationName] === 'function') {
                        validatorFunc = this[validationName];
                        validatorFuncScope = this;
                    } else {
                        validatorFunc = validators[validationName];
                        validatorFuncScope = validators;
                    }

                    let message = validatorFunc.apply(
                        validatorFuncScope,
                        [value].concat(interpolatedValidationArgs)
                    );

                    if (message === '' && Array.isArray(value)) {
                        const errors = [];
                        let elemValue;
                        let error;

                        for (let i = 0, len = value.length; i < len; i++) {
                            elemValue = value[i];

                            error = validatorFunc.apply(validatorFuncScope,
                                [elemValue].concat(interpolatedValidationArgs));

                            if (error !== '') {
                                errors.push({
                                    index: i,
                                    value: elemValue,
                                    message: error
                                });
                            }
                        }

                        if (errors.length > 0) {
                            message = errors;
                        } else {
                            message = '';
                        }
                    }

                    return message;
                });
            }
        });

        temp[attrName] = (value, model) => {
            let message;
            let validationFunc;

            for (let i = 0, len = validationFuncs.length; i < len; i++) {
                validationFunc = validationFuncs[i];
                message = validationFunc.call(this, value, model);

                if (message !== '') {
                    return message;
                }
            }

            return message;
        };
    });

    return temp;
}

function getErrorStatus() {
    return _.keys(this.validate.errorAttributes).length > 0;
}

function validateValue(model, attribute) {
    let message = this.validate.validations[attribute](
        model[attribute], model
    );

    if (message !== '') {
        message = formatMessage(message);
        this.validate.errorAttributes[attribute] = true;
        this.validate.hasError = true;
    } else {
        delete this.validate.errorAttributes[attribute];

        if (this.validate.hasError) {
            this.validate.hasError = getErrorStatus.call(this);
        }
    }

    return message;
}

function validateAllValues(model) {
    const errors = {};

    _.forOwn(model, (value, attribute) => {
        errors[attribute] = validate.call(this, model, attribute); // eslint-disable-line block-scoped-var
    });

    return errors;
}

/**
 * Validate form field values
 *
 * @param {object} model (required) Model object containing the form field
 *     values entered by the user. To validate all values of a model object, pass the model object with no
 *     `attribute` argument. Otherwise, only the value of the `attribute` will
 *     be validated.
 * @param {string} attribute Specifies a single attribute value to be validated.
 * @return {undefined} No return value needed
 *
 */
function validate(model, attribute) {
    if (model && typeof model === 'object' && !Array.isArray(model) &&
        typeof model !== 'function') {

        // Validate the value of a single attribute.
        if (typeof attribute === 'string') {
            if (typeof this.validate.validations[attribute] !== 'function') {
                return '';
            }

            return validateValue.call(this, model, attribute);
        }

        return validateAllValues.call(this, model);
    }

    const errorMessage = `Invalid model value provided to 'validate' method used in ${this.constructor.name}.`;
    throw new Error(errorMessage);
}

/**
 * Bind validations to an instance object
 *
 * @param {object} validations (required) Map of name:value pairs. The name is
 *     a model attribute. The value can be a string declaration of space
 *     separated standard `validators` methods or a custom function to test the
 *     model attribute value.
 * @param {object} context (required) Instance object receiving validation
 *     functionality.
 * @return {undefined} No return value needed
 *
 */
export function bindValidations(validations, context) {
    if (context && typeof context === 'object') {
        if (context.validate !== undefined) {
            const errorMessage = `Cannot bindValidations to ${context.constructor.name} because it already has a 'validate' property.`;
            throw new Error(errorMessage);
        }
        context.validate = validate;
        context.validate.validations = parseValidations.call(context, validations);
        context.validate.hasError = false;
        context.validate.errorAttributes = {};
    } else {
        const errorMessage = "Invalid 'context' argument provided for bindValidations."; // eslint-disable-line quotes
        throw new Error(errorMessage);
    }
}

export default {
    bindValidations
};
