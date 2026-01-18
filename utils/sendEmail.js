import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  // 1) create transporter ('gmail', 'Mailgun', 'SendGrid')
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  })
  // 2) email options (from, to, subject, text...)
  const mailOptions = {
    from: `E-Shop Ecommerce <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  }
  // 3) send email to user
  await transporter.sendMail(mailOptions);
}

export default sendEmail;
