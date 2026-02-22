import nodemailer from "nodemailer";

const sendEmail = async (to, subject, html) => {

  try {

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"JobPortal" <${process.env.EMAIL_USER}>`,
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