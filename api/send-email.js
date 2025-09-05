import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { name, email, subject, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_EMAIL,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const mailToAlphaGlory = {
    from: `"${name}" <${process.env.GMAIL_EMAIL}>`,
    to: process.env.TO_EMAIL,
    replyTo: email,
    subject: `New Contact Form Message: ${subject}`,
    html: `
      <div style="font-family: sans-serif; line-height: 1.6;">
        <h2>New Message from Alpha Glory Website</h2>
        <p>You have received a new message through your website's contact form.</p>
        <hr>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Subject:</strong> ${subject}</p>
        <h3>Message:</h3>
        <p style="background-color: #f4f4f4; padding: 15px; border-radius: 5px;">${message}</p>
      </div>
    `,
  };

  const mailToUser = {
    from: `"Alpha Glory Centre" <${process.env.GMAIL_EMAIL}>`,
    to: email,
    subject: "Thank you for contacting us!",
    html: `
      <div style="font-family: sans-serif; line-height: 1.6;">
        <h2>Thank You for Your Message!</h2>
        <p>Hello ${name},</p>
        <p>We have successfully received your message and appreciate you reaching out. A member of our team will get back to you as soon as possible.</p>
        <p>For your records, here is a copy of your message:</p>
        <hr>
        <p style="background-color: #f4f4f4; padding: 15px; border-radius: 5px;">${message}</p>
        <br>
        <p>Sincerely,</p>
        <p><strong>The Alpha Glory Team</strong></p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailToAlphaGlory);
    await transporter.sendMail(mailToUser);

    res.status(200).json({ message: "Emails sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email." });
  }
}
