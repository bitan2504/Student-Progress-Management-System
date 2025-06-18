import dotenv from 'dotenv';
dotenv.config();
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export default async function sendEmail({ to, subject, text, html }) {
    try {
        const info = await transporter.sendMail({
            from: `"No Reply" <${process.env.SMTP_USER}>`, // sender address
            to,
            subject,
            text,
            html,
        });
        console.log('Message sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}