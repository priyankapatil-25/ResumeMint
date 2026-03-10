"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { FiSearch, FiUsers, FiChevronLeft, FiChevronRight, FiDownload } from "react-icons/fi";

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [activeBranch, setActiveBranch] = useState<string | null>(null);

  const fetchStudents = useCallback(async (searchQuery: string, pageNum: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/students?search=${encodeURIComponent(searchQuery)}&page=${pageNum}&limit=200`);
      if (res.status === 403) { router.push("/dashboard"); return; }
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setStudents(data.students);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    } catch { setStudents([]); }
    setLoading(false);
  }, [router]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      const role = (session?.user as any)?.role;
      if (role !== "ADMIN") { router.push("/dashboard"); return; }
      fetchStudents(search, page);
    }
  }, [status, session, page]); // eslint-disable-line react-hooks/exhaustive-deps

  // Group students by branch
  const branchGroups: Record<string, any[]> = {};
  students.forEach((s) => {
    const branch = s.branch || "Unspecified";
    if (!branchGroups[branch]) branchGroups[branch] = [];
    branchGroups[branch].push(s);
  });
  const branchNames = Object.keys(branchGroups).sort();

  // Filtered students based on active branch tab
  const displayStudents = activeBranch ? (branchGroups[activeBranch] || []) : students;

  // Compute aggregate stats
  const totalSkills = students.reduce((sum, s) => sum + (s._count?.skills || 0), 0);
  const totalProjects = students.reduce((sum, s) => sum + (s._count?.projects || 0), 0);
  const totalInternships = students.reduce((sum, s) => sum + (s._count?.internships || 0), 0);

  if (status === "loading" || loading) {
    return (
      <>
        <Navbar size="large" />
        <div className="aurora-bg min-h-screen" style={{ paddingTop: 110, paddingLeft: 24, paddingRight: 24, paddingBottom: 48 }}>
          <div className="skeleton h-14 rounded-xl mb-6" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
            <div className="skeleton h-24 rounded-2xl" />
            <div className="skeleton h-24 rounded-2xl" />
            <div className="skeleton h-24 rounded-2xl" />
            <div className="skeleton h-24 rounded-2xl" />
          </div>
          <div className="skeleton h-14 rounded-xl mb-6" />
          <div className="skeleton h-[500px] rounded-2xl" />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar size="large" />
      <div className="aurora-bg min-h-screen" style={{ paddingTop: 110, paddingLeft: 24, paddingRight: 24, paddingBottom: 48 }}>
        <div style={{ position: "relative", zIndex: 1 }}>

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28, flexWrap: "wrap" as const }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: "#C62828", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, color: "#fff" }}>
              ★
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <h2 style={{ fontSize: 26, fontWeight: 700, fontFamily: "var(--font-space)", color: "var(--text-primary)", margin: 0 }}>Admin Panel</h2>
                <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 600, background: "#FECACA", color: "#C62828" }}>
                  Logged in as Admin
                </span>
              </div>
              <p style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 4 }}>Manage all student records and resumes</p>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
            {[
              { icon: "👥", value: total, label: "Total Students", bg: "#D6E2ED", color: "#1A3A5C" },
              { icon: "⚙", value: totalSkills, label: "Total Skills", bg: "#D1FAE5", color: "#D4A017" },
              { icon: "★", value: totalProjects, label: "Total Projects", bg: "#E8EEF5", color: "#2D5F8A" },
              { icon: "💼", value: totalInternships, label: "Total Internships", bg: "#FEF3C7", color: "#B8860B" },
            ].map((stat) => (
              <div key={stat.label} className="bento-card" style={{ textAlign: "center" }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px", fontSize: 20, background: stat.bg, color: stat.color }}>
                  {stat.icon}
                </div>
                <div style={{ fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)", fontSize: 28, fontWeight: 700, color: "var(--text-primary)" }}>{stat.value}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Branch Tabs */}
          {branchNames.length > 1 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" as const }}>
              <button
                onClick={() => setActiveBranch(null)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 99, border: "1px solid var(--border)",
                  background: activeBranch === null ? "#1A3A5C" : "var(--surface-light)",
                  color: activeBranch === null ? "#fff" : "var(--text-secondary)",
                  fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "'Inter',sans-serif",
                }}
              >
                All Branches
                <span style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  padding: "1px 8px", borderRadius: 99, fontSize: 11, fontWeight: 700,
                  background: activeBranch === null ? "rgba(255,255,255,0.25)" : "#D6E2ED",
                  color: activeBranch === null ? "#fff" : "#1A3A5C",
                }}>
                  {students.length}
                </span>
              </button>
              {branchNames.map((branch) => (
                <button
                  key={branch}
                  onClick={() => setActiveBranch(activeBranch === branch ? null : branch)}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 99, border: "1px solid var(--border)",
                    background: activeBranch === branch ? "#1A3A5C" : "var(--surface-light)",
                    color: activeBranch === branch ? "#fff" : "var(--text-secondary)",
                    fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "'Inter',sans-serif",
                  }}
                >
                  {branch}
                  <span style={{
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    padding: "1px 8px", borderRadius: 99, fontSize: 11, fontWeight: 700,
                    background: activeBranch === branch ? "rgba(255,255,255,0.25)" : "#D1FAE5",
                    color: activeBranch === branch ? "#fff" : "#2E7D4A",
                  }}>
                    {branchGroups[branch].length}
                  </span>
                </button>
              ))}
            </motion.div>
          )}

          {/* Search */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ marginBottom: 20 }}>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: 14 }}>
                <FiSearch size={16} />
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); fetchStudents(e.target.value, 1); }}
                placeholder="Search students by name, email, or branch..."
                className="form-input"
                style={{ paddingLeft: 40, width: "100%", background: "#F8FAFB", border: "1px solid var(--border)", borderRadius: 12, padding: "12px 16px 12px 40px", fontSize: 14, fontFamily: "'Inter',sans-serif", color: "var(--text-primary)", outline: "none" }}
              />
            </div>
          </motion.div>

          {/* Table */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <div className="bento-card" style={{ overflow: "hidden", padding: 0 }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, minWidth: 1000 }}>
                  <thead>
                    <tr>
                      {["Sr.", "Name", "Email", "Phone", "Branch", "Year", "Skills", "Projects", "Certs", "Actions"].map((h) => (
                        <th key={h} style={{ textAlign: h === "Skills" || h === "Projects" || h === "Certs" || h === "Actions" ? "center" : "left", padding: "12px 14px", fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" as const, letterSpacing: 0.5, borderBottom: "1px solid var(--border)" }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {displayStudents.length === 0 ? (
                      <tr>
                        <td colSpan={10} style={{ textAlign: "center", padding: "64px 0", color: "var(--text-muted)" }}>
                          <FiUsers size={32} style={{ opacity: 0.4, marginBottom: 8 }} />
                          <p>{search ? "No students found matching your search." : activeBranch ? `No students found in ${activeBranch}.` : "No student records found."}</p>
                        </td>
                      </tr>
                    ) : (
                      displayStudents.map((s, i) => (
                        <tr key={s.id} style={{ borderBottom: "1px solid #EBF1F7" }}>
                          <td style={{ padding: "12px 14px", fontSize: 13 }}>{i + 1}</td>
                          <td style={{ padding: "12px 14px", fontSize: 13 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#1A3A5C", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff" }}>
                                {s.name?.charAt(0)?.toUpperCase()}
                              </div>
                              <span style={{ fontWeight: 600 }}>{s.name}</span>
                            </div>
                          </td>
                          <td style={{ padding: "12px 14px", fontSize: 12, color: "var(--text-secondary)" }}>{s.email}</td>
                          <td style={{ padding: "12px 14px", fontSize: 13 }}>{s.phone || "—"}</td>
                          <td style={{ padding: "12px 14px" }}>
                            {s.branch ? (
                              <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 600, background: "#D1FAE5", color: "#2E7D4A" }}>{s.branch}</span>
                            ) : <span style={{ color: "var(--text-muted)" }}>—</span>}
                          </td>
                          <td style={{ padding: "12px 14px", fontSize: 13 }}>{s.graduationYear || "—"}</td>
                          <td style={{ padding: "12px 14px", textAlign: "center" }}>
                            <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 600, background: "#D6E2ED", color: "#1A3A5C" }}>{s._count?.skills || 0}</span>
                          </td>
                          <td style={{ padding: "12px 14px", textAlign: "center" }}>
                            <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 600, background: "#E8EEF5", color: "#2D5F8A" }}>{s._count?.projects || 0}</span>
                          </td>
                          <td style={{ padding: "12px 14px", textAlign: "center" }}>
                            <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 600, background: "#FEF3C7", color: "#996515" }}>{s._count?.certifications || 0}</span>
                          </td>
                          <td style={{ padding: "12px 14px", textAlign: "center" }}>
                            <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                              <Link href={`/admin/students/${s.id}`} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "6px 12px", borderRadius: 10, border: "none", background: "#1A3A5C", color: "#fff", fontWeight: 700, fontSize: 11, textDecoration: "none", fontFamily: "'Inter',sans-serif" }}>
                                View Details
                              </Link>
                              <Link href={`/admin/students/${s.id}?download=true`} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 4, padding: "6px 10px", borderRadius: 10, border: "1px solid #D6E2ED", background: "#E8EEF5", color: "#1A3A5C", fontWeight: 700, fontSize: 11, textDecoration: "none", fontFamily: "'Inter',sans-serif" }}>
                                <FiDownload size={12} /> PDF
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 14px", fontSize: 13, color: "var(--text-muted)", borderTop: "1px solid var(--border)" }}>
                <span>
                  Showing {displayStudents.length} of {total} students
                  {activeBranch && <> &middot; Branch: {activeBranch}</>}
                  {totalPages > 1 && <> &middot; Page {page} of {totalPages}</>}
                </span>
                {totalPages > 1 && (
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "8px 16px", borderRadius: 14, border: "1px solid var(--border)", background: "var(--surface-light)", color: "var(--text-secondary)", fontWeight: 600, fontSize: 12, cursor: page === 1 ? "not-allowed" : "pointer", opacity: page === 1 ? 0.5 : 1, fontFamily: "'Inter',sans-serif" }}
                    >
                      <FiChevronLeft size={14} /> Prev
                    </button>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "8px 16px", borderRadius: 14, border: "1px solid var(--border)", background: "var(--surface-light)", color: "var(--text-secondary)", fontWeight: 600, fontSize: 12, cursor: page === totalPages ? "not-allowed" : "pointer", opacity: page === totalPages ? 0.5 : 1, fontFamily: "'Inter',sans-serif" }}
                    >
                      Next <FiChevronRight size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </>
  );
}
