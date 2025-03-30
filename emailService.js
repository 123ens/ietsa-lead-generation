const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async sendEmail(to, subject, html) {
    try {
      await this.transporter.sendMail({
        from: `"EITSA" <${process.env.SMTP_FROM}>`,
        to,
        subject: `[EITSA] ${subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 5px;">
              <h1 style="color: #2c3e50; margin-bottom: 20px;">EITSA</h1>
              ${html}
            </div>
            <div style="text-align: center; margin-top: 20px; color: #6c757d; font-size: 12px;">
              <p>This is an automated message from EITSA. Please do not reply to this email.</p>
            </div>
          </div>
        `
      });
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  async sendVerificationEmail(user, token) {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    const html = `
      <h2 style="color: #2c3e50;">Welcome to EITSA!</h2>
      <p>Hello ${user.firstName},</p>
      <p>Thank you for joining EITSA. Please verify your email address by clicking the button below:</p>
      <div style="text-align: center; margin: 20px 0;">
        <a href="${verificationUrl}" 
           style="background-color: #3498db; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Verify Email Address
        </a>
      </div>
      <p>Or copy and paste this link in your browser:</p>
      <p style="word-break: break-all;">${verificationUrl}</p>
      <p>This link will expire in 24 hours.</p>
      <p>If you didn't create an account with EITSA, please ignore this email.</p>
    `;

    await this.sendEmail(user.email, 'Verify Your Email', html);
  }

  async sendPasswordResetEmail(user, token) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    const html = `
      <h2 style="color: #2c3e50;">Password Reset Request</h2>
      <p>Hello ${user.firstName},</p>
      <p>You requested to reset your EITSA account password. Click the button below to proceed:</p>
      <div style="text-align: center; margin: 20px 0;">
        <a href="${resetUrl}" 
           style="background-color: #3498db; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Reset Password
        </a>
      </div>
      <p>Or copy and paste this link in your browser:</p>
      <p style="word-break: break-all;">${resetUrl}</p>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this password reset, please ignore this email.</p>
    `;

    await this.sendEmail(user.email, 'Password Reset Request', html);
  }

  async sendPasswordChangedEmail(user) {
    const html = `
      <h2 style="color: #2c3e50;">Password Changed Successfully</h2>
      <p>Hello ${user.firstName},</p>
      <p>Your EITSA account password has been successfully changed.</p>
      <p>If you didn't make this change, please contact EITSA support immediately.</p>
    `;

    await this.sendEmail(user.email, 'Password Changed', html);
  }

  async sendNewLoginEmail(user, device, ip) {
    const html = `
      <h2 style="color: #2c3e50;">New Login Detected</h2>
      <p>Hello ${user.firstName},</p>
      <p>A new login was detected on your EITSA account:</p>
      <ul style="list-style: none; padding: 0;">
        <li style="margin: 10px 0;"><strong>Device:</strong> ${device}</li>
        <li style="margin: 10px 0;"><strong>IP Address:</strong> ${ip}</li>
        <li style="margin: 10px 0;"><strong>Time:</strong> ${new Date().toLocaleString()}</li>
      </ul>
      <p>If this wasn't you, please contact EITSA support immediately.</p>
    `;

    await this.sendEmail(user.email, 'New Login Detected', html);
  }
}

module.exports = new EmailService(); 