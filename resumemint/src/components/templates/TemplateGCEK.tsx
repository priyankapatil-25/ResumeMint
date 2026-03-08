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

// ─── Entry Header (left title, right date) ──────────────────────
function EntryHeader({ left, right }: { left: string; right?: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 1 }}>
      <span style={{
        fontSize: 10, fontWeight: 700, color: COLORS.textBlack, fontFamily: "'Georgia', 'Cambria', serif",
      }}>
        {left}
      </span>
      {right && (
        <span style={{
          fontSize: 9, color: COLORS.mediumGray, fontFamily: "'Georgia', 'Cambria', serif",
          whiteSpace: "nowrap", marginLeft: 8,
        }}>
          {right}
        </span>
      )}
    </div>
  );
}

// ─── Subtitle (blue italic) ─────────────────────────────────────
function Subtitle({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontSize: 9.5, fontStyle: "italic", color: COLORS.accentBlue, marginBottom: 2,
      fontFamily: "'Georgia', 'Cambria', serif",
    }}>
      {children}
    </p>
  );
}

// ─── Bullet point ───────────────────────────────────────────────
function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 6, marginBottom: 2 }}>
      <span style={{ fontSize: 9.5, color: COLORS.textBlack, lineHeight: 1, marginTop: 2 }}>{"\u2022"}</span>
      <span style={{
        fontSize: 9.5, color: COLORS.textBlack, lineHeight: 1.4, textAlign: "justify", flex: 1,
        fontFamily: "'Georgia', 'Cambria', serif",
      }}>
        {children}
      </span>
    </div>
  );
}

