// backend/utils/emailTemplates.js

// ================= OTP EMAIL =================
export const otpEmailTemplate = (name, otp) => {
  return `
  <div style="
    font-family: Arial, sans-serif;
    background: linear-gradient(135deg,#0f172a,#1e293b);
    padding:40px;
    color:white;
    text-align:center;
  ">

    <div style="
      max-width:500px;
      margin:auto;
      background:#020617;
      border-radius:12px;
      padding:30px;
      box-shadow:0 10px 30px rgba(0,0,0,0.4);
      border:1px solid #1e293b;
    ">

      <h2 style="color:#38bdf8;">CareerForge</h2>

      <h3 style="margin-top:20px;">Email Verification</h3>

      <p>Hello <b>${name}</b>,</p>

      <p>Your verification OTP is:</p>

      <div style="
        font-size:32px;
        letter-spacing:8px;
        font-weight:bold;
        background:linear-gradient(90deg,#22c55e,#4ade80);
        color:black;
        padding:15px 25px;
        border-radius:10px;
        display:inline-block;
        margin:20px 0;
      ">
        ${otp}
      </div>

      <p style="color:#94a3b8;">
        This OTP is valid for 10 minutes.
      </p>

      <p style="margin-top:30px;font-size:12px;color:#64748b;">
        If you didn’t request this, you can ignore this email.
      </p>

    </div>

  </div>
  `;
};



// ================= RESET PASSWORD EMAIL =================
export const resetPasswordTemplate = (name, otp) => {
  return `
  <div style="
    font-family: Arial, sans-serif;
    background: linear-gradient(135deg,#1e293b,#020617);
    padding:40px;
    color:white;
    text-align:center;
  ">

    <div style="
      max-width:500px;
      margin:auto;
      background:#020617;
      border-radius:12px;
      padding:30px;
      box-shadow:0 10px 30px rgba(0,0,0,0.4);
      border:1px solid #1e293b;
    ">

      <h2 style="color:#facc15;">CareerForge</h2>

      <h3 style="margin-top:20px;">Password Reset Request</h3>

      <p>Hello <b>${name}</b>,</p>

      <p>Your password reset OTP is:</p>

      <div style="
        font-size:32px;
        letter-spacing:8px;
        font-weight:bold;
        background:linear-gradient(90deg,#facc15,#f59e0b);
        color:black;
        padding:15px 25px;
        border-radius:10px;
        display:inline-block;
        margin:20px 0;
      ">
        ${otp}
      </div>

      <p style="color:#94a3b8;">
        This OTP is valid for 10 minutes.
      </p>

      <p style="margin-top:30px;font-size:12px;color:#64748b;">
        If you didn’t request this, please secure your account.
      </p>

    </div>

  </div>
  `;
};