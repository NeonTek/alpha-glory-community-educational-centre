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
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Thank You from Alpha Glory</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f7f6;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
          
          <tr>
            <td align="center" style="padding: 20px 0;">
              <img src="/assets/images/logo.jpeg" alt="Alpha Glory Logo" style="display: block; width: 200px;">
            </td>
          </tr>

          <tr>
            <td style="padding: 20px 30px;">
              <h1 style="color: #1e3a8a; font-size: 24px;">Thank You for Your Message!</h1>
              <p style="color: #334155; line-height: 1.6;">Hello ${name},</p>
              <p style="color: #334155; line-height: 1.6;">We've successfully received your message and appreciate you reaching out. A member of our team will review your inquiry and get back to you as soon as possible.</p>
              <p style="color: #334155; line-height: 1.6;">For your records, here is a copy of your message:</p>
            </td>
          </tr>

          <tr>
            <td style="padding: 0 30px;">
              <div style="background-color: #f1f5f9; padding: 20px; border-radius: 5px; border-left: 4px solid #3b82f6;">
                <p style="color: #475569; margin: 0; line-height: 1.6;">${message}</p>
              </div>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding: 30px;">
              <a href="https://alphagloryeducationalcenter.org/" target="_blank" style="background-color: #2563eb; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                Visit Our Website
              </a>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding: 20px 30px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">
              <p style="margin: 0 0 10px 0;">Alpha Glory Community Educational Centre</p>
              <p style="margin: 0 0 10px 0;">Kabiria Stage 2, Nairobi, Kenya</p>
              <p style="margin: 0;">
                <a href="https://www.facebook.com/AlphaGlorySchool" target="_blank" style="color: #3b82f6; text-decoration: none;">Follow us on Facebook</a>
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 10px 30px; font-size: 10px; color: #94a3b8;">
                <p>This is an automated transactional email sent to ${email} because you contacted us via our website.</p>
            </td>
          </tr>
        </table>
      </body>
      </html>
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
