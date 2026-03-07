"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import jsPDF from "jspdf";
import Link from "next/link";
import {
  FiDownload,
  FiLayout,
  FiShare2,
  FiSmartphone,
  FiMonitor,
} from "react-icons/fi";
import toast from "react-hot-toast";

import TemplateAurora from "@/components/templates/TemplateAurora";
import TemplateMinimal from "@/components/templates/TemplateMinimal";
import TemplateBold from "@/components/templates/TemplateBold";

/* eslint-disable @typescript-eslint/no-explicit-any */

const templates = [
  {
    id: "aurora",
    name: "Aurora",
    desc: "Dark premium",
    component: TemplateAurora,
  },
  {
    id: "minimal",
    name: "Minimal",
    desc: "Light & ATS-friendly",
    component: TemplateMinimal,
  },
  {
    id: "bold",
    name: "Bold",
    desc: "Creative two-column",
    component: TemplateBold,
  },
];

export default function PreviewPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [template, setTemplate] = useState("aurora");
  const [downloading, setDownloading] = useState(false);
  const [mobileView, setMobileView] = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/profile")
        .then((res) => res.json())
        .then((data) => {
          setProfile(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [status]);

  const downloadPDF = () => {
    if (!profile) return;
    setDownloading(true);
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const W = pdf.internal.pageSize.getWidth();
      const H = pdf.internal.pageSize.getHeight();
      const margin = 14;
      const contentW = W - margin * 2;
      let y = margin;

      const checkPage = (need: number) => {
        if (y + need > H - margin) { pdf.addPage(); y = margin; }
      };

      // ===== HEADER =====
      const headerH = 38;
      pdf.setFillColor(30, 41, 59);
      pdf.rect(0, 0, W, headerH, "F");
      // Accent line
      pdf.setFillColor(99, 102, 241);
      pdf.rect(0, headerH, W, 1, "F");

      // Photo in header (if base64)
      let textStartX = margin;
      if (profile.photo && profile.photo.startsWith("data:image")) {
        try {
          pdf.addImage(profile.photo, "JPEG", margin, 6, 26, 26);
          textStartX = margin + 30;
        } catch { /* skip photo on error */ }
      }

      // Name
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(20);
      pdf.setFont("helvetica", "bold");
      pdf.text(profile.name || "Your Name", textStartX, 16);

      // Branch
      if (profile.branch) {
        pdf.setFontSize(9);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(165, 180, 210);
        pdf.text(profile.branch, textStartX, 22);
      }

      // Contact row
      const contacts: string[] = [];
      if (profile.email) contacts.push(profile.email);
      if (profile.phone) contacts.push(profile.phone);
      if (profile.address) contacts.push(profile.address);
      if (profile.github) contacts.push(profile.github);
      if (profile.linkedin) contacts.push(profile.linkedin);
      if (contacts.length > 0) {
        pdf.setFontSize(7.5);
        pdf.setTextColor(140, 155, 180);
        // Split into two rows if too long
        const row1 = contacts.slice(0, 3).join("  |  ");
        const row2 = contacts.slice(3).join("  |  ");
        pdf.text(row1, textStartX, 28);
        if (row2) pdf.text(row2, textStartX, 33);
      }

      y = headerH + 6;

      // ===== HELPERS =====
      const sectionTitle = (title: string) => {
        checkPage(12);
        y += 3;
        pdf.setFontSize(9.5);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(50, 50, 80);
        pdf.text(title.toUpperCase(), margin, y);
        y += 1.5;
        pdf.setDrawColor(99, 102, 241);
        pdf.setLineWidth(0.4);
        pdf.line(margin, y, W - margin, y);
        y += 4.5;
      };

      const addWrapped = (text: string, fontSize: number, color: [number, number, number]) => {
        pdf.setFontSize(fontSize);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(...color);
        const lines = pdf.splitTextToSize(text, contentW);
        lines.forEach((line: string) => {
          checkPage(4.5);
          pdf.text(line, margin, y);
          y += fontSize * 0.42;
        });
        y += 1.5;
      };

      // ===== SECTIONS =====

      // Objective
      if (profile.objective) {
        sectionTitle("Career Objective");
        addWrapped(profile.objective, 9, [70, 70, 70]);
      }

      // Education
      if (profile.college) {
        sectionTitle("Education");
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(30, 30, 30);
        pdf.text(profile.college, margin, y);
        if (profile.enrollmentYear && profile.graduationYear) {
          pdf.setFont("helvetica", "normal");
          pdf.setTextColor(120, 120, 120);
          const yearText = `${profile.enrollmentYear} - ${profile.graduationYear}`;
          pdf.text(yearText, W - margin - pdf.getTextWidth(yearText), y);
        }
        y += 4.5;
        if (profile.branch) {
          pdf.setFontSize(8.5);
          pdf.setTextColor(80, 80, 80);
          pdf.text(profile.branch, margin, y);
        }
        if (cgpa !== "N/A") {
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(9);
          pdf.setTextColor(99, 102, 241);
          pdf.text(`CGPA: ${cgpa}`, W - margin - pdf.getTextWidth(`CGPA: ${cgpa}`), y);
        }
        y += 6;
      }

      // School
      if (profile.school10th || profile.school12th) {
        sectionTitle("School Education");
        [
          { label: "12th", school: profile.school12th, board: profile.board12th, pct: profile.percentage12th, yr: profile.year12th },
          { label: "10th", school: profile.school10th, board: profile.board10th, pct: profile.percentage10th, yr: profile.year10th },
        ].forEach((s) => {
          if (!s.school) return;
          checkPage(8);
          pdf.setFontSize(9);
          pdf.setFont("helvetica", "bold");
          pdf.setTextColor(30, 30, 30);
          pdf.text(`${s.label} - ${s.school}`, margin, y);
          if (s.pct) {
            pdf.setTextColor(99, 102, 241);
            const pctText = `${s.pct}%`;
            pdf.text(pctText, W - margin - pdf.getTextWidth(pctText), y);
          }
          y += 3.5;
          pdf.setFont("helvetica", "normal");
          pdf.setTextColor(100, 100, 100);
          pdf.setFontSize(8);
          const details = [s.board, s.yr].filter(Boolean).join(" | ");
          if (details) pdf.text(details, margin, y);
          y += 5;
        });
      }

      // Semesters (compact inline)
      const sems = profile.semesters || [];
      if (sems.length > 0) {
        sectionTitle("Semester Results");
        checkPage(6);
        const semParts = sems.map((sem: { number: number; sgpa: number }) => `Sem ${sem.number}: ${sem.sgpa.toFixed(2)}`);
        pdf.setFontSize(8.5);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(50, 50, 50);
        const semText = semParts.join("    ");
        const semLines = pdf.splitTextToSize(semText, contentW);
        semLines.forEach((line: string) => {
          checkPage(4);
          pdf.text(line, margin, y);
          y += 4;
        });
        y += 2;
      }

      // Skills (grouped by category)
      const skills = profile.skills || [];
      if (skills.length > 0) {
        sectionTitle("Technical Skills");
        const grouped: Record<string, string[]> = {};
        skills.forEach((s: { name: string; category: string }) => {
          const cat = s.category || "General";
          if (!grouped[cat]) grouped[cat] = [];
          grouped[cat].push(s.name);
        });
        Object.entries(grouped).forEach(([cat, names]) => {
          checkPage(5);
          pdf.setFontSize(8.5);
          pdf.setFont("helvetica", "bold");
          pdf.setTextColor(60, 60, 80);
          pdf.text(`${cat}: `, margin, y);
          const catWidth = pdf.getTextWidth(`${cat}: `);
          pdf.setFont("helvetica", "normal");
          pdf.setTextColor(60, 60, 60);
          const namesStr = names.join(", ");
          const nameLines = pdf.splitTextToSize(namesStr, contentW - catWidth);
          nameLines.forEach((line: string, idx: number) => {
            checkPage(4);
            pdf.text(line, margin + (idx === 0 ? catWidth : 0), y);
            y += 4;
          });
          y += 1;
        });
        y += 1;
      }

      // Projects
      const projects = profile.projects || [];
      if (projects.length > 0) {
        sectionTitle("Projects");
        projects.forEach((p: { title: string; description: string; techStack: string[] }) => {
          checkPage(14);
          pdf.setFontSize(9.5);
          pdf.setFont("helvetica", "bold");
          pdf.setTextColor(30, 30, 30);
          pdf.text(p.title, margin, y);
          y += 4;
          if (p.description) addWrapped(p.description, 8.5, [80, 80, 80]);
          if (p.techStack?.length > 0) {
            pdf.setFontSize(7.5);
            pdf.setFont("helvetica", "italic");
            pdf.setTextColor(99, 102, 241);
            const techText = "Tech: " + p.techStack.join(", ");
            const techLines = pdf.splitTextToSize(techText, contentW);
            techLines.forEach((line: string) => {
              checkPage(4);
              pdf.text(line, margin, y);
              y += 3.5;
            });
          }
          y += 2;
        });
      }

      // Internships
      const interns = profile.internships || [];
      if (interns.length > 0) {
        sectionTitle("Internships");
        interns.forEach((i: { role: string; company: string; duration: string; description: string }) => {
          checkPage(12);
          pdf.setFontSize(9.5);
          pdf.setFont("helvetica", "bold");
          pdf.setTextColor(30, 30, 30);
          pdf.text(i.role || i.company, margin, y);
          if (i.duration) {
            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(8);
            pdf.setTextColor(120, 120, 120);
            pdf.text(i.duration, W - margin - pdf.getTextWidth(i.duration), y);
          }
          y += 4;
          if (i.company && i.role) {
            pdf.setFontSize(8.5);
            pdf.setTextColor(99, 102, 241);
            pdf.text(i.company, margin, y);
            y += 3.5;
          }
          if (i.description) addWrapped(i.description, 8.5, [80, 80, 80]);
          y += 1.5;
        });
      }

      // Certifications
      const certs = profile.certifications || [];
      if (certs.length > 0) {
        sectionTitle("Certifications");
        certs.forEach((c: { title: string; issuer: string; date: string }) => {
          checkPage(5);
          pdf.setFontSize(9);
          pdf.setFont("helvetica", "bold");
          pdf.setTextColor(30, 30, 30);
          pdf.text(c.title, margin, y);
          pdf.setFont("helvetica", "normal");
          pdf.setTextColor(100, 100, 100);
          const info = [c.issuer, c.date].filter(Boolean).join(", ");
          if (info) {
            const titleW = pdf.getTextWidth(c.title);
            if (titleW + pdf.getTextWidth(` — ${info}`) < contentW) {
              pdf.text(` — ${info}`, margin + titleW, y);
            } else {
              y += 3.5;
              pdf.text(info, margin, y);
            }
          }
          y += 4.5;
        });
      }

      pdf.save(`${profile.name || "resume"}_ResumeMint.pdf`);
      toast.success("PDF downloaded!");
    } catch (err) {
      console.error("PDF error:", err);
      toast.error("PDF download failed.");
    }
    setDownloading(false);
  };

  // Calculate CGPA from semesters
  const semesters: any[] = profile?.semesters || [];
  const cgpa =
    semesters.length > 0
      ? (
          semesters.reduce((sum: number, s: any) => sum + (s.sgpa || 0), 0) /
          semesters.length
        ).toFixed(2)
      : "N/A";

  const ActiveTemplate = templates.find((t) => t.id === template)?.component || TemplateAurora;

  if (status === "loading" || loading) {
    return (
      <>
        <Navbar />
        <div className="aurora-bg min-h-screen pt-28 pb-12 px-6">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
            <div className="lg:w-72 shrink-0">
              <div className="skeleton h-80 rounded-2xl" />
            </div>
            <div className="flex-1">
              <div className="skeleton h-[800px] rounded-2xl" />
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!profile) return null;

  return (
    <>
      <Navbar />
      <div className="aurora-bg min-h-screen pt-28 pb-12 px-6">
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:w-72 shrink-0"
          >
            <div className="lg:sticky lg:top-28">
              <div className="bento-card">
                {/* Template Selector */}
                <div className="flex items-center gap-2 mb-4">
                  <FiLayout className="text-[#6366F1]" size={18} />
                  <span
                    className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider"
                    style={{ fontFamily: "var(--font-space)" }}
                  >
                    Template
                  </span>
                </div>

                <div className="flex flex-col gap-2 mb-5">
                  {templates.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTemplate(t.id)}
                      className={`text-left px-4 py-3 rounded-xl transition-all duration-200 border ${
                        template === t.id
                          ? "bg-[rgba(99,102,241,0.15)] border-[rgba(99,102,241,0.4)] text-[var(--text-primary)]"
                          : "bg-[var(--surface-light)] border-transparent text-[var(--text-secondary)] hover:border-[var(--border-hover)]"
                      }`}
                    >
                      <span
                        className="text-sm font-semibold block"
                        style={{ fontFamily: "var(--font-space)" }}
                      >
                        {t.name}
                      </span>
                      <span className="text-xs text-[var(--text-muted)]">
                        {t.desc}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Divider */}
                <div className="border-t border-[var(--border)] my-4" />

                {/* View Toggle */}
                <div className="flex items-center gap-2 mb-4">
                  <button
                    onClick={() => setMobileView(false)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm transition-all ${
                      !mobileView
                        ? "bg-[rgba(99,102,241,0.15)] text-[#818CF8]"
                        : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                    }`}
                  >
                    <FiMonitor size={14} />
                    Desktop
                  </button>
                  <button
                    onClick={() => setMobileView(true)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm transition-all ${
                      mobileView
                        ? "bg-[rgba(99,102,241,0.15)] text-[#818CF8]"
                        : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                    }`}
                  >
                    <FiSmartphone size={14} />
                    Mobile
                  </button>
                </div>

                {/* Download PDF */}
                <button
                  onClick={downloadPDF}
                  disabled={downloading}
                  className="btn-accent w-full justify-center mb-3"
                >
                  <FiDownload size={16} />
                  {downloading ? "Generating..." : "Download PDF"}
                </button>

                {/* Share Profile */}
                <Link
                  href={`/profile/${profile.id}`}
                  className="btn-secondary w-full justify-center"
                >
                  <FiShare2 size={16} />
                  Share Profile
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Main Preview Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-1 flex justify-center"
          >
            <div
              className={`transition-all duration-300 ${
                mobileView ? "max-w-[400px]" : "w-full"
              }`}
            >
              <div ref={resumeRef}>
                <ActiveTemplate profile={profile} cgpa={cgpa} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
