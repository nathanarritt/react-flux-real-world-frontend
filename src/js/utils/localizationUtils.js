import _ from 'lodash';
import Globalize from 'globalize';

import caGregorian from 'cldr-data/main/en/ca-gregorian';
import currencies from 'cldr-data/main/en/currencies';
import dateFields from 'cldr-data/main/en/dateFields';
import numbers from 'cldr-data/main/en/numbers';
import timeZoneNames from 'cldr-data/main/en/timeZoneNames';

import currencyData from 'cldr-data/supplemental/currencyData';
import likelySubtags from 'cldr-data/supplemental/likelySubtags';
import plurals from 'cldr-data/supplemental/plurals';
import timeData from 'cldr-data/supplemental/timeData';
import weekData from 'cldr-data/supplemental/weekData';

import enUs from '../../json/localization/en-US';

// Before we can use Globalize, we need to feed it the appropriate I18n content (Unicode CLDR).
Globalize.load(
    caGregorian, currencies, dateFields, numbers, timeZoneNames,
    currencyData, likelySubtags, plurals, timeData, weekData
);

Globalize.loadMessages(enUs);

// Set "en" as our default locale.
Globalize.locale('en-US');

/**
 * @param {date} date The date needs to be localized and formatted
 * @param {object} options The options of date format
 * @return {string} Localized date in string format
 */
export function dateFormatter(date, options = {}) {
    try {
        return Globalize.dateFormatter(options)(date);
    } catch (error) {
        return date;
    }
}

/**
 * Localize keys into text strings.
 *
 * @param {string} message Key in localization file
 * @param {array} options Array of dynamic values used in translated text
 * @return {string} Localized text
 *
 * Example:
 *
 *     // The array index can be used in the translation text for dynamic values
 *     SELECTED_ITEMS,"Selected Items ({0})","Selected Items ({0})"
 *
 *     // An array with a single value at index 0 is passed to formatMessage as the second argument
 *     localizationUtils.formatMessage('SELECTED_ITEMS', [this.state.value ? this.state.value.length : 0])
 *
 *     // Result if this.state.value.length is 3
 *     Selected Items (3)
 *
 */
export function formatMessage(message, options = []) {
    try {
        return Globalize.formatMessage(message, options);
    } catch (error) {

        // message not found in loaded messages
        return message;
    }
}

/**
 * Convert localized object back to API formatted object.
 *
 * @param {object} value Object to convert.
 * @param {object} options Optional values.
 *     - idAttribute {string} Attribute from original object used as ID.
 *     - nameAttribute {string} Attribute from original object used as name.
 * @return {object} Object to send to the API.
 */
function getLocalizedObjectValue(value, options = {}) {

    const idAttribute = options.idAttribute || 'id';
    const nameAttribute = options.nameAttribute || 'name';

    // Set id back to original value unless it was null or undefined.
    if (idAttribute !== 'id') {

        value[idAttribute] = value.id;

        if (value.localizationUtilsId != null) { // eslint-disable-line no-eq-null
            value.id = value.localizationUtilsId;
        } else {
            delete value.id;
        }

        // Remove backup values from object before sending data to API.
        delete value.localizationUtilsId;

    }

    // Set name back to original value unless it was null or undefined.
    if (nameAttribute !== 'name') {

        value[nameAttribute] = value.name;

        if (value.localizationUtilsName != null) { // eslint-disable-line no-eq-null
            value.name = value.localizationUtilsName;
        } else {
            delete value.name;
        }

        // Remove backup value from object before sending data to API.
        delete value.localizationUtilsName;

    }

    return value;

}

export function getObjectArrayValue(value, options) {
    return _.map(value, item => {
        return getLocalizedObjectValue(item, options);
    });
}

export function getObjectValue(value, options) {
    return getLocalizedObjectValue(value, options);
}

export function getStringArrayValue(value) {
    return _.map(value, item => {
        return item.id;
    });
}

export function getStringValue(value) {
    return value ? value.id : value;
}

/**
 * Convert API formatted object to localized object.
 *
 * @param {object} value Object to convert.
 * @param {object} options Optional values.
 *     - idAttribute {string} Attribute from original object used as ID.
 *     - nameAttribute {string} Attribute from original object used as name.
 *     - skipTranslation {boolean} Skip localization for user entered data.
 * @return {object} Object with localized attribute values.
 */
function localizeObjectValue(value, options = {}) {

    const idAttribute = options.idAttribute || 'id';
    const nameAttribute = options.nameAttribute || 'name';
    const skipTranslation = !!options.skipTranslation;

    // Create a backup of the original id value and set id to the value needed in the UI
    if (idAttribute !== 'id') {
        value.localizationUtilsId = value.id;
        value.id = value[idAttribute];
    }

    // Create a backup of the original name value
    if (nameAttribute !== 'name') {
        value.localizationUtilsName = value.name;
    }

    // set name to the value needed in the UI
    if (skipTranslation) {
        value.name = value[nameAttribute];
    } else {
        value.name = formatMessage(value[nameAttribute]);
    }

    return value;
}

/**
 * Convert Value to localized object.
 *
 * @param {array|object|string} value Value to convert.
 * @param {object} options Optional values.
 *     - idAttribute {string} Attribute from original object used as ID (default: `id`).
 *     - nameAttribute {string} Attribute from original object used as name (default: `name`).
 *     - skipTranslation {boolean} Don't translate the name value for user entered data (just want object with id and name).
 * @return {object} Object with localized attribute values.
 */
export function localizeValue(value, options = {}) {

    // Do nothing if value is null or undefined (returns original value)
    if (value != null) { // eslint-disable-line no-eq-null
        const isNumberValue = typeof value === 'number';

        if (typeof value === 'string' || isNumberValue) {

            let name;

            if (options.skipTranslation || isNumberValue) {
                name = value;
            } else {
                name = formatMessage(value);
            }

            return {
                id: value,
                name
            };

        } else if (Array.isArray(value)) {

            if (typeof value[0] === 'string') {

                return _.map(value, item => {

                    let name;

                    if (options.skipTranslation) {
                        name = item;
                    } else {
                        name = formatMessage(item);
                    }

                    return {
                        id: item,
                        name
                    };
                });

            }

            // value is an array of objects
            return _.map(value, item => {
                return localizeObjectValue(item, options);
            });

        }

        // value is an object
        return localizeObjectValue(value, options);

    }

    return value;

}

export default {
    formatMessage,
    getObjectArrayValue,
    getObjectValue,
    getStringArrayValue,
    getStringValue,
    localizeValue
};
