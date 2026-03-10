"use client";

import React from "react";
import { FiMail, FiPhone, FiMapPin, FiGithub, FiLinkedin, FiGlobe, FiExternalLink, FiAward, FiBriefcase, FiCode, FiBook, FiUser } from "react-icons/fi";

/* eslint-disable @typescript-eslint/no-explicit-any */

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

function SidebarHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-3 mt-6">
      <h3 className="text-[13px] font-bold uppercase tracking-[0.15em] whitespace-nowrap" style={{ color: "rgba(255,255,255,0.55)" }}>
        {children}
      </h3>
      <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.15)" }} />
    </div>
  );
}

function MainHeading({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 mb-4 mt-6">
      <div className="w-7 h-7 rounded-md flex items-center justify-center bg-[#EBF1F7]">{icon}</div>
      <h2 className="text-[14px] font-bold uppercase tracking-[0.1em] text-slate-700">{children}</h2>
      <div className="flex-1 h-[2px] rounded-full" style={{ background: "#1A3A5C" }} />
    </div>
  );
}

function SkillDots({ proficiency }: { proficiency: number }) {
  const filled = Math.round((proficiency / 100) * 5);
  return (
    <div className="flex gap-1.5">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="w-[7px] h-[7px] rounded-full"
          style={{ background: i < filled ? "#1A3A5C" : "rgba(255,255,255,0.15)" }} />
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

  const filledSemesters = profile.semesters?.filter((s) => s.sgpa > 0) || [];

  return (
    <div className="min-h-[297mm] w-[210mm] mx-auto flex bg-white overflow-hidden"
      style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", fontSize: "12px" }}>

      {/* ===== LEFT SIDEBAR ===== */}
      <div className="w-[35%] shrink-0 text-white px-5 py-7 relative"
        style={{ background: "#0F2133" }}>

        {/* Decorative orbs */}
        <div className="absolute top-0 right-0 w-[120px] h-[120px] rounded-full opacity-10 pointer-events-none"
          style={{ background: "rgba(45,95,138,0.25)" }} />

        {/* Photo */}
        <div className="flex justify-center mb-4 relative z-10">
          <div className="w-[120px] h-[120px] rounded-2xl overflow-hidden flex items-center justify-center text-white text-3xl font-bold"
            style={{
              background: profile.photo ? "transparent" : "#1A3A5C",
              boxShadow: "0 6px 24px rgba(0,0,0,0.3), 0 0 0 3px rgba(26,58,92,0.3)",
            }}>
            {profile.photo ? (
              <img src={profile.photo} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              <span>{initials}</span>
            )}
          </div>
        </div>

        {/* Name & Branch */}
        <div className="text-center mb-5 relative z-10">
          <h2 className="text-[18px] font-extrabold text-white leading-tight">{profile.name}</h2>
          {profile.branch && (
            <div className="mt-2 inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
              style={{ background: "rgba(26,58,92,0.2)", color: "#7FA3C2", border: "1px solid rgba(26,58,92,0.2)" }}>
              {profile.branch}
            </div>
          )}
        </div>

        {/* CGPA highlight */}
        {cgpa !== "N/A" && (
          <div className="text-center mb-4 relative z-10">
            <div className="inline-flex flex-col items-center px-5 py-2.5 rounded-xl"
              style={{ background: "rgba(212,160,23,0.1)", border: "1px solid rgba(212,160,23,0.2)" }}>
              <span className="text-[9px] text-teal-300 uppercase tracking-wider font-bold">Overall CGPA / %</span>
              <span className="text-[24px] font-extrabold text-teal-400 leading-none mt-1">{cgpa}</span>
            </div>
          </div>
        )}

        {/* Contact */}
        <SidebarHeading>Contact</SidebarHeading>
        <div className="space-y-2.5 relative z-10">
          {[
            { icon: <FiMail size={12} />, val: profile.email },
            { icon: <FiPhone size={12} />, val: profile.phone },
            { icon: <FiMapPin size={12} />, val: profile.address },
            ...(profile.dob ? [{ icon: <FiUser size={12} />, val: `DOB: ${profile.dob}` }] : []),
            { icon: <FiGithub size={12} />, val: profile.github },
            { icon: <FiLinkedin size={12} />, val: profile.linkedin },
            { icon: <FiGlobe size={12} />, val: profile.portfolio },
          ].filter((c) => c.val).map((c, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded flex items-center justify-center shrink-0 mt-[1px]"
                style={{ background: "rgba(26,58,92,0.15)" }}>
                <span className="text-indigo-300">{c.icon}</span>
              </div>
              <span className="text-[11px] text-slate-300 break-all leading-[1.5]">{c.val}</span>
            </div>
          ))}
        </div>

        {/* Skills */}
        {profile.skills?.length > 0 && (
          <>
            <SidebarHeading>Skills</SidebarHeading>
            <div className="space-y-3 relative z-10">
              {Object.entries(skillsByCategory).map(([category, skills]) => (
                <div key={category}>
                  <p className="text-[9px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "#2D5F8A" }}>{category}</p>
                  <div className="space-y-1.5">
                    {skills.map((skill: any) => (
                      <div key={skill.name} className="flex items-center justify-between">
                        <span className="text-[11px] text-slate-300">{skill.name}</span>
                        <SkillDots proficiency={skill.proficiency || 75} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Semesters */}
        {filledSemesters.length > 0 && (
          <>
            <SidebarHeading>Semesters</SidebarHeading>
            <div className="grid grid-cols-2 gap-1.5 relative z-10">
              {filledSemesters.map((sem) => (
                <div key={sem.number} className="flex items-center justify-between px-2.5 py-2 rounded-md"
                  style={{ background: "rgba(26,58,92,0.08)" }}>
                  <span className="text-[10px] text-slate-400 font-medium">Sem {sem.number}</span>
                  <span className="text-[12px] font-bold font-mono" style={{ color: sem.sgpa >= 8 ? "#D4A017" : "#7FA3C2" }}>
                    {sem.sgpa}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Extra Activities */}
        {profile.extraActivities && profile.extraActivities.length > 0 && (
          <>
            <SidebarHeading>Activities</SidebarHeading>
            <div className="space-y-1.5 relative z-10">
              {profile.extraActivities.map((activity, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-[10px] text-teal-400 mt-0.5">*</span>
                  <span className="text-[11px] text-slate-300 leading-[1.5]">{activity}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ===== RIGHT MAIN CONTENT ===== */}
      <div className="flex-1 px-7 py-7 text-gray-800 overflow-hidden">

        {/* Objective */}
        {profile.objective && (
          <>
            <MainHeading icon={<FiUser size={13} className="text-[#1A3A5C]" />}>Career Objective</MainHeading>
            <p className="text-[12px] leading-[1.8] text-slate-600 italic pl-1">&ldquo;{profile.objective}&rdquo;</p>
          </>
        )}

        {/* Education */}
        <MainHeading icon={<FiBook size={13} className="text-[#1A3A5C]" />}>Education</MainHeading>
        <div className="space-y-3">
          {/* Engineering */}
          {profile.college && (
            <div className="rounded-lg p-4 bg-[#EBF1F7] border border-[#C8D8E8]">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-[13px] font-bold text-slate-800">{profile.college}</h3>
                  <p className="text-[11px] text-[#1A3A5C] mt-1 font-medium">{profile.branch}</p>
                  {cgpa !== "N/A" && <p className="text-[10px] text-slate-500 mt-1">CGPA / %: {cgpa}</p>}
                </div>
                {profile.enrollmentYear && profile.graduationYear && (
                  <span className="text-[10px] px-2.5 py-1 rounded bg-[#D6E2ED] text-[#1A3A5C] font-mono font-semibold shrink-0 ml-2">
                    {profile.enrollmentYear} - {profile.graduationYear}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Diploma */}
          {profile.diplomaCollege && (
            <div className="rounded-lg p-4 bg-[#FFF8E1] border border-[#FFE082]">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-[13px] font-bold text-slate-800">{profile.diplomaCollege}</h3>
                  <p className="text-[11px] text-[#B8860B] mt-1 font-medium">Diploma - {profile.diplomaBranch}</p>
                  {profile.diplomaPercentage && <p className="text-[10px] text-slate-500 mt-1">Percentage / CGPA: {profile.diplomaPercentage}</p>}
                </div>
                {profile.diplomaYear && (
                  <span className="text-[10px] px-2.5 py-1 rounded bg-[#FFF0C4] text-[#B8860B] font-mono font-semibold shrink-0 ml-2">
                    {profile.diplomaYear}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* 12th */}
          {profile.school12th && (
            <div className="flex items-center justify-between rounded-lg p-4 bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-md flex items-center justify-center bg-[#D6E2ED] text-[#1A3A5C] text-[11px] font-extrabold shrink-0">
                  12th
                </div>
                <div>
                  <span className="text-[12px] font-semibold text-slate-700 block">{profile.school12th}</span>
                  <span className="text-[10px] text-slate-400">{profile.board12th}{profile.year12th ? ` | ${profile.year12th}` : ""}</span>
                </div>
              </div>
              {profile.percentage12th && (
                <span className="text-[18px] font-extrabold text-[#1A3A5C] shrink-0 ml-2">
                  {profile.percentage12th}<span className="text-[10px] text-slate-400">%</span>
                </span>
              )}
            </div>
          )}

          {/* 10th */}
          {profile.school10th && (
            <div className="flex items-center justify-between rounded-lg p-4 bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-md flex items-center justify-center bg-teal-100 text-teal-600 text-[11px] font-extrabold shrink-0">
                  10th
                </div>
                <div>
                  <span className="text-[12px] font-semibold text-slate-700 block">{profile.school10th}</span>
                  <span className="text-[10px] text-slate-400">{profile.board10th}{profile.year10th ? ` | ${profile.year10th}` : ""}</span>
                </div>
              </div>
              {profile.percentage10th && (
                <span className="text-[18px] font-extrabold text-teal-600 shrink-0 ml-2">
                  {profile.percentage10th}<span className="text-[10px] text-slate-400">%</span>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Projects */}
        {profile.projects?.length > 0 && (
          <>
            <MainHeading icon={<FiCode size={13} className="text-[#1A3A5C]" />}>Projects</MainHeading>
            <div className="space-y-3">
              {profile.projects.map((project, i) => (
                <div key={i} className="rounded-lg p-4 bg-white border border-slate-200 relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-[3px]"
                    style={{ background: "#1A3A5C" }} />
                  <div className="pl-3">
                    <div className="flex items-start justify-between">
                      <h3 className="text-[13px] font-bold text-slate-800">{project.title}</h3>
                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        {project.github && (
                          <a href={project.github} className="w-5 h-5 rounded flex items-center justify-center bg-slate-100 text-slate-500">
                            <FiGithub size={11} />
                          </a>
                        )}
                        {project.liveDemo && (
                          <a href={project.liveDemo} className="w-5 h-5 rounded flex items-center justify-center bg-slate-100 text-slate-500">
                            <FiExternalLink size={11} />
                          </a>
                        )}
                      </div>
                    </div>
                    {project.description && (
                      <p className="text-[11px] text-slate-500 mt-1.5 leading-[1.7]">{project.description}</p>
                    )}
                    {project.techStack?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {project.techStack.map((tech, j) => (
                          <span key={j} className="px-2 py-[2px] text-[9px] rounded-full font-semibold bg-[#EBF1F7] text-[#1A3A5C] border border-[#C8D8E8]">
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
            <MainHeading icon={<FiBriefcase size={13} className="text-[#1A3A5C]" />}>Internships</MainHeading>
            <div className="space-y-3">
              {profile.internships.map((intern, i) => (
                <div key={i} className="rounded-lg p-4 bg-white border border-slate-200 relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ background: "#D4A017" }} />
                  <div className="pl-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-[13px] font-bold text-slate-800">{intern.role}</h3>
                        <p className="text-[11px] text-[#1A3A5C] mt-1 font-medium">{intern.company}</p>
                      </div>
                      {intern.duration && (
                        <span className="text-[10px] px-2.5 py-1 rounded-full bg-teal-50 text-teal-600 font-semibold shrink-0 ml-2">
                          {intern.duration}
                        </span>
                      )}
                    </div>
                    {intern.description && (
                      <p className="text-[11px] text-slate-500 mt-1.5 leading-[1.7]">{intern.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Certifications */}
        {profile.certifications?.length > 0 && (
          <>
            <MainHeading icon={<FiAward size={13} className="text-[#1A3A5C]" />}>Certifications</MainHeading>
            <div className="space-y-3">
              {profile.certifications.map((cert, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg p-3.5 bg-[#FFF8E1] border border-[#FFE082]">
                  <div className="w-8 h-8 rounded-md shrink-0 flex items-center justify-center bg-[#FFF0C4]">
                    <FiAward size={14} className="text-[#B8860B]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-slate-700">{cert.title}</p>
                    <p className="text-[10px] text-slate-400">
                      {cert.issuer}{cert.date ? ` | ${cert.date}` : ""}
                    </p>
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
