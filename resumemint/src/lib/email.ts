import nodemailer from "nodemailer";
import path from "path";

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

const logoPath = path.join(process.cwd(), "public", "GCEK Logo.jpg");
const logoCid = "gcek-logo@resumemint";

export async function sendVerificationEmail(email: string, code: string) {
  const transporter = getTransporter();
  console.log("[EMAIL] Sending OTP to:", email);
  await transporter.sendMail({
    from: `"GCEK Resume Builder" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Your Verification Code - GCEK Resume Builder",
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #E8EEF5; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <img src="cid:${logoCid}" alt="GCEK" style="width: 56px; height: 56px; border-radius: 50%; object-fit: cover;" />
          <h3 style="color: #0A1628; margin-top: 8px; font-size: 14px;">Government College Of Engineering, Karad</h3>
          <h2 style="color: #0F2133; margin-top: 12px;">Email Verification</h2>
        </div>
        <div style="background: white; border-radius: 12px; padding: 24px; text-align: center; border: 1px solid #C8D8E8;">
          <p style="color: #6B7E91; margin-bottom: 16px;">Your verification code is:</p>
          <div style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #1A3A5C; font-family: monospace; padding: 16px; background: #EBF1F7; border-radius: 8px; display: inline-block;">
            ${code}
          </div>
          <p style="color: #6B7E91; margin-top: 16px; font-size: 13px;">This code expires in 10 minutes.</p>
        </div>
        <p style="text-align: center; color: #7FA3C2; font-size: 12px; margin-top: 20px;">Government College Of Engineering, Karad</p>
      </div>
    `,
    attachments: [
      {
        filename: "GCEK Logo.jpg",
        path: logoPath,
        cid: logoCid,
      },
    ],
  });
  console.log("[EMAIL] OTP sent to:", email);
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const transporter = getTransporter();
  const resetUrl = `${process.env.NEXTAUTH_URL}/forgot-password?token=${token}`;
  console.log("[EMAIL] Sending reset link to:", email);
  await transporter.sendMail({
    from: `"GCEK Resume Builder" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Reset Your Password - GCEK Resume Builder",
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #E8EEF5; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <img src="cid:${logoCid}" alt="GCEK" style="width: 56px; height: 56px; border-radius: 50%; object-fit: cover;" />
          <h3 style="color: #0A1628; margin-top: 8px; font-size: 14px;">Government College Of Engineering, Karad</h3>
          <h2 style="color: #0F2133; margin-top: 12px;">Password Reset</h2>
        </div>
        <div style="background: white; border-radius: 12px; padding: 24px; text-align: center; border: 1px solid #C8D8E8;">
          <p style="color: #6B7E91; margin-bottom: 16px;">Click the button below to reset your password:</p>
          <a href="${resetUrl}" style="display: inline-block; background: #1A3A5C; color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 15px;">Reset Password</a>
          <p style="color: #6B7E91; margin-top: 16px; font-size: 13px;">This link expires in 30 minutes.</p>
          <p style="color: #7FA3C2; margin-top: 8px; font-size: 12px;">If you didn't request this, ignore this email.</p>
        </div>
        <p style="text-align: center; color: #7FA3C2; font-size: 12px; margin-top: 20px;">Government College Of Engineering, Karad</p>
      </div>
    `,
    attachments: [
      {
        filename: "GCEK Logo.jpg",
        path: logoPath,
        cid: logoCid,
      },
    ],
  });
  console.log("[EMAIL] Reset link sent to:", email);
}
