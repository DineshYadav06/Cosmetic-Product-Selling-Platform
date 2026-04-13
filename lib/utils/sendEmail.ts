import nodemailer from 'nodemailer';

export async function sendEmail({ to, subject, html }: { to: string, subject: string, html: string }) {
  // Using the exact variables provided in the .env file: ID and SECERT
  const user = process.env.ID;
  const pass = process.env.SECERT;

  if (!user || !pass) {
    console.warn("⚠️ Email credentials (ID and SECERT) are missing in .env. Email skipped.");
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Standard for Gmail
      auth: {
        user,
        pass,
      },
    });

    const info = await transporter.sendMail({
      from: `"GLOWMART Luxury" <${user}>`,
      to,
      subject,
      html,
    });

    console.log("Message sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}
