import _ from 'lodash';

import {localizeValue} from './localizationUtils';

// Returns a new array of collection data without the deleted model object.
export function deleteModel(collection, id) {
    return _.reject(collection, model => {
        return model.id === id;
    });
}

function setBooleanTextAttributes(booleanTextAttributes, model) {
    _.each(booleanTextAttributes, data => {
        const attribute = data.attribute;

        if (typeof model[attribute] === 'boolean') {
            model[attribute] = localizeValue(data[model[attribute]]);
        }
    });
}

function setInverseBooleanAttributes(inverseBooleanAttributes, model) {
    _.each(inverseBooleanAttributes, attribute => {
        if (typeof model[attribute] === 'boolean') {
            model[attribute] = !model[attribute];
        }
    });
}

function setLocalizeAttributes(localizeAttributes, model) {
    _.each(localizeAttributes, data => {
        let attribute;
        let localizeOptions;

        if (typeof data === 'string') {
            attribute = data;
        } else {
            attribute = data.attribute;
            localizeOptions = _.omit(data, 'attribute');
        }

        model[attribute] = localizeValue(model[attribute], localizeOptions);
    });
}

function setSortAttributes(sortAttributes, model) {
    _.each(sortAttributes, sortItem => {
        let attribute;
        let sortByAttribute = 'name';

        if (typeof sortItem === 'string') {
            attribute = sortItem;
        } else {
            attribute = sortItem.attribute;
            sortByAttribute = sortItem.sortByAttribute || sortByAttribute;
        }

        model[attribute] = _.sortBy(model[attribute], data => {
            if (typeof data === 'number') {
                return data;
            }

            if (typeof data === 'string') {
                return data.toLowerCase();
            }

            // assumes `data` is an object with attributes
            return data[sortByAttribute].toLowerCase();
        });
    });
}

/**
 * Convert model data returned from an API into a data structure needed in the UI.
 *
 * Specify model attributes that need to be an object with `id` and `name`
 * properties using the localizeAttributes option.
 *
 * Specify model attributes that are array values which need to be sorted using
 * the sortAttributes option.
 *
 * @param {object} model Data object returned from API.
 * @param {object} options Attributes to specify how the data needs to change.
 *     - booleanTextAttributes {array} Converts a boolean value to a text value.
 *       Array of objects with three attributes: `attribute` to specify
 *       which model attribute to modify, `true` and `false` to specify the
 *       text for each possible boolean value.
 *     - inverseBooleanAttributes {array} Array of attributes to convert.
 *     - localizeAttributes {array} Array of strings if no special options need
 *       to be set for localizationUtils.localizeValue. Otherwise, an array
 *       of objects with an `attribute` property and the necessary options.
 *     - nameAttribute {string} For model objects that don't have a `name`
 *       attribute, specify the attribute to be used as `name` attribute in
 *       components requiring an `id` and `name`.
 *     - sortAttributes {array} Array of strings if sortByAttribute is default
 *       of `name`. If a different sortByAttribute needs to be specified for
 *       the sort, an array of objects with `attribute` and `sortByAttribute`
 *       properties.
 * @return {object} Model converted to UI appropriate data.
 *
 */
export function parseModel(model, options = {}) {
    const {
        booleanTextAttributes, inverseBooleanAttributes, localizeAttributes,
        nameAttribute, sortAttributes
    } = options;

    if (nameAttribute) {

        // assumes model does not already have a `name` attribute
        model.name = model[nameAttribute];
    }

    if (booleanTextAttributes) {
        setBooleanTextAttributes(booleanTextAttributes, model);
    }

    if (inverseBooleanAttributes) {
        setInverseBooleanAttributes(inverseBooleanAttributes, model);
    }

    if (localizeAttributes) {
        setLocalizeAttributes(localizeAttributes, model);
    }

    if (sortAttributes) {
        setSortAttributes(sortAttributes, model);
    }

    return model;
}

// Returns a new array of collection data with parsed model objects.
export function parseCollection(collection, options = {}) {
    return _.map(collection, model => {
        return parseModel(model, options);
    });
}

// Returns a new array of collection data with sorted models.
export function sortCollection(collection, options = {}) {
    const sortByAttribute = options.sortByAttribute || 'name';

    return _.sortBy(collection, model => {
        if (typeof model === 'number') {
            return model;
        }

        if (typeof model === 'string') {
            return model.toLowerCase();
        }

        const value = model[sortByAttribute];

        if (typeof value === 'number') {
            return value;
        }

        if (typeof value === 'string') {
            return value.toLowerCase();
        }

        // assumes `value` is an entity object with a `name` attribute
        if (typeof value.name === 'number') {
            return value.name;
        }

        // assumes `value` is an entity object with a `name` attribute
        return value.name.toLowerCase();
    });
}

// Returns a new array of collection data with an updated (new) model object at index.
export function updateModel(collection, data) {
    let clone = [...collection];

    let index = _.findIndex(clone, model => {
        return model.id === data.id;
    });

    clone[index] = data;

    return clone;
}

export function parseGeneratedData(data, excludes = []) {
    return localizeValue(_.without(...[_.keys(data)].concat(excludes)));
}

export function sortGeneratedData(data, sortByAttribute = 'name') {
    return _.sortBy(data, item => {
        return item[sortByAttribute].toLowerCase();
    });
}

export default {
    deleteModel,
    parseModel,
    parseCollection,
    sortCollection,
    updateModel,
    parseGeneratedData,
    sortGeneratedData
};
