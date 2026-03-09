"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { calculateResumeScore } from "@/lib/resumeScore";
import {
  FiCheckCircle,
  FiAlertCircle,
  FiCode,
  FiFolder,
  FiAward,
  FiFileText,
  FiEye,
  FiShare2,
} from "react-icons/fi";
import Link from "next/link";

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  if (status === "loading" || loading) {
    return (
      <>
        <Navbar />
        <div className="aurora-bg min-h-screen pb-12 px-6" style={{ paddingTop: "100px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            {/* Skeleton welcome */}
            <div className="mb-8">
              <div className="skeleton h-10 w-80 mb-3" />
              <div className="skeleton h-5 w-52" />
            </div>
            {/* Skeleton bento grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="skeleton h-64 rounded-2xl" />
              <div className="skeleton h-64 rounded-2xl" />
              <div className="skeleton h-64 rounded-2xl" />
              <div className="col-span-1 md:col-span-2 lg:col-span-3 skeleton h-56 rounded-2xl" />
              <div className="skeleton h-56 rounded-2xl" />
              <div className="skeleton h-56 rounded-2xl" />
              <div className="skeleton h-56 rounded-2xl" />
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!profile) return null;

  // --- Computed data ---
  const scoreResult = calculateResumeScore(profile);
  const score = scoreResult.total;

  const semesters: any[] = profile.semesters || [];
  const cgpa =
    semesters.length > 0
      ? (
          semesters.reduce((sum: number, s: any) => sum + (s.sgpa || 0), 0) /
          semesters.length
        ).toFixed(2)
      : "N/A";

  const skillsCount = profile.skills?.length || 0;
  const projectsCount = profile.projects?.length || 0;
  const certsCount = profile.certifications?.length || 0;

  const sections = [
    { label: "Personal Info", done: !!(profile.phone && profile.name) },
    { label: "Education", done: !!(profile.college && profile.branch) },
    { label: "School (10th)", done: !!profile.school10th },
    { label: "School (12th)", done: !!profile.school12th },
    { label: "Semesters", done: semesters.length > 0 },
    { label: "Skills", done: skillsCount > 0 },
    { label: "Projects", done: projectsCount > 0 },
    { label: "Certifications", done: certsCount > 0 },
  ];

  const completedCount = sections.filter((s) => s.done).length;

  // SVG ring calculations
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDash = (score / 100) * circumference;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
    }),
  };

  return (
    <>
      <Navbar />
      <div className="aurora-bg min-h-screen pb-12 px-6" style={{ paddingTop: "100px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }} className="relative z-10">
          {/* Welcome Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1
              className="text-3xl md:text-4xl font-bold mb-2"
              style={{ fontFamily: "var(--font-space)" }}
            >
              Welcome back,{" "}
              <span className="text-gradient">
                {session?.user?.name || "User"}
              </span>
            </h1>
          </motion.div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Card 1: Resume Score */}
            <motion.div
              className="bento-card flex flex-col items-center justify-center"
              custom={0}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
            >
              <div className="relative w-48 h-48 mb-4">
                <svg
                  className="w-full h-full -rotate-90"
                  viewBox="0 0 160 160"
                >
                  {/* Background ring */}
                  <circle
                    cx="80"
                    cy="80"
                    r={radius}
                    fill="none"
                    stroke="var(--surface-light)"
                    strokeWidth="10"
                  />
                  {/* Score ring */}
                  <motion.circle
                    cx="80"
                    cy="80"
                    r={radius}
                    fill="none"
                    stroke="url(#scoreGrad)"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: circumference - strokeDash }}
                    transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                  />
                  <defs>
                    <linearGradient
                      id="scoreGrad"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#6366F1" />
                      <stop offset="100%" stopColor="#14B8A6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span
                    className="text-5xl font-bold text-gradient"
                    style={{ fontFamily: "var(--font-jetbrains)" }}
                  >
                    {score}
                  </span>
                  <span
                    className="text-sm text-[var(--text-muted)]"
                    style={{ fontFamily: "var(--font-jetbrains)" }}
                  >
                    / 100
                  </span>
                </div>
              </div>
              <p
                className="text-lg font-semibold text-[var(--text-primary)]"
                style={{ fontFamily: "var(--font-space)" }}
              >
                Resume Score
              </p>
              <p
                className="text-sm text-[var(--text-muted)] mt-1"
                style={{ fontFamily: "var(--font-jetbrains)" }}
              >
                {score}/100
              </p>
            </motion.div>

            {/* Card 2: CGPA */}
            <motion.div
              className="bento-card flex flex-col items-center justify-center"
              custom={1}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
            >
              <span
                className="text-5xl font-bold text-gradient mb-3"
                style={{ fontFamily: "var(--font-jetbrains)" }}
              >
                {cgpa}
              </span>
              <p
                className="text-[var(--text-secondary)] text-sm font-medium"
                style={{ fontFamily: "var(--font-space)" }}
              >
                Cumulative GPA
              </p>
              {semesters.length > 0 && (
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  from {semesters.length} semester
                  {semesters.length > 1 ? "s" : ""}
                </p>
              )}
            </motion.div>

            {/* Card 3: Quick Stats */}
            <motion.div
              className="bento-card flex flex-col justify-center gap-5"
              custom={2}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
            >
              <h3
                className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1"
                style={{ fontFamily: "var(--font-space)" }}
              >
                Quick Stats
              </h3>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#E0E7FF" }}>
                  <FiCode className="text-[#6366F1]" size={16} />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-lg" style={{ fontFamily: "var(--font-jetbrains)", color: "var(--text-primary)" }}>{skillsCount}</div>
                  <div className="text-xs" style={{ color: "var(--text-muted)" }}>Skills</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#D1FAE5" }}>
                  <FiFolder className="text-[#14B8A6]" size={16} />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-lg" style={{ fontFamily: "var(--font-jetbrains)", color: "var(--text-primary)" }}>{projectsCount}</div>
                  <div className="text-xs" style={{ color: "var(--text-muted)" }}>Projects</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#FEF3C7" }}>
                  <FiAward className="text-[#D97706]" size={16} />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-lg" style={{ fontFamily: "var(--font-jetbrains)", color: "var(--text-primary)" }}>{certsCount}</div>
                  <div className="text-xs" style={{ color: "var(--text-muted)" }}>Certifications</div>
                </div>
              </div>
            </motion.div>

            {/* Card 4: Section Checklist (full width) */}
            <motion.div
              className="col-span-1 md:col-span-2 lg:col-span-3 bento-card"
              custom={3}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
            >
              <h3
                className="text-lg font-semibold mb-4"
                style={{ fontFamily: "var(--font-space)" }}
              >
                Profile Completion{" "}
                <span
                  className="text-sm text-[var(--text-muted)] font-normal"
                  style={{ fontFamily: "var(--font-jetbrains)" }}
                >
                  ({completedCount}/{sections.length})
                </span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {sections.map((sec) => (
                  <div
                    key={sec.label}
                    className="flex items-center gap-3 py-2 px-3 rounded-xl"
                    style={{ background: "var(--surface-light)" }}
                  >
                    {sec.done ? (
                      <FiCheckCircle className="text-emerald-400 shrink-0" size={18} />
                    ) : (
                      <FiAlertCircle className="text-amber-400 shrink-0" size={18} />
                    )}
                    <span
                      className={`text-sm ${
                        sec.done
                          ? "text-[var(--text-primary)]"
                          : "text-[var(--text-muted)]"
                      }`}
                    >
                      {sec.label}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Card 5: Quick Actions */}
            <motion.div
              className="bento-card flex flex-col gap-3"
              custom={4}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
            >
              <h3
                className="text-lg font-semibold mb-2"
                style={{ fontFamily: "var(--font-space)" }}
              >
                Quick Actions
              </h3>
              <Link
                href="/builder"
                className="btn-primary text-center justify-center w-full"
              >
                <FiFileText size={16} />
                Build Resume
              </Link>
              <Link
                href="/preview"
                className="btn-secondary text-center justify-center w-full"
              >
                <FiEye size={16} />
                Preview
              </Link>
              <Link
                href={`/profile/${profile.id}`}
                className="btn-secondary text-center justify-center w-full"
              >
                <FiShare2 size={16} />
                Share Profile
              </Link>
            </motion.div>

            {/* Card 6: Semester Journey Mini */}
            <motion.div
              className="col-span-1 md:col-span-2 bento-card"
              custom={5}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
            >
              <h3
                className="text-lg font-semibold mb-4"
                style={{ fontFamily: "var(--font-space)" }}
              >
                Semester Journey
              </h3>
              {semesters.length === 0 ? (
                <p className="text-sm text-[var(--text-muted)]">
                  No semester data yet
                </p>
              ) : (
                <div className="flex flex-col gap-3">
                  {semesters.map((sem: any) => {
                    const pct = ((sem.sgpa || 0) / 10) * 100;
                    return (
                      <div key={sem.number} className="flex items-center gap-3">
                        <span
                          className="text-xs text-[var(--text-muted)] w-10 shrink-0"
                          style={{ fontFamily: "var(--font-jetbrains)" }}
                        >
                          Sem {sem.number}
                        </span>
                        <div
                          className="flex-1 h-5 rounded-full overflow-hidden"
                          style={{ background: "var(--surface-light)" }}
                        >
                          <motion.div
                            className="h-full rounded-full"
                            style={{
                              background:
                                "linear-gradient(90deg, #6366F1, #14B8A6)",
                            }}
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{
                              duration: 0.8,
                              delay: 0.4 + sem.number * 0.1,
                              ease: "easeOut",
                            }}
                          />
                        </div>
                        <span
                          className="text-xs font-bold text-[var(--text-primary)] w-8 text-right"
                          style={{ fontFamily: "var(--font-jetbrains)" }}
                        >
                          {sem.sgpa?.toFixed(1) ?? "—"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
