import nodemailer from "nodemailer";

const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // TLS
      family: 4, // ⭐ Force IPv4 (Render fix)

      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },

      tls: {
        rejectUnauthorized: false,
      },

      connectionTimeout: 10000, // ⭐ Prevent hanging
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });

    // ⭐ Verify connection before sending (important)
    await transporter.verify();

    await transporter.sendMail({
      from: `"CareerForge" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("✅ Email sent to:", to);

  } catch (error) {
    console.error("❌ Email Error:", error.message);
    throw new Error("Email sending failed");
  }
};

export default sendEmail;