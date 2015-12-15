/*
 *
 * API/wrapper for localStorage
 * - simplifies the interface
 * - provides an isEnabled property to check if localStorage is supported
 * - automatically converts objects to strings for set and back to objects for get
 *
 * const storage = {
 *     clear() {},
 *     isEnabled: true,
 *     forEach(callback) {},
 *     get(key) {},
 *     getAll() {},
 *     remove(key) {},
 *     set(key, value) {}
 * };
 *
 */

const storage = {
    isEnabled: true
};

function deserialize(value) {
    if (typeof value !== 'string') {
        return undefined;
    }

    try {
        return JSON.parse(value);
    } catch (error) {
        return value || undefined;
    }
}

function serialize(value) {
    return JSON.stringify(value);
}

function isLocalStorageSupported() {
    try {
        return ('localStorage' in window && window.localStorage);
    } catch (error) {
        return false;
    }
}

let nativeStorage;

if (isLocalStorageSupported()) {
    nativeStorage = window.localStorage;

    storage.clear = () => {
        nativeStorage.clear();
    };

    storage.forEach = callback => {
        for (let i = 0; i < nativeStorage.length; i++) {
            const key = nativeStorage.key(i);
            callback(key, storage.get(key));
        }
    };

    storage.get = key => {
        return deserialize(nativeStorage.getItem(key));
    };

    storage.getAll = () => {
        const allData = {};

        storage.forEach((key, value) => {
            allData[key] = value;
        });

        return allData;
    };

    storage.remove = key => {
        nativeStorage.removeItem(key);
    };

    storage.set = (key, value) => {
        if (value === undefined) {
            return storage.remove(key);
        }

        nativeStorage.setItem(key, serialize(value));

        return value;
    };
}

try {
    const testKey = '__storagejs__';

    storage.set(testKey, testKey);

    if (storage.get(testKey) !== testKey) {
        storage.isEnabled = false;
    }

    storage.remove(testKey);
} catch (error) {
    storage.isEnabled = false;
}

export default storage;
