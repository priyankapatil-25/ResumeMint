"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import TemplateGCEK from "@/components/templates/TemplateGCEK";
import jsPDF from "jspdf";
import Link from "next/link";
import toast from "react-hot-toast";

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function AdminStudentDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [showResume, setShowResume] = useState(false);
  const [autoDownloadDone, setAutoDownloadDone] = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated" && params.id) {
      const role = (session?.user as any)?.role;
      if (role !== "ADMIN") {
        router.push("/dashboard");
        return;
      }
      fetch(`/api/admin/students/${params.id}`)
        .then((res) => {
          if (res.status === 403) { router.push("/dashboard"); return null; }
          if (!res.ok) throw new Error("Failed");
          return res.json();
        })
        .then((data) => { if (data) setProfile(data); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [status, session, params.id, router]);

  // Auto-download PDF when coming from admin list with ?download=true
  useEffect(() => {
    if (profile && searchParams.get("download") === "true" && !autoDownloadDone) {
      setAutoDownloadDone(true);
      downloadPDF();
    }
  }, [profile, searchParams, autoDownloadDone]); // eslint-disable-line react-hooks/exhaustive-deps

  const semesters: any[] = (profile?.semesters || []).filter((s: any) => s.sgpa > 0);
  const cgpa =
    semesters.length > 0
      ? (semesters.reduce((sum: number, s: any) => sum + (s.sgpa || 0), 0) / semesters.length).toFixed(2)
      : "N/A";

  const downloadPDF = async () => {
    if (!profile) return;
    setDownloading(true);
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const W = pdf.internal.pageSize.getWidth();
      const H = pdf.internal.pageSize.getHeight();
      const margin = 18;
      const contentW = W - margin * 2;
      let y = 0;
      let pageNum = 1;

      const NAVY: [number, number, number] = [27, 42, 74];
      const BLUE: [number, number, number] = [44, 95, 138];
      const GOLD: [number, number, number] = [196, 151, 47];
      const TEXT_BLK: [number, number, number] = [26, 26, 26];
      const MED_GRAY: [number, number, number] = [74, 74, 74];
      const SUBTLE: [number, number, number] = [136, 153, 170];

      const addFooter = () => {
        pdf.setDrawColor(...GOLD);
        pdf.setLineWidth(0.3);
        pdf.line(0, H - 7, W, H - 7);
        pdf.setFillColor(...NAVY);
        pdf.rect(0, H - 6.5, W, 6.5, "F");
        pdf.setFontSize(5.5);
        pdf.setTextColor(170, 187, 204);
        pdf.setFont("helvetica", "normal");
        pdf.text(profile.college || "GCE Karad" + "  |  Shivaji University", margin, H - 2.5);
        pdf.text(`Page ${pageNum}`, W - margin - pdf.getTextWidth(`Page ${pageNum}`), H - 2.5);
      };

      const checkPage = (need: number) => {
        if (y + need > H - 14) { addFooter(); pdf.addPage(); pageNum++; y = margin; }
      };

      // Header
      pdf.setFillColor(...NAVY);
      pdf.rect(0, 0, W, 2, "F");
      pdf.setFillColor(...GOLD);
      pdf.rect(0, 2, W, 0.5, "F");
      y = 4;

      // Emblem (real college logo)
      const emblemSize = 16;
      try {
        const logoImg = await new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = "/GCEK Logo.jpg";
        });
        const canvas = document.createElement("canvas");
        canvas.width = logoImg.width;
        canvas.height = logoImg.height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(logoImg, 0, 0);
        const logoDataUrl = canvas.toDataURL("image/jpeg");
        pdf.addImage(logoDataUrl, "JPEG", margin, y + 1, emblemSize, emblemSize);
      } catch {
        pdf.setFillColor(...NAVY);
        pdf.circle(margin + emblemSize / 2, y + 1 + emblemSize / 2, emblemSize / 2, "F");
      }

      // Name & Contact
      const nameX = margin + emblemSize + 4;
      pdf.setFontSize(19); pdf.setFont("helvetica", "bold"); pdf.setTextColor(...NAVY);
      pdf.text((profile.name || "STUDENT").toUpperCase(), nameX, y + 7);
      const contacts: string[] = [];
      if (profile.phone) contacts.push(profile.phone);
      if (profile.email) contacts.push(profile.email);
      if (profile.linkedin) contacts.push(profile.linkedin);
      if (profile.github) contacts.push(profile.github);
      if (contacts.length > 0) {
        pdf.setFontSize(7.5); pdf.setFont("helvetica", "normal"); pdf.setTextColor(...MED_GRAY);
        pdf.text(contacts.slice(0, 3).join("  |  "), nameX, y + 12);
        const row2 = contacts.slice(3).join("  |  ");
        if (row2) pdf.text(row2, nameX, y + 16);
      }

      // Photo
      const photoSize = 18;
      let photoEndX = W - margin;
      if (profile.photo?.startsWith("data:image")) {
        try {
          const photoX = W - margin - photoSize;
          pdf.setDrawColor(...GOLD); pdf.setLineWidth(0.4);
          pdf.rect(photoX - 0.5, y + 0.5, photoSize + 1, photoSize + 1, "S");
          pdf.addImage(profile.photo, "JPEG", photoX, y + 1, photoSize, photoSize);
          photoEndX = photoX - 3;
        } catch { /* skip */ }
      }
      pdf.setFontSize(5.5); pdf.setFont("helvetica", "normal"); pdf.setTextColor(...SUBTLE);
      const collegeName = profile.college || "Government College of Engineering, Karad";
      pdf.text(collegeName, photoEndX - pdf.getTextWidth(collegeName), y + 5);
      const subTag = "Autonomous | Shivaji University";
      pdf.text(subTag, photoEndX - pdf.getTextWidth(subTag), y + 9);

      y += 20;
      pdf.setDrawColor(...BLUE); pdf.setLineWidth(0.5); pdf.line(margin, y, W - margin, y);
      pdf.setDrawColor(...GOLD); pdf.setLineWidth(0.2); pdf.line(margin, y + 1, W - margin, y + 1);
      y += 5;

      // Helpers
      const sectionTitle = (title: string) => {
        checkPage(12); y += 4;
        pdf.setFontSize(10); pdf.setFont("helvetica", "bold"); pdf.setTextColor(...NAVY);
        pdf.text(title.toUpperCase(), margin, y); y += 1.5;
        pdf.setDrawColor(...BLUE); pdf.setLineWidth(0.5); pdf.line(margin, y, W - margin, y);
        y += 0.5; pdf.setDrawColor(...GOLD); pdf.setLineWidth(0.2); pdf.line(margin, y, margin + contentW * 0.4, y); y += 4;
      };
      const entryHeader = (left: string, right?: string) => {
        checkPage(6);
        pdf.setFontSize(9.5); pdf.setFont("helvetica", "bold"); pdf.setTextColor(...TEXT_BLK);
        pdf.text(left, margin, y);
        if (right) { pdf.setFont("helvetica", "normal"); pdf.setFontSize(8.5); pdf.setTextColor(...MED_GRAY); pdf.text(right, W - margin - pdf.getTextWidth(right), y); }
        y += 4;
      };
      const subtitle = (text: string) => {
        pdf.setFontSize(9); pdf.setFont("helvetica", "italic"); pdf.setTextColor(...BLUE); pdf.text(text, margin, y); y += 3.5;
      };
      const bullet = (text: string) => {
        pdf.setFontSize(9); pdf.setFont("helvetica", "normal"); pdf.setTextColor(...TEXT_BLK);
        const lines = pdf.splitTextToSize(text, contentW - 6);
        lines.forEach((line: string, idx: number) => { checkPage(4); if (idx === 0) pdf.text("\u2022", margin + 2, y); pdf.text(line, margin + 6, y); y += 3.8; });
        y += 0.5;
      };
      const skillsRow = (label: string, value: string) => {
        checkPage(5); pdf.setFontSize(9); pdf.setFont("helvetica", "bold"); pdf.setTextColor(...TEXT_BLK);
        pdf.text(label, margin, y);
        const labelW = contentW * 0.28;
        pdf.setFont("helvetica", "normal");
        const valueLines = pdf.splitTextToSize(value, contentW - labelW);
        valueLines.forEach((line: string, idx: number) => { if (idx > 0) checkPage(4); pdf.text(line, margin + labelW, y); if (idx < valueLines.length - 1) y += 3.8; });
        y += 4;
      };

      // Sections
      if (profile.objective) {
        sectionTitle("Career Objective");
        pdf.setFontSize(9); pdf.setFont("helvetica", "normal"); pdf.setTextColor(...TEXT_BLK);
        pdf.splitTextToSize(profile.objective, contentW).forEach((line: string) => { checkPage(4); pdf.text(line, margin, y); y += 3.8; });
        y += 2;
      }

      sectionTitle("Education");
      if (profile.college) {
        entryHeader(`Bachelor of Engineering (${profile.branch || "Engineering"})`, profile.enrollmentYear && profile.graduationYear ? `${profile.enrollmentYear} \u2013 ${profile.graduationYear}` : undefined);
        subtitle(`${profile.college} \u2014 Shivaji University`);
        if (cgpa !== "N/A") bullet(`CGPA: ${cgpa}`);
      }
      if (profile.diplomaCollege) {
        y += 1;
        entryHeader(`Diploma \u2014 ${profile.diplomaBranch || "Engineering"}`, profile.diplomaYear || undefined);
        subtitle(profile.diplomaCollege);
        if (profile.diplomaPercentage) bullet(`Percentage / CGPA: ${profile.diplomaPercentage}`);
      }
      if (profile.school12th) {
        y += 1;
        entryHeader(`HSC (Science) \u2014 ${profile.board12th || "Maharashtra State Board"}`, profile.year12th || undefined);
        subtitle(profile.school12th);
        if (profile.percentage12th) bullet(`Percentage: ${profile.percentage12th}%`);
      }
      if (profile.school10th) {
        y += 1;
        entryHeader(`SSC \u2014 ${profile.board10th || "Maharashtra State Board"}`, profile.year10th || undefined);
        subtitle(profile.school10th);
        if (profile.percentage10th) bullet(`Percentage: ${profile.percentage10th}%`);
      }

      const skills = profile.skills || [];
      if (skills.length > 0) {
        sectionTitle("Technical Skills");
        const grouped: Record<string, string[]> = {};
        skills.forEach((s: any) => { const cat = s.category || "General"; if (!grouped[cat]) grouped[cat] = []; grouped[cat].push(s.name); });
        Object.entries(grouped).forEach(([cat, names]) => skillsRow(`${cat}:`, names.join(", ")));
      }

      const sems = semesters;
      if (sems.length > 0) {
        sectionTitle("Semester Results");
        checkPage(6);
        const semText = sems.map((sem: any) => `Sem ${sem.number}: ${sem.sgpa.toFixed(2)}`).join("    ");
        pdf.setFontSize(9); pdf.setFont("helvetica", "normal"); pdf.setTextColor(...TEXT_BLK);
        pdf.splitTextToSize(semText, contentW).forEach((line: string) => { checkPage(4); pdf.text(line, margin, y); y += 4; });
        y += 2;
      }

      const interns = profile.internships || [];
      if (interns.length > 0) {
        sectionTitle("Internship Experience");
        interns.forEach((i: any) => { checkPage(10); entryHeader(`${i.role} \u2014 ${i.company}`, i.duration || undefined); if (i.description) bullet(i.description); y += 1; });
      }

      const projects = profile.projects || [];
      if (projects.length > 0) {
        sectionTitle("Academic Projects");
        projects.forEach((p: any) => {
          checkPage(10); entryHeader(p.title);
          if (p.description) bullet(p.description);
          if (p.techStack?.length > 0) {
            pdf.setFontSize(8); pdf.setFont("helvetica", "italic"); pdf.setTextColor(...BLUE);
            pdf.splitTextToSize("Tech Stack: " + p.techStack.join(", "), contentW - 6).forEach((line: string) => { checkPage(4); pdf.text(line, margin + 6, y); y += 3.5; });
          }
          y += 1.5;
        });
      }

      const certs = profile.certifications || [];
      if (certs.length > 0) {
        sectionTitle("Certifications");
        certs.forEach((c: any) => bullet(`${c.title}${c.issuer ? ` \u2014 ${c.issuer}` : ""}${c.date ? `, ${c.date}` : ""}`));
      }

      const activities = profile.extraActivities || [];
      if (activities.length > 0) {
        sectionTitle("Achievements & Extracurricular Activities");
        activities.forEach((a: string) => bullet(a));
      }

      sectionTitle("Personal Details");
      if (profile.dob) skillsRow("Date of Birth:", profile.dob);
      if (profile.address) skillsRow("Address:", profile.address);

      y += 4; checkPage(10);
      pdf.setDrawColor(232, 232, 232); pdf.setLineWidth(0.2); pdf.line(margin, y, W - margin, y);
      y += 4; pdf.setFontSize(8); pdf.setFont("helvetica", "italic"); pdf.setTextColor(...MED_GRAY);
      pdf.text("I hereby declare that all the information furnished above is true to the best of my knowledge and belief.", margin, y);
      addFooter();

      pdf.save(`${profile.name || "resume"}_GCEK_Resume.pdf`);
      toast.success("PDF downloaded!");
    } catch (err) {
      console.error("PDF error:", err);
      toast.error("PDF download failed.");
    }
    setDownloading(false);
  };

  if (status === "loading" || loading) {
    return (
      <>
        <Navbar size="large" />
        <div className="aurora-bg min-h-screen pt-32 pb-12 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="skeleton h-12 rounded-xl mb-6" />
            <div className="skeleton h-96 rounded-2xl" />
          </div>
        </div>
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <Navbar size="large" />
        <div className="aurora-bg min-h-screen pt-32 pb-12 px-6">
          <div className="max-w-7xl mx-auto text-center py-20">
            <p style={{ color: "var(--text-muted)" }}>Student not found.</p>
            <Link href="/admin" className="btn-accent mt-4 inline-flex">Back to Admin</Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar size="large" />
      <div className="aurora-bg min-h-screen" style={{ paddingTop: 110, paddingLeft: 24, paddingRight: 24, paddingBottom: 48 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>

          {/* Back link */}
          <Link href="/admin" style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 20, fontSize: 14, color: "var(--text-muted)", textDecoration: "none" }}>
            &#8592; Back to Admin Panel
          </Link>

          {/* Header Card — matches HTML .detail-header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bento-card" style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" as const }}>
              {/* Avatar — 72px circle matching HTML .detail-avatar */}
              <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#1A3A5C", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                {profile.name?.charAt(0)?.toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: 22, fontWeight: 700, fontFamily: "var(--font-space)", color: "var(--text-primary)", margin: 0 }}>{profile.name}</h2>
                <p style={{ fontSize: 14, color: "var(--text-muted)", margin: "4px 0 0" }}>
                  {profile.branch || "Engineering"} | {profile.enrollmentYear || ""}–{profile.graduationYear || ""}
                </p>
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" as const }}>
                <button onClick={() => setShowResume(!showResume)} className="btn-secondary">
                  {showResume ? "Hide Resume" : "View Resume"}
                </button>
                <button onClick={downloadPDF} disabled={downloading} className="btn-accent">
                  &#128196; {downloading ? "Generating..." : "Download PDF"}
                </button>
              </div>
            </div>

            {/* Resume toggle area */}
            {showResume && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ padding: 20, background: "var(--surface-light)", borderRadius: 14, marginTop: 16 }}>
                <div style={{ maxWidth: "210mm", margin: "0 auto" }}>
                  <div ref={resumeRef}>
                    <TemplateGCEK profile={profile} cgpa={cgpa} />
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Detail Grid — 3 columns matching HTML .detail-grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>

            {/* Personal Info */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bento-card">
              <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, color: "var(--text-primary)" }}>&#128100; Personal Information</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13 }}>
                {profile.email && <div><span style={{ color: "var(--text-muted)" }}>Email:</span><br /><strong>{profile.email}</strong></div>}
                {profile.phone && <div><span style={{ color: "var(--text-muted)" }}>Phone:</span><br /><strong>{profile.phone}</strong></div>}
                {profile.address && <div><span style={{ color: "var(--text-muted)" }}>Address:</span><br /><strong>{profile.address}</strong></div>}
                {profile.dob && <div><span style={{ color: "var(--text-muted)" }}>Date of Birth:</span><br /><strong>{profile.dob}</strong></div>}
                {profile.linkedin && <div><span style={{ color: "var(--text-muted)" }}>LinkedIn:</span><br /><strong style={{ color: "#1A3A5C" }}>{profile.linkedin}</strong></div>}
                {profile.github && <div><span style={{ color: "var(--text-muted)" }}>GitHub:</span><br /><strong style={{ color: "#1A3A5C" }}>{profile.github}</strong></div>}
                {profile.portfolio && <div><span style={{ color: "var(--text-muted)" }}>Portfolio:</span><br /><strong style={{ color: "#1A3A5C" }}>{profile.portfolio}</strong></div>}
              </div>
            </motion.div>

            {/* Education */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bento-card">
              <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, color: "var(--text-primary)" }}>&#127891; Education</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 13 }}>
                {profile.college && (
                  <div style={{ padding: 10, background: "var(--surface-light)", borderRadius: 10 }}>
                    <div style={{ fontWeight: 700 }}>B.E. {profile.branch || "Engineering"}</div>
                    <div style={{ color: "var(--text-muted)", fontSize: 12 }}>{profile.college}</div>
                    {cgpa !== "N/A" && (
                      <div style={{ marginTop: 4 }}>
                        <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 600, background: "#D6E2ED", color: "#1A3A5C" }}>CGPA: {cgpa}</span>
                      </div>
                    )}
                  </div>
                )}
                {profile.diplomaCollege && (
                  <div style={{ padding: 10, background: "var(--surface-light)", borderRadius: 10 }}>
                    <div style={{ fontWeight: 700 }}>Diploma — {profile.diplomaBranch || "Engineering"}</div>
                    <div style={{ color: "var(--text-muted)", fontSize: 12 }}>{profile.diplomaCollege}</div>
                    {profile.diplomaPercentage && <div style={{ marginTop: 4, fontSize: 12, fontWeight: 600, color: "#D4A017" }}>{profile.diplomaPercentage}%</div>}
                  </div>
                )}
                {profile.school12th && (
                  <div style={{ padding: 10, background: "var(--surface-light)", borderRadius: 10 }}>
                    <div style={{ fontWeight: 700 }}>HSC (12th) {profile.percentage12th ? `- ${profile.percentage12th}%` : ""}</div>
                    <div style={{ color: "var(--text-muted)", fontSize: 12 }}>{profile.school12th}{profile.year12th ? ` | ${profile.year12th}` : ""}</div>
                  </div>
                )}
                {profile.school10th && (
                  <div style={{ padding: 10, background: "var(--surface-light)", borderRadius: 10 }}>
                    <div style={{ fontWeight: 700 }}>SSC (10th) {profile.percentage10th ? `- ${profile.percentage10th}%` : ""}</div>
                    <div style={{ color: "var(--text-muted)", fontSize: 12 }}>{profile.school10th}{profile.year10th ? ` | ${profile.year10th}` : ""}</div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Career Objective */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bento-card">
              <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, color: "var(--text-primary)" }}>&#127919; Career Objective</h4>
              <p style={{ fontSize: 13, color: "#555", lineHeight: 1.6 }}>
                {profile.objective || "Not provided"}
              </p>
            </motion.div>

            {/* Skills — tag badges */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bento-card">
              <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, color: "var(--text-primary)" }}>&#9881; Skills</h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {(profile.skills || []).map((s: any, i: number) => (
                  <span key={i} style={{ display: "inline-block", padding: "4px 12px", borderRadius: 99, fontSize: 11, fontWeight: 600, background: "#E8EEF5", color: "#1A3A5C" }}>
                    {s.name}
                  </span>
                ))}
                {(!profile.skills || profile.skills.length === 0) && (
                  <p style={{ fontSize: 12, color: "var(--text-muted)" }}>No skills added</p>
                )}
              </div>
            </motion.div>

            {/* Projects */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bento-card">
              <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, color: "var(--text-primary)" }}>&#9733; Projects</h4>
              {(profile.projects || []).map((p: any, i: number) => (
                <div key={i} style={{ padding: 12, background: "var(--surface-light)", borderRadius: 12, marginBottom: 10 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{p.title}</div>
                  {p.techStack?.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4, margin: "6px 0" }}>
                      {p.techStack.map((t: string, j: number) => (
                        <span key={j} style={{ display: "inline-block", padding: "2px 8px", borderRadius: 99, fontSize: 10, fontWeight: 600, background: "#E8EEF5", color: "#1A3A5C" }}>{t}</span>
                      ))}
                    </div>
                  )}
                  {p.description && <p style={{ fontSize: 12, color: "#666", margin: 0 }}>{p.description}</p>}
                </div>
              ))}
              {(!profile.projects || profile.projects.length === 0) && (
                <p style={{ fontSize: 12, color: "var(--text-muted)" }}>No projects added</p>
              )}
            </motion.div>

            {/* Certs & Internships — combined card matching HTML */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="bento-card">
              <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, color: "var(--text-primary)" }}>&#128188; Certifications & Internships</h4>
              <div style={{ fontSize: 13 }}>
                {(profile.internships || []).map((intern: any, idx: number) => (
                  <div key={`i-${idx}`} style={{ padding: 10, background: "var(--surface-light)", borderRadius: 10, marginBottom: 8 }}>
                    <div style={{ fontWeight: 600 }}>&#128188; {intern.company}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{intern.role}{intern.duration ? ` | ${intern.duration}` : ""}</div>
                  </div>
                ))}
                {(profile.certifications || []).map((c: any, idx: number) => (
                  <div key={`c-${idx}`} style={{ padding: 10, background: "var(--surface-light)", borderRadius: 10, marginBottom: 8 }}>
                    <div style={{ fontWeight: 600 }}>&#128196; {c.title}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{c.issuer}{c.date ? ` | ${c.date}` : ""}</div>
                  </div>
                ))}
                {(!profile.internships || profile.internships.length === 0) && (!profile.certifications || profile.certifications.length === 0) && (
                  <p style={{ fontSize: 12, color: "var(--text-muted)" }}>No certifications or internships added</p>
                )}
              </div>
            </motion.div>

            {/* Semester Results — span-2 matching HTML */}
            {semesters.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bento-card" style={{ gridColumn: "span 2" }}>
                <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, color: "var(--text-primary)" }}>&#128202; Semester Results</h4>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => {
                    const sem = semesters.find((s: any) => s.number === num);
                    return (
                      <div key={num} style={{ padding: 12, background: "var(--surface-light)", borderRadius: 12, textAlign: "center", opacity: sem ? 1 : 0.4 }}>
                        <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4 }}>Sem {num}</div>
                        <div style={{ fontSize: 22, fontWeight: 700, background: sem ? "#1A3A5C" : "none", WebkitBackgroundClip: sem ? "text" : undefined, WebkitTextFillColor: sem ? "transparent" : "var(--text-muted)", color: sem ? undefined : "var(--text-muted)" }}>
                          {sem ? sem.sgpa.toFixed(1) : "--"}
                        </div>
                        {sem && sem.backlog > 0 && <div style={{ fontSize: 10, color: "#C62828", marginTop: 2 }}>{sem.backlog} backlog(s)</div>}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Extra Activities */}
            {profile.extraActivities?.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="bento-card">
                <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, color: "var(--text-primary)" }}>&#11088; Extra Activities</h4>
                <div style={{ fontSize: 13 }}>
                  {profile.extraActivities.map((a: string, i: number) => (
                    <div key={i} style={{ padding: "4px 0", color: "var(--text-secondary)" }}>• {a}</div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}
