"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { useState } from "react";
import { FiMenu, FiX, FiLogOut, FiGrid, FiEdit3, FiEye, FiShield } from "react-icons/fi";

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50"
      style={{ background: "rgba(238, 242, 255, 0.8)", backdropFilter: "blur(16px)", borderBottom: "1px solid #DDD6FE", boxShadow: "0 2px 12px rgba(99,102,241,0.04)" }}
    >
      <div className="px-6 py-3 flex items-center justify-between" style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Left: GCEK logo + college name attached */}
        <Link href="/" className="flex items-center gap-2.5" style={{ maxWidth: 420, marginLeft: 60 }}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-teal-400 flex items-center justify-center font-bold text-white text-[9px] leading-none shrink-0">
            GCEK
          </div>
          <span className="text-[14px] font-bold text-gradient leading-tight" style={{ fontFamily: "var(--font-space)" }}>
            Government College Of Engineering, Karad
          </span>
        </Link>

        {/* Right: Nav links */}
        <div className="hidden md:flex items-center gap-1">
          {session ? (
            <>
              <NavLink href="/dashboard" icon={<FiGrid size={15} />} label="Dashboard" />
              <NavLink href="/builder" icon={<FiEdit3 size={15} />} label="Builder" />
              <NavLink href="/preview" icon={<FiEye size={15} />} label="Preview" />
              {(session.user as any)?.role === "ADMIN" && (
                <NavLink href="/admin" icon={<FiShield size={15} />} label="Admin" />
              )}
              <div className="ml-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-teal-400 flex items-center justify-center text-xs font-bold text-white">
                  {session.user?.name?.charAt(0).toUpperCase()}
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-sm text-slate-500 hover:text-red-500 transition-colors flex items-center gap-1.5"
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

        <button className="md:hidden text-slate-600" onClick={() => setOpen(!open)}>
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
              {(session.user as any)?.role === "ADMIN" && (
                <Link href="/admin" className="pill-tab text-left text-orange-500" onClick={() => setOpen(false)}>Admin Panel</Link>
              )}
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
