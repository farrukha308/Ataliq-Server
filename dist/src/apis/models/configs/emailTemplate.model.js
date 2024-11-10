"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const constant_1 = __importDefault(require("../../../constant/constant"));
// Define the schema for the email template
const EmailTemplateSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true }, // Unique name for template
    fromEmail: { type: String, required: true }, // Unique name for template
    subject: { type: String, required: true }, // Subject of the email
    body: { type: String, required: true }, // Body content with placeholders
    placeholders: { type: [String], default: [] }, // List of placeholders, e.g., ['{{username}}', '{{resetLink}}']
    type: { type: String, required: true }, // Type of email (e.g., welcome, password reset)
    language: { type: String, required: true }, // Language code (e.g., 'en', 'es')
    isActive: { type: Boolean, default: true }, // Is this template active?
    createdAt: { type: Date, default: Date.now }, // Creation timestamp
    updatedAt: { type: Date, default: Date.now }, // Last updated timestamp
});
// Middleware to update `updatedAt` on modification
EmailTemplateSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});
// Create the model from the schema
const EmailTemplate = (0, mongoose_1.model)(constant_1.default.SCHEMA.EMAIL_TEMPLATE, EmailTemplateSchema);
exports.default = EmailTemplate;
// {
//   "data1": "qwejdfklsf1",
//   "schema": "EMAIL_TEMPLATE",
//     "data2": [{
//       "name": "SEND_PASSCODE",
//       "subject": "Your Pass Code",
//       "body": "<p>Dear {{username}},</p>\n<p>Your OTP code is: <strong>{{otpCode}}</strong></p>\n<p>This code will expire in {{expiryTime}} minutes.</p>\n<p>If you did not request this, please ignore this email.</p>",
//       "placeholders": ["username", "otpCode", "expiryTime"],
//       "type": "OTP",
//       "language": "en"
//     }]
// }
//# sourceMappingURL=emailTemplate.model.js.map