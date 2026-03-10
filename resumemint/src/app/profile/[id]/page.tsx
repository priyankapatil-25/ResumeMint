"use client";

import { useEffect, useState, use } from "react";
import { motion } from "framer-motion";
import QRCode from "qrcode";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiGithub,
  FiLinkedin,
  FiGlobe,
  FiAward,
  FiBriefcase,
  FiCode,
  FiFolder,
  FiBookOpen,
  FiExternalLink,
} from "react-icons/fi";
import Link from "next/link";

/* eslint-disable @typescript-eslint/no-explicit-any */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function PublicProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [qrCode, setQrCode] = useState<string>("");

  useEffect(() => {
    fetch(`/api/profile/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (typeof window !== "undefined" && profile) {
      QRCode.toDataURL(window.location.href, {
        width: 200,
        color: { dark: "#1A3A5C", light: "#FFFFFF" },
      }).then((url: string) => setQrCode(url));
    }
  }, [profile]);

  if (loading) {
    return (
      <div className="aurora-bg min-h-screen flex items-center justify-center">
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-[#1A3A5C] border-t-transparent animate-spin" />
          <p
            className="text-[var(--text-muted)] text-sm"
            style={{ fontFamily: "var(--font-jetbrains)" }}
          >
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="aurora-bg min-h-screen flex items-center justify-center">
        <div className="relative z-10 bento-card text-center max-w-md mx-auto">
          <h1
            className="text-6xl font-bold text-gradient mb-4"
            style={{ fontFamily: "var(--font-space)" }}
          >
            404
          </h1>
          <p className="text-[var(--text-secondary)] mb-6">
            This profile could not be found.
          </p>
          <Link href="/" className="btn-primary">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const semesters: any[] = profile.semesters || [];
  const skills: any[] = profile.skills || [];
  const projects: any[] = profile.projects || [];
  const certifications: any[] = profile.certifications || [];
  const internships: any[] = profile.internships || [];

  const cgpa =
    semesters.length > 0
      ? (
          semesters.reduce((sum: number, s: any) => sum + (s.sgpa || 0), 0) /
          semesters.length
        ).toFixed(2)
      : "N/A";

  // Group skills by category
  const skillsByCategory: Record<string, any[]> = {};
  skills.forEach((skill) => {
    const cat = skill.category || "Other";
    if (!skillsByCategory[cat]) skillsByCategory[cat] = [];
    skillsByCategory[cat].push(skill);
  });

  const initials = profile.name
    ? profile.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <div className="aurora-bg min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-12 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-6"
        >
          {/* Header Card */}
          <motion.div
            variants={itemVariants}
            className="bento-card glow-indigo"
          >
            <div className="flex flex-col md:flex-row gap-6">
              {/* Photo / Initials + Info */}
              <div className="flex-1 flex flex-col sm:flex-row gap-5">
                {/* Avatar */}
                <div className="shrink-0">
                  {profile.photo ? (
                    <img
                      src={profile.photo}
                      alt={profile.name}
                      className="w-24 h-24 rounded-2xl object-cover border-2 border-[var(--border)]"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-2xl bg-[#1A3A5C] flex items-center justify-center">
                      <span
                        className="text-2xl font-bold text-white"
                        style={{ fontFamily: "var(--font-space)" }}
                      >
                        {initials}
                      </span>
                    </div>
                  )}
                </div>

                {/* Name + Details */}
                <div className="flex-1">
                  <h1
                    className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-1"
                    style={{ fontFamily: "var(--font-space)" }}
                  >
                    {profile.name}
                  </h1>
                  {(profile.branch || profile.college) && (
                    <p className="text-[var(--text-secondary)] text-sm mb-4">
                      {profile.branch}
                      {profile.branch && profile.college ? " | " : ""}
                      {profile.college}
                    </p>
                  )}

                  {/* Contact Links */}
                  <div className="flex flex-wrap gap-3">
                    {profile.email && (
                      <a
                        href={`mailto:${profile.email}`}
                        className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[#1A3A5C] transition-colors"
                      >
                        <FiMail size={13} />
                        {profile.email}
                      </a>
                    )}
                    {profile.phone && (
                      <a
                        href={`tel:${profile.phone}`}
                        className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[#1A3A5C] transition-colors"
                      >
                        <FiPhone size={13} />
                        {profile.phone}
                      </a>
                    )}
                    {profile.address && (
                      <span className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                        <FiMapPin size={13} />
                        {profile.address}
                      </span>
                    )}
                    {profile.github && (
                      <a
                        href={profile.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[#1A3A5C] transition-colors"
                      >
                        <FiGithub size={13} />
                        GitHub
                      </a>
                    )}
                    {profile.linkedin && (
                      <a
                        href={profile.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[#1A3A5C] transition-colors"
                      >
                        <FiLinkedin size={13} />
                        LinkedIn
                      </a>
                    )}
                    {profile.portfolio && (
                      <a
                        href={profile.portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[#1A3A5C] transition-colors"
                      >
                        <FiGlobe size={13} />
                        Portfolio
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* QR Code */}
              {qrCode && (
                <div className="shrink-0 flex flex-col items-center gap-2">
                  <img
                    src={qrCode}
                    alt="Profile QR Code"
                    className="w-28 h-28 rounded-xl"
                  />
                  <span className="text-[10px] text-[var(--text-muted)]">
                    Scan to view
                  </span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            <div className="bento-card flex flex-col items-center justify-center py-5">
              <span
                className="text-3xl font-bold text-gradient"
                style={{ fontFamily: "var(--font-jetbrains)" }}
              >
                {cgpa}
              </span>
              <span className="text-xs text-[var(--text-muted)] mt-1">
                CGPA
              </span>
            </div>
            <div className="bento-card flex flex-col items-center justify-center py-5">
              <span
                className="text-3xl font-bold text-gradient"
                style={{ fontFamily: "var(--font-jetbrains)" }}
              >
                {semesters.length}
              </span>
              <span className="text-xs text-[var(--text-muted)] mt-1">
                Semesters
              </span>
            </div>
            <div className="bento-card flex flex-col items-center justify-center py-5">
              <span
                className="text-3xl font-bold text-gradient"
                style={{ fontFamily: "var(--font-jetbrains)" }}
              >
                {skills.length}
              </span>
              <span className="text-xs text-[var(--text-muted)] mt-1">
                Skills
              </span>
            </div>
            <div className="bento-card flex flex-col items-center justify-center py-5">
              <span
                className="text-3xl font-bold text-gradient"
                style={{ fontFamily: "var(--font-jetbrains)" }}
              >
                {projects.length}
              </span>
              <span className="text-xs text-[var(--text-muted)] mt-1">
                Projects
              </span>
            </div>
          </motion.div>

          {/* About Me */}
          {profile.objective && (
            <motion.div variants={itemVariants} className="bento-card">
              <h2
                className="text-lg font-semibold mb-3 flex items-center gap-2"
                style={{ fontFamily: "var(--font-space)" }}
              >
                <FiBookOpen className="text-[#1A3A5C]" size={18} />
                About Me
              </h2>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                {profile.objective}
              </p>
            </motion.div>
          )}

          {/* Semester Journey */}
          {semesters.length > 0 && (
            <motion.div variants={itemVariants} className="bento-card">
              <h2
                className="text-lg font-semibold mb-5 flex items-center gap-2"
                style={{ fontFamily: "var(--font-space)" }}
              >
                <FiBookOpen className="text-[#D4A017]" size={18} />
                Semester Journey
              </h2>
              <div className="flex flex-col gap-3">
                {semesters.map((sem: any) => {
                  const pct = ((sem.sgpa || 0) / 10) * 100;
                  return (
                    <div key={sem.number} className="flex items-center gap-3">
                      <span
                        className="text-xs text-[var(--text-muted)] w-12 shrink-0"
                        style={{ fontFamily: "var(--font-jetbrains)" }}
                      >
                        Sem {sem.number}
                      </span>
                      <div
                        className="flex-1 h-6 rounded-full overflow-hidden"
                        style={{ background: "var(--surface-light)" }}
                      >
                        <motion.div
                          className="h-full rounded-full"
                          style={{
                            background: "#1A3A5C",
                          }}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{
                            duration: 0.8,
                            delay: 0.3 + sem.number * 0.1,
                            ease: "easeOut" as const,
                          }}
                        />
                      </div>
                      <span
                        className="text-sm font-bold text-[var(--text-primary)] w-10 text-right"
                        style={{ fontFamily: "var(--font-jetbrains)" }}
                      >
                        {sem.sgpa?.toFixed(1) ?? "--"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <motion.div variants={itemVariants} className="bento-card">
              <h2
                className="text-lg font-semibold mb-5 flex items-center gap-2"
                style={{ fontFamily: "var(--font-space)" }}
              >
                <FiCode className="text-[#1A3A5C]" size={18} />
                Skills
              </h2>
              <div className="flex flex-col gap-5">
                {Object.entries(skillsByCategory).map(([category, catSkills]) => (
                  <div key={category}>
                    <h3
                      className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3"
                      style={{ fontFamily: "var(--font-space)" }}
                    >
                      {category}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {catSkills.map((skill: any) => (
                        <span
                          key={skill.name}
                          className="group relative px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:scale-105 cursor-default"
                          style={{
                            background: "var(--surface-light)",
                            border: "1px solid var(--border)",
                            color: "var(--text-secondary)",
                          }}
                        >
                          {skill.name}
                          {/* Proficiency tooltip */}
                          {skill.proficiency && (
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded-lg text-[10px] font-bold bg-[#1A3A5C] text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                              {skill.proficiency}%
                            </span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <motion.div variants={itemVariants} className="bento-card">
              <h2
                className="text-lg font-semibold mb-5 flex items-center gap-2"
                style={{ fontFamily: "var(--font-space)" }}
              >
                <FiFolder className="text-[#B8860B]" size={18} />
                Projects
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((project: any, idx: number) => (
                  <div
                    key={idx}
                    className="rounded-xl p-4 transition-all hover:border-[var(--border-hover)]"
                    style={{
                      background: "var(--surface-light)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <h3
                      className="text-sm font-semibold text-[var(--text-primary)] mb-1"
                      style={{ fontFamily: "var(--font-space)" }}
                    >
                      {project.title}
                    </h3>
                    {project.description && (
                      <p className="text-xs text-[var(--text-muted)] mb-3 line-clamp-2">
                        {project.description}
                      </p>
                    )}
                    {project.techStack && project.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {project.techStack.map((tech: string, i: number) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md text-[10px] font-medium"
                            style={{
                              background: "rgba(26, 58, 92, 0.1)",
                              color: "#2D5F8A",
                            }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-3">
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-[#1A3A5C] transition-colors"
                        >
                          <FiGithub size={12} />
                          Code
                        </a>
                      )}
                      {project.liveDemo && (
                        <a
                          href={project.liveDemo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-[#D4A017] transition-colors"
                        >
                          <FiExternalLink size={12} />
                          Demo
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <motion.div variants={itemVariants} className="bento-card">
              <h2
                className="text-lg font-semibold mb-5 flex items-center gap-2"
                style={{ fontFamily: "var(--font-space)" }}
              >
                <FiAward className="text-[#B8860B]" size={18} />
                Certifications
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {certifications.map((cert: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 rounded-xl p-4"
                    style={{
                      background: "var(--surface-light)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center shrink-0">
                      <FiAward className="text-white" size={16} />
                    </div>
                    <div>
                      <h3
                        className="text-sm font-semibold text-[var(--text-primary)]"
                        style={{ fontFamily: "var(--font-space)" }}
                      >
                        {cert.title}
                      </h3>
                      {cert.issuer && (
                        <p className="text-xs text-[var(--text-muted)]">
                          {cert.issuer}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Internships */}
          {internships.length > 0 && (
            <motion.div variants={itemVariants} className="bento-card">
              <h2
                className="text-lg font-semibold mb-5 flex items-center gap-2"
                style={{ fontFamily: "var(--font-space)" }}
              >
                <FiBriefcase className="text-[#D4A017]" size={18} />
                Internships
              </h2>
              <div className="flex flex-col gap-4">
                {internships.map((intern: any, idx: number) => (
                  <div
                    key={idx}
                    className="rounded-xl p-4"
                    style={{
                      background: "var(--surface-light)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                      <h3
                        className="text-sm font-semibold text-[var(--text-primary)]"
                        style={{ fontFamily: "var(--font-space)" }}
                      >
                        {intern.company}
                      </h3>
                      {intern.duration && (
                        <span
                          className="text-xs text-[var(--text-muted)]"
                          style={{ fontFamily: "var(--font-jetbrains)" }}
                        >
                          {intern.duration}
                        </span>
                      )}
                    </div>
                    {intern.role && (
                      <p className="text-xs text-[#2D5F8A] font-medium mb-1">
                        {intern.role}
                      </p>
                    )}
                    {intern.description && (
                      <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                        {intern.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Footer */}
          <motion.div
            variants={itemVariants}
            className="text-center py-8"
          >
            <Link href="/" className="inline-flex items-center gap-2 group">
              <img src="/GCEK Logo.jpg" alt="GCEK" className="w-6 h-6 rounded-full object-cover" />
              <span className="text-xs text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] transition-colors">
                Built with{" "}
                <span
                  className="text-gradient font-semibold"
                  style={{ fontFamily: "var(--font-space)" }}
                >
                  GCE Karad
                </span>
              </span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
