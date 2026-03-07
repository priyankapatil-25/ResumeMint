"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || data.message || "Something went wrong. Please try again.");
      } else {
        router.push("/login?registered=true");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{ background: "var(--bg)", minHeight: "100vh" }}
      className="flex items-center justify-center px-4 py-12"
    >
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          padding: 32,
          width: "100%",
          maxWidth: 420,
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white text-lg"
            style={{ background: "linear-gradient(135deg, #6366F1, #14B8A6)", fontFamily: "var(--font-space)" }}
          >
            RM
          </div>
          <span className="text-gradient text-2xl font-bold" style={{ fontFamily: "var(--font-space)" }}>
            ResumeMint
          </span>
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-space)" }}>
            Create Account
          </h1>
          <p className="text-gray-400">Start crafting your professional resume today</p>
        </div>

        {/* Error display */}
        {error && (
          <div
            style={{
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: 8,
              padding: 12,
              marginBottom: 20,
            }}
          >
            <p style={{ color: "#f87171", fontSize: 14, textAlign: "center" }}>{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Full Name */}
          <div style={{ position: "relative" }}>
            <FiUser
              style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}
              size={18}
            />
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="input-field"
              style={{ width: "100%", paddingLeft: 42 }}
            />
          </div>

          {/* Email */}
          <div style={{ position: "relative" }}>
            <FiMail
              style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}
              size={18}
            />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-field"
              style={{ width: "100%", paddingLeft: 42 }}
            />
          </div>

          {/* Password */}
          <div style={{ position: "relative" }}>
            <FiLock
              style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}
              size={18}
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="input-field"
              style={{ width: "100%", paddingLeft: 42, paddingRight: 42 }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: 14,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "#9ca3af",
                cursor: "pointer",
              }}
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div style={{ position: "relative" }}>
            <FiLock
              style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}
              size={18}
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="input-field"
              style={{ width: "100%", paddingLeft: 42 }}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              background: "linear-gradient(135deg, #F59E0B, #D97706)",
              color: "#0F172A",
              padding: "14px 28px",
              borderRadius: 12,
              fontWeight: 700,
              fontSize: 16,
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              width: "100%",
            }}
          >
            {loading ? "Creating..." : (
              <>
                Create Account <FiArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Login link */}
        <p style={{ textAlign: "center", marginTop: 24, color: "#9ca3af", fontSize: 14 }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "#6366F1", fontWeight: 600 }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
