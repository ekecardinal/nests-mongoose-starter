import * as nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: '**',
  port: 465,
  secure: true,
  auth: {
    user: '**',
    pass: '**',
  },
  tls: {
    rejectUnauthorized: false, // Useful for testing (not recommended for production)
  },
});
