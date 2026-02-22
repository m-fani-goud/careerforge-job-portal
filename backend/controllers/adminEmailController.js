import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";



// ==============================================
// APPROVE FROM EMAIL
// ==============================================
export const approveFromEmail = async (req, res) => {
  try {

    const { token } = req.params;

    const user = await User.findOne({
      approvalToken: token,
      approvalTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.send("<h2>Invalid or expired approval link</h2>");
    }

    user.approvalStatus = "approved";
    user.companyVerified = true;

    user.approvalToken = undefined;
    user.approvalTokenExpire = undefined;

    await user.save();


    // ✅ Notify recruiter
    await sendEmail(
      user.email,
      "Recruiter Approved",
      `
      <h2>🎉 Congratulations!</h2>
      <p>Your recruiter account has been approved.</p>
      <p>You can now login and post jobs.</p>
      `
    );


    res.send(`
      <div style="font-family:Arial;text-align:center;padding:40px">
        <h2 style="color:green">✅ Recruiter Approved Successfully</h2>
        <p>${user.name} can now access recruiter features.</p>
      </div>
    `);

  } catch (error) {
    res.send("Server Error");
  }
};



// ==============================================
// REJECT PAGE (FORM)
// ==============================================
export const rejectPage = async (req, res) => {

  const { token } = req.params;

  res.send(`
    <div style="font-family:Arial;padding:40px">

      <h2>Reject Recruiter</h2>

      <form method="POST" action="/api/admin/reject-email/${token}">

        <label>Reason:</label><br/>

        <textarea name="reason"
          style="width:300px;height:100px"
          required></textarea><br/><br/>

        <button
          style="
            background:red;
            color:white;
            padding:10px 20px;
            border:none;
            border-radius:6px;
          ">
          Reject Recruiter
        </button>

      </form>

    </div>
  `);
};



// ==============================================
// REJECT FROM EMAIL
// ==============================================
export const rejectFromEmail = async (req, res) => {
  try {

    const { token } = req.params;
    const { reason } = req.body;

    const user = await User.findOne({
      approvalToken: token,
      approvalTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.send("<h2>Invalid or expired link</h2>");
    }

    user.approvalStatus = "rejected";

    user.approvalToken = undefined;
    user.approvalTokenExpire = undefined;

    await user.save();


    // ✅ Notify recruiter
    await sendEmail(
      user.email,
      "Recruiter Request Rejected",
      `
      <h2>Recruiter Request Rejected</h2>

      <p>We are sorry, your recruiter request was rejected.</p>

      <p><b>Reason:</b> ${reason}</p>
      `
    );


    res.send(`
      <div style="font-family:Arial;text-align:center;padding:40px">
        <h2 style="color:red">❌ Recruiter Rejected</h2>
        <p>${user.name} has been notified.</p>
      </div>
    `);

  } catch (error) {
    res.send("Server Error");
  }
};