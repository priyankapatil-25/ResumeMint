"use client";

import React from "react";
import { FiMail, FiPhone, FiMapPin, FiGithub, FiLinkedin, FiGlobe, FiExternalLink, FiAward, FiBriefcase, FiCode, FiBook } from "react-icons/fi";

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

function SidebarHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-3 mt-6">
      <h3 className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "rgba(255,255,255,0.45)" }}>
        {children}
      </h3>
      <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
    </div>
  );
}

function MainHeading({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 mb-4 mt-7">
      <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-indigo-50">{icon}</div>
      <h2 className="text-[12px] font-bold uppercase tracking-[0.12em] text-slate-700">{children}</h2>
      <div className="flex-1 h-[2px] rounded-full" style={{ background: "linear-gradient(90deg, #6366F1, transparent)" }} />
    </div>
  );
}

function SkillDots({ proficiency }: { proficiency: number }) {
  const filled = Math.round((proficiency / 100) * 5);
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="w-[6px] h-[6px] rounded-full"
          style={{ background: i < filled ? "linear-gradient(135deg, #818CF8, #6366F1)" : "rgba(255,255,255,0.1)" }} />
      ))}
    </div>
  );
}

export default function TemplateBold({ profile, cgpa }: TemplateProps) {
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
    <div className="min-h-[297mm] w-[210mm] mx-auto flex bg-white overflow-hidden"
      style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* ===== LEFT SIDEBAR ===== */}
      <div className="w-[35%] shrink-0 text-white px-6 py-7 relative"
        style={{ background: "linear-gradient(180deg, #1E1B4B 0%, #312E81 50%, #0F172A 100%)" }}>

        {/* Decorative orbs */}
        <div className="absolute top-0 right-0 w-[150px] h-[150px] rounded-full opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(129,140,248,0.5), transparent 70%)" }} />
        <div className="absolute bottom-20 left-0 w-[100px] h-[100px] rounded-full opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(45,212,191,0.5), transparent 70%)" }} />

        {/* Photo */}
        <div className="flex justify-center mb-4 relative z-10">
          <div className="relative">
            <div className="w-[100px] h-[100px] rounded-2xl overflow-hidden flex items-center justify-center text-white text-3xl font-bold"
              style={{
                background: profile.photo ? "transparent" : "linear-gradient(135deg, #6366F1, #2DD4BF)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.3), 0 0 0 3px rgba(99,102,241,0.3)",
              }}>
              {profile.photo ? (
                <img src={profile.photo} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                <span>{initials}</span>
              )}
            </div>
            {/* Decorative badge */}
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg flex items-center justify-center text-[9px] font-bold"
              style={{ background: "linear-gradient(135deg, #6366F1, #2DD4BF)", boxShadow: "0 2px 8px rgba(99,102,241,0.4)" }}>
              <FiCode size={14} />
            </div>
          </div>
        </div>

        {/* Name */}
        <div className="text-center mb-5 relative z-10">
          <h2 className="text-[17px] font-extrabold text-white leading-tight">{profile.name}</h2>
          {profile.branch && (
            <div className="mt-2 inline-block px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider"
              style={{ background: "rgba(99,102,241,0.2)", color: "#A5B4FC", border: "1px solid rgba(99,102,241,0.2)" }}>
              {profile.branch}
            </div>
          )}
        </div>

        {/* CGPA highlight */}
        {cgpa !== "N/A" && (
          <div className="text-center mb-5 relative z-10">
            <div className="inline-flex flex-col items-center px-5 py-3 rounded-xl"
              style={{ background: "rgba(45,212,191,0.1)", border: "1px solid rgba(45,212,191,0.2)" }}>
              <span className="text-[8px] text-teal-300 uppercase tracking-wider font-bold">Overall CGPA</span>
              <span className="text-[24px] font-extrabold text-teal-400 leading-none mt-1">{cgpa}</span>
            </div>
          </div>
        )}

        {/* Contact */}
        <SidebarHeading>Contact</SidebarHeading>
        <div className="space-y-2.5 relative z-10">
          {[
            { icon: <FiMail size={11} />, val: profile.email },
            { icon: <FiPhone size={11} />, val: profile.phone },
            { icon: <FiMapPin size={11} />, val: profile.address },
            { icon: <FiGithub size={11} />, val: profile.github },
            { icon: <FiLinkedin size={11} />, val: profile.linkedin },
            { icon: <FiGlobe size={11} />, val: profile.portfolio },
          ].filter((c) => c.val).map((c, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-[1px]"
                style={{ background: "rgba(99,102,241,0.15)" }}>
                <span className="text-indigo-300">{c.icon}</span>
              </div>
              <span className="text-[10px] text-slate-300 break-all leading-[1.6]">{c.val}</span>
            </div>
          ))}
        </div>

        {/* Skills with dot ratings */}
        {profile.skills?.length > 0 && (
          <>
            <SidebarHeading>Skills</SidebarHeading>
            <div className="space-y-3 relative z-10">
              {Object.entries(skillsByCategory).map(([category, skills]) => (
                <div key={category}>
                  <p className="text-[8px] font-bold uppercase tracking-wider mb-2" style={{ color: "#818CF8" }}>{category}</p>
                  <div className="space-y-2">
                    {skills.map((skill: any) => (
                      <div key={skill.name} className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-300">{skill.name}</span>
                        <SkillDots proficiency={skill.proficiency || 75} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Certifications */}
        {profile.certifications?.length > 0 && (
          <>
            <SidebarHeading>Certifications</SidebarHeading>
            <div className="space-y-3 relative z-10">
              {profile.certifications.map((cert, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-md shrink-0 flex items-center justify-center mt-[1px]"
                    style={{ background: "rgba(251,191,36,0.15)" }}>
                    <FiAward size={11} className="text-amber-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-slate-200 leading-tight">{cert.title}</p>
                    {cert.issuer && <p className="text-[8px] text-indigo-300 mt-0.5">{cert.issuer}</p>}
                    {cert.date && <p className="text-[8px] text-slate-500 mt-0.5">{cert.date}</p>}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Semesters (compact grid) */}
        {profile.semesters?.length > 0 && (
          <>
            <SidebarHeading>Semesters</SidebarHeading>
            <div className="grid grid-cols-2 gap-1.5 relative z-10">
              {profile.semesters.map((sem) => {
                const isHigh = sem.sgpa >= 8;
                return (
                  <div key={sem.number} className="flex items-center justify-between px-2.5 py-2 rounded-lg"
                    style={{ background: "rgba(99,102,241,0.08)" }}>
                    <span className="text-[9px] text-slate-400 font-medium">Sem {sem.number}</span>
                    <span className="text-[12px] font-bold font-mono" style={{ color: isHigh ? "#2DD4BF" : "#A5B4FC" }}>
                      {sem.sgpa.toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* ===== RIGHT MAIN CONTENT ===== */}
      <div className="flex-1 px-7 py-7 text-gray-800 overflow-hidden">
        {/* Name header */}
        <div className="mb-2">
          <h1 className="text-[26px] font-extrabold text-slate-800 tracking-tight leading-none">{profile.name}</h1>
          {profile.branch && (
            <p className="text-[11px] text-indigo-600 mt-1.5 font-semibold">{profile.branch}</p>
          )}
          <div className="w-14 h-[3px] rounded-full mt-3" style={{ background: "linear-gradient(90deg, #6366F1, #2DD4BF)" }} />
        </div>

        {/* Objective */}
        {profile.objective && (
          <>
            <MainHeading icon={<FiBook size={12} className="text-indigo-500" />}>Career Objective</MainHeading>
            <p className="text-[10px] leading-[1.8] text-slate-500 italic">&ldquo;{profile.objective}&rdquo;</p>
          </>
        )}

        {/* Education */}
        {profile.college && (
          <>
            <MainHeading icon={<FiBook size={12} className="text-indigo-500" />}>Education</MainHeading>
            <div className="rounded-xl p-4 bg-gradient-to-r from-indigo-50 to-white border border-indigo-100">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-[12px] font-bold text-slate-800">{profile.college}</h3>
                  <p className="text-[10px] text-indigo-600 mt-0.5 font-medium">{profile.branch}</p>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <span className="text-[9px] px-2 py-1 rounded bg-indigo-100 text-indigo-600 font-mono font-semibold">
                    {profile.enrollmentYear} &ndash; {profile.graduationYear}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* School */}
        {(profile.school10th || profile.school12th) && (
          <>
            <MainHeading icon={<FiBook size={12} className="text-indigo-500" />}>School Education</MainHeading>
            <div className="space-y-2">
              {[
                { label: "12th", school: profile.school12th, board: profile.board12th, pct: profile.percentage12th, yr: profile.year12th },
                { label: "10th", school: profile.school10th, board: profile.board10th, pct: profile.percentage10th, yr: profile.year10th },
              ].map((s) =>
                s.school ? (
                  <div key={s.label} className="flex items-center justify-between rounded-lg p-3 bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-indigo-100 text-indigo-600 text-[10px] font-extrabold shrink-0">
                        {s.label}
                      </div>
                      <div>
                        <span className="text-[10px] font-semibold text-slate-700 block">{s.school}</span>
                        <span className="text-[8px] text-slate-400">{s.board} | {s.yr}</span>
                      </div>
                    </div>
                    {s.pct && (
                      <span className="text-[16px] font-extrabold text-indigo-600 shrink-0 ml-3">
                        {s.pct}<span className="text-[9px] text-slate-400">%</span>
                      </span>
                    )}
                  </div>
                ) : null
              )}
            </div>
          </>
        )}

        {/* Projects */}
        {profile.projects?.length > 0 && (
          <>
            <MainHeading icon={<FiCode size={12} className="text-indigo-500" />}>Projects</MainHeading>
            <div className="space-y-3">
              {profile.projects.map((project, i) => (
                <div key={i} className="rounded-xl p-4 bg-white border border-slate-200 relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-[3px]"
                    style={{ background: "linear-gradient(180deg, #6366F1, #2DD4BF)" }} />
                  <div className="pl-2">
                    <div className="flex items-start justify-between">
                      <h3 className="text-[12px] font-bold text-slate-800">{project.title}</h3>
                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        {project.github && (
                          <a href={project.github} className="w-5 h-5 rounded flex items-center justify-center bg-slate-100 text-slate-400 hover:text-indigo-600 transition-colors">
                            <FiGithub size={10} />
                          </a>
                        )}
                        {project.liveDemo && (
                          <a href={project.liveDemo} className="w-5 h-5 rounded flex items-center justify-center bg-slate-100 text-slate-400 hover:text-indigo-600 transition-colors">
                            <FiExternalLink size={10} />
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
                          <span key={j} className="px-2 py-[2px] text-[8px] rounded-full font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100">
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
            <MainHeading icon={<FiBriefcase size={12} className="text-indigo-500" />}>Internships</MainHeading>
            <div className="space-y-3">
              {profile.internships.map((intern, i) => (
                <div key={i} className="rounded-xl p-4 bg-white border border-slate-200 relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ background: "#2DD4BF" }} />
                  <div className="pl-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-[12px] font-bold text-slate-800">{intern.role}</h3>
                        <p className="text-[10px] text-indigo-600 mt-0.5 font-medium">{intern.company}</p>
                      </div>
                      <span className="text-[9px] px-2 py-1 rounded-full bg-teal-50 text-teal-600 font-semibold shrink-0 ml-3">
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
          </>
        )}
      </div>
    </div>
  );
}
