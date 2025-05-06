// const nodemailer = require('nodemailer');
// const config = require('../config/config');

// Create reusable transporter
// const transporter = nodemailer.createTransport({
//     host: config.SMTP_HOST,
//     port: config.SMTP_PORT,
//     secure: config.SMTP_PORT === 465,
//     auth: {
//         user: config.SMTP_USER,
//         pass: config.SMTP_PASS
//     }
// });

// Verify transporter configuration
// transporter.verify((error, success) => {
//     if (error) {
//         console.error('SMTP configuration error:', error);
//     } else {
//         console.log('SMTP server is ready to send emails');
//     }
// });

// Email templates
const templates = {
    verification: (verificationUrl) => ({
        subject: 'Verify your email address',
        html: `
            <h1>Welcome to Momentum!</h1>
            <p>Please click the link below to verify your email address:</p>
            <a href="${verificationUrl}">${verificationUrl}</a>
            <p>This link will expire in 24 hours.</p>
            <p>If you didn't create an account, you can safely ignore this email.</p>
        `
    }),
    passwordReset: (resetUrl) => ({
        subject: 'Reset your password',
        html: `
            <h1>Password Reset Request</h1>
            <p>You requested to reset your password. Click the link below to proceed:</p>
            <a href="${resetUrl}">${resetUrl}</a>
            <p>This link will expire in 10 minutes.</p>
            <p>If you didn't request a password reset, you can safely ignore this email.</p>
        `
    })
};

// Send email function
const sendEmail = async ({ to, subject, text, html, template, templateData }) => {
    // try {
    //     let emailContent = { to, subject, text, html };

    //     // Use template if specified
    //     if (template && templates[template]) {
    //         const templateContent = templates[template](templateData);
    //         emailContent = {
    //             ...emailContent,
    //             subject: templateContent.subject,
    //             html: templateContent.html
    //         };
    //     }

    //     // Send email
    //     // const info = await transporter.sendMail(emailContent);
    //     console.log('Email sent:', info.messageId);
    //     return info;
    // } catch (error) {
    //     console.error('Error sending email:', error);
    //     throw new Error('Failed to send email');
    // }
};

module.exports = {
    sendEmail
}


