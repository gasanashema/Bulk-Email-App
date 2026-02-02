const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.post("/api/send", async (req, res) => {
  const { to, subject, html, fromName, auth } = req.body;

  if (!to || !subject || !html) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const { user, pass } = auth || {};

  if (!user || !pass) {
    return res
      .status(401)
      .json({
        error:
          "Missing credentials. Please provide Gmail user and App Password in the UI.",
      });
  }

  try {
    // Create transporter per-request with dynamic credentials
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
    console.error("Error sending email:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
