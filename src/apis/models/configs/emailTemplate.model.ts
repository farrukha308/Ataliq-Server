import { Schema, model, Document } from 'mongoose';
import CONSTANT from '../../../constant/constant';

// Define the interface for the email template
export interface IEmailTemplate extends Document {
  name: string;             // Unique name for the template
  fromEmail: string;
  subject: string;          // Subject of the email
  body: string;             // Body/content of the email (can include placeholders)
  placeholders?: string[];  // Optional: Placeholders for dynamic values (e.g., {{username}})
  type: string;             // Type of email (e.g., 'welcome', 'reset_password')
  language: string;         // Language code (e.g., 'en', 'fr')
  isActive: boolean;        // Whether the template is active or not
  createdAt: Date;          // Timestamp when the template was created
  updatedAt: Date;          // Timestamp when the template was last updated
}

// Define the schema for the email template
const EmailTemplateSchema = new Schema<IEmailTemplate>({
  name: { type: String, required: true, unique: true },  // Unique name for template
  fromEmail: { type: String, required: true },  // Unique name for template
  subject: { type: String, required: true },             // Subject of the email
  body: { type: String, required: true },                // Body content with placeholders
  placeholders: { type: [String], default: [] },         // List of placeholders, e.g., ['{{username}}', '{{resetLink}}']
  type: { type: String, required: true },                // Type of email (e.g., welcome, password reset)
  language: { type: String, required: true },            // Language code (e.g., 'en', 'es')
  isActive: { type: Boolean, default: true },            // Is this template active?
  createdAt: { type: Date, default: Date.now },          // Creation timestamp
  updatedAt: { type: Date, default: Date.now },          // Last updated timestamp
});

// Middleware to update `updatedAt` on modification
EmailTemplateSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Create the model from the schema
const EmailTemplate = model<IEmailTemplate>(CONSTANT.SCHEMA.EMAIL_TEMPLATE, EmailTemplateSchema);

export default EmailTemplate;

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
