"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { FiSearch, FiUsers, FiChevronLeft, FiChevronRight } from "react-icons/fi";

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

  const fetchStudents = useCallback(async (searchQuery: string, pageNum: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/students?search=${encodeURIComponent(searchQuery)}&page=${pageNum}`);
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

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPage(1);
    fetchStudents(search, 1);
  };

  // Compute aggregate stats
  const totalSkills = students.reduce((sum, s) => sum + (s._count?.skills || 0), 0);
  const totalProjects = students.reduce((sum, s) => sum + (s._count?.projects || 0), 0);
  const totalInternships = students.reduce((sum, s) => sum + (s._count?.internships || 0), 0);

  if (status === "loading" || loading) {
    return (
      <>
        <Navbar />
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
      <Navbar />
      <div className="aurora-bg min-h-screen" style={{ paddingTop: 110, paddingLeft: 24, paddingRight: 24, paddingBottom: 48 }}>
        <div style={{ position: "relative", zIndex: 1 }}>

          {/* Header — matches HTML admin header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28, flexWrap: "wrap" as const }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: "linear-gradient(135deg,#EF4444,#F97316)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, color: "#fff" }}>
              ★
            </div>
            <div>
              <h2 style={{ fontSize: 26, fontWeight: 700, fontFamily: "var(--font-space)", color: "var(--text-primary)" }}>Admin Panel</h2>
              <p style={{ fontSize: 14, color: "var(--text-muted)" }}>Manage all student records and resumes</p>
            </div>
            <div style={{ marginLeft: "auto" }}>
              <span style={{ display: "inline-flex", alignItems: "center", padding: "6px 14px", borderRadius: 99, fontSize: 12, fontWeight: 600, background: "#FEE2E2", color: "#DC2626" }}>
                Logged in as Admin
              </span>
            </div>
          </motion.div>

          {/* Stats — matches HTML .admin-stats */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
            {[
              { icon: "👥", value: total, label: "Total Students", bg: "linear-gradient(135deg,#E0E7FF,#C7D2FE)", color: "#6366F1" },
              { icon: "⚙", value: totalSkills, label: "Total Skills", bg: "linear-gradient(135deg,#D1FAE5,#A7F3D0)", color: "#14B8A6" },
              { icon: "★", value: totalProjects, label: "Total Projects", bg: "linear-gradient(135deg,#F3E8FF,#DDD6FE)", color: "#8B5CF6" },
              { icon: "💼", value: totalInternships, label: "Total Internships", bg: "linear-gradient(135deg,#FEF3C7,#FDE68A)", color: "#D97706" },
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

          {/* Search — matches HTML search bar */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            <form onSubmit={handleSearch} style={{ display: "flex", gap: 10, flex: 1 }}>
              <div style={{ flex: 1, position: "relative" }}>
                <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: 14 }}>
                  <FiSearch size={16} />
                </span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search students by name, email, or branch..."
                  className="form-input"
                  style={{ paddingLeft: 40, width: "100%", background: "#FAFAFF", border: "1px solid var(--border)", borderRadius: 12, padding: "12px 16px 12px 40px", fontSize: 14, fontFamily: "'Inter',sans-serif", color: "var(--text-primary)", outline: "none" }}
                />
              </div>
              <button type="submit" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px 24px", borderRadius: 14, border: "none", background: "linear-gradient(135deg,#6366F1,#8B5CF6)", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", boxShadow: "0 4px 12px rgba(99,102,241,0.25)", fontFamily: "'Inter',sans-serif" }}>
                Search
              </button>
            </form>
          </motion.div>

          {/* Table — matches HTML .admin-table */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <div className="bento-card" style={{ overflow: "hidden", padding: 0 }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, minWidth: 900 }}>
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
                    {students.length === 0 ? (
                      <tr>
                        <td colSpan={10} style={{ textAlign: "center", padding: "64px 0", color: "var(--text-muted)" }}>
                          <FiUsers size={32} style={{ opacity: 0.4, marginBottom: 8 }} />
                          <p>{search ? "No students found matching your search." : "No student records found."}</p>
                        </td>
                      </tr>
                    ) : (
                      students.map((s, i) => (
                        <tr key={s.id} style={{ borderBottom: "1px solid #F3F0FF" }}>
                          <td style={{ padding: "12px 14px", fontSize: 13 }}>{(page - 1) * 20 + i + 1}</td>
                          <td style={{ padding: "12px 14px", fontSize: 13 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#6366F1,#14B8A6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff" }}>
                                {s.name?.charAt(0)?.toUpperCase()}
                              </div>
                              <span style={{ fontWeight: 600 }}>{s.name}</span>
                            </div>
                          </td>
                          <td style={{ padding: "12px 14px", fontSize: 12, color: "var(--text-secondary)" }}>{s.email}</td>
                          <td style={{ padding: "12px 14px", fontSize: 13 }}>{s.phone || "—"}</td>
                          <td style={{ padding: "12px 14px" }}>
                            {s.branch ? (
                              <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 600, background: "#D1FAE5", color: "#059669" }}>{s.branch}</span>
                            ) : <span style={{ color: "var(--text-muted)" }}>—</span>}
                          </td>
                          <td style={{ padding: "12px 14px", fontSize: 13 }}>{s.graduationYear || "—"}</td>
                          <td style={{ padding: "12px 14px", textAlign: "center" }}>
                            <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 600, background: "#E0E7FF", color: "#4338CA" }}>{s._count?.skills || 0}</span>
                          </td>
                          <td style={{ padding: "12px 14px", textAlign: "center" }}>
                            <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 600, background: "#F3E8FF", color: "#7C3AED" }}>{s._count?.projects || 0}</span>
                          </td>
                          <td style={{ padding: "12px 14px", textAlign: "center" }}>
                            <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 600, background: "#FEF3C7", color: "#B45309" }}>{s._count?.certifications || 0}</span>
                          </td>
                          <td style={{ padding: "12px 14px", textAlign: "center" }}>
                            <Link href={`/admin/students/${s.id}`} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "6px 14px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#6366F1,#8B5CF6)", color: "#fff", fontWeight: 700, fontSize: 11, textDecoration: "none", fontFamily: "'Inter',sans-serif" }}>
                              View Details
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination — matches HTML .pagination */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 14px", fontSize: 13, color: "var(--text-muted)", borderTop: "1px solid var(--border)" }}>
                <span>
                  Showing {students.length} of {total} students
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
