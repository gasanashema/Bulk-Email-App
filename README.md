# ✉️ BucketMail

**BucketMail** is a powerful, browser-based bulk email solution designed for privacy, speed, and simplicity. Built with developers and marketers in mind, it allows you to send mass email campaigns directly from your browser—meaning your data never touches our servers.

![BucketMail LinkedIn Flyer](file:///home/shema/.gemini/antigravity/brain/dc5ca2d2-25a0-418a-895e-af59e8ff79bb/bucketmail_linkedin_flyer_mockup_1770070085235.png)

## ✨ Features

- **🔒 Browser-Side Privacy**: Your contact lists, email templates, and SMTP credentials stay in your browser session.
- **⚡ Real-time Sending Progress**: Watch your campaign launch in real-time with a live status tracker for every recipient.
- **🎨 Custom Branding**: Fully customize your emails with your brand colors, custom Call to Action (CTA) buttons, and personalized signatures.
- **📜 Open Source**: Transparent, community-driven, and free to use.
- **📱 Responsive Preview**: Preview your emails on both Desktop and Mobile views before sending.
- **💾 Export Options**: Export your campaigns and recipient lists as JSON or HTML for future use.

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Framer Motion (for animations).
- **Backend**: Node.js, Express.
- **Email Engine**: Nodemailer with SMTP support.

## 🚀 Getting Started

### Prerequisites

1.  **Node.js**: Ensure you have Node.js installed.
2.  **Gmail App Password**: Since BucketMail uses SMTP, you'll need a Google App Password to send emails securely without sharing your main password.

### Installation

1.  **Clone the repository**:

    ```bash
    git clone https://github.com/gasanashema/Bulk-Email-App.git
    cd Bulk-Email-App
    ```

2.  **Install dependencies**:

    ```bash
    cd bulk-email-builder
    npm install
    ```

3.  **Start the application**:
    Open two terminals:
    - **Terminal 1 (Backend)**:

      ```bash
      cd bulk-email-builder/server
      node server.js
      ```

    - **Terminal 2 (Frontend)**:
      ```bash
      cd bulk-email-builder
      npm run dev
      ```

4.  **Access the app**: Open `http://localhost:5173` in your browser.

## 🌐 Deployment

BucketMail is ready to be deployed to platforms like **Vercel** or **Netlify**.

> [!IMPORTANT]
> When deploying, make sure to:
>
> 1. Set the `VITE_API_URL` environment variable to point to your hosted Node.js backend.
> 2. Ensure your backend has the correct CORS settings to allow requests from your frontend domain.

## 📖 How to Use

1.  **Hero/Home**: Click "Start Campaign" to enter the wizard.
2.  **Recipients**: Upload your contacts via CSV or manually enter them.
3.  **Content**: Write your email using a rich editor. Use `{{name}}` or other tags for personalization.
4.  **Signature**: Add a professional signature.
5.  **Branding**: Pick your colors and enable a **Call to Action** button.
6.  **Launch**: Enter your Gmail address and App Password, review the preview, and hit **Launch Campaign**!

## 🤝 Connect with the Creator

Developed with ❤️ by **Shema Philbert**.

- **GitHub**: [@gasanashema](https://github.com/gasanashema)
- **LinkedIn**: [Shema Philbert](https://www.linkedin.com/in/shema-philbert)
- **Linktree**: [BucketMail Creator](https://linktr.ee/Shema_philbert)

---

> [!NOTE]
> This project is open-source. Feel free to fork, star, and contribute to making bulk emailing more secure and accessible!
