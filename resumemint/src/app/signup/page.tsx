"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiShield, FiArrowLeft } from "react-icons/fi";

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<"form" | "otp">("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const startResendTimer = () => {
    setResendTimer(60);
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendCode = async () => {
    setError("");
    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }
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
      const res = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to send verification code.");
      } else {
        setStep("otp");
        startResendTimer();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to resend code.");
      } else {
        startResendTimer();
        setOtp(["", "", "", "", "", ""]);
      }
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      otpRefs.current[5]?.focus();
    }
  };

  const handleVerifyAndSignup = async () => {
    setError("");
    const code = otp.join("");
    if (code.length !== 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }

    setLoading(true);
    try {
      // Step 1: Verify OTP
      const verifyRes = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) {
        setError(verifyData.error || "Invalid verification code.");
        return;
      }

      // Step 2: Create account
      const signupRes = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, verified: true }),
      });
      const signupData = await signupRes.json();
      if (!signupRes.ok) {
        setError(signupData.error || "Failed to create account.");
      } else {
        router.push("/login?registered=true");
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
    border: "1px solid #C8D8E8",
    borderRadius: 20,
    padding: 36,
    width: "100%",
    boxShadow: "0 8px 40px rgba(26, 58, 92, 0.08)",
  };

  return (
    <div
      className="aurora-bg flex items-center justify-center px-4 py-12"
    >
      <div style={{ width: "100%", maxWidth: 430 }}>
      <div style={cardStyle}>

        {step === "form" ? (
          <>
            {/* College Logo & Name */}
            <div className="flex flex-col items-center gap-2" style={{ marginBottom: 24 }}>
              <img src="/GCEK Logo.jpg" alt="GCEK" className="w-14 h-14 rounded-full object-cover" />
              <span className="text-sm font-semibold" style={{ fontFamily: "var(--font-space)", color: "#0A1628" }}>
                Government College Of Engineering, Karad
              </span>
            </div>

            {/* Heading */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-space)", color: "#0F2133", marginBottom: 20 }}>
                Create Account
              </h1>
              <p style={{ color: "#6B7E91", marginBottom: 30 }}>Start crafting your professional resume today</p>
            </div>

            {/* Error */}
            {error && (
              <div style={{ background: "rgba(220, 53, 53, 0.06)", border: "1px solid rgba(220, 53, 53, 0.15)", borderRadius: 12, padding: 12, marginBottom: 20 }}>
                <p style={{ color: "#C62828", fontSize: 14, textAlign: "center" }}>{error}</p>
              </div>
            )}

            {/* Form */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ position: "relative" }}>
                <FiUser style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#7FA3C2" }} size={18} />
                <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required className="input-field" style={{ width: "100%", paddingLeft: 42 }} />
              </div>

              <div style={{ position: "relative" }}>
                <FiMail style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#7FA3C2" }} size={18} />
                <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required className="input-field" style={{ width: "100%", paddingLeft: 42 }} />
              </div>

              <div style={{ position: "relative" }}>
                <FiLock style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#7FA3C2" }} size={18} />
                <input type={showPassword ? "text" : "password"} placeholder="Password (min 6 characters)" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="input-field" style={{ width: "100%", paddingLeft: 42, paddingRight: 42 }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#7FA3C2", cursor: "pointer" }}>
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>

              <div style={{ position: "relative" }}>
                <FiLock style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#7FA3C2" }} size={18} />
                <input type={showPassword ? "text" : "password"} placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="input-field" style={{ width: "100%", paddingLeft: 42 }} />
              </div>

              <button
                onClick={handleSendCode}
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
                {loading ? "Sending Code..." : (<>Verify Email <FiArrowRight size={18} /></>)}
              </button>
            </div>
          </>
        ) : (
          <>
            {/* OTP Step */}
            <div className="text-center mb-8">
              <div style={{ width: 56, height: 56, borderRadius: 16, background: "#1A3A5C", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <FiShield size={28} color="white" />
              </div>
              <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-space)", color: "#0F2133" }}>
                Verify Your Email
              </h1>
              <p style={{ color: "#6B7E91", fontSize: 14 }}>
                We sent a 6-digit code to<br />
                <span style={{ color: "#1A3A5C", fontWeight: 600 }}>{email}</span>
              </p>
            </div>

            {/* Error */}
            {error && (
              <div style={{ background: "rgba(220, 53, 53, 0.06)", border: "1px solid rgba(220, 53, 53, 0.15)", borderRadius: 12, padding: 12, marginBottom: 20 }}>
                <p style={{ color: "#C62828", fontSize: 14, textAlign: "center" }}>{error}</p>
              </div>
            )}

            {/* OTP Input */}
            <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 24 }} onPaste={handleOtpPaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { otpRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  style={{
                    width: 48,
                    height: 56,
                    textAlign: "center",
                    fontSize: 22,
                    fontWeight: 700,
                    fontFamily: "var(--font-jetbrains, monospace)",
                    color: "#0F2133",
                    background: digit ? "#E0E8F0" : "#F8FAFB",
                    border: digit ? "2px solid #1A3A5C" : "1px solid #C8D8E8",
                    borderRadius: 12,
                    outline: "none",
                    transition: "all 0.2s",
                  }}
                  onFocus={(e) => { e.target.style.borderColor = "#1A3A5C"; e.target.style.boxShadow = "0 0 0 3px rgba(26,58,92,0.12)"; }}
                  onBlur={(e) => { if (!digit) { e.target.style.borderColor = "#C8D8E8"; e.target.style.boxShadow = "none"; } }}
                />
              ))}
            </div>

            {/* Verify Button */}
            <button
              onClick={handleVerifyAndSignup}
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
                marginBottom: 16,
              }}
            >
              {loading ? "Verifying..." : (<>Create Account <FiArrowRight size={18} /></>)}
            </button>

            {/* Resend & Back */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button
                onClick={() => { setStep("form"); setError(""); setOtp(["", "", "", "", "", ""]); }}
                style={{ background: "none", border: "none", color: "#1A3A5C", fontWeight: 600, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
              >
                <FiArrowLeft size={14} /> Back
              </button>
              <button
                onClick={handleResend}
                disabled={resendTimer > 0 || loading}
                style={{
                  background: "none",
                  border: "none",
                  color: resendTimer > 0 ? "#7FA3C2" : "#1A3A5C",
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: resendTimer > 0 ? "not-allowed" : "pointer",
                }}
              >
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend Code"}
              </button>
            </div>
          </>
        )}

        {/* Login link */}
        {step === "form" && (
          <p style={{ textAlign: "center", marginTop: 24, color: "#6B7E91", fontSize: 14 }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "#1A3A5C", fontWeight: 600 }}>
              Sign in
            </Link>
          </p>
        )}
      </div>
      </div>
    </div>
  );
}
