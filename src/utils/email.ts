import { IEmailTemplate } from '../apis/models/configs/emailTemplate.model';
import { auditLog } from './logger';
import nodemailer from 'nodemailer';

// Fill template with dynamic values
const fillValues = (template: string, values: Record<string, string>): string => {
  return template.replace(/{{(.*?)}}/g, (_, key) => {
    return values[key] || `{{${key}}}`; // Replace with the corresponding value, or keep the placeholder if the key is missing
  });
};

// Email sending function with audit logs
const sendEmail = async (
  to: string,               // recipient's email
  template: IEmailTemplate,         // email template with placeholders
  dynamicValues: Record<string, string> // values to replace placeholders
) => {
  try {
    // Log the attempt to fill the email template with dynamic values
    auditLog(`Attempting to fill template with dynamic values for ${to}`);

    // Fill template with dynamic values
    const emailContent = fillValues(template?.body, dynamicValues);

    // Log the success of template filling
    auditLog(`Template filled successfully for ${to}`);

    // Create a transporter using your SMTP settings
    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.example.com', // Your SMTP host (e.g., Gmail, SendGrid)
      port: parseInt(process.env.SMTP_PORT || '587'),    // SMTP port
      secure: false,                                    // Use TLS (for secure connections)
      auth: {
        user: process.env.SMTP_USER || 'your-email@example.com', // Your SMTP user
        pass: process.env.SMTP_PASS || 'your-email-password',    // Your SMTP password
      },
    });

    // Log the attempt to send the email
    
    let emailObj = {
      from: template?.fromEmail || 'no-reply@example.com',  // Sender address
      to: to,                                                 // Receiver address
      subject: template?.subject,                                       // Email subject
      html: emailContent,                                     // HTML body content (filled template)
    }
    
    auditLog(`Attempting to send email to ${to} with subject "${JSON.stringify(emailObj)}"`);
    // Send email
    let info = await transporter.sendMail(emailObj);

    // Log the successful sending of the email
    auditLog(`Email sent successfully to ${to}. Message ID: ${info.messageId}`);

    return { status: 'success', message: 'Email sent successfully' };
  } catch (error: any) {
    // Log the error during email sending
    auditLog(`Error sending email to ${to}: ${error.message}`);

    return { status: 'fail', message: 'Failed to send email' };
  }
};

export default sendEmail
