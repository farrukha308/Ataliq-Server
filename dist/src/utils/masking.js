"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maskPhoneNumber = exports.maskEmail = void 0;
const maskEmail = (email) => {
    const [user, domain] = email.split('@');
    const maskedUser = user[0] + '*'.repeat(user.length - 2) + user.slice(-1);
    return `${maskedUser}@${domain}`;
};
exports.maskEmail = maskEmail;
const maskPhoneNumber = (phoneNumber, visibleDigits = 4) => {
    // Remove any non-numeric characters (optional)
    const sanitizedNumber = phoneNumber.replace(/\D/g, '');
    // Calculate the number of asterisks needed
    const maskedSectionLength = sanitizedNumber.length - visibleDigits;
    // If the phone number is too short, return as is
    if (maskedSectionLength <= 0) {
        return sanitizedNumber;
    }
    // Create the masked section (all asterisks)
    const maskedSection = '*'.repeat(maskedSectionLength);
    // Take the last `visibleDigits` from the phone number
    const visibleSection = sanitizedNumber.slice(-visibleDigits);
    // Combine the masked and visible sections
    return maskedSection + visibleSection;
};
exports.maskPhoneNumber = maskPhoneNumber;
//# sourceMappingURL=masking.js.map