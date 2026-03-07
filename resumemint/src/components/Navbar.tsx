"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { useState } from "react";
import { FiMenu, FiX, FiLogOut, FiGrid, FiEdit3, FiEye } from "react-icons/fi";

export default function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50"
      style={{ background: "rgba(6, 11, 24, 0.8)", backdropFilter: "blur(16px)", borderBottom: "1px solid var(--border)" }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-teal-400 flex items-center justify-center font-bold text-white text-sm">
            RM
          </div>
          <span className="text-lg font-bold text-gradient" style={{ fontFamily: "var(--font-space)" }}>
            ResumeMint
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {session ? (
            <>
              <NavLink href="/dashboard" icon={<FiGrid size={15} />} label="Dashboard" />
              <NavLink href="/builder" icon={<FiEdit3 size={15} />} label="Builder" />
              <NavLink href="/preview" icon={<FiEye size={15} />} label="Preview" />
              <div className="ml-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-teal-400 flex items-center justify-center text-xs font-bold text-white">
                  {session.user?.name?.charAt(0).toUpperCase()}
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-sm text-slate-400 hover:text-red-400 transition-colors flex items-center gap-1.5"
                >
                  <FiLogOut size={14} />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="pill-tab">Login</Link>
              <Link href="/signup" className="btn-accent !py-2 !px-5 !text-sm ml-2">Get Started</Link>
            </>
          )}
        </div>

        <button className="md:hidden text-slate-300" onClick={() => setOpen(!open)}>
          {open ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {open && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="md:hidden mx-4 mb-4 bento-card !p-4">
          {session ? (
            <div className="flex flex-col gap-2">
              <Link href="/dashboard" className="pill-tab text-left" onClick={() => setOpen(false)}>Dashboard</Link>
              <Link href="/builder" className="pill-tab text-left" onClick={() => setOpen(false)}>Builder</Link>
              <Link href="/preview" className="pill-tab text-left" onClick={() => setOpen(false)}>Preview</Link>
              <button onClick={() => { signOut({ callbackUrl: "/" }); setOpen(false); }} className="pill-tab text-left text-red-400">Logout</button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Link href="/login" className="pill-tab text-left" onClick={() => setOpen(false)}>Login</Link>
              <Link href="/signup" className="btn-accent text-center !text-sm" onClick={() => setOpen(false)}>Get Started</Link>
            </div>
          )}
        </motion.div>
      )}
    </motion.nav>
  );
}

function NavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} className="pill-tab flex items-center gap-1.5">
      {icon} {label}
    </Link>
  );
}
