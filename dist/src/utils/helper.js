"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUndefinedOrEmpty = exports.valueExistsInObject = exports.validateArrayObject = exports.getRouteName = exports.getObject = void 0;
const getObject = (list, attribute, value, getAll = false) => {
    if (list === undefined)
        return null;
    let obj = list.filter((item) => String(item[attribute]) === String(value));
    if (obj === null || obj === undefined || obj.length === 0)
        return null;
    else
        return getAll ? obj : obj[0];
};
exports.getObject = getObject;
const getRouteName = (url) => {
    let arr = url.split('/');
    if (arr.includes('google') && arr.includes('auth'))
        return 'google';
    else if (arr.includes('linkedin') && arr.includes('auth'))
        return 'linkedin';
    else if (arr.includes('apple') && arr.includes('auth'))
        return 'apple';
    else
        return arr[arr.length - 1];
};
exports.getRouteName = getRouteName;
/**
 * Helper function to validate if the required attributes are present in an object.
 *
 * @param obj - The object to validate.
 * @param requiredAttributes - An array of strings representing the required attributes.
 * @returns An object with `valid` boolean and an `errors` array containing any validation errors.
 */
const validateArrayObject = (obj, requiredAttributes) => {
    const errors = [];
    // Loop through the required attributes and check if they exist in the object
    obj.forEach((object) => {
        requiredAttributes.map((attribute) => {
            if (object[attribute] === undefined || object[attribute] === null) {
                errors.push(`${attribute} is required in object.`);
            }
        });
    });
    // If no errors, the object is valid
    const isValid = errors.length === 0;
    return {
        valid: isValid,
        errors
    };
};
exports.validateArrayObject = validateArrayObject;
const valueExistsInObject = (obj, value) => {
    // Helper function to check value in object recursively
    const checkValue = (obj) => {
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (typeof obj[key] === 'object' && obj[key] !== null) {
                    // Recursively check nested objects
                    if (checkValue(obj[key])) {
                        return true;
                    }
                }
                else if (String(obj[key].toLowerCase()) === String(value.toLowerCase())) {
                    // If the value matches
                    return true;
                }
            }
        }
        return false;
    };
    return checkValue(obj);
};
exports.valueExistsInObject = valueExistsInObject;
const isUndefinedOrEmpty = (data) => {
    if (data === undefined || data === "" || data === null || data === "null")
        return true;
    else
        return false;
};
exports.isUndefinedOrEmpty = isUndefinedOrEmpty;
//# sourceMappingURL=helper.js.map