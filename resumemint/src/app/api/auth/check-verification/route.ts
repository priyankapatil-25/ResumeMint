import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ status: "missing_email" });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { emailVerified: true },
    });

    // User exists but email not verified
    if (user && !user.emailVerified) {
      return NextResponse.json({ status: "not_verified" });
    }

    // User doesn't exist — check if they started signup (have a pending verification code)
    if (!user) {
      const pendingCode = await prisma.verificationCode.findFirst({
        where: { email },
        orderBy: { createdAt: "desc" },
      });
      if (pendingCode) {
        return NextResponse.json({ status: "not_verified" });
      }
      return NextResponse.json({ status: "not_found" });
    }

    return NextResponse.json({ status: "verified" });
  } catch {
    return NextResponse.json({ status: "error" });
  }
}
