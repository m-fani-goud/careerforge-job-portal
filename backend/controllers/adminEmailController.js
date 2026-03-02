import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";


// ======================================================
// ⭐ APPROVE RECRUITER FROM EMAIL LINK
// ======================================================
export const approveFromEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      approvalToken: token,
      approvalTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.send(getErrorPage("Invalid or expired approval link"));
    }

    user.approvalStatus = "approved";
    user.companyVerified = true;

    user.approvalToken = undefined;
    user.approvalTokenExpire = undefined;

    await user.save();

    // ================= EMAIL TO RECRUITER =================
    await sendEmail(
      user.email,
      "🎉 Recruiter Approved",
      recruiterApprovedTemplate(user.name)
    );

    res.send(getSuccessPage("Recruiter Approved", `${user.name} can now login and post jobs.`));

  } catch (error) {
    console.log("Approve Error:", error);
    res.send(getErrorPage("Server Error"));
  }
};



// ======================================================
// ⭐ REJECT FORM PAGE
// ======================================================
export const rejectPage = async (req, res) => {

  const { token } = req.params;

  res.send(`
  <html>
  <head>
    <title>Reject Recruiter</title>
    <style>
      body {
        font-family: Arial;
        background: linear-gradient(135deg,#1e293b,#0f172a);
        color: white;
        display:flex;
        justify-content:center;
        align-items:center;
        height:100vh;
      }
      .card {
        background:#020617;
        padding:30px;
        border-radius:12px;
        width:400px;
        box-shadow:0 10px 30px rgba(0,0,0,0.5);
      }
      textarea {
        width:100%;
        height:120px;
        border-radius:8px;
        padding:10px;
        margin-top:10px;
      }
      button {
        background:#ef4444;
        color:white;
        border:none;
        padding:12px;
        border-radius:8px;
        width:100%;
        margin-top:15px;
        cursor:pointer;
      }
    </style>
  </head>
  <body>
    <div class="card">
      <h2>Reject Recruiter</h2>
      <form method="POST" action="/api/admin/reject-email/${token}">
        <label>Reason</label>
        <textarea name="reason" required></textarea>
        <button type="submit">Reject Recruiter</button>
      </form>
    </div>
  </body>
  </html>
  `);
};



// ======================================================
// ⭐ REJECT RECRUITER FROM EMAIL
// ======================================================
export const rejectFromEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const { reason } = req.body;

    const user = await User.findOne({
      approvalToken: token,
      approvalTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.send(getErrorPage("Invalid or expired link"));
    }

    user.approvalStatus = "rejected";

    user.approvalToken = undefined;
    user.approvalTokenExpire = undefined;

    await user.save();

    // ================= EMAIL TO RECRUITER =================
    await sendEmail(
      user.email,
      "Recruiter Request Rejected",
      recruiterRejectedTemplate(user.name, reason)
    );

    res.send(getErrorPage(`${user.name} has been rejected and notified.`));

  } catch (error) {
    console.log("Reject Error:", error);
    res.send(getErrorPage("Server Error"));
  }
};



// ======================================================
// ⭐ EMAIL TEMPLATES
// ======================================================

const recruiterApprovedTemplate = (name) => `
<div style="font-family:Arial;background:#0f172a;color:white;padding:30px">
  <h2 style="color:#22c55e">🎉 Congratulations ${name}</h2>
  <p>Your recruiter account has been approved.</p>
  <p>You can now login and post jobs.</p>
</div>
`;

const recruiterRejectedTemplate = (name, reason) => `
<div style="font-family:Arial;background:#0f172a;color:white;padding:30px">
  <h2 style="color:#ef4444">❌ Request Rejected</h2>
  <p>Hello ${name},</p>
  <p>Your recruiter request was rejected.</p>
  <p><b>Reason:</b> ${reason}</p>
</div>
`;



// ======================================================
// ⭐ SUCCESS / ERROR PAGES
// ======================================================

const getSuccessPage = (title, message) => `
<html>
<head>
<style>
body{
  font-family:Arial;
  background:linear-gradient(135deg,#0f172a,#1e293b);
  color:white;
  display:flex;
  justify-content:center;
  align-items:center;
  height:100vh;
}
.card{
  background:#020617;
  padding:40px;
  border-radius:12px;
  text-align:center;
}
</style>
</head>
<body>
  <div class="card">
    <h2 style="color:#22c55e">✅ ${title}</h2>
    <p>${message}</p>
  </div>
</body>
</html>
`;

const getErrorPage = (message) => `
<html>
<head>
<style>
body{
  font-family:Arial;
  background:linear-gradient(135deg,#0f172a,#1e293b);
  color:white;
  display:flex;
  justify-content:center;
  align-items:center;
  height:100vh;
}
.card{
  background:#020617;
  padding:40px;
  border-radius:12px;
  text-align:center;
}
</style>
</head>
<body>
  <div class="card">
    <h2 style="color:#ef4444">⚠️ Error</h2>
    <p>${message}</p>
  </div>
</body>
</html>
`;