"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import TemplateGCEK from "@/components/templates/TemplateGCEK";
import jsPDF from "jspdf";
import Link from "next/link";
import {
  FiArrowLeft,
  FiDownload,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiGithub,
  FiLinkedin,
  FiGlobe,
  FiCode,
  FiBookOpen,
  FiAward,
  FiBriefcase,
  FiTarget,
  FiStar,
} from "react-icons/fi";
import toast from "react-hot-toast";

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function AdminStudentDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [showResume, setShowResume] = useState(false);
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

  const semesters: any[] = (profile?.semesters || []).filter((s: any) => s.sgpa > 0);
  const cgpa =
    semesters.length > 0
      ? (semesters.reduce((sum: number, s: any) => sum + (s.sgpa || 0), 0) / semesters.length).toFixed(2)
      : "N/A";

  const downloadPDF = () => {
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

      // Emblem
      const emblemSize = 16;
      const ecx = margin + emblemSize / 2;
      const ecy = y + emblemSize / 2 + 1;
      pdf.setDrawColor(...NAVY); pdf.setLineWidth(0.6); pdf.setFillColor(255, 255, 255);
      pdf.circle(ecx, ecy, emblemSize / 2, "FD");
      pdf.setDrawColor(...GOLD); pdf.setLineWidth(0.35);
      pdf.circle(ecx, ecy, emblemSize / 2 - 1.2, "S");
      pdf.setFillColor(...NAVY); pdf.setDrawColor(...NAVY);
      pdf.circle(ecx, ecy, emblemSize / 2 - 1.8, "F");
      const innerR = emblemSize / 2 - 1.8;
      const toothLen = 1.2;
      pdf.setDrawColor(...GOLD); pdf.setLineWidth(0.4);
      for (let i = 0; i < 16; i++) {
        const angle = (2 * Math.PI * i) / 16;
        pdf.line(ecx + (innerR - 0.3) * Math.cos(angle), ecy + (innerR - 0.3) * Math.sin(angle), ecx + (innerR + toothLen) * Math.cos(angle), ecy + (innerR + toothLen) * Math.sin(angle));
      }
      const spokeR = emblemSize / 2 - 4.2;
      pdf.setLineWidth(0.15);
      for (let i = 0; i < 12; i++) {
        const angle = (2 * Math.PI * i) / 12;
        pdf.line(ecx, ecy, ecx + spokeR * Math.cos(angle), ecy + spokeR * Math.sin(angle));
      }
      pdf.setFillColor(...GOLD); pdf.circle(ecx, ecy, 0.9, "F");
      for (let i = 0; i < 12; i++) {
        const angle = (2 * Math.PI * i) / 12;
        pdf.circle(ecx + spokeR * Math.cos(angle), ecy + spokeR * Math.sin(angle), 0.35, "F");
      }
      pdf.setFontSize(4); pdf.setFont("helvetica", "bold"); pdf.setTextColor(255, 255, 255);
      const textR = emblemSize / 2 - 2.5;
      ["G", "C", "E", "K"].forEach((ch, i) => {
        const angle = Math.PI / 2 + 0.28 - i * 0.19;
        pdf.text(ch, ecx + textR * Math.cos(angle), ecy - textR * Math.sin(angle), { align: "center" });
      });
      pdf.setFontSize(3.5);
      ["1", "9", "6", "0"].forEach((ch, i) => {
        const angle = -Math.PI / 2 + 0.25 - i * 0.17;
        pdf.text(ch, ecx + textR * Math.cos(angle), ecy - textR * Math.sin(angle), { align: "center" });
      });

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
        <Navbar />
        <div className="aurora-bg min-h-screen pt-28 pb-12 px-6">
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
        <Navbar />
        <div className="aurora-bg min-h-screen pt-28 pb-12 px-6">
          <div className="max-w-7xl mx-auto text-center py-20">
            <p style={{ color: "var(--text-muted)" }}>Student not found.</p>
            <Link href="/admin" className="btn-accent mt-4 inline-flex">Back to Admin</Link>
          </div>
        </div>
      </>
    );
  }

  const InfoItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | null | undefined }) => (
    value ? (
      <div className="flex items-start gap-2.5 py-1.5">
        <span style={{ color: "var(--text-muted)" }}>{icon}</span>
        <div>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</p>
          <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{value}</p>
        </div>
      </div>
    ) : null
  );

  return (
    <>
      <Navbar />
      <div className="aurora-bg min-h-screen pt-28 pb-12 px-6">
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Back Button & Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <Link href="/admin" className="inline-flex items-center gap-2 text-sm mb-4 hover:text-indigo-500 transition-colors" style={{ color: "var(--text-muted)" }}>
              <FiArrowLeft size={16} /> Back to Admin Panel
            </Link>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                {profile.photo ? (
                  <img src={profile.photo} alt={profile.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-200" />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-teal-400 flex items-center justify-center text-2xl font-bold text-white">
                    {profile.name?.charAt(0)?.toUpperCase()}
                  </div>
                )}
                <div>
                  <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-space)", color: "var(--text-primary)" }}>
                    {profile.name}
                  </h1>
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                    {profile.branch || "Engineering"} {profile.enrollmentYear && `| ${profile.enrollmentYear}–${profile.graduationYear}`}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowResume(!showResume)} className="btn-secondary">
                  <FiTarget size={16} /> {showResume ? "Hide Resume" : "View Resume"}
                </button>
                <button onClick={downloadPDF} disabled={downloading} className="btn-accent">
                  <FiDownload size={16} /> {downloading ? "Generating..." : "Download PDF"}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Resume Preview */}
          {showResume && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <div className="max-w-[210mm] mx-auto shadow-2xl rounded-lg overflow-hidden border border-slate-200/20">
                <div ref={resumeRef}>
                  <TemplateGCEK profile={profile} cgpa={cgpa} />
                </div>
              </div>
            </motion.div>
          )}

          {/* Student Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Personal Info */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bento-card">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                <FiUser size={15} className="text-indigo-500" /> Personal Information
              </h3>
              <div className="space-y-1">
                <InfoItem icon={<FiMail size={14} />} label="Email" value={profile.email} />
                <InfoItem icon={<FiPhone size={14} />} label="Phone" value={profile.phone} />
                <InfoItem icon={<FiMapPin size={14} />} label="Address" value={profile.address} />
                <InfoItem icon={<FiCalendar size={14} />} label="Date of Birth" value={profile.dob} />
                <InfoItem icon={<FiLinkedin size={14} />} label="LinkedIn" value={profile.linkedin} />
                <InfoItem icon={<FiGithub size={14} />} label="GitHub" value={profile.github} />
                <InfoItem icon={<FiGlobe size={14} />} label="Portfolio" value={profile.portfolio} />
              </div>
            </motion.div>

            {/* Education */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bento-card">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                <FiBookOpen size={15} className="text-teal-500" /> Education
              </h3>
              <div className="space-y-3">
                {profile.college && (
                  <div className="p-3 rounded-xl" style={{ background: "rgba(99,102,241,0.05)" }}>
                    <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>B.E. — {profile.branch}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{profile.college}</p>
                    {cgpa !== "N/A" && <p className="text-xs mt-1 font-medium text-indigo-500">CGPA: {cgpa}</p>}
                  </div>
                )}
                {profile.diplomaCollege && (
                  <div className="p-3 rounded-xl" style={{ background: "rgba(20,184,166,0.05)" }}>
                    <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Diploma — {profile.diplomaBranch}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{profile.diplomaCollege}</p>
                    {profile.diplomaPercentage && <p className="text-xs mt-1 font-medium text-teal-500">{profile.diplomaPercentage}%</p>}
                  </div>
                )}
                {profile.school12th && (
                  <div className="p-3 rounded-xl" style={{ background: "rgba(99,102,241,0.05)" }}>
                    <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>HSC — {profile.board12th}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{profile.school12th}</p>
                    {profile.percentage12th && <p className="text-xs mt-1 font-medium text-indigo-500">{profile.percentage12th}%</p>}
                  </div>
                )}
                {profile.school10th && (
                  <div className="p-3 rounded-xl" style={{ background: "rgba(20,184,166,0.05)" }}>
                    <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>SSC — {profile.board10th}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{profile.school10th}</p>
                    {profile.percentage10th && <p className="text-xs mt-1 font-medium text-teal-500">{profile.percentage10th}%</p>}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Career Objective */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bento-card">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                <FiTarget size={15} className="text-purple-500" /> Career Objective
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {profile.objective || "Not provided"}
              </p>
            </motion.div>

            {/* Skills */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bento-card">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                <FiCode size={15} className="text-amber-500" /> Skills ({profile.skills?.length || 0})
              </h3>
              <div className="flex flex-wrap gap-2">
                {(profile.skills || []).map((s: any, i: number) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg text-xs font-medium" style={{ background: "rgba(99,102,241,0.1)", color: "#6366F1" }}>
                    {s.name}
                  </span>
                ))}
                {(!profile.skills || profile.skills.length === 0) && (
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>No skills added</p>
                )}
              </div>
            </motion.div>

            {/* Projects */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bento-card">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                <FiBookOpen size={15} className="text-emerald-500" /> Projects ({profile.projects?.length || 0})
              </h3>
              <div className="space-y-3">
                {(profile.projects || []).map((p: any, i: number) => (
                  <div key={i} className="p-3 rounded-xl" style={{ background: "rgba(16,185,129,0.05)" }}>
                    <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{p.title}</p>
                    {p.description && <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{p.description}</p>}
                    {p.techStack?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {p.techStack.map((t: string, j: number) => (
                          <span key={j} className="px-1.5 py-0.5 rounded text-[10px]" style={{ background: "rgba(16,185,129,0.1)", color: "#10B981" }}>{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {(!profile.projects || profile.projects.length === 0) && (
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>No projects added</p>
                )}
              </div>
            </motion.div>

            {/* Certifications & Internships */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bento-card">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                <FiAward size={15} className="text-red-500" /> Certifications ({profile.certifications?.length || 0})
              </h3>
              <div className="space-y-2 mb-6">
                {(profile.certifications || []).map((c: any, i: number) => (
                  <div key={i} className="p-2.5 rounded-xl" style={{ background: "rgba(239,68,68,0.05)" }}>
                    <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{c.title}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{c.issuer} {c.date && `| ${c.date}`}</p>
                  </div>
                ))}
                {(!profile.certifications || profile.certifications.length === 0) && (
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>No certifications added</p>
                )}
              </div>

              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                <FiBriefcase size={15} className="text-blue-500" /> Internships ({profile.internships?.length || 0})
              </h3>
              <div className="space-y-2">
                {(profile.internships || []).map((i: any, idx: number) => (
                  <div key={idx} className="p-2.5 rounded-xl" style={{ background: "rgba(59,130,246,0.05)" }}>
                    <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{i.role} — {i.company}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{i.duration}</p>
                  </div>
                ))}
                {(!profile.internships || profile.internships.length === 0) && (
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>No internships added</p>
                )}
              </div>
            </motion.div>

            {/* Semesters */}
            {semesters.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="bento-card lg:col-span-2">
                <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                  <FiStar size={15} className="text-yellow-500" /> Semester Results (CGPA: {cgpa})
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {semesters.map((s: any) => (
                    <div key={s.id} className="p-3 rounded-xl text-center" style={{ background: "rgba(99,102,241,0.05)" }}>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>Sem {s.number}</p>
                      <p className="text-lg font-bold text-indigo-500">{s.sgpa.toFixed(2)}</p>
                      {s.backlog > 0 && <p className="text-[10px] text-red-400">{s.backlog} backlog(s)</p>}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Extra Activities */}
            {profile.extraActivities?.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="bento-card">
                <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                  <FiStar size={15} className="text-orange-500" /> Extra Activities
                </h3>
                <ul className="space-y-1.5">
                  {profile.extraActivities.map((a: string, i: number) => (
                    <li key={i} className="text-sm flex items-start gap-2" style={{ color: "var(--text-secondary)" }}>
                      <span className="text-orange-400 mt-1">•</span> {a}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
