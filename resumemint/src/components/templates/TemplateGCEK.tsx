"use client";

import React from "react";

/* eslint-disable @typescript-eslint/no-explicit-any, @next/next/no-img-element */

interface TemplateProps {
  profile: {
    name: string; email: string; phone: string; address: string; photo: string;
    dob?: string;
    linkedin: string; github: string; portfolio: string; objective: string;
    college: string; branch: string; enrollmentYear: number; graduationYear: number;
    diplomaCollege?: string; diplomaBranch?: string; diplomaPercentage?: string; diplomaYear?: string;
    school10th: string; board10th: string; percentage10th: string; year10th: string;
    school12th: string; board12th: string; percentage12th: string; year12th: string;
    semesters: { number: number; sgpa: number; subjects: string[]; backlog: number }[];
    skills: { name: string; category: string; proficiency: number }[];
    projects: { title: string; description: string; techStack: string[]; github: string; liveDemo: string }[];
    certifications: { title: string; issuer: string; date: string; image?: string }[];
    internships: { company: string; role: string; duration: string; description: string }[];
    extraActivities?: string[];
  };
  cgpa: string;
}

// ─── Color Palette (GCEK Branded) ───────────────────────────────
const COLORS = {
  darkNavy: "#1B2A4A",
  accentBlue: "#2C5F8A",
  gcekGold: "#C4972F",
  mediumGray: "#4A4A4A",
  lightGray: "#E8E8E8",
  textBlack: "#1A1A1A",
  subtleTag: "#8899AA",
};

