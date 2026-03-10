"use client";

import React from "react";
import { FiMail, FiPhone, FiMapPin, FiGithub, FiLinkedin, FiGlobe, FiExternalLink, FiAward, FiBriefcase, FiCode, FiBook, FiTarget, FiLayers } from "react-icons/fi";

/* eslint-disable @typescript-eslint/no-explicit-any */

interface TemplateProps {
  profile: {
    name: string; email: string; phone: string; address: string; photo: string;
    linkedin: string; github: string; portfolio: string; objective: string;
    college: string; branch: string; enrollmentYear: number; graduationYear: number;
    school10th: string; board10th: string; percentage10th: string; year10th: string;
    school12th: string; board12th: string; percentage12th: string; year12th: string;
    semesters: { number: number; sgpa: number; subjects: string[] }[];
    skills: { name: string; category: string; proficiency: number }[];
    projects: { title: string; description: string; techStack: string[]; github: string; liveDemo: string }[];
    certifications: { title: string; issuer: string; date: string }[];
    internships: { company: string; role: string; duration: string; description: string }[];
  };
  cgpa: string;
}

function SkillRing({ name, proficiency }: { name: string; proficiency: number }) {
  const r = 18;
  const circ = 2 * Math.PI * r;
  const offset = circ - (proficiency / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="44" height="44" className="transform -rotate-90">
        <circle cx="22" cy="22" r={r} fill="none" stroke="rgba(26,58,92,0.15)" strokeWidth="3" />
        <circle cx="22" cy="22" r={r} fill="none" stroke="url(#skillGrad)" strokeWidth="3"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
        <defs>
          <linearGradient id="skillGrad">
            <stop offset="0%" stopColor="#1A3A5C" />
            <stop offset="100%" stopColor="#1A3A5C" />
          </linearGradient>
        </defs>
      </svg>
      <span className="text-[8px] text-slate-400 text-center leading-tight max-w-[52px] truncate">{name}</span>
    </div>
  );
}

function SectionHeader({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4 mt-8">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center"
        style={{ background: "rgba(26,58,92,0.25)" }}>
        {icon}
      </div>
      <h2 className="text-[13px] font-bold uppercase tracking-[0.15em] text-white flex-1">
        {children}
      </h2>
      <div className="flex-1 h-px" style={{ background: "rgba(26,58,92,0.4)" }} />
    </div>
  );
}

