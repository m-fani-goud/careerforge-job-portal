import { Resend } from "resend";

const sendEmail = async (to, subject, html) => {
  try {
    // ⭐ Create resend instance INSIDE function
    const resend = new Resend(process.env.RESEND_API_KEY);

    const response = await resend.emails.send({
      from: process.env.EMAIL_FROM, // onboarding@resend.dev
      to: to,
      subject: subject,
      html: html,
    });

    console.log("✅ Email sent:", response);

  } catch (error) {
    console.error("❌ Email Error:", error);
    throw new Error("Email sending failed");
  }
};

export default sendEmail;