const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.get("/", (req, res) => {
  res.send(`
        <div style="font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background: #f8fafc; color: #1e293b; margin: 0;">
            <div style="background: white; padding: 2.5rem; border-radius: 1.5rem; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1); border: 1px solid #e2e8f0; text-align: center; max-width: 400px;">
                <h1 style="margin: 0 0 1rem 0; color: #2563eb; font-size: 2rem;">✉️ BucketMail API</h1>
                <p style="margin: 0; font-size: 1.1rem; color: #475569;">The backend engine is purring!</p>
                <div style="margin-top: 2rem; display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.25rem; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 9999px; color: #166534; font-weight: 600; font-size: 0.875rem;">
                    <span style="display: block; width: 8px; height: 8px; background: #22c55e; border-radius: 50%; animate: pulse 2s infinite;"></span>
                    Status: Online & Ready
                </div>
            </div>
        </div>
    `);
});

app.post("/api/verify", async (req, res) => {
  const { auth } = req.body;
  const { user, pass } = auth || {};

  if (!user || !pass) {
    return res.status(401).json({ error: "Missing credentials" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });

    await transporter.verify();
    res
      .status(200)
      .json({ success: true, message: "SMTP connection successful" });
  } catch (error) {
    console.error("SMTP Verification Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/send", async (req, res) => {
  const { to, subject, html, fromName, auth } = req.body;

  if (!to || !subject || !html) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const { user, pass } = auth || {};

  if (!user || !pass) {
    return res.status(401).json({
      error:
        "Missing credentials. Please provide Gmail user and App Password in the UI.",
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });

    const info = await transporter.sendMail({
      from: `"${fromName || "Bulk Email Builder"}" <${user}>`,
      to,
      subject,
      html,
    });

    console.log(`Email sent to ${to}: ${info.messageId}`);
    res.status(200).json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);

    let userFriendlyError = error.message;
    if (error.code === "EAUTH") {
      userFriendlyError =
        "Authentication failed. Please verify your Gmail address and App Password.";
    } else if (error.code === "ESOCKET" || error.syscall === "connect") {
      userFriendlyError =
        "Connection to Gmail blocked. This is common on some hosting providers like Vercel. Consider using SendGrid or Mailgun.";
    }

    res.status(500).json({ error: userFriendlyError, code: error.code });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