export default function TemplateAurora({ profile, cgpa }: TemplateProps) {
  const initials = profile.name
    ? profile.name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2)
    : "";

  const skillsByCategory = profile.skills?.reduce<Record<string, typeof profile.skills>>((acc, skill) => {
    const cat = skill.category || "General";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {}) ?? {};

  return (
    <div className="min-h-[297mm] w-[210mm] mx-auto relative overflow-hidden"
      style={{ backgroundColor: "#060B18", color: "#CBD5E1", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* Decorative background orbs */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full opacity-20 pointer-events-none"
        style={{ background: "rgba(26,58,92,0.15)", filter: "blur(60px)" }} />
      <div className="absolute bottom-20 left-0 w-[250px] h-[250px] rounded-full opacity-15 pointer-events-none"
        style={{ background: "rgba(212,160,23,0.15)", filter: "blur(50px)" }} />

      {/* ===== HEADER ===== */}
      <div className="relative px-10 pt-8 pb-7"
        style={{ background: "rgba(26,58,92,0.08)" }}>
        {/* Gradient border bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px]"
          style={{ background: "#1A3A5C" }} />

        <div className="flex items-center gap-7">
          {/* Photo */}
          <div className="relative shrink-0">
            <div className="w-[95px] h-[95px] rounded-2xl overflow-hidden flex items-center justify-center text-white text-3xl font-bold"
              style={{
                background: profile.photo ? "transparent" : "#1A3A5C",
                border: "3px solid transparent",
                backgroundClip: "padding-box",
                boxShadow: "0 0 0 3px rgba(26,58,92,0.3), 0 8px 32px rgba(0,0,0,0.4)",
              }}>
              {profile.photo ? (
                <img src={profile.photo} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                <span>{initials}</span>
              )}
            </div>
            {/* Online dot */}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-[3px] flex items-center justify-center"
              style={{ borderColor: "#060B18", background: "#1A3A5C" }}>
              <span className="text-[7px] text-white font-bold">A+</span>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-[30px] font-extrabold text-white leading-none tracking-tight">
              {profile.name}
            </h1>
            {profile.branch && (
              <div className="flex items-center gap-2 mt-2">
                <div className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                  style={{ background: "rgba(26,58,92,0.2)", color: "#7FA3C2", border: "1px solid rgba(26,58,92,0.2)" }}>
                  {profile.branch}
                </div>
                {cgpa !== "N/A" && (
                  <div className="px-3 py-1 rounded-full text-[10px] font-bold"
                    style={{ background: "rgba(212,160,23,0.15)", color: "#5EEAD4", border: "1px solid rgba(212,160,23,0.2)" }}>
                    CGPA: {cgpa}
                  </div>
                )}
              </div>
            )}
            {/* Contact Row */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3">
              {[
                { icon: <FiMail size={10} />, val: profile.email },
                { icon: <FiPhone size={10} />, val: profile.phone },
                { icon: <FiMapPin size={10} />, val: profile.address },
                { icon: <FiGithub size={10} />, val: profile.github },
                { icon: <FiLinkedin size={10} />, val: profile.linkedin },
                { icon: <FiGlobe size={10} />, val: profile.portfolio },
              ].filter((c) => c.val).map((c, i) => (
                <span key={i} className="flex items-center gap-1.5 text-[10px] text-slate-400">
                  <span className="text-indigo-400">{c.icon}</span> {c.val}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ===== BODY ===== */}
      <div className="px-10 pb-10 relative z-10">
        {/* Objective */}
        {profile.objective && (
          <>
            <SectionHeader icon={<FiTarget size={14} className="text-indigo-300" />}>Career Objective</SectionHeader>
            <div className="rounded-xl p-4 text-[11px] leading-[1.8] text-slate-300 italic"
              style={{ background: "rgba(30,41,59,0.45)", border: "1px solid rgba(26,58,92,0.1)", borderLeft: "3px solid #1A3A5C" }}>
              &ldquo;{profile.objective}&rdquo;
            </div>
          </>
        )}

        {/* Education */}
        {profile.college && (
          <>
            <SectionHeader icon={<FiBook size={14} className="text-indigo-300" />}>Education</SectionHeader>
            <div className="rounded-xl p-5 relative overflow-hidden"
              style={{ background: "rgba(30,41,59,0.6)", border: "1px solid rgba(26,58,92,0.15)" }}>
              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-20 h-20 opacity-30 pointer-events-none"
                style={{ background: "rgba(26,58,92,0.2)" }} />
              <div className="flex items-start justify-between relative">
                <div>
                  <h3 className="text-[14px] font-bold text-white">{profile.college}</h3>
                  <p className="text-[11px] text-indigo-300 mt-1 font-medium">{profile.branch}</p>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <div className="px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold"
                    style={{ background: "rgba(26,58,92,0.15)", color: "#7FA3C2" }}>
                    {profile.enrollmentYear} &ndash; {profile.graduationYear}
                  </div>
                  {cgpa !== "N/A" && (
                    <p className="text-[16px] font-extrabold mt-2" style={{ color: "#D4A017" }}>
                      {cgpa} <span className="text-[9px] font-normal text-slate-500">CGPA</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* School Education */}
        {(profile.school10th || profile.school12th) && (
          <>
            <SectionHeader icon={<FiBook size={14} className="text-indigo-300" />}>School Education</SectionHeader>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "XII Standard", school: profile.school12th, board: profile.board12th, pct: profile.percentage12th, yr: profile.year12th, color: "#2D5F8A" },
                { label: "X Standard", school: profile.school10th, board: profile.board10th, pct: profile.percentage10th, yr: profile.year10th, color: "#D4A017" },
              ].map((s) =>
                s.school ? (
                  <div key={s.label} className="rounded-xl p-4 relative overflow-hidden"
                    style={{ background: "rgba(30,41,59,0.5)", border: "1px solid rgba(26,58,92,0.1)" }}>
                    <div className="absolute top-0 left-0 w-full h-[3px]" style={{ background: s.color }} />
                    <p className="text-[9px] font-bold uppercase tracking-wider mb-2" style={{ color: s.color }}>{s.label}</p>
                    <p className="text-[11px] text-slate-200 font-semibold">{s.school}</p>
                    {s.board && <p className="text-[9px] text-slate-500 mt-0.5">{s.board}</p>}
                    <div className="flex justify-between items-end mt-3">
                      {s.pct && (
                        <div>
                          <span className="text-[20px] font-extrabold" style={{ color: s.color }}>{s.pct}</span>
                          <span className="text-[10px] text-slate-500">%</span>
                        </div>
                      )}
                      {s.yr && <span className="text-[9px] text-slate-500 font-mono">{s.yr}</span>}
                    </div>
                  </div>
                ) : null
              )}
            </div>
          </>
        )}

        {/* Semesters with visual bars */}
        {profile.semesters?.length > 0 && (
          <>
            <SectionHeader icon={<FiLayers size={14} className="text-indigo-300" />}>Semester Performance</SectionHeader>
            <div className="rounded-xl p-5"
              style={{ background: "rgba(30,41,59,0.4)", border: "1px solid rgba(26,58,92,0.1)" }}>
              <div className="flex items-end gap-2 justify-center" style={{ height: "80px" }}>
                {profile.semesters.map((sem) => {
                  const heightPct = (sem.sgpa / 10) * 100;
                  const isHigh = sem.sgpa >= 8;
                  return (
                    <div key={sem.number} className="flex flex-col items-center gap-1 flex-1">
                      <span className="text-[9px] font-bold font-mono" style={{ color: isHigh ? "#D4A017" : "#2D5F8A" }}>
                        {sem.sgpa.toFixed(1)}
                      </span>
                      <div className="w-full rounded-t-md relative" style={{
                        height: `${heightPct}%`,
                        background: isHigh
                          ? "#D4A017"
                          : "#2D5F8A",
                        minHeight: "8px",
                      }} />
                      <span className="text-[8px] text-slate-500">S{sem.number}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Skills with rings */}
        {profile.skills?.length > 0 && (
          <>
            <SectionHeader icon={<FiCode size={14} className="text-indigo-300" />}>Technical Skills</SectionHeader>
            <div className="space-y-4">
              {Object.entries(skillsByCategory).map(([category, skills]) => (
                <div key={category}>
                  <p className="text-[9px] font-bold text-indigo-400 uppercase tracking-[0.15em] mb-2">{category}</p>
                  <div className="flex flex-wrap gap-3">
                    {skills.map((skill: any) => (
                      <SkillRing key={skill.name} name={skill.name} proficiency={skill.proficiency || 75} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Projects */}
        {profile.projects?.length > 0 && (
          <>
            <SectionHeader icon={<FiCode size={14} className="text-indigo-300" />}>Projects</SectionHeader>
            <div className="space-y-3">
              {profile.projects.map((project, i) => (
                <div key={i} className="rounded-xl p-4 relative overflow-hidden group"
                  style={{ background: "rgba(30,41,59,0.5)", border: "1px solid rgba(26,58,92,0.12)" }}>
                  {/* Left accent */}
                  <div className="absolute left-0 top-0 bottom-0 w-[3px]"
                    style={{ background: "#1A3A5C" }} />
                  <div className="pl-3">
                    <div className="flex items-start justify-between">
                      <h3 className="text-[13px] font-bold text-white">{project.title}</h3>
                      <div className="flex items-center gap-2 shrink-0 ml-3">
                        {project.github && (
                          <a href={project.github} className="w-6 h-6 rounded-md flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                            style={{ background: "rgba(26,58,92,0.15)" }}>
                            <FiGithub size={11} />
                          </a>
                        )}
                        {project.liveDemo && (
                          <a href={project.liveDemo} className="w-6 h-6 rounded-md flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                            style={{ background: "rgba(212,160,23,0.15)" }}>
                            <FiExternalLink size={11} />
                          </a>
                        )}
                      </div>
                    </div>
                    {project.description && (
                      <p className="text-[10px] text-slate-400 mt-2 leading-[1.7]">{project.description}</p>
                    )}
                    {project.techStack?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {project.techStack.map((tech, j) => (
                          <span key={j} className="px-2.5 py-[3px] text-[9px] rounded-full font-semibold"
                            style={{ background: "rgba(212,160,23,0.12)", color: "#5EEAD4", border: "1px solid rgba(212,160,23,0.15)" }}>
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Internships */}
        {profile.internships?.length > 0 && (
          <>
            <SectionHeader icon={<FiBriefcase size={14} className="text-indigo-300" />}>Internships</SectionHeader>
            <div className="relative pl-5">
              {/* Timeline line */}
              <div className="absolute left-[7px] top-2 bottom-2 w-[2px]"
                style={{ background: "#1A3A5C" }} />
              <div className="space-y-4">
                {profile.internships.map((intern, i) => (
                  <div key={i} className="relative">
                    {/* Timeline dot */}
                    <div className="absolute -left-5 top-1.5 w-[14px] h-[14px] rounded-full border-[3px] z-10"
                      style={{ borderColor: "#060B18", background: "#1A3A5C" }} />
                    <div className="rounded-xl p-4"
                      style={{ background: "rgba(30,41,59,0.4)", border: "1px solid rgba(26,58,92,0.1)" }}>
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-[12px] font-bold text-white">{intern.role}</h3>
                          <p className="text-[10px] text-indigo-300 mt-0.5 font-medium">{intern.company}</p>
                        </div>
                        <span className="text-[9px] px-2 py-1 rounded-full font-mono shrink-0 ml-3"
                          style={{ background: "rgba(26,58,92,0.1)", color: "#7FA3C2" }}>
                          {intern.duration}
                        </span>
                      </div>
                      {intern.description && (
                        <p className="text-[10px] text-slate-400 mt-2 leading-[1.7]">{intern.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Certifications */}
        {profile.certifications?.length > 0 && (
          <>
            <SectionHeader icon={<FiAward size={14} className="text-indigo-300" />}>Certifications</SectionHeader>
            <div className="grid grid-cols-2 gap-2">
              {profile.certifications.map((cert, i) => (
                <div key={i} className="rounded-xl p-3 flex items-start gap-3"
                  style={{ background: "rgba(30,41,59,0.4)", border: "1px solid rgba(26,58,92,0.1)" }}>
                  <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center"
                    style={{ background: "rgba(251,191,36,0.12)" }}>
                    <FiAward size={14} className="text-amber-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-white leading-tight">{cert.title}</p>
                    {cert.issuer && <p className="text-[9px] text-indigo-300 mt-0.5">{cert.issuer}</p>}
                    {cert.date && <p className="text-[8px] text-slate-500 mt-0.5">{cert.date}</p>}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
