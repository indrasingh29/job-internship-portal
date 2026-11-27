const nodemailer = require('nodemailer');

// In-memory outbox used strictly when NODE_ENV === 'test' for automated verification
const testOutbox = [];

const isSmtpConfigured = () => {
  return Boolean(
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS
  );
};

const createTransporter = () => {
  if (isSmtpConfigured()) {
    const port = parseInt(process.env.SMTP_PORT, 10) || 587;
    const secure = process.env.SMTP_SECURE === 'true' || port === 465;

    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  // Non-production JSON transport so dev/test can run without external SMTP credentials
  return nodemailer.createTransport({
    jsonTransport: true
  });
};

/**
 * Send a password reset email via configured SMTP or non-production JSON transport.
 */
const sendPasswordResetEmail = async ({ to, name, resetUrl }) => {
  const fromAddress = process.env.EMAIL_FROM || process.env.SMTP_USER || 'no-reply@jobportal.local';
  const subject = 'Reset your JobPortal password';

  const html = `
    <div style="font-family: Inter, Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #0f172a; line-height: 1.6;">
      <h2 style="color: #6d28d9; margin-bottom: 12px;">Password Reset Request</h2>
      <p>Hi ${name || 'there'},</p>
      <p>We received a request to reset the password for your JobPortal account. Click the button below to choose a new password. This link is valid for <strong>15 minutes</strong> and can only be used once.</p>
      <p style="margin: 24px 0;">
        <a href="${resetUrl}" style="display: inline-block; background-color: #7c3aed; color: #ffffff; text-decoration: none; font-weight: 600; padding: 12px 24px; border-radius: 10px;">
          Reset Password
        </a>
      </p>
      <p style="font-size: 13px; color: #475569;">If the button does not work, copy and paste this link into your browser:</p>
      <p style="font-size: 13px; word-break: break-all; color: #4f46e5;">${resetUrl}</p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
      <p style="font-size: 12px; color: #64748b;">If you did not request a password reset, you can safely ignore this email.</p>
    </div>
  `;

  const text = `Hi ${name || 'there'},\n\nWe received a request to reset your JobPortal password. Use the link below within 15 minutes:\n${resetUrl}\n\nIf you did not request this, please ignore this email.`;

  if (process.env.NODE_ENV === 'production' && !isSmtpConfigured()) {
    throw new Error('SMTP email service is not configured.');
  }

  const transporter = createTransporter();
  const info = await transporter.sendMail({
    from: `"JobPortal" <${fromAddress}>`,
    to,
    subject,
    text,
    html
  });

  if (process.env.NODE_ENV === 'test') {
    testOutbox.push({ to, subject, resetUrl, timestamp: new Date().toISOString() });
  } else if (!isSmtpConfigured() && process.env.NODE_ENV === 'development') {
    console.info(`[Email] SMTP not configured; password reset email prepared for ${to}.`);
    console.info(`[Email Dev Link] ${resetUrl}`);
  }

  return info;
};

const getLastTestEmail = () => {
  if (process.env.NODE_ENV !== 'test') return null;
  return testOutbox.length > 0 ? testOutbox[testOutbox.length - 1] : null;
};

const clearTestOutbox = () => {
  if (process.env.NODE_ENV === 'test') {
    testOutbox.length = 0;
  }
};

module.exports = {
  sendPasswordResetEmail,
  isSmtpConfigured,
  getLastTestEmail,
  clearTestOutbox
};