// ─── Skills Row (label: value) ──────────────────────────────────
function SkillsRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", marginBottom: 3 }}>
      <span style={{
        fontSize: 9.5, fontWeight: 700, color: COLORS.textBlack, width: "28%", flexShrink: 0,
        fontFamily: "'Georgia', 'Cambria', serif",
      }}>
        {label}
      </span>
      <span style={{
        fontSize: 9.5, color: COLORS.textBlack, flex: 1,
        fontFamily: "'Georgia', 'Cambria', serif",
      }}>
        {value}
      </span>
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

  // Contact line
  const contactParts: string[] = [];
  if (profile.phone) contactParts.push(profile.phone);
  if (profile.email) contactParts.push(profile.email);
  if (profile.linkedin) contactParts.push(profile.linkedin);
  if (profile.github) contactParts.push(profile.github);
  if (profile.portfolio) contactParts.push(profile.portfolio);
  const contactLine = contactParts.join("  |  ");

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
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 6, color: COLORS.subtleTag, margin: 0, fontFamily: "sans-serif" }}>
                {profile.college || "Government College of Engineering, Karad"}
              </p>
              <p style={{ fontSize: 5.5, color: COLORS.subtleTag, margin: "2px 0 0 0", fontFamily: "sans-serif" }}>
                Autonomous | Shivaji University
              </p>
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

        {/* ── EDUCATION ── */}
        <SectionHeader>Education</SectionHeader>

        {/* Engineering */}
        {profile.college && (
          <>
            <EntryHeader
              left={`Bachelor of Engineering (${profile.branch || "Engineering"})`}
              right={profile.enrollmentYear && profile.graduationYear ? `${profile.enrollmentYear} \u2013 ${profile.graduationYear}` : undefined}
            />
            <Subtitle>{profile.college} — Shivaji University</Subtitle>
            {cgpa !== "N/A" && <Bullet>CGPA: <strong>{cgpa}</strong></Bullet>}
          </>
        )}

        {/* Diploma */}
        {profile.diplomaCollege && (
          <div style={{ marginTop: 4 }}>
            <EntryHeader
              left={`Diploma — ${profile.diplomaBranch || "Engineering"}`}
              right={profile.diplomaYear || undefined}
            />
            <Subtitle>{profile.diplomaCollege}</Subtitle>
            {profile.diplomaPercentage && <Bullet>Percentage / CGPA: <strong>{profile.diplomaPercentage}</strong></Bullet>}
          </div>
        )}

        {/* 12th */}
        {profile.school12th && (
          <div style={{ marginTop: 4 }}>
            <EntryHeader
              left={`HSC (Science) — ${profile.board12th || "Maharashtra State Board"}`}
              right={profile.year12th || undefined}
            />
            <Subtitle>{profile.school12th}</Subtitle>
            {profile.percentage12th && <Bullet>Percentage: <strong>{profile.percentage12th}%</strong></Bullet>}
          </div>
        )}

        {/* 10th */}
        {profile.school10th && (
          <div style={{ marginTop: 4 }}>
            <EntryHeader
              left={`SSC — ${profile.board10th || "Maharashtra State Board"}`}
              right={profile.year10th || undefined}
            />
            <Subtitle>{profile.school10th}</Subtitle>
            {profile.percentage10th && <Bullet>Percentage: <strong>{profile.percentage10th}%</strong></Bullet>}
          </div>
        )}

        {/* ── TECHNICAL SKILLS ── */}
        {profile.skills?.length > 0 && (
          <>
            <SectionHeader>Technical Skills</SectionHeader>
            {Object.entries(skillsByCategory).map(([category, skills]) => (
              <SkillsRow
                key={category}
                label={`${category}:`}
                value={(skills as any[]).map((s: any) => s.name).join(", ")}
              />
            ))}
          </>
        )}

        {/* ── SEMESTER RESULTS ── */}
        {filledSemesters.length > 0 && (
          <>
            <SectionHeader>Semester Results</SectionHeader>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "2px 16px", marginBottom: 4 }}>
              {filledSemesters.map((sem) => (
                <span key={sem.number} style={{
                  fontSize: 9.5, color: COLORS.textBlack, fontFamily: "'Georgia', 'Cambria', serif",
                }}>
                  <strong>Sem {sem.number}:</strong> {sem.sgpa.toFixed(2)}
                </span>
              ))}
            </div>
          </>
        )}

        {/* ── INTERNSHIP EXPERIENCE ── */}
        {profile.internships?.length > 0 && (
          <>
            <SectionHeader>Internship Experience</SectionHeader>
            {profile.internships.map((intern, i) => (
              <div key={i} style={{ marginBottom: 6 }}>
                <EntryHeader
                  left={`${intern.role} — ${intern.company}`}
                  right={intern.duration || undefined}
                />
                {intern.description && <Bullet>{intern.description}</Bullet>}
              </div>
            ))}
          </>
        )}

        {/* ── ACADEMIC PROJECTS ── */}
        {profile.projects?.length > 0 && (
          <>
            <SectionHeader>Academic Projects</SectionHeader>
            {profile.projects.map((project, i) => (
              <div key={i} style={{ marginBottom: 6 }}>
                <EntryHeader left={project.title} />
                {project.description && <Bullet>{project.description}</Bullet>}
                {project.techStack?.length > 0 && (
                  <Bullet>
                    <em style={{ color: COLORS.accentBlue }}>
                      Tech Stack: {project.techStack.join(", ")}
                    </em>
                  </Bullet>
                )}
              </div>
            ))}
          </>
        )}

        {/* ── CERTIFICATIONS ── */}
        {profile.certifications?.length > 0 && (
          <>
            <SectionHeader>Certifications</SectionHeader>
            {profile.certifications.map((cert, i) => (
              <Bullet key={i}>
                {cert.title}
                {cert.issuer ? ` — ${cert.issuer}` : ""}
                {cert.date ? `, ${cert.date}` : ""}
              </Bullet>
            ))}
          </>
        )}

        {/* ── ACHIEVEMENTS & EXTRACURRICULAR ── */}
        {profile.extraActivities && profile.extraActivities.length > 0 && (
          <>
            <SectionHeader>Achievements & Extracurricular Activities</SectionHeader>
            {profile.extraActivities.map((activity, i) => (
              <Bullet key={i}>{activity}</Bullet>
            ))}
          </>
        )}

        {/* ── PERSONAL DETAILS ── */}
        <SectionHeader>Personal Details</SectionHeader>
        {profile.dob && <SkillsRow label="Date of Birth:" value={profile.dob} />}
        {profile.address && <SkillsRow label="Address:" value={profile.address} />}

        {/* ── DECLARATION ── */}
        <div style={{ marginTop: 14 }}>
          <div style={{ width: "100%", height: 0.5, backgroundColor: COLORS.lightGray, marginBottom: 6 }} />
          <p style={{
            fontSize: 8.5, fontStyle: "italic", color: COLORS.mediumGray, lineHeight: 1.3,
            fontFamily: "'Georgia', 'Cambria', serif",
          }}>
            I hereby declare that all the information furnished above is true to the best of my knowledge and belief.
          </p>
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