// ─── GCEK Emblem SVG Component ──────────────────────────────────
function GCEKEmblem({ size = 50 }: { size?: number }) {
  const cx = size / 2;
  const cy = size / 2;
  const innerR = size / 2 - 6;
  const spokeR = size / 2 - 14;
  const textR = size / 2 - 8;
  const numTeeth = 16;

  // Generate gear teeth lines
  const teeth = Array.from({ length: numTeeth }, (_, i) => {
    const angle = (2 * Math.PI * i) / numTeeth;
    const x1 = cx + (innerR - 1) * Math.cos(angle);
    const y1 = cy + (innerR - 1) * Math.sin(angle);
    const x2 = cx + (innerR + 3.5) * Math.cos(angle);
    const y2 = cy + (innerR + 3.5) * Math.sin(angle);
    return <line key={`tooth-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={COLORS.gcekGold} strokeWidth={1.5} />;
  });

  // Generate spokes
  const spokes = Array.from({ length: 12 }, (_, i) => {
    const angle = (2 * Math.PI * i) / 12;
    const x2 = cx + spokeR * Math.cos(angle);
    const y2 = cy + spokeR * Math.sin(angle);
    return <line key={`spoke-${i}`} x1={cx} y1={cy} x2={x2} y2={y2} stroke={COLORS.gcekGold} strokeWidth={0.5} />;
  });

  // Spoke tip dots
  const spokeDots = Array.from({ length: 12 }, (_, i) => {
    const angle = (2 * Math.PI * i) / 12;
    const x = cx + spokeR * Math.cos(angle);
    const y = cy + spokeR * Math.sin(angle);
    return <circle key={`dot-${i}`} cx={x} cy={y} r={1.2} fill={COLORS.gcekGold} />;
  });

  // GCEK text along top arc
  const gcekLetters = "GCEK".split("").map((ch, i) => {
    const angle = Math.PI / 2 + 0.22 - i * 0.15;
    const tx = cx + textR * Math.cos(angle);
    const ty = cy - textR * Math.sin(angle); // SVG y is inverted
    const rotation = -(angle * 180 / Math.PI - 90);
    return (
      <text key={`gcek-${i}`} x={tx} y={ty} fill="white" fontSize={5.5} fontWeight="bold" fontFamily="sans-serif"
        textAnchor="middle" dominantBaseline="central"
        transform={`rotate(${rotation}, ${tx}, ${ty})`}>
        {ch}
      </text>
    );
  });

  // 1960 text along bottom arc
  const yearLetters = "1960".split("").map((ch, i) => {
    const angle = -Math.PI / 2 + 0.2 - i * 0.14;
    const tx = cx + textR * Math.cos(angle);
    const ty = cy - textR * Math.sin(angle);
    const rotation = -(angle * 180 / Math.PI + 90);
    return (
      <text key={`year-${i}`} x={tx} y={ty} fill="white" fontSize={4.5} fontWeight="bold" fontFamily="sans-serif"
        textAnchor="middle" dominantBaseline="central"
        transform={`rotate(${rotation}, ${tx}, ${ty})`}>
        {ch}
      </text>
    );
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Outer ring */}
      <circle cx={cx} cy={cy} r={size / 2 - 1} fill="white" stroke={COLORS.darkNavy} strokeWidth={2.2} />
      {/* Gold ring */}
      <circle cx={cx} cy={cy} r={size / 2 - 4} fill="none" stroke={COLORS.gcekGold} strokeWidth={1.2} />
      {/* Inner dark circle */}
      <circle cx={cx} cy={cy} r={innerR} fill={COLORS.darkNavy} />
      {/* Gear teeth */}
      {teeth}
      {/* Spokes */}
      {spokes}
      {/* Center dot */}
      <circle cx={cx} cy={cy} r={3} fill={COLORS.gcekGold} />
      {/* Spoke tip dots */}
      {spokeDots}
      {/* GCEK text */}
      {gcekLetters}
      {/* 1960 text */}
      {yearLetters}
    </svg>
  );
}

// ─── Section Header with blue + gold dividers ───────────────────
function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 10, marginBottom: 6 }}>
      <h2 style={{
        fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em",
        color: COLORS.darkNavy, marginBottom: 2, fontFamily: "'Georgia', 'Cambria', serif",
      }}>
        {children}
      </h2>
      <div style={{ width: "100%", height: 1.5, backgroundColor: COLORS.accentBlue, marginBottom: 1 }} />
      <div style={{ width: "40%", height: 0.6, backgroundColor: COLORS.gcekGold, marginBottom: 6 }} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN TEMPLATE COMPONENT
// ═══════════════════════════════════════════════════════════════════
export default function TemplateGCEK({ profile, cgpa }: TemplateProps) {
  const filledSemesters = profile.semesters?.filter((s) => s.sgpa > 0) || [];

  // Group skills by category
  const skillsByCategory = profile.skills?.reduce<Record<string, typeof profile.skills>>((acc, skill) => {
    const cat = skill.category || "General";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {}) ?? {};

  // Contact line — matches HTML: ✉ email | 📞 phone | address | linkedin | github
  const contactParts: string[] = [];
  if (profile.email) contactParts.push(`\u2709 ${profile.email}`);
  if (profile.phone) contactParts.push(`\uD83D\uDCDE ${profile.phone}`);
  if (profile.address) contactParts.push(profile.address);
  if (profile.linkedin) contactParts.push(`\uD83D\uDD17 ${profile.linkedin}`);
  if (profile.github) contactParts.push(`\uD83D\uDCBB ${profile.github}`);
  if (profile.portfolio) contactParts.push(`\uD83C\uDF10 ${profile.portfolio}`);
  const contactLine = contactParts.join("  \u00A0|\u00A0  ");

  return (
    <div
      className="relative"
      style={{
        width: "210mm", minHeight: "297mm", margin: "0 auto", backgroundColor: "white",
        fontFamily: "'Georgia', 'Cambria', serif", fontSize: 12, color: COLORS.textBlack,
        paddingBottom: 24,
      }}
    >
      {/* ═══════════════════════════════════════════════════════════ */}
      {/* BRANDED HEADER                                             */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <div style={{ padding: "0 0.7in" }}>
        {/* Top navy accent bar */}
        <div style={{ width: "100%", height: 3, backgroundColor: COLORS.darkNavy }} />
        {/* Gold line */}
        <div style={{ width: "100%", height: 1, backgroundColor: COLORS.gcekGold }} />

        {/* Header content */}
        <div style={{ display: "flex", alignItems: "center", padding: "10px 0 8px 0", position: "relative" }}>
          {/* Emblem */}
          <div style={{ marginRight: 12, flexShrink: 0 }}>
            <GCEKEmblem size={50} />
          </div>

          {/* Name & Contact */}
          <div style={{ flex: 1 }}>
            <h1 style={{
              fontSize: 21, fontWeight: 700, color: COLORS.darkNavy, margin: 0, lineHeight: 1.2,
              fontFamily: "'Georgia', 'Cambria', serif",
            }}>
              {profile.name?.toUpperCase() || "YOUR NAME"}
            </h1>
            <p style={{
              fontSize: 8.5, color: COLORS.mediumGray, margin: "3px 0 0 0",
              fontFamily: "'Georgia', 'Cambria', serif",
            }}>
              {contactLine}
            </p>
          </div>

          {/* College tagline + Photo (right) */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <div style={{ textAlign: "right", fontSize: 7, color: "#4A5568", lineHeight: 1.6 }}>
              Government College of<br />Engineering, Karad<br />
              <span style={{ fontStyle: "italic", fontSize: 6 }}>An Autonomous Institute</span>
            </div>
            {/* Student Photo */}
            {profile.photo && (
              <div style={{
                width: 50, height: 50, borderRadius: 4, overflow: "hidden", flexShrink: 0,
                border: `1.5px solid ${COLORS.gcekGold}`,
                boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
              }}>
                <img src={profile.photo} alt={profile.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            )}
          </div>
        </div>

        {/* Bottom separator lines */}
        <div style={{ width: "100%", height: 1.2, backgroundColor: COLORS.accentBlue }} />
        <div style={{ width: "100%", height: 0.5, backgroundColor: COLORS.gcekGold, marginTop: 1.5 }} />
      </div>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* MAIN CONTENT                                               */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <div style={{ padding: "4px 0.7in 0 0.7in" }}>

        {/* ── CAREER OBJECTIVE ── */}
        {profile.objective && (
          <>
            <SectionHeader>Career Objective</SectionHeader>
            <p style={{
              fontSize: 9.5, lineHeight: 1.45, color: COLORS.textBlack, textAlign: "justify", marginBottom: 4,
              fontFamily: "'Georgia', 'Cambria', serif",
            }}>
              {profile.objective}
            </p>
          </>
        )}

        {/* ── EDUCATION (table format matching HTML) ── */}
        <SectionHeader>Education</SectionHeader>
        <table style={{ width: "100%", fontSize: 8, borderCollapse: "collapse", fontFamily: "'Georgia', 'Cambria', serif" }}>
          <thead>
            <tr style={{ background: "#F8FAFC" }}>
              <th style={{ textAlign: "left", padding: "3px 6px", fontWeight: 600 }}>Degree</th>
              <th style={{ textAlign: "left", padding: "3px 6px" }}>Institution</th>
              <th style={{ textAlign: "left", padding: "3px 6px" }}>Year</th>
              <th style={{ textAlign: "left", padding: "3px 6px" }}>Score</th>
            </tr>
          </thead>
          <tbody>
            {profile.college && (
              <tr>
                <td style={{ padding: "3px 6px" }}>B.E. ({profile.branch || "Engineering"})</td>
                <td style={{ padding: "3px 6px" }}>{profile.college}</td>
                <td style={{ padding: "3px 6px" }}>{profile.enrollmentYear && profile.graduationYear ? `${profile.enrollmentYear}-${profile.graduationYear}` : ""}</td>
                <td style={{ padding: "3px 6px" }}>{cgpa !== "N/A" ? `CGPA: ${cgpa}` : ""}</td>
              </tr>
            )}
            {profile.diplomaCollege && (
              <tr style={{ background: "#FAFBFC" }}>
                <td style={{ padding: "3px 6px" }}>Diploma ({profile.diplomaBranch || "Engineering"})</td>
                <td style={{ padding: "3px 6px" }}>{profile.diplomaCollege}</td>
                <td style={{ padding: "3px 6px" }}>{profile.diplomaYear || ""}</td>
                <td style={{ padding: "3px 6px" }}>{profile.diplomaPercentage || ""}</td>
              </tr>
            )}
            {profile.school12th && (
              <tr style={profile.diplomaCollege ? {} : { background: "#FAFBFC" }}>
                <td style={{ padding: "3px 6px" }}>HSC (12th)</td>
                <td style={{ padding: "3px 6px" }}>{profile.school12th}</td>
                <td style={{ padding: "3px 6px" }}>{profile.year12th || ""}</td>
                <td style={{ padding: "3px 6px" }}>{profile.percentage12th ? `${profile.percentage12th}%` : ""}</td>
              </tr>
            )}
            {profile.school10th && (
              <tr>
                <td style={{ padding: "3px 6px" }}>SSC (10th)</td>
                <td style={{ padding: "3px 6px" }}>{profile.school10th}</td>
                <td style={{ padding: "3px 6px" }}>{profile.year10th || ""}</td>
                <td style={{ padding: "3px 6px" }}>{profile.percentage10th ? `${profile.percentage10th}%` : ""}</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* ── TECHNICAL SKILLS (matching HTML) ── */}
        {profile.skills?.length > 0 && (
          <>
            <SectionHeader>Technical Skills</SectionHeader>
            <div style={{ fontSize: 8, color: "#333" }}>
              {Object.entries(skillsByCategory).map(([category, skills]) => (
                <div key={category} style={{ marginBottom: 3 }}>
                  <strong>{category}:</strong> {(skills as any[]).map((s: any) => s.name).join(", ")}
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── SEMESTER RESULTS (badge cards matching HTML) ── */}
        {filledSemesters.length > 0 && (
          <>
            <SectionHeader>Semester Results</SectionHeader>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {filledSemesters.map((sem) => (
                <div key={sem.number} style={{
                  background: "#F8FAFC", padding: "4px 10px", borderRadius: 4, fontSize: 8,
                  textAlign: "center", border: "1px solid #E5E7EB",
                }}>
                  <div style={{ fontWeight: 600 }}>Sem {sem.number}</div>
                  <div style={{ fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)", fontWeight: 700 }}>
                    {typeof sem.sgpa === "number" ? sem.sgpa.toFixed(1) : sem.sgpa}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── INTERNSHIP EXPERIENCE (matching HTML) ── */}
        {profile.internships?.length > 0 && (
          <>
            <SectionHeader>Internship Experience</SectionHeader>
            {profile.internships.map((intern, i) => (
              <div key={i} style={{ fontSize: 9, color: "#333", marginBottom: 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <strong>{intern.role} - {intern.company}</strong>
                  <span style={{ fontSize: 8, color: "#666" }}>{intern.duration}</span>
                </div>
                {intern.description && <p style={{ fontSize: 8, marginTop: 2 }}>{intern.description}</p>}
              </div>
            ))}
          </>
        )}

        {/* ── ACADEMIC PROJECTS (matching HTML) ── */}
        {profile.projects?.length > 0 && (
          <>
            <SectionHeader>Academic Projects</SectionHeader>
            {profile.projects.map((project, i) => (
              <div key={i} style={{ fontSize: 9, color: "#333", marginBottom: 6 }}>
                <div>
                  <strong>{project.title}</strong>
                  {project.techStack?.length > 0 && (
                    <span style={{ fontSize: 7, color: "#6366F1" }}> | {project.techStack.join(", ")}</span>
                  )}
                </div>
                {project.description && <p style={{ fontSize: 8, marginTop: 2 }}>{project.description}</p>}
              </div>
            ))}
          </>
        )}

        {/* ── CERTIFICATIONS (matching HTML) ── */}
        {profile.certifications?.length > 0 && (
          <>
            <SectionHeader>Certifications</SectionHeader>
            <div style={{ fontSize: 8, color: "#333" }}>
              {profile.certifications.map((cert, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                  <span>• {cert.title}{cert.issuer ? ` - ${cert.issuer}` : ""}</span>
                  {cert.date && <span style={{ color: "#666" }}>{cert.date}</span>}
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── ACHIEVEMENTS & EXTRACURRICULAR ── */}
        {profile.extraActivities && profile.extraActivities.length > 0 && (
          <>
            <SectionHeader>Achievements & Extracurricular Activities</SectionHeader>
            <div style={{ fontSize: 8, color: "#333" }}>
              {profile.extraActivities.map((activity, i) => (
                <div key={i} style={{ marginBottom: 2 }}>• {activity}</div>
              ))}
            </div>
          </>
        )}

        {/* ── PERSONAL DETAILS (2-col grid matching HTML) ── */}
        <SectionHeader>Personal Details</SectionHeader>
        <div style={{ fontSize: 8, color: "#333", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          {profile.dob && <div><strong>Date of Birth:</strong> {profile.dob}</div>}
          <div><strong>Languages:</strong> English, Hindi, Marathi</div>
          {profile.address && <div><strong>Address:</strong> {profile.address}</div>}
          <div><strong>Nationality:</strong> Indian</div>
        </div>

        {/* ── DECLARATION (matching HTML) ── */}
        <SectionHeader>Declaration</SectionHeader>
        <p style={{ fontSize: 7, color: "#555", fontStyle: "italic" }}>
          I hereby declare that the information furnished above is true to the best of my knowledge and belief.
        </p>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 8 }}>
          <span>Place: {profile.address?.split(",")[0]?.trim() || "Karad"}</span>
          <span style={{ fontWeight: 600 }}>{profile.name || "Student Name"}</span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* BRANDED FOOTER                                             */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
      }}>
        {/* Gold accent line */}
        <div style={{ width: "100%", height: 0.8, backgroundColor: COLORS.gcekGold }} />
        {/* Navy footer bar */}
        <div style={{
          width: "100%", height: 18, backgroundColor: COLORS.darkNavy,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 0.7in",
        }}>
          <span style={{ fontSize: 6, color: "#AABBCC", fontFamily: "sans-serif" }}>
            {profile.college || "GCE Karad"} | Shivaji University
          </span>
          <span style={{ fontSize: 6, color: "#AABBCC", fontFamily: "sans-serif" }}>
            Page 1
          </span>
        </div>
      </div>

      {/* ── Subtle watermark ── */}
      <div style={{
        position: "absolute", right: -12, top: "50%", transform: "translateY(-50%) rotate(90deg)",
        fontSize: 72, fontWeight: 700, color: "rgba(220, 225, 232, 0.25)",
        fontFamily: "sans-serif", letterSpacing: 8, pointerEvents: "none",
      }}>
        GCEK
      </div>
    </div>
  );
}
