"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import {
  FiSearch,
  FiUsers,
  FiEye,
  FiChevronLeft,
  FiChevronRight,
  FiShield,
  FiBookOpen,
  FiAward,
  FiBriefcase,
  FiCode,
} from "react-icons/fi";

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
      if (res.status === 403) {
        router.push("/dashboard");
        return;
      }
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setStudents(data.students);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    } catch {
      setStudents([]);
    }
    setLoading(false);
  }, [router]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      const role = (session?.user as any)?.role;
      if (role !== "ADMIN") {
        router.push("/dashboard");
        return;
      }
      fetchStudents(search, page);
    }
  }, [status, session, page]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPage(1);
    fetchStudents(search, 1);
  };

  if (status === "loading" || loading) {
    return (
      <>
        <Navbar />
        <div className="aurora-bg min-h-screen pt-40 pb-12 px-4 sm:px-8 lg:px-12">
          <div className="w-full">
            <div className="skeleton h-14 rounded-xl mb-6" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="skeleton h-20 rounded-2xl" />
              <div className="skeleton h-20 rounded-2xl" />
              <div className="skeleton h-20 rounded-2xl" />
              <div className="skeleton h-20 rounded-2xl" />
            </div>
            <div className="skeleton h-14 rounded-xl mb-6" />
            <div className="skeleton h-[500px] rounded-2xl" />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="aurora-bg min-h-screen pt-40 pb-12 px-4 sm:px-8 lg:px-12">
        <div className="w-full relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-400 flex items-center justify-center shadow-lg">
                  <FiShield className="text-white" size={22} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-space)", color: "var(--text-primary)" }}>
                    Admin Panel
                  </h1>
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                    Manage all student records and resumes
                  </p>
                </div>
              </div>
              <div className="text-sm px-4 py-2 rounded-xl" style={{ background: "rgba(99,102,241,0.08)", color: "#6366F1" }}>
                Logged in as Admin
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6"
          >
            <div className="bento-card flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
                <FiUsers className="text-white" size={18} />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{total}</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Total Students</p>
              </div>
            </div>
            <div className="bento-card flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
                <FiCode className="text-white" size={18} />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                  {students.reduce((sum, s) => sum + (s._count?.skills || 0), 0)}
                </p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Total Skills</p>
              </div>
            </div>
            <div className="bento-card flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <FiBookOpen className="text-white" size={18} />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                  {students.reduce((sum, s) => sum + (s._count?.projects || 0), 0)}
                </p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Total Projects</p>
              </div>
            </div>
            <div className="bento-card flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                <FiBriefcase className="text-white" size={18} />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                  {students.reduce((sum, s) => sum + (s._count?.internships || 0), 0)}
                </p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Total Internships</p>
              </div>
            </div>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <form onSubmit={handleSearch} className="flex gap-3">
              <div className="flex-1 relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} size={18} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, email, branch, or college..."
                  className="w-full pl-11 pr-4 py-3 rounded-xl border bg-white/70 backdrop-blur-sm text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
                />
              </div>
              <button type="submit" className="btn-accent !py-3 !px-6">
                Search
              </button>
            </form>
          </motion.div>

          {/* Students Table */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bento-card !p-0 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm" style={{ minWidth: 900 }}>
                <thead>
                  <tr style={{ background: "rgba(99,102,241,0.06)", borderBottom: "2px solid var(--border)" }}>
                    <th className="text-left px-4 py-4 font-semibold whitespace-nowrap" style={{ color: "var(--text-secondary)", width: 50 }}>Sr.</th>
                    <th className="text-left px-4 py-4 font-semibold whitespace-nowrap" style={{ color: "var(--text-secondary)", minWidth: 140 }}>Name</th>
                    <th className="text-left px-4 py-4 font-semibold whitespace-nowrap" style={{ color: "var(--text-secondary)", minWidth: 220 }}>Email</th>
                    <th className="text-left px-4 py-4 font-semibold whitespace-nowrap" style={{ color: "var(--text-secondary)", minWidth: 130 }}>Phone</th>
                    <th className="text-left px-4 py-4 font-semibold whitespace-nowrap" style={{ color: "var(--text-secondary)", minWidth: 100 }}>Branch</th>
                    <th className="text-left px-4 py-4 font-semibold whitespace-nowrap" style={{ color: "var(--text-secondary)", minWidth: 90 }}>Year</th>
                    <th className="text-center px-4 py-4 font-semibold whitespace-nowrap" style={{ color: "var(--text-secondary)", minWidth: 70 }}>
                      <div className="flex items-center justify-center gap-1"><FiCode size={13} /> Skills</div>
                    </th>
                    <th className="text-center px-4 py-4 font-semibold whitespace-nowrap" style={{ color: "var(--text-secondary)", minWidth: 80 }}>
                      <div className="flex items-center justify-center gap-1"><FiBookOpen size={13} /> Projects</div>
                    </th>
                    <th className="text-center px-4 py-4 font-semibold whitespace-nowrap" style={{ color: "var(--text-secondary)", minWidth: 70 }}>
                      <div className="flex items-center justify-center gap-1"><FiAward size={13} /> Certs</div>
                    </th>
                    <th className="text-center px-4 py-4 font-semibold whitespace-nowrap" style={{ color: "var(--text-secondary)", minWidth: 90 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="text-center py-16" style={{ color: "var(--text-muted)" }}>
                        <div className="flex flex-col items-center gap-2">
                          <FiUsers size={32} style={{ color: "var(--text-muted)", opacity: 0.4 }} />
                          <p>{search ? "No students found matching your search." : "No student records found."}</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    students.map((s, i) => (
                      <tr
                        key={s.id}
                        className="hover:bg-indigo-50/50 transition-colors group"
                        style={{ borderBottom: "1px solid var(--border)" }}
                      >
                        <td className="px-4 py-4" style={{ color: "var(--text-muted)" }}>{(page - 1) * 20 + i + 1}</td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-teal-400 flex items-center justify-center text-xs font-bold text-white shrink-0">
                              {s.name?.charAt(0)?.toUpperCase()}
                            </div>
                            <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{s.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-xs" style={{ color: "var(--text-secondary)" }}>{s.email}</td>
                        <td className="px-4 py-4" style={{ color: "var(--text-secondary)" }}>{s.phone || "—"}</td>
                        <td className="px-4 py-4">
                          {s.branch ? (
                            <span className="px-2 py-1 rounded-md text-xs font-medium" style={{ background: "rgba(20,184,166,0.1)", color: "#0D9488" }}>{s.branch}</span>
                          ) : <span style={{ color: "var(--text-muted)" }}>—</span>}
                        </td>
                        <td className="px-4 py-4" style={{ color: "var(--text-secondary)" }}>
                          {s.enrollmentYear && s.graduationYear ? `${s.enrollmentYear}–${s.graduationYear}` : "—"}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="inline-block min-w-[28px] px-2 py-0.5 rounded-md text-xs font-semibold" style={{ background: "rgba(99,102,241,0.1)", color: "#6366F1" }}>{s._count?.skills || 0}</span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="inline-block min-w-[28px] px-2 py-0.5 rounded-md text-xs font-semibold" style={{ background: "rgba(168,85,247,0.1)", color: "#A855F7" }}>{s._count?.projects || 0}</span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="inline-block min-w-[28px] px-2 py-0.5 rounded-md text-xs font-semibold" style={{ background: "rgba(245,158,11,0.1)", color: "#D97706" }}>{s._count?.certifications || 0}</span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <Link
                            href={`/admin/students/${s.id}`}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-indigo-500 to-indigo-600 text-white hover:shadow-lg hover:scale-105 transition-all"
                          >
                            <FiEye size={13} /> View Details
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination / Footer */}
            <div className="flex items-center justify-between px-5 py-4" style={{ borderTop: "1px solid var(--border)", background: "rgba(99,102,241,0.02)" }}>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                Showing <strong>{students.length}</strong> of <strong>{total}</strong> students
                {totalPages > 1 && <> &middot; Page {page} of {totalPages}</>}
              </p>
              {totalPages > 1 && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1.5 rounded-lg border text-sm hover:bg-indigo-50 disabled:opacity-40 transition-colors flex items-center gap-1"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <FiChevronLeft size={14} /> Prev
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-1.5 rounded-lg border text-sm hover:bg-indigo-50 disabled:opacity-40 transition-colors flex items-center gap-1"
                    style={{ borderColor: "var(--border)" }}
                  >
                    Next <FiChevronRight size={14} />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
