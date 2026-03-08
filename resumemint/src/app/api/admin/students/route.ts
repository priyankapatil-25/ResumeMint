import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const admin = await prisma.user.findUnique({ where: { email: session.user.email }, select: { role: true } });
    if (!admin || admin.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 20;
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
            { branch: { contains: search, mode: "insensitive" as const } },
            { college: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [students, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          college: true,
          branch: true,
          enrollmentYear: true,
          graduationYear: true,
          role: true,
          createdAt: true,
          _count: {
            select: { skills: true, projects: true, certifications: true, internships: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    // Filter out admin users from results
    const filtered = students.filter((s) => s.role !== "ADMIN");

    return NextResponse.json({
      students: filtered,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Admin students fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
