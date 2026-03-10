"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        // Check if the email exists and is verified
        const checkRes = await fetch("/api/auth/check-verification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const checkData = await checkRes.json();
        if (checkData.status === "verified") {
          // User exists and is verified — wrong password
          setError("Invalid email or password. Please try again.");
        } else {
          // User doesn't exist or email not verified
          setError("Email verification is pending. Please check your email and complete signup first.");
        }
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="aurora-bg flex items-center justify-center px-4 py-12"
    >
      <div style={{ width: "100%", maxWidth: 430 }}>
        {/* Card */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(12px)",
            border: "1px solid #C8D8E8",
            borderRadius: 20,
            padding: 36,
            boxShadow: "0 8px 40px rgba(26, 58, 92, 0.08)",
          }}
        >
          {/* College Logo & Name */}
          <div className="flex flex-col items-center gap-2" style={{ marginBottom: 24 }}>
            <img src="/GCEK Logo.jpg" alt="GCEK" className="w-14 h-14 rounded-full object-cover" />
            <span className="text-sm font-semibold" style={{ fontFamily: "var(--font-space)", color: "#0A1628" }}>
              Government College Of Engineering, Karad
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-bold text-center" style={{ fontFamily: "var(--font-space)", color: "#0F2133", marginBottom: 20 }}>
            Welcome Back
          </h1>
          <p className="text-center" style={{ color: "#6B7E91", fontSize: 14, marginBottom: 30 }}>Sign in to continue building your resume</p>

          {/* Error display */}
          {error && (
            <div
              style={{
                background: "rgba(220, 53, 53, 0.06)",
                border: "1px solid rgba(220, 53, 53, 0.15)",
                borderRadius: 12,
                padding: 12,
                marginBottom: 20,
              }}
            >
              <p style={{ color: "#C62828", fontSize: 14, textAlign: "center" }}>{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: "#0F2133" }}>Email Address</label>
              <div style={{ position: "relative" }}>
                <FiMail
                  style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#7FA3C2" }}
                  size={18}
                />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-field"
                  style={{ width: "100%", paddingLeft: 42 }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: "#0F2133" }}>Password</label>
              <div style={{ position: "relative" }}>
                <FiLock
                  style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#7FA3C2" }}
                  size={18}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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
                    color: "#7FA3C2",
                    cursor: "pointer",
                  }}
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            {/* Forgot Password — right aligned, above submit */}
            <div style={{ textAlign: "right", marginTop: -8 }}>
              <Link href="/forgot-password" style={{ color: "#1A3A5C", fontWeight: 600, fontSize: 13 }}>
                Forgot Password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                background: "#1A3A5C",
                color: "white",
                padding: "14px 28px",
                borderRadius: 14,
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
                boxShadow: "0 4px 16px rgba(26, 58, 92, 0.25)",
              }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Signup link */}
          <p style={{ textAlign: "center", marginTop: 16, color: "#6B7E91", fontSize: 13 }}>
            Don&apos;t have an account?{" "}
            <Link href="/signup" style={{ color: "#1A3A5C", fontWeight: 600 }}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
