"use client";

import React from "react";
import { FiMail, FiPhone, FiMapPin, FiGithub, FiLinkedin, FiGlobe, FiAward, FiBriefcase, FiCode, FiBook, FiTarget, FiLayers } from "react-icons/fi";

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

function SectionHeader({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 mb-4 mt-7">
      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "#E8EEF5" }}>
        {icon}
      </div>
      <h2 className="text-[12px] font-bold uppercase tracking-[0.12em] text-slate-700">
        {children}
      </h2>
      <div className="flex-1 h-[2px] rounded-full" style={{ background: "#A0B8CC" }} />
    </div>
  );
}

function SkillBar({ name, proficiency }: { name: string; proficiency: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-slate-600 font-medium min-w-[60px] truncate">{name}</span>
      <div className="flex-1 h-[6px] rounded-full bg-slate-100 overflow-hidden">
        <div className="h-full rounded-full transition-all"
          style={{ width: `${proficiency}%`, background: "#1A3A5C" }} />
      </div>
      <span className="text-[8px] text-slate-400 font-mono w-[22px] text-right">{proficiency}%</span>
    </div>
  );
}

export default function TemplateMinimal({ profile, cgpa }: TemplateProps) {
  const skillsByCategory = profile.skills?.reduce<Record<string, typeof profile.skills>>((acc, skill) => {
    const cat = skill.category || "General";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {}) ?? {};

  return (
    <div className="min-h-[297mm] w-[210mm] mx-auto bg-white text-gray-800"
      style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* ===== HEADER ===== */}
      <div className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0" style={{ background: "#0F2133" }} />
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-[180px] h-[180px] rounded-full opacity-10 pointer-events-none"
          style={{ background: "rgba(255,255,255,0.5)" }} />
        <div className="absolute -bottom-8 -left-8 w-[120px] h-[120px] rounded-full opacity-10 pointer-events-none"
          style={{ background: "rgba(255,255,255,0.5)" }} />

        <div className="relative px-10 py-8">
          <div className="flex items-center gap-6">
            {/* Photo */}
            {profile.photo ? (
              <div className="w-[88px] h-[88px] rounded-2xl overflow-hidden shrink-0"
                style={{ border: "3px solid rgba(255,255,255,0.25)", boxShadow: "0 8px 24px rgba(0,0,0,0.3)" }}>
                <img src={profile.photo} alt={profile.name} className="w-full h-full object-cover" />
              </div>
            ) : null}
            <div className="flex-1">
              <h1 className="text-[28px] font-extrabold text-white leading-none tracking-tight">
                {profile.name}
              </h1>
              {profile.branch && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/10 text-indigo-200 backdrop-blur-sm">
                    {profile.branch}
                  </span>
                  {cgpa !== "N/A" && (
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-200">
                      CGPA: {cgpa}
                    </span>
                  )}
                </div>
              )}
              {/* Contact */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3">
                {[
                  { icon: <FiMail size={10} />, val: profile.email },
                  { icon: <FiPhone size={10} />, val: profile.phone },
                  { icon: <FiMapPin size={10} />, val: profile.address },
                  { icon: <FiGithub size={10} />, val: profile.github },
                  { icon: <FiLinkedin size={10} />, val: profile.linkedin },
                  { icon: <FiGlobe size={10} />, val: profile.portfolio },
                ].filter((c) => c.val).map((c, i) => (
                  <span key={i} className="flex items-center gap-1 text-[10px] text-indigo-200/80">
                    <span className="text-indigo-300/60">{c.icon}</span> {c.val}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== BODY ===== */}
      <div className="px-10 pb-10">
        {/* Objective */}
        {profile.objective && (
          <>
            <SectionHeader icon={<FiTarget size={13} className="text-[#1A3A5C]" />}>Career Objective</SectionHeader>
            <div className="rounded-xl p-4 bg-slate-50 border border-slate-100"
              style={{ borderLeft: "3px solid #1A3A5C" }}>
              <p className="text-[11px] leading-[1.8] text-slate-600 italic">
                &ldquo;{profile.objective}&rdquo;
              </p>
            </div>
          </>
        )}

        {/* Education */}
        {profile.college && (
          <>
            <SectionHeader icon={<FiBook size={13} className="text-[#1A3A5C]" />}>Education</SectionHeader>
            <div className="rounded-xl p-5 bg-[#EBF1F7] border border-[#C8D8E8]">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-[13px] font-bold text-slate-800">{profile.college}</h3>
                  <p className="text-[11px] text-[#1A3A5C] mt-0.5 font-medium">{profile.branch}</p>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <span className="px-2 py-1 rounded-md text-[10px] font-mono bg-[#D6E2ED] text-[#1A3A5C] font-semibold">
                    {profile.enrollmentYear} &ndash; {profile.graduationYear}
                  </span>
                  {cgpa !== "N/A" && (
                    <p className="text-[18px] font-extrabold text-[#1A3A5C] mt-1">
                      {cgpa} <span className="text-[9px] font-normal text-slate-400">CGPA</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* School */}
        {(profile.school10th || profile.school12th) && (
          <>
            <SectionHeader icon={<FiBook size={13} className="text-[#1A3A5C]" />}>School Education</SectionHeader>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "XII Standard", school: profile.school12th, board: profile.board12th, pct: profile.percentage12th, yr: profile.year12th, color: "#1A3A5C" },
                { label: "X Standard", school: profile.school10th, board: profile.board10th, pct: profile.percentage10th, yr: profile.year10th, color: "#2D5F8A" },
              ].map((s) =>
                s.school ? (
                  <div key={s.label} className="rounded-xl p-4 bg-white border border-slate-200 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: s.color }} />
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">{s.label}</p>
                    <p className="text-[11px] text-slate-700 font-semibold">{s.school}</p>
                    {s.board && <p className="text-[9px] text-slate-400 mt-0.5">{s.board}</p>}
                    <div className="flex justify-between items-end mt-2">
                      {s.pct && (
                        <span className="text-[20px] font-extrabold" style={{ color: s.color }}>
                          {s.pct}<span className="text-[10px] text-slate-400">%</span>
                        </span>
                      )}
                      {s.yr && <span className="text-[9px] text-slate-400 font-mono">{s.yr}</span>}
                    </div>
                  </div>
                ) : null
              )}
            </div>
          </>
        )}

        {/* Semesters */}
        {profile.semesters?.length > 0 && (
          <>
            <SectionHeader icon={<FiLayers size={13} className="text-[#1A3A5C]" />}>Semester Performance</SectionHeader>
            <div className="rounded-xl p-4 bg-slate-50 border border-slate-100">
              <div className="flex items-end gap-2 justify-center" style={{ height: "70px" }}>
                {profile.semesters.map((sem) => {
                  const heightPct = (sem.sgpa / 10) * 100;
                  const isHigh = sem.sgpa >= 8;
                  return (
                    <div key={sem.number} className="flex flex-col items-center gap-1 flex-1">
                      <span className="text-[9px] font-bold font-mono" style={{ color: isHigh ? "#059669" : "#1A3A5C" }}>
                        {sem.sgpa.toFixed(1)}
                      </span>
                      <div className="w-full rounded-t-md" style={{
                        height: `${heightPct}%`,
                        background: isHigh
                          ? "#2E7D4A"
                          : "#1A3A5C",
                        minHeight: "8px",
                      }} />
                      <span className="text-[8px] text-slate-400 font-medium">S{sem.number}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Skills */}
        {profile.skills?.length > 0 && (
          <>
            <SectionHeader icon={<FiCode size={13} className="text-[#1A3A5C]" />}>Technical Skills</SectionHeader>
            <div className="space-y-3">
              {Object.entries(skillsByCategory).map(([category, skills]) => (
                <div key={category}>
                  <p className="text-[9px] font-bold text-[#1A3A5C] uppercase tracking-[0.15em] mb-2">{category}</p>
                  <div className="space-y-1.5">
                    {skills.map((skill: any) => (
                      <SkillBar key={skill.name} name={skill.name} proficiency={skill.proficiency || 75} />
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
            <SectionHeader icon={<FiCode size={13} className="text-[#1A3A5C]" />}>Projects</SectionHeader>
            <div className="space-y-3">
              {profile.projects.map((project, i) => (
                <div key={i} className="rounded-xl p-4 bg-white border border-slate-200 hover:border-indigo-200 transition-colors"
                  style={{ borderLeft: "3px solid #1A3A5C" }}>
                  <div className="flex items-start justify-between">
                    <h3 className="text-[12px] font-bold text-slate-800">{project.title}</h3>
                    <div className="flex items-center gap-1.5 shrink-0 ml-3">
                      {project.github && (
                        <a href={project.github} className="w-6 h-6 rounded-md flex items-center justify-center bg-slate-100 text-slate-400 hover:text-[#1A3A5C] transition-colors">
                          <FiGithub size={11} />
                        </a>
                      )}
                      {project.liveDemo && (
                        <a href={project.liveDemo} className="w-6 h-6 rounded-md flex items-center justify-center bg-slate-100 text-slate-400 hover:text-[#1A3A5C] transition-colors">
                          <FiGlobe size={11} />
                        </a>
                      )}
                    </div>
                  </div>
                  {project.description && (
                    <p className="text-[10px] text-slate-500 mt-1.5 leading-[1.7]">{project.description}</p>
                  )}
                  {project.techStack?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {project.techStack.map((tech, j) => (
                        <span key={j} className="px-2.5 py-[3px] text-[9px] rounded-full font-semibold bg-[#EBF1F7] text-[#1A3A5C] border border-[#C8D8E8]">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Internships */}
        {profile.internships?.length > 0 && (
          <>
            <SectionHeader icon={<FiBriefcase size={13} className="text-[#1A3A5C]" />}>Internships</SectionHeader>
            <div className="relative pl-5">
              {/* Timeline */}
              <div className="absolute left-[7px] top-2 bottom-2 w-[2px] rounded-full"
                style={{ background: "#1A3A5C" }} />
              <div className="space-y-3">
                {profile.internships.map((intern, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-5 top-2 w-[12px] h-[12px] rounded-full border-[3px] border-white z-10"
                      style={{ background: "#1A3A5C", boxShadow: "0 0 0 2px #A0B8CC" }} />
                    <div className="rounded-xl p-4 bg-white border border-slate-200">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-[12px] font-bold text-slate-800">{intern.role}</h3>
                          <p className="text-[10px] text-[#1A3A5C] font-medium mt-0.5">{intern.company}</p>
                        </div>
                        <span className="text-[9px] px-2 py-1 rounded-full bg-[#EBF1F7] text-[#1A3A5C] font-mono font-semibold shrink-0 ml-3">
                          {intern.duration}
                        </span>
                      </div>
                      {intern.description && (
                        <p className="text-[10px] text-slate-500 mt-1.5 leading-[1.7]">{intern.description}</p>
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
            <SectionHeader icon={<FiAward size={13} className="text-[#1A3A5C]" />}>Certifications</SectionHeader>
            <div className="grid grid-cols-2 gap-2">
              {profile.certifications.map((cert, i) => (
                <div key={i} className="rounded-xl p-3 flex items-start gap-2.5 bg-[#FFF8E1]/50 border border-[#FFE082]/80">
                  <div className="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center bg-[#FFF0C4]">
                    <FiAward size={13} className="text-[#B8860B]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-slate-700 leading-tight">{cert.title}</p>
                    {cert.issuer && <p className="text-[9px] text-[#1A3A5C] mt-0.5">{cert.issuer}</p>}
                    {cert.date && <p className="text-[8px] text-slate-400 mt-0.5">{cert.date}</p>}
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
