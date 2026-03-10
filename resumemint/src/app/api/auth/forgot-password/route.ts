import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Don't reveal if email exists or not
      return NextResponse.json({ message: "If this email is registered, you will receive a reset link." });
    }

    // Rate limit: 1 reset per 2 minutes
    const recent = await prisma.passwordReset.findFirst({
      where: {
        email,
        createdAt: { gt: new Date(Date.now() - 2 * 60 * 1000) },
      },
    });
    if (recent) {
      return NextResponse.json({ message: "If this email is registered, you will receive a reset link." });
    }

    // Generate secure token
    const token = crypto.randomBytes(32).toString("hex");

    // Delete old reset tokens for this email
    await prisma.passwordReset.deleteMany({ where: { email } });

    // Save new token (expires in 30 minutes)
    await prisma.passwordReset.create({
      data: {
        email,
        token,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000),
      },
    });

    // Send email and await result
    try {
      await sendPasswordResetEmail(email, token);
    } catch (err) {
      console.error("[EMAIL] Failed to send reset link:", err);
      return NextResponse.json({ error: "Failed to send reset email. Please try again later." }, { status: 500 });
    }

    return NextResponse.json({ message: "If this email is registered, you will receive a reset link." });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
