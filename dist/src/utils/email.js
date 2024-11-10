"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./logger");
const nodemailer_1 = __importDefault(require("nodemailer"));
// Fill template with dynamic values
const fillValues = (template, values) => {
    return template.replace(/{{(.*?)}}/g, (_, key) => {
        return values[key] || `{{${key}}}`; // Replace with the corresponding value, or keep the placeholder if the key is missing
    });
};
// Email sending function with audit logs
const sendEmail = (to, // recipient's email
template, // email template with placeholders
dynamicValues // values to replace placeholders
) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Log the attempt to fill the email template with dynamic values
        (0, logger_1.auditLog)(`Attempting to fill template with dynamic values for ${to}`);
        // Fill template with dynamic values
        const emailContent = fillValues(template === null || template === void 0 ? void 0 : template.body, dynamicValues);
        // Log the success of template filling
        (0, logger_1.auditLog)(`Template filled successfully for ${to}`);
        // Create a transporter using your SMTP settings
        let transporter = nodemailer_1.default.createTransport({
            host: process.env.SMTP_HOST || 'smtp.example.com', // Your SMTP host (e.g., Gmail, SendGrid)
            port: parseInt(process.env.SMTP_PORT || '587'), // SMTP port
            secure: false, // Use TLS (for secure connections)
            auth: {
                user: process.env.SMTP_USER || 'your-email@example.com', // Your SMTP user
                pass: process.env.SMTP_PASS || 'your-email-password', // Your SMTP password
            },
        });
        // Log the attempt to send the email
        let emailObj = {
            from: (template === null || template === void 0 ? void 0 : template.fromEmail) || 'no-reply@example.com', // Sender address
            to: to, // Receiver address
            subject: template === null || template === void 0 ? void 0 : template.subject, // Email subject
            html: emailContent, // HTML body content (filled template)
        };
        (0, logger_1.auditLog)(`Attempting to send email to ${to} with subject "${JSON.stringify(emailObj)}"`);
        // Send email
        let info = yield transporter.sendMail(emailObj);
        // Log the successful sending of the email
        (0, logger_1.auditLog)(`Email sent successfully to ${to}. Message ID: ${info.messageId}`);
        return { status: 'success', message: 'Email sent successfully' };
    }
    catch (error) {
        // Log the error during email sending
        (0, logger_1.auditLog)(`Error sending email to ${to}: ${error.message}`);
        return { status: 'fail', message: 'Failed to send email' };
    }
});
exports.default = sendEmail;
//# sourceMappingURL=email.js.map