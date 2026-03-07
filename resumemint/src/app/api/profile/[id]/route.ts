import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        semesters: { orderBy: { number: "asc" } },
        skills: true, projects: true, certifications: true, internships: true,
      },
    });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    const { password: _, ...safe } = user;
    return NextResponse.json(safe);
  } catch (error) {
    console.error("Public profile error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
