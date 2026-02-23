import nodemailer from "nodemailer";

const sendEmail = async (to, subject, html) => {
  try {

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,              // ⭐ IMPORTANT
      secure: false,          // ⭐ IMPORTANT (false for 587)
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    await transporter.sendMail({
      from: `"CareerForge" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("✅ Email sent to:", to);

  } catch (error) {
    console.log("❌ Email Error:", error);
  }
};

export default sendEmail;