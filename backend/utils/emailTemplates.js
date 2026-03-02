// ======================================================
// 🌌 ULTRA PREMIUM DARK BASE TEMPLATE
// ======================================================

const baseTemplate = (content) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <style>
      body {
        margin: 0;
        padding: 0;
        background: #0f172a;
        font-family: 'Segoe UI', Roboto, sans-serif;
        color: #e2e8f0;
      }

      .container {
        max-width: 650px;
        margin: 40px auto;
        background: linear-gradient(145deg,#0b1220,#111827);
        border-radius: 20px;
        overflow: hidden;
        box-shadow: 0 40px 90px rgba(0,0,0,0.6);
        border: 1px solid rgba(255,255,255,0.08);
      }

      .header {
        background: linear-gradient(135deg,#6366f1,#8b5cf6,#ec4899);
        padding: 45px 20px;
        text-align: center;
        color: white;
      }

      .logo {
        font-size: 26px;
        font-weight: bold;
        letter-spacing: 1px;
      }

      .subtitle {
        opacity: 0.9;
        font-size: 14px;
        margin-top: 5px;
      }

      .content {
        padding: 40px 30px;
        text-align: center;
      }

      .card {
        background: rgba(255,255,255,0.05);
        border-radius: 16px;
        padding: 22px;
        margin: 25px 0;
        border: 1px solid rgba(255,255,255,0.08);
        backdrop-filter: blur(10px);
      }

      .otp {
        font-size: 32px;
        letter-spacing: 6px;
        font-weight: bold;
        color: #a78bfa;
        margin: 20px 0;
      }

      .button {
        display: inline-block;
        padding: 14px 30px;
        border-radius: 50px;
        text-decoration: none;
        font-weight: bold;
        margin: 10px;
        color: white;
        transition: 0.3s;
      }

      .approve {
        background: linear-gradient(90deg,#22c55e,#16a34a);
        box-shadow: 0 0 15px rgba(34,197,94,0.5);
      }

      .reject {
        background: linear-gradient(90deg,#ef4444,#dc2626);
        box-shadow: 0 0 15px rgba(239,68,68,0.5);
      }

      .button:hover {
        transform: translateY(-2px) scale(1.05);
      }

      .footer {
        background: rgba(255,255,255,0.03);
        padding: 20px;
        text-align: center;
        font-size: 12px;
        color: #94a3b8;
      }

      .divider {
        height: 1px;
        background: rgba(255,255,255,0.1);
        margin: 25px 0;
      }

      h2 {
        margin-bottom: 10px;
        color: white;
      }

      p {
        color: #cbd5e1;
        line-height: 1.6;
      }
    </style>
  </head>

  <body>

    <div class="container">

      <div class="header">
        <div class="logo">🚀 CareerForge</div>
        <div class="subtitle">AI Powered Hiring Platform</div>
      </div>

      <div class="content">
        ${content}
      </div>

      <div class="footer">
        © ${new Date().getFullYear()} CareerForge — All rights reserved
      </div>

    </div>

  </body>
  </html>
  `;
};



// ======================================================
// 🔐 OTP EMAIL
// ======================================================

export const otpEmailTemplate = (name, otp) => {

  const content = `
    <h2>Hello ${name} 👋</h2>

    <p>Your verification code is:</p>

    <div class="card">
      <div class="otp">${otp}</div>
      <p>This OTP expires in 10 minutes.</p>
    </div>

    <p>If you did not request this, please ignore.</p>
  `;

  return baseTemplate(content);
};



// ======================================================
// 🔑 PASSWORD RESET EMAIL
// ======================================================

export const resetPasswordTemplate = (name, otp) => {

  const content = `
    <h2>Password Reset 🔑</h2>

    <p>Hello ${name},</p>

    <p>Your password reset code:</p>

    <div class="card">
      <div class="otp">${otp}</div>
      <p>Expires in 10 minutes.</p>
    </div>
  `;

  return baseTemplate(content);
};



// ======================================================
// 👔 RECRUITER REQUEST → ADMIN
// ======================================================

export const recruiterApprovalTemplate = (
  name,
  email,
  company,
  approveLink,
  rejectLink
) => {

  const content = `
    <h2>New Recruiter Request 👔</h2>

    <p>A recruiter has registered and needs approval.</p>

    <div class="card">
      <p><b>Name:</b> ${name}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Company:</b> ${company}</p>
    </div>

    <p>Please review and take action:</p>

    <a href="${approveLink}" class="button approve">
      ✅ Approve
    </a>

    <a href="${rejectLink}" class="button reject">
      ❌ Reject
    </a>
  `;

  return baseTemplate(content);
};



// ======================================================
// ✅ RECRUITER APPROVED EMAIL
// ======================================================

export const recruiterApprovedTemplate = (name) => {

  const content = `
    <h2>Congratulations ${name}! 🎉</h2>

    <p>Your recruiter account has been approved.</p>

    <div class="card">
      <p>You can now login and start posting jobs.</p>
    </div>
  `;

  return baseTemplate(content);
};



// ======================================================
// ❌ RECRUITER REJECTED EMAIL
// ======================================================

export const recruiterRejectedTemplate = (name) => {

  const content = `
    <h2>Hello ${name}</h2>

    <p>We regret to inform you that your recruiter request was not approved.</p>

    <div class="card">
      <p>Please contact support for more details.</p>
    </div>
  `;

  return baseTemplate(content);
};