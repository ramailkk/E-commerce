import nodemailer, { Transporter } from "nodemailer";
import dotenv from "dotenv";
dotenv.config();


// Configure the transporter using environment variables
const transporter: Transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: parseInt(process.env.MAIL_PORT || "587"),
  auth: {
    // dont forget to chnage name FROM USER-> USERNAME AND PASS-> PASSWORD
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

// Send email utility
export default async function sendEmail(
  to: string,
  subject: string,
  text: string,
): Promise<boolean> {
  try {
    const mailOptions = {
      from: process.env.MAIL_USERNAME,
      to,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}
