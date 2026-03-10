import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if email already registered (only block if fully verified)
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing && existing.emailVerified) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    // Rate limit: max 1 code per minute per email
    const recentCode = await prisma.verificationCode.findFirst({
      where: {
        email,
        createdAt: { gt: new Date(Date.now() - 60 * 1000) },
      },
    });
    if (recentCode) {
      return NextResponse.json({ error: "Please wait 1 minute before requesting a new code" }, { status: 429 });
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Delete old codes for this email
    await prisma.verificationCode.deleteMany({ where: { email } });

    // Save new code (expires in 10 minutes)
    await prisma.verificationCode.create({
      data: {
        email,
        code,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    // Send email in background - don't make user wait
    sendVerificationEmail(email, code).catch((err) => {
      console.error("[EMAIL] Failed to send OTP:", err);
    });

    return NextResponse.json({ message: "Verification code sent" });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("Send code error:", errMsg);
    return NextResponse.json({ error: `Failed to send verification code: ${errMsg}` }, { status: 500 });
  }
}
