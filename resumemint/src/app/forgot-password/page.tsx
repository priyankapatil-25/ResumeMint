"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiCheckCircle, FiArrowLeft } from "react-icons/fi";

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={
      <div style={{ background: "linear-gradient(135deg, #EEF2FF 0%, #F0FDFA 40%, #FEF9C3 100%)", minHeight: "100vh" }}
        className="flex items-center justify-center px-4 py-12">
        <div style={{ color: "#7C7C9A", fontSize: 16 }}>Loading...</div>
      </div>
    }>
      <ForgotPasswordContent />
    </Suspense>
  );
}

function ForgotPasswordContent() {
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get("token");

  const [step, setStep] = useState<"email" | "reset" | "success">(tokenFromUrl ? "reset" : "email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    if (tokenFromUrl) setStep("reset");
  }, [tokenFromUrl]);

  const handleSendReset = async () => {
    setError("");
    if (!email) { setError("Please enter your email."); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      await res.json();
      setEmailSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setError("");
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: tokenFromUrl, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to reset password.");
      } else {
        setStep("success");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const cardStyle = {
    background: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(12px)",
    border: "1px solid #DDD6FE",
    borderRadius: 20,
    padding: 36,
    width: "100%",
    maxWidth: 430,
    boxShadow: "0 8px 40px rgba(99, 102, 241, 0.08)",
  };

  return (
    <div
      style={{ background: "linear-gradient(135deg, #EEF2FF 0%, #F0FDFA 40%, #FEF9C3 100%)", minHeight: "100vh" }}
      className="flex items-center justify-center px-4 py-12"
    >
      <div style={cardStyle}>
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-[8px]"
            style={{ background: "linear-gradient(135deg, #6366F1, #14B8A6)", fontFamily: "var(--font-space)" }}
          >
            GCEK
          </div>
          <span className="text-gradient text-lg font-bold" style={{ fontFamily: "var(--font-space)" }}>
            Government College Of Engineering, Karad
          </span>
        </div>

        {step === "email" && !emailSent && (
          <>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-space)", color: "#1E1B4B" }}>
                Forgot Password?
              </h1>
              <p style={{ color: "#7C7C9A", fontSize: 14 }}>
                Enter your email and we&apos;ll send you a reset link
              </p>
            </div>

            {error && (
              <div style={{ background: "rgba(239, 68, 68, 0.06)", border: "1px solid rgba(239, 68, 68, 0.15)", borderRadius: 12, padding: 12, marginBottom: 20 }}>
                <p style={{ color: "#DC2626", fontSize: 14, textAlign: "center" }}>{error}</p>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ position: "relative" }}>
                <FiMail style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#A5B4FC" }} size={18} />
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

              <button
                onClick={handleSendReset}
                disabled={loading}
                style={{
                  background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
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
                  boxShadow: "0 4px 16px rgba(99, 102, 241, 0.25)",
                }}
              >
                {loading ? "Sending..." : (<>Send Reset Link <FiArrowRight size={18} /></>)}
              </button>
            </div>

            <p style={{ textAlign: "center", marginTop: 24, color: "#7C7C9A", fontSize: 14 }}>
              <Link href="/login" style={{ color: "#6366F1", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4 }}>
                <FiArrowLeft size={14} /> Back to Sign in
              </Link>
            </p>
          </>
        )}

        {step === "email" && emailSent && (
          <div className="text-center">
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg, #10B981, #14B8A6)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <FiMail size={28} color="white" />
            </div>
            <h2 className="text-xl font-bold mb-2" style={{ fontFamily: "var(--font-space)", color: "#1E1B4B" }}>
              Check Your Email
            </h2>
            <p style={{ color: "#7C7C9A", fontSize: 14, marginBottom: 24 }}>
              If <span style={{ color: "#6366F1", fontWeight: 600 }}>{email}</span> is registered, you&apos;ll receive a password reset link shortly.
            </p>
            <Link
              href="/login"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                color: "#6366F1",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              <FiArrowLeft size={14} /> Back to Sign in
            </Link>
          </div>
        )}

        {step === "reset" && (
          <>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-space)", color: "#1E1B4B" }}>
                Set New Password
              </h1>
              <p style={{ color: "#7C7C9A", fontSize: 14 }}>Enter your new password below</p>
            </div>

            {error && (
              <div style={{ background: "rgba(239, 68, 68, 0.06)", border: "1px solid rgba(239, 68, 68, 0.15)", borderRadius: 12, padding: 12, marginBottom: 20 }}>
                <p style={{ color: "#DC2626", fontSize: 14, textAlign: "center" }}>{error}</p>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ position: "relative" }}>
                <FiLock style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#A5B4FC" }} size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password (min 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="input-field"
                  style={{ width: "100%", paddingLeft: 42, paddingRight: 42 }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#A5B4FC", cursor: "pointer" }}>
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>

              <div style={{ position: "relative" }}>
                <FiLock style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#A5B4FC" }} size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="input-field"
                  style={{ width: "100%", paddingLeft: 42 }}
                />
              </div>

              <button
                onClick={handleResetPassword}
                disabled={loading}
                style={{
                  background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
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
                  boxShadow: "0 4px 16px rgba(99, 102, 241, 0.25)",
                }}
              >
                {loading ? "Resetting..." : (<>Reset Password <FiArrowRight size={18} /></>)}
              </button>
            </div>
          </>
        )}

        {step === "success" && (
          <div className="text-center">
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg, #10B981, #14B8A6)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <FiCheckCircle size={28} color="white" />
            </div>
            <h2 className="text-xl font-bold mb-2" style={{ fontFamily: "var(--font-space)", color: "#1E1B4B" }}>
              Password Reset!
            </h2>
            <p style={{ color: "#7C7C9A", fontSize: 14, marginBottom: 24 }}>
              Your password has been updated successfully.
            </p>
            <Link
              href="/login"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
                color: "white",
                padding: "14px 28px",
                borderRadius: 14,
                fontWeight: 700,
                fontSize: 15,
                textDecoration: "none",
                boxShadow: "0 4px 16px rgba(99, 102, 241, 0.25)",
              }}
            >
              Sign In <FiArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
