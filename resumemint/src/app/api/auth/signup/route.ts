import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { name, email, password, verified } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    // Require email verification
    if (!verified) {
      return NextResponse.json({ error: "Email must be verified first" }, { status: 400 });
    }

    // Double-check: ensure there's a used verification code for this email
    const verifiedCode = await prisma.verificationCode.findFirst({
      where: { email, used: true },
      orderBy: { createdAt: "desc" },
    });
    if (!verifiedCode) {
      return NextResponse.json({ error: "Email verification required" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing && existing.emailVerified) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 12);

    let user;
    if (existing && !existing.emailVerified) {
      // User exists but never completed verification — update their record
      user = await prisma.user.update({
        where: { email },
        data: { name, password: hashed, emailVerified: true },
      });
    } else {
      user = await prisma.user.create({ data: { name, email, password: hashed, emailVerified: true } });
    }

    // Cleanup verification codes for this email
    await prisma.verificationCode.deleteMany({ where: { email } });

    return NextResponse.json({ message: "Account created successfully", userId: user.id }, { status: 201 });
  } catch (error) {
    console.error("Signup error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: `Signup failed: ${msg}` }, { status: 500 });
  }
}
