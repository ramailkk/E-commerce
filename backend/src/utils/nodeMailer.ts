import nodemailer, { Transporter } from "nodemailer";

// Define transporter with Mailtrap SMTP settings
const transporter: Transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "73a6ab85b669df",
    pass: "cbe0c721302a8a",
  },
});

// Define the function with proper TypeScript types
export default async function sendEmail(
  to: string,
  subject: string,
  text: string,
): Promise<boolean> {
  try {
    const mailOptions = {
      from: "AUTH_SYSTEM@example.com",
      to,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
    return true; // Email sent successfully
  } catch (error) {
    console.error("Error sending email:", error);
    return false; // Email sending failed
  }
}
