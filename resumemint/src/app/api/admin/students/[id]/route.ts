import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const admin = await prisma.user.findUnique({ where: { email: session.user.email }, select: { role: true } });
    if (!admin || admin.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        semesters: { orderBy: { number: "asc" } },
        skills: true,
        projects: true,
        certifications: true,
        internships: true,
      },
    });

    if (!user) return NextResponse.json({ error: "Student not found" }, { status: 404 });

    const { password: _, ...safe } = user;
    return NextResponse.json(safe);
  } catch (error) {
    console.error("Admin student detail error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
