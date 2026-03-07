import nodemailer from "nodemailer";

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

export async function sendVerificationEmail(email: string, code: string) {
  const transporter = getTransporter();
  console.log("[EMAIL] Sending OTP to:", email);
  await transporter.sendMail({
    from: `"GCEK Resume Builder" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Your Verification Code - GCEK Resume Builder",
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: linear-gradient(135deg, #EEF2FF, #F0FDFA); border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="display: inline-block; width: 48px; height: 48px; border-radius: 12px; background: linear-gradient(135deg, #6366F1, #14B8A6); color: white; font-weight: bold; font-size: 10px; line-height: 48px;">GCEK</div>
          <h2 style="color: #1E1B4B; margin-top: 12px;">Email Verification</h2>
        </div>
        <div style="background: white; border-radius: 12px; padding: 24px; text-align: center; border: 1px solid #DDD6FE;">
          <p style="color: #7C7C9A; margin-bottom: 16px;">Your verification code is:</p>
          <div style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #6366F1; font-family: monospace; padding: 16px; background: #F5F3FF; border-radius: 8px; display: inline-block;">
            ${code}
          </div>
          <p style="color: #7C7C9A; margin-top: 16px; font-size: 13px;">This code expires in 10 minutes.</p>
        </div>
        <p style="text-align: center; color: #A5B4FC; font-size: 12px; margin-top: 20px;">Government College Of Engineering, Karad</p>
      </div>
    `,
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
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: linear-gradient(135deg, #EEF2FF, #F0FDFA); border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="display: inline-block; width: 48px; height: 48px; border-radius: 12px; background: linear-gradient(135deg, #6366F1, #14B8A6); color: white; font-weight: bold; font-size: 10px; line-height: 48px;">GCEK</div>
          <h2 style="color: #1E1B4B; margin-top: 12px;">Password Reset</h2>
        </div>
        <div style="background: white; border-radius: 12px; padding: 24px; text-align: center; border: 1px solid #DDD6FE;">
          <p style="color: #7C7C9A; margin-bottom: 16px;">Click the button below to reset your password:</p>
          <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #6366F1, #8B5CF6); color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 15px;">Reset Password</a>
          <p style="color: #7C7C9A; margin-top: 16px; font-size: 13px;">This link expires in 30 minutes.</p>
          <p style="color: #A5B4FC; margin-top: 8px; font-size: 12px;">If you didn't request this, ignore this email.</p>
        </div>
        <p style="text-align: center; color: #A5B4FC; font-size: 12px; margin-top: 20px;">Government College Of Engineering, Karad</p>
      </div>
    `,
  });
  console.log("[EMAIL] Reset link sent to:", email);
}
