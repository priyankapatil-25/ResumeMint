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
  FiSmartphone,
  FiMonitor,
} from "react-icons/fi";
import toast from "react-hot-toast";

import TemplateGCEK from "@/components/templates/TemplateGCEK";

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function PreviewPage() {
  const { status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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
      const margin = 18;
      const contentW = W - margin * 2;
      let y = 0;
      let pageNum = 1;

      // ─── GCEK Color Palette ───
      const NAVY: [number, number, number] = [27, 42, 74];
      const BLUE: [number, number, number] = [44, 95, 138];
      const GOLD: [number, number, number] = [196, 151, 47];
      const TEXT_BLK: [number, number, number] = [26, 26, 26];
      const MED_GRAY: [number, number, number] = [74, 74, 74];
      const SUBTLE: [number, number, number] = [136, 153, 170];

      // ─── Footer on every page ───
      const addFooter = () => {
        // Gold accent line
        pdf.setDrawColor(...GOLD);
        pdf.setLineWidth(0.3);
        pdf.line(0, H - 7, W, H - 7);
        // Navy footer bar
        pdf.setFillColor(...NAVY);
        pdf.rect(0, H - 6.5, W, 6.5, "F");
        // Footer text
        pdf.setFontSize(5.5);
        pdf.setTextColor(170, 187, 204);
        pdf.setFont("helvetica", "normal");
        pdf.text(profile.college || "GCE Karad" + "  |  Shivaji University", margin, H - 2.5);
        pdf.text(`Page ${pageNum}`, W - margin - pdf.getTextWidth(`Page ${pageNum}`), H - 2.5);
      };

      const checkPage = (need: number) => {
        if (y + need > H - 14) {
          addFooter();
          pdf.addPage();
          pageNum++;
          y = margin;
        }
      };

      // ═══════════════════════════════════════════════════════════
      // BRANDED HEADER
      // ═══════════════════════════════════════════════════════════

      // Top navy accent bar
      pdf.setFillColor(...NAVY);
      pdf.rect(0, 0, W, 2, "F");
      // Gold line below
      pdf.setFillColor(...GOLD);
      pdf.rect(0, 2, W, 0.5, "F");

      y = 4;

      // ─── Draw GCEK Emblem ───
      const emblemSize = 16; // mm
      const ecx = margin + emblemSize / 2;
      const ecy = y + emblemSize / 2 + 1;

      // Outer ring (white fill, navy stroke)
      pdf.setDrawColor(...NAVY);
      pdf.setLineWidth(0.6);
      pdf.setFillColor(255, 255, 255);
      pdf.circle(ecx, ecy, emblemSize / 2, "FD");

      // Gold ring
      pdf.setDrawColor(...GOLD);
      pdf.setLineWidth(0.35);
      pdf.circle(ecx, ecy, emblemSize / 2 - 1.2, "S");

      // Inner dark circle
      pdf.setFillColor(...NAVY);
      pdf.setDrawColor(...NAVY);
      pdf.circle(ecx, ecy, emblemSize / 2 - 1.8, "F");

      // Gear teeth (gold lines around inner circle)
      const innerR = emblemSize / 2 - 1.8;
      const toothLen = 1.2;
      pdf.setDrawColor(...GOLD);
      pdf.setLineWidth(0.4);
      for (let i = 0; i < 16; i++) {
        const angle = (2 * Math.PI * i) / 16;
        const x1 = ecx + (innerR - 0.3) * Math.cos(angle);
        const y1 = ecy + (innerR - 0.3) * Math.sin(angle);
        const x2 = ecx + (innerR + toothLen) * Math.cos(angle);
        const y2 = ecy + (innerR + toothLen) * Math.sin(angle);
        pdf.line(x1, y1, x2, y2);
      }

      // Spokes (gold lines from center)
      const spokeR = emblemSize / 2 - 4.2;
      pdf.setLineWidth(0.15);
      for (let i = 0; i < 12; i++) {
        const angle = (2 * Math.PI * i) / 12;
        const x2 = ecx + spokeR * Math.cos(angle);
        const y2 = ecy + spokeR * Math.sin(angle);
        pdf.line(ecx, ecy, x2, y2);
      }

      // Center dot (gold)
      pdf.setFillColor(...GOLD);
      pdf.circle(ecx, ecy, 0.9, "F");

      // Spoke tip dots
      for (let i = 0; i < 12; i++) {
        const angle = (2 * Math.PI * i) / 12;
        const dx = ecx + spokeR * Math.cos(angle);
        const dy = ecy + spokeR * Math.sin(angle);
        pdf.circle(dx, dy, 0.35, "F");
      }

      // "GCEK" text along top arc
      pdf.setFontSize(4);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(255, 255, 255);
      const textR = emblemSize / 2 - 2.5;
      const gcekLetters = ["G", "C", "E", "K"];
      const gcekStartAngle = Math.PI / 2 + 0.28;
      gcekLetters.forEach((ch, i) => {
        const angle = gcekStartAngle - i * 0.19;
        const tx = ecx + textR * Math.cos(angle);
        const ty = ecy - textR * Math.sin(angle);
        pdf.text(ch, tx, ty, { align: "center" });
      });

      // "1960" text along bottom arc
      pdf.setFontSize(3.5);
      const yearLetters = ["1", "9", "6", "0"];
      const yearStartAngle = -Math.PI / 2 + 0.25;
      yearLetters.forEach((ch, i) => {
        const angle = yearStartAngle - i * 0.17;
        const tx = ecx + textR * Math.cos(angle);
        const ty = ecy - textR * Math.sin(angle);
        pdf.text(ch, tx, ty, { align: "center" });
      });

      // ─── Name & Contact (offset for emblem) ───
      const nameX = margin + emblemSize + 4;

      // Name (large, navy)
      pdf.setFontSize(19);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(...NAVY);
      pdf.text((profile.name || "YOUR NAME").toUpperCase(), nameX, y + 7);

      // Contact line
      const contacts: string[] = [];
      if (profile.phone) contacts.push(profile.phone);
      if (profile.email) contacts.push(profile.email);
      if (profile.linkedin) contacts.push(profile.linkedin);
      if (profile.github) contacts.push(profile.github);
      if (contacts.length > 0) {
        pdf.setFontSize(7.5);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(...MED_GRAY);
        const row1 = contacts.slice(0, 3).join("  |  ");
        const row2 = contacts.slice(3).join("  |  ");
        pdf.text(row1, nameX, y + 12);
        if (row2) pdf.text(row2, nameX, y + 16);
      }

      // Student photo (right side of header)
      const photoSize = 18; // mm
      let photoEndX = W - margin;
      if (profile.photo && profile.photo.startsWith("data:image")) {
        try {
          const photoX = W - margin - photoSize;
          const photoY = y + 1;
          // Gold border around photo
          pdf.setDrawColor(...GOLD);
          pdf.setLineWidth(0.4);
          pdf.rect(photoX - 0.5, photoY - 0.5, photoSize + 1, photoSize + 1, "S");
          pdf.addImage(profile.photo, "JPEG", photoX, photoY, photoSize, photoSize);
          photoEndX = photoX - 3;
        } catch { /* skip photo on error */ }
      }

      // College tagline (right-aligned, before photo)
      pdf.setFontSize(5.5);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(...SUBTLE);
      const collegeName = profile.college || "Government College of Engineering, Karad";
      pdf.text(collegeName, photoEndX - pdf.getTextWidth(collegeName), y + 5);
      const subTag = "Autonomous | Shivaji University";
      pdf.text(subTag, photoEndX - pdf.getTextWidth(subTag), y + 9);

      // Bottom separator lines
      y += 20;
      pdf.setDrawColor(...BLUE);
      pdf.setLineWidth(0.5);
      pdf.line(margin, y, W - margin, y);
      pdf.setDrawColor(...GOLD);
      pdf.setLineWidth(0.2);
      pdf.line(margin, y + 1, W - margin, y + 1);

      y += 5;

      // ═══════════════════════════════════════════════════════════
      // HELPERS (GCEK styled)
      // ═══════════════════════════════════════════════════════════

      const sectionTitle = (title: string) => {
        checkPage(12);
        y += 4;
        // Section title text (navy, uppercase)
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(...NAVY);
        pdf.text(title.toUpperCase(), margin, y);
        y += 1.5;
        // Blue underline (full width)
        pdf.setDrawColor(...BLUE);
        pdf.setLineWidth(0.5);
        pdf.line(margin, y, W - margin, y);
        // Gold accent line (40% width)
        y += 0.5;
        pdf.setDrawColor(...GOLD);
        pdf.setLineWidth(0.2);
        pdf.line(margin, y, margin + contentW * 0.4, y);
        y += 4;
      };

      const entryHeader = (left: string, right?: string) => {
        checkPage(6);
        pdf.setFontSize(9.5);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(...TEXT_BLK);
        pdf.text(left, margin, y);
        if (right) {
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(8.5);
          pdf.setTextColor(...MED_GRAY);
          pdf.text(right, W - margin - pdf.getTextWidth(right), y);
        }
        y += 4;
      };

      const subtitle = (text: string) => {
        pdf.setFontSize(9);
        pdf.setFont("helvetica", "italic");
        pdf.setTextColor(...BLUE);
        pdf.text(text, margin, y);
        y += 3.5;
      };

      const bullet = (text: string) => {
        pdf.setFontSize(9);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(...TEXT_BLK);
        const bulletX = margin + 2;
        const textX = margin + 6;
        const lines = pdf.splitTextToSize(text, contentW - 6);
        lines.forEach((line: string, idx: number) => {
          checkPage(4);
          if (idx === 0) pdf.text("\u2022", bulletX, y);
          pdf.text(line, textX, y);
          y += 3.8;
        });
        y += 0.5;
      };

      const skillsRow = (label: string, value: string) => {
        checkPage(5);
        pdf.setFontSize(9);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(...TEXT_BLK);
        pdf.text(label, margin, y);
        const labelW = contentW * 0.28;
        pdf.setFont("helvetica", "normal");
        const valueLines = pdf.splitTextToSize(value, contentW - labelW);
        valueLines.forEach((line: string, idx: number) => {
          if (idx > 0) { checkPage(4); }
          pdf.text(line, margin + labelW, y);
          if (idx < valueLines.length - 1) y += 3.8;
        });
        y += 4;
      };

      // ═══════════════════════════════════════════════════════════
      // SECTIONS
      // ═══════════════════════════════════════════════════════════

      // ── Career Objective ──
      if (profile.objective) {
        sectionTitle("Career Objective");
        pdf.setFontSize(9);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(...TEXT_BLK);
        const objLines = pdf.splitTextToSize(profile.objective, contentW);
        objLines.forEach((line: string) => {
          checkPage(4);
          pdf.text(line, margin, y);
          y += 3.8;
        });
        y += 2;
      }

      // ── Education ──
      sectionTitle("Education");

      if (profile.college) {
        entryHeader(
          `Bachelor of Engineering (${profile.branch || "Engineering"})`,
          profile.enrollmentYear && profile.graduationYear
            ? `${profile.enrollmentYear} \u2013 ${profile.graduationYear}` : undefined
        );
        subtitle(`${profile.college} \u2014 Shivaji University`);
        if (cgpa !== "N/A") bullet(`CGPA: ${cgpa}`);
      }

      // Diploma
      if (profile.diplomaCollege) {
        y += 1;
        entryHeader(
          `Diploma \u2014 ${profile.diplomaBranch || "Engineering"}`,
          profile.diplomaYear || undefined
        );
        subtitle(profile.diplomaCollege);
        if (profile.diplomaPercentage) bullet(`Percentage / CGPA: ${profile.diplomaPercentage}`);
      }

      // 12th
      if (profile.school12th) {
        y += 1;
        entryHeader(
          `HSC (Science) \u2014 ${profile.board12th || "Maharashtra State Board"}`,
          profile.year12th || undefined
        );
        subtitle(profile.school12th);
        if (profile.percentage12th) bullet(`Percentage: ${profile.percentage12th}%`);
      }

      // 10th
      if (profile.school10th) {
        y += 1;
        entryHeader(
          `SSC \u2014 ${profile.board10th || "Maharashtra State Board"}`,
          profile.year10th || undefined
        );
        subtitle(profile.school10th);
        if (profile.percentage10th) bullet(`Percentage: ${profile.percentage10th}%`);
      }

      // ── Technical Skills ──
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
          skillsRow(`${cat}:`, names.join(", "));
        });
      }

      // ── Semester Results ──
      const sems = (profile.semesters || []).filter((s: any) => s.sgpa > 0);
      if (sems.length > 0) {
        sectionTitle("Semester Results");
        checkPage(6);
        const semParts = sems.map((sem: { number: number; sgpa: number }) => `Sem ${sem.number}: ${sem.sgpa.toFixed(2)}`);
        pdf.setFontSize(9);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(...TEXT_BLK);
        const semText = semParts.join("    ");
        const semLines = pdf.splitTextToSize(semText, contentW);
        semLines.forEach((line: string) => {
          checkPage(4);
          pdf.text(line, margin, y);
          y += 4;
        });
        y += 2;
      }

      // ── Internship Experience ──
      const interns = profile.internships || [];
      if (interns.length > 0) {
        sectionTitle("Internship Experience");
        interns.forEach((i: { role: string; company: string; duration: string; description: string }) => {
          checkPage(10);
          entryHeader(`${i.role} \u2014 ${i.company}`, i.duration || undefined);
          if (i.description) bullet(i.description);
          y += 1;
        });
      }

      // ── Academic Projects ──
      const projects = profile.projects || [];
      if (projects.length > 0) {
        sectionTitle("Academic Projects");
        projects.forEach((p: { title: string; description: string; techStack: string[] }) => {
          checkPage(10);
          entryHeader(p.title);
          if (p.description) bullet(p.description);
          if (p.techStack?.length > 0) {
            pdf.setFontSize(8);
            pdf.setFont("helvetica", "italic");
            pdf.setTextColor(...BLUE);
            const techText = "Tech Stack: " + p.techStack.join(", ");
            const techLines = pdf.splitTextToSize(techText, contentW - 6);
            techLines.forEach((line: string) => {
              checkPage(4);
              pdf.text(line, margin + 6, y);
              y += 3.5;
            });
          }
          y += 1.5;
        });
      }

      // ── Certifications ──
      const certs = profile.certifications || [];
      if (certs.length > 0) {
        sectionTitle("Certifications");
        certs.forEach((c: { title: string; issuer: string; date: string }) => {
          const certText = `${c.title}${c.issuer ? ` \u2014 ${c.issuer}` : ""}${c.date ? `, ${c.date}` : ""}`;
          bullet(certText);
        });
      }

      // ── Achievements & Extracurricular ──
      const activities = profile.extraActivities || [];
      if (activities.length > 0) {
        sectionTitle("Achievements & Extracurricular Activities");
        activities.forEach((activity: string) => {
          bullet(activity);
        });
      }

      // ── Personal Details ──
      sectionTitle("Personal Details");
      if (profile.dob) skillsRow("Date of Birth:", profile.dob);
      if (profile.address) skillsRow("Address:", profile.address);

      // ── Declaration ──
      y += 4;
      checkPage(10);
      pdf.setDrawColor(232, 232, 232);
      pdf.setLineWidth(0.2);
      pdf.line(margin, y, W - margin, y);
      y += 4;
      pdf.setFontSize(8);
      pdf.setFont("helvetica", "italic");
      pdf.setTextColor(...MED_GRAY);
      pdf.text("I hereby declare that all the information furnished above is true to the best of my knowledge and belief.", margin, y);

      // Add footer to last page
      addFooter();

      pdf.save(`${profile.name || "resume"}_GCEK_Resume.pdf`);
      toast.success("PDF downloaded!");
    } catch (err) {
      console.error("PDF error:", err);
      toast.error("PDF download failed.");
    }
    setDownloading(false);
  };

  // Calculate CGPA from filled semesters only
  const semesters: any[] = (profile?.semesters || []).filter((s: any) => s.sgpa > 0);
  const cgpa =
    semesters.length > 0
      ? (
          semesters.reduce((sum: number, s: any) => sum + (s.sgpa || 0), 0) /
          semesters.length
        ).toFixed(2)
      : "N/A";

  const ActiveTemplate = TemplateGCEK;

  if (status === "loading" || loading) {
    return (
      <>
        <Navbar />
        <div className="aurora-bg min-h-screen" style={{ paddingTop: 110 }}>
          <div style={{ display: "flex", gap: 24, maxWidth: 1400, margin: "0 auto", padding: "0 24px 48px" }}>
            <div style={{ width: 288, flexShrink: 0 }}>
              <div className="skeleton" style={{ height: 200, borderRadius: 16 }} />
            </div>
            <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
              <div className="skeleton" style={{ width: "210mm", height: 800, borderRadius: 0 }} />
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
      <div className="aurora-bg min-h-screen" style={{ paddingTop: 110 }}>
        {/* Preview Layout — matches HTML .preview-layout */}
        <div style={{ display: "flex", gap: 24, maxWidth: 1400, margin: "0 auto", padding: "0 24px 48px" }}>

          {/* Sidebar — matches HTML .preview-sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            style={{ width: 288, flexShrink: 0, position: "sticky", top: 120, alignSelf: "flex-start" }}
          >
            <div className="bento-card" style={{ marginBottom: 16 }}>
              {/* Toggle Group — matches HTML .toggle-group */}
              <div style={{ display: "flex", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", marginBottom: 16 }}>
                <button
                  onClick={() => setMobileView(false)}
                  style={{
                    flex: 1, padding: 8, fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer",
                    background: !mobileView ? "var(--primary, #6366F1)" : "#fff",
                    color: !mobileView ? "#fff" : "var(--text-muted)",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  <FiMonitor size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} />
                  Desktop
                </button>
                <button
                  onClick={() => setMobileView(true)}
                  style={{
                    flex: 1, padding: 8, fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer",
                    background: mobileView ? "var(--primary, #6366F1)" : "#fff",
                    color: mobileView ? "#fff" : "var(--text-muted)",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  <FiSmartphone size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} />
                  Mobile
                </button>
              </div>

              {/* Download PDF — matches HTML btn-accent */}
              <button
                onClick={downloadPDF}
                disabled={downloading}
                style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
                  width: "100%", padding: "12px 24px", borderRadius: 14, border: "none",
                  background: "linear-gradient(135deg, #6366F1, #8B5CF6)", color: "#fff",
                  fontWeight: 700, fontSize: 14, cursor: downloading ? "not-allowed" : "pointer",
                  boxShadow: "0 4px 12px rgba(99,102,241,0.25)", marginBottom: 10,
                  opacity: downloading ? 0.6 : 1,
                }}
              >
                <FiDownload size={16} />
                {downloading ? "Generating..." : "📄 Download PDF"}
              </button>

              {/* Share Profile — matches HTML btn-secondary */}
              <Link
                href={`/profile/${profile.id}`}
                style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
                  width: "100%", padding: "10px 20px", borderRadius: 14,
                  border: "1px solid var(--border)", background: "var(--surface-light)",
                  color: "var(--text-secondary)", fontWeight: 600, fontSize: 13,
                  textDecoration: "none",
                }}
              >
                🔗 Share Profile
              </Link>
            </div>
          </motion.div>

          {/* Resume Container — matches HTML .resume-container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ flex: 1, display: "flex", justifyContent: "center" }}
          >
            <div
              style={{
                width: mobileView ? 400 : "210mm",
                maxWidth: mobileView ? 400 : "210mm",
                transition: "all 0.3s",
              }}
            >
              <div
                ref={resumeRef}
                style={{
                  background: "#fff",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.1)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <ActiveTemplate profile={profile} cgpa={cgpa} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
