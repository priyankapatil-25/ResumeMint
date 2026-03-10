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

      // ─── Add GCEK Logo ───
      const emblemSize = 16; // mm
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
        // Fallback: draw a simple circle placeholder if image fails
        pdf.setFillColor(...NAVY);
        pdf.circle(margin + emblemSize / 2, y + 1 + emblemSize / 2, emblemSize / 2, "F");
      }

      // ─── Name & Contact (offset for emblem) ───
      const nameX = margin + emblemSize + 4;

      // Name (large, navy)
      pdf.setFontSize(19);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(...NAVY);
      pdf.text((profile.name || "YOUR NAME").toUpperCase(), nameX, y + 7);

      // Contact line with icons — matches HTML: ✉ email | 📞 phone | address
      const contacts: string[] = [];
      if (profile.email) contacts.push(`\u2709 ${profile.email}`);
      if (profile.phone) contacts.push(`${profile.phone}`);
      if (profile.address) contacts.push(profile.address);
      if (contacts.length > 0) {
        pdf.setFontSize(7.5);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(...MED_GRAY);
        pdf.text(contacts.join("  |  "), nameX, y + 12);
      }
      // Second row: LinkedIn, GitHub, Portfolio
      const contacts2: string[] = [];
      if (profile.linkedin) contacts2.push(profile.linkedin);
      if (profile.github) contacts2.push(profile.github);
      if (profile.portfolio) contacts2.push(profile.portfolio);
      if (contacts2.length > 0) {
        pdf.setFontSize(7);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(...MED_GRAY);
        pdf.text(contacts2.join("  |  "), nameX, y + 16);
      }

      // College tagline (right-aligned) — no student photo in PDF
      const collegeEndX = W - margin;
      pdf.setFontSize(6);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(...SUBTLE);
      const col1 = "Government College of";
      const col2 = "Engineering, Karad";
      const col3 = "An Autonomous Institute";
      pdf.text(col1, collegeEndX - pdf.getTextWidth(col1), y + 4);
      pdf.text(col2, collegeEndX - pdf.getTextWidth(col2), y + 7.5);
      pdf.setFontSize(5);
      pdf.setFont("helvetica", "italic");
      pdf.text(col3, collegeEndX - pdf.getTextWidth(col3), y + 10.5);

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

      // ── Education (table format matching HTML) ──
      sectionTitle("Education");
      {
        const colWidths = [contentW * 0.28, contentW * 0.38, contentW * 0.14, contentW * 0.20];
        const colX = [margin, margin + colWidths[0], margin + colWidths[0] + colWidths[1], margin + colWidths[0] + colWidths[1] + colWidths[2]];
        const rowH = 5;

        // Header row
        checkPage(8);
        pdf.setFillColor(248, 250, 252);
        pdf.rect(margin, y - 3, contentW, rowH, "F");
        pdf.setFontSize(8);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(...TEXT_BLK);
        ["Degree", "Institution", "Year", "Score"].forEach((h, i) => {
          pdf.text(h, colX[i] + 2, y);
        });
        y += rowH;

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(7.5);
        pdf.setTextColor(...TEXT_BLK);

        const eduRows: string[][] = [];
        if (profile.college) {
          eduRows.push([
            `B.E. (${profile.branch || "Engineering"})`,
            profile.college,
            profile.enrollmentYear && profile.graduationYear ? `${profile.enrollmentYear}-${profile.graduationYear}` : "",
            cgpa !== "N/A" ? `CGPA: ${cgpa}` : "",
          ]);
        }
        if (profile.diplomaCollege) {
          eduRows.push([
            `Diploma (${profile.diplomaBranch || "Engineering"})`,
            profile.diplomaCollege,
            profile.diplomaYear || "",
            profile.diplomaPercentage || "",
          ]);
        }
        if (profile.school12th) {
          eduRows.push([
            "HSC (12th)",
            profile.school12th,
            profile.year12th || "",
            profile.percentage12th ? `${profile.percentage12th}%` : "",
          ]);
        }
        if (profile.school10th) {
          eduRows.push([
            "SSC (10th)",
            profile.school10th,
            profile.year10th || "",
            profile.percentage10th ? `${profile.percentage10th}%` : "",
          ]);
        }

        eduRows.forEach((row, ri) => {
          checkPage(6);
          if (ri % 2 === 1) {
            pdf.setFillColor(250, 251, 252);
            pdf.rect(margin, y - 3, contentW, rowH, "F");
          }
          pdf.setTextColor(...TEXT_BLK);
          row.forEach((cell, ci) => {
            const maxW = colWidths[ci] - 4;
            const truncated = pdf.getTextWidth(cell) > maxW ? cell.substring(0, Math.floor(cell.length * maxW / pdf.getTextWidth(cell))) + "..." : cell;
            pdf.text(truncated, colX[ci] + 2, y);
          });
          y += rowH;
        });
        y += 2;
      }

      // ── Technical Skills (matching HTML: category bold + names) ──
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
          pdf.setFontSize(8);
          pdf.setFont("helvetica", "bold");
          pdf.setTextColor(...TEXT_BLK);
          const label = `${cat}: `;
          pdf.text(label, margin, y);
          const labelW = pdf.getTextWidth(label);
          pdf.setFont("helvetica", "normal");
          pdf.text(names.join(", "), margin + labelW, y);
          y += 4;
        });
        y += 1;
      }

      // ── Semester Results (badge style matching HTML) ──
      const sems = (profile.semesters || []).filter((s: any) => s.sgpa > 0);
      if (sems.length > 0) {
        sectionTitle("Semester Results");
        checkPage(12);
        const badgeW = 20;
        const badgeH = 10;
        const badgeGap = 3;
        const maxPerRow = Math.floor((contentW + badgeGap) / (badgeW + badgeGap));
        sems.forEach((sem: { number: number; sgpa: number }, idx: number) => {
          const col = idx % maxPerRow;
          const row = Math.floor(idx / maxPerRow);
          if (col === 0 && row > 0) { y += badgeH + badgeGap; checkPage(badgeH + 4); }
          const bx = margin + col * (badgeW + badgeGap);
          const by = y;
          // Badge background
          pdf.setFillColor(248, 250, 252);
          pdf.setDrawColor(229, 231, 235);
          pdf.setLineWidth(0.2);
          pdf.roundedRect(bx, by, badgeW, badgeH, 1.5, 1.5, "FD");
          // Sem label
          pdf.setFontSize(6.5);
          pdf.setFont("helvetica", "bold");
          pdf.setTextColor(...TEXT_BLK);
          pdf.text(`Sem ${sem.number}`, bx + badgeW / 2, by + 4, { align: "center" });
          // SGPA value
          pdf.setFontSize(8);
          pdf.setFont("courier", "bold");
          pdf.text(typeof sem.sgpa === "number" ? sem.sgpa.toFixed(1) : String(sem.sgpa), bx + badgeW / 2, by + 8, { align: "center" });
        });
        y += badgeH + 4;
      }

      // ── Internship Experience (inline format matching HTML) ──
      const interns = profile.internships || [];
      if (interns.length > 0) {
        sectionTitle("Internship Experience");
        interns.forEach((i: { role: string; company: string; duration: string; description: string }) => {
          checkPage(10);
          pdf.setFontSize(9);
          pdf.setFont("helvetica", "bold");
          pdf.setTextColor(...TEXT_BLK);
          pdf.text(`${i.role} - ${i.company}`, margin, y);
          if (i.duration) {
            pdf.setFontSize(8);
            pdf.setFont("helvetica", "normal");
            pdf.setTextColor(...MED_GRAY);
            pdf.text(i.duration, W - margin - pdf.getTextWidth(i.duration), y);
          }
          y += 4;
          if (i.description) {
            pdf.setFontSize(8);
            pdf.setFont("helvetica", "normal");
            pdf.setTextColor(...TEXT_BLK);
            const descLines = pdf.splitTextToSize(i.description, contentW);
            descLines.forEach((line: string) => { checkPage(4); pdf.text(line, margin, y); y += 3.5; });
          }
          y += 2;
        });
      }

      // ── Academic Projects (title bold + tech stack in blue with pipe) ──
      const projects = profile.projects || [];
      if (projects.length > 0) {
        sectionTitle("Academic Projects");
        projects.forEach((p: { title: string; description: string; techStack: string[] }) => {
          checkPage(10);
          pdf.setFontSize(9);
          pdf.setFont("helvetica", "bold");
          pdf.setTextColor(...TEXT_BLK);
          let titleText = p.title;
          pdf.text(titleText, margin, y);
          if (p.techStack?.length > 0) {
            const titleW = pdf.getTextWidth(titleText + " ");
            pdf.setFontSize(7);
            pdf.setFont("helvetica", "normal");
            pdf.setTextColor(99, 102, 241);
            pdf.text("| " + p.techStack.join(", "), margin + titleW, y);
          }
          y += 4;
          if (p.description) {
            pdf.setFontSize(8);
            pdf.setFont("helvetica", "normal");
            pdf.setTextColor(...TEXT_BLK);
            const descLines = pdf.splitTextToSize(p.description, contentW);
            descLines.forEach((line: string) => { checkPage(4); pdf.text(line, margin, y); y += 3.5; });
          }
          y += 2;
        });
      }

      // ── Certifications (bullet with date right-aligned matching HTML) ──
      const certs = profile.certifications || [];
      if (certs.length > 0) {
        sectionTitle("Certifications");
        certs.forEach((c: { title: string; issuer: string; date: string }) => {
          checkPage(5);
          pdf.setFontSize(8);
          pdf.setFont("helvetica", "normal");
          pdf.setTextColor(...TEXT_BLK);
          const certText = `\u2022  ${c.title}${c.issuer ? ` - ${c.issuer}` : ""}`;
          pdf.text(certText, margin + 2, y);
          if (c.date) {
            pdf.setTextColor(...MED_GRAY);
            pdf.text(c.date, W - margin - pdf.getTextWidth(c.date), y);
          }
          y += 4;
        });
      }

      // ── Achievements & Extracurricular ──
      const activities = profile.extraActivities || [];
      if (activities.length > 0) {
        sectionTitle("Achievements & Extracurricular Activities");
        activities.forEach((activity: string) => {
          checkPage(5);
          pdf.setFontSize(8);
          pdf.setFont("helvetica", "normal");
          pdf.setTextColor(...TEXT_BLK);
          pdf.text(`\u2022  ${activity}`, margin + 2, y);
          y += 4;
        });
      }

      // ── Personal Details (2-col grid matching HTML) ──
      sectionTitle("Personal Details");
      {
        const pdItems: [string, string][] = [];
        if (profile.dob) pdItems.push(["Date of Birth:", profile.dob]);
        pdItems.push(["Languages:", "English, Hindi, Marathi"]);
        if (profile.address) pdItems.push(["Address:", profile.address]);
        pdItems.push(["Nationality:", "Indian"]);
        const halfW = contentW / 2;
        for (let i = 0; i < pdItems.length; i += 2) {
          checkPage(5);
          // Left column
          pdf.setFontSize(8);
          pdf.setFont("helvetica", "bold");
          pdf.setTextColor(...TEXT_BLK);
          pdf.text(pdItems[i][0], margin, y);
          pdf.setFont("helvetica", "normal");
          pdf.text(" " + pdItems[i][1], margin + pdf.getTextWidth(pdItems[i][0]), y);
          // Right column
          if (i + 1 < pdItems.length) {
            pdf.setFont("helvetica", "bold");
            pdf.text(pdItems[i + 1][0], margin + halfW, y);
            pdf.setFont("helvetica", "normal");
            pdf.text(" " + pdItems[i + 1][1], margin + halfW + pdf.getTextWidth(pdItems[i + 1][0]), y);
          }
          y += 4;
        }
      }

      // ── Declaration (matching HTML) ──
      sectionTitle("Declaration");
      pdf.setFontSize(7);
      pdf.setFont("helvetica", "italic");
      pdf.setTextColor(...MED_GRAY);
      pdf.text("I hereby declare that the information furnished above is true to the best of my knowledge and belief.", margin, y);
      y += 6;
      pdf.setFontSize(8);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(...TEXT_BLK);
      pdf.text(`Place: ${profile.address?.split(",")[0]?.trim() || "Karad"}`, margin, y);
      const sigName = profile.name || "Student Name";
      pdf.setFont("helvetica", "bold");
      pdf.text(sigName, W - margin - pdf.getTextWidth(sigName), y);

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
                overflow: "hidden",
              }}
            >
              <div
                ref={resumeRef}
                style={{
                  background: "#fff",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.1)",
                  position: "relative",
                  overflow: "hidden",
                  ...(mobileView
                    ? {
                        width: "210mm",
                        transform: `scale(${400 / 794})`,
                        transformOrigin: "top left",
                      }
                    : {}),
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
