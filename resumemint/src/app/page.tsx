import Link from "next/link";
import Image from "next/image";
import { FiFileText, FiDownload, FiBarChart2, FiAward, FiArrowRight } from "react-icons/fi";

const features = [
  {
    icon: <FiFileText size={22} />,
    title: "Smart Resume Builder",
    desc: "Build a professional resume step-by-step with guided sections for academics, skills, projects, and more.",
  },
  {
    icon: <FiBarChart2 size={22} />,
    title: "Semester-wise Academic Tracking",
    desc: "Record your CGPA and SGPA semester by semester with visual progress tracking.",
  },
  {
    icon: <FiAward size={22} />,
    title: "Skills & Certifications",
    desc: "Showcase your technical skills, internships, and certifications in a structured, professional format.",
  },
  {
    icon: <FiDownload size={22} />,
    title: "One-click PDF Export",
    desc: "Download a beautifully formatted PDF resume ready to submit for placements and internships.",
  },
];

export default function LandingPage() {
  return (
    <div className="aurora-bg" style={{ minHeight: "100vh" }}>
      {/* Subtle background blobs */}
      <div
        style={{
          position: "fixed",
          top: "-10%",
          right: "-5%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(26,58,92,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: "-10%",
          left: "-5%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(212,160,23,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Navbar */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--border)",
          padding: "14px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Image
            src="/GCEK Logo.jpg"
            alt="GCEK Logo"
            width={38}
            height={38}
            style={{ borderRadius: 8, objectFit: "cover" }}
          />
          <div>
            <div style={{ fontFamily: "var(--font-space)", fontWeight: 700, fontSize: "0.95rem", color: "#1A3A5C", lineHeight: 1.2 }}>
              ResumeMint
            </div>
            <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", lineHeight: 1 }}>
              GCE Karad
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <Link href="/login">
            <button className="btn-secondary" style={{ padding: "9px 20px", fontSize: "0.85rem" }}>
              Login
            </button>
          </Link>
          <Link href="/signup">
            <button className="btn-primary" style={{ padding: "9px 20px", fontSize: "0.85rem" }}>
              Get Started
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section
        style={{
          maxWidth: 780,
          margin: "0 auto",
          padding: "80px 24px 60px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(26,58,92,0.08)",
            border: "1px solid rgba(26,58,92,0.15)",
            borderRadius: 100,
            padding: "6px 16px",
            marginBottom: 28,
          }}
        >
          <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#1A3A5C", letterSpacing: "0.04em" }}>
            GOVERNMENT COLLEGE OF ENGINEERING, KARAD
          </span>
        </div>

        <h1
          style={{
            fontFamily: "var(--font-space)",
            fontSize: "clamp(2rem, 5vw, 3.2rem)",
            fontWeight: 800,
            color: "#0F2133",
            lineHeight: 1.15,
            marginBottom: 20,
          }}
        >
          Build Your Professional{" "}
          <span style={{ color: "#1A3A5C" }}>Digital Resume</span>
          <br />
          <span style={{ color: "#D4A017" }}>in Minutes</span>
        </h1>

        <p
          style={{
            fontSize: "1.05rem",
            color: "var(--text-muted)",
            lineHeight: 1.7,
            marginBottom: 40,
            maxWidth: 560,
            margin: "0 auto 40px",
          }}
        >
          The official resume builder for GCE Karad students. Track your academics semester-wise,
          showcase your skills, and export a placement-ready PDF — all in one place.
        </p>

        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/signup">
            <button className="btn-primary" style={{ padding: "13px 32px", fontSize: "0.95rem" }}>
              Create Your Resume <FiArrowRight size={16} />
            </button>
          </Link>
          <Link href="/login">
            <button className="btn-secondary" style={{ padding: "13px 32px", fontSize: "0.95rem" }}>
              Already have an account?
            </button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section
        style={{
          maxWidth: 960,
          margin: "0 auto",
          padding: "20px 24px 80px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
            gap: 20,
          }}
        >
          {features.map((f, i) => (
            <div key={i} className="bento-card" style={{ textAlign: "left" }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "rgba(26,58,92,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#1A3A5C",
                  marginBottom: 14,
                }}
              >
                {f.icon}
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-space)",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  color: "#0F2133",
                  marginBottom: 8,
                }}
              >
                {f.title}
              </h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid var(--border)",
          padding: "20px 24px",
          textAlign: "center",
          color: "var(--text-muted)",
          fontSize: "0.8rem",
        }}
      >
        © {new Date().getFullYear()} Government College of Engineering, Karad. All rights reserved.
      </footer>
    </div>
  );
}
