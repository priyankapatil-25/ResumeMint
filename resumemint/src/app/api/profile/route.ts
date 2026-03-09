import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

const userIncludes = {
  semesters: { orderBy: { number: "asc" as const } },
  skills: true,
  projects: true,
  certifications: true,
  internships: true,
};

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email }, include: userIncludes });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const { password: _, ...safe } = user;
    return NextResponse.json(safe);
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await req.json();
    const existing = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!existing) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const uid = existing.id;

    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name: data.name, dob: data.dob || null, phone: data.phone, address: data.address, photo: data.photo,
        linkedin: data.linkedin, github: data.github, portfolio: data.portfolio, objective: data.objective,
        college: data.college, branch: data.branch,
        enrollmentYear: data.enrollmentYear ? Number(data.enrollmentYear) : null,
        graduationYear: data.graduationYear ? Number(data.graduationYear) : null,
        diplomaCollege: data.diplomaCollege || null, diplomaBranch: data.diplomaBranch || null,
        diplomaPercentage: data.diplomaPercentage || null, diplomaYear: data.diplomaYear || null,
        school12th: data.school12th, board12th: data.board12th, percentage12th: data.percentage12th, year12th: data.year12th,
        school10th: data.school10th, board10th: data.board10th, percentage10th: data.percentage10th, year10th: data.year10th,
        extraActivities: data.extraActivities || [],
      },
    });

    // Rebuild relations
    if (data.semesters !== undefined) {
      await prisma.semester.deleteMany({ where: { userId: uid } });
      if (data.semesters.length > 0)
        await prisma.semester.createMany({ data: data.semesters.map((s: { number: number; sgpa: number; subjects: string[]; backlog: number }) => ({ number: s.number, sgpa: s.sgpa, subjects: s.subjects || [], backlog: s.backlog || 0, userId: uid })) });
    }
    if (data.skills !== undefined) {
      await prisma.skill.deleteMany({ where: { userId: uid } });
      if (data.skills.length > 0)
        await prisma.skill.createMany({ data: data.skills.map((s: { name: string; category: string; proficiency: number }) => ({ name: s.name, category: s.category, proficiency: s.proficiency, userId: uid })) });
    }
    if (data.projects !== undefined) {
      await prisma.project.deleteMany({ where: { userId: uid } });
      if (data.projects.length > 0)
        await prisma.project.createMany({ data: data.projects.map((p: { title: string; description: string; techStack: string[]; github: string; liveDemo: string }) => ({ title: p.title, description: p.description || "", techStack: p.techStack || [], github: p.github || "", liveDemo: p.liveDemo || "", userId: uid })) });
    }
    if (data.certifications !== undefined) {
      await prisma.certification.deleteMany({ where: { userId: uid } });
      if (data.certifications.length > 0)
        await prisma.certification.createMany({ data: data.certifications.map((c: { title: string; issuer: string; date: string; url: string; image: string }) => ({ title: c.title, issuer: c.issuer || "", date: c.date || "", url: c.url || "", image: c.image || "", userId: uid })) });
    }
    if (data.internships !== undefined) {
      await prisma.internship.deleteMany({ where: { userId: uid } });
      if (data.internships.length > 0)
        await prisma.internship.createMany({ data: data.internships.map((i: { company: string; role: string; duration: string; description: string }) => ({ company: i.company, role: i.role || "", duration: i.duration || "", description: i.description || "", userId: uid })) });
    }

    const updated = await prisma.user.findUnique({ where: { email: session.user.email }, include: userIncludes });
    const { password: _p, ...result } = updated!;
    return NextResponse.json(result);
  } catch (error) {
    console.error("Profile update error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
