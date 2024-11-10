"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEmptyObject = exports.toTitleCase = exports.passwordRegex = exports.emailRegex = exports.phoneRegex = void 0;
const phoneRegex = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
exports.phoneRegex = phoneRegex;
const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
exports.emailRegex = emailRegex;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
exports.passwordRegex = passwordRegex;
const toTitleCase = (str) => {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};
exports.toTitleCase = toTitleCase;
const isEmptyObject = (obj) => {
    for (const prop in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, prop)) {
            return false;
        }
    }
    return true;
};
exports.isEmptyObject = isEmptyObject;
//# sourceMappingURL=regex.js.map