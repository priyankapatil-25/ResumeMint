"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import toast from "react-hot-toast";
import {
  FiUser,
  FiBook,
  FiCode,
  FiAward,
  FiBriefcase,
  FiChevronLeft,
  FiChevronRight,
  FiSave,
  FiPlus,
  FiTrash2,
  FiCheck,
  FiLayers,
} from "react-icons/fi";

/* eslint-disable @typescript-eslint/no-explicit-any */

interface FormData {
  name: string;
  email: string;
  dob: string;
  phone: string;
  address: string;
  photo: string;
  linkedin: string;
  github: string;
  portfolio: string;
  objective: string;
  college: string;
  branch: string;
  enrollmentYear: string;
  graduationYear: string;
  diplomaCollege: string;
  diplomaBranch: string;
  diplomaPercentage: string;
  diplomaYear: string;
  school12th: string;
  board12th: string;
  percentage12th: string;
  year12th: string;
  school10th: string;
  board10th: string;
  percentage10th: string;
  year10th: string;
  semesters: { number: number; sgpa: number; subjects: string[]; backlog: number }[];
  skills: { name: string; category: string; proficiency: number }[];
  projects: { title: string; description: string; techStack: string[]; github: string; liveDemo: string }[];
  certifications: { title: string; issuer: string; date: string; url: string; image: string }[];
  internships: { company: string; role: string; duration: string; description: string }[];
  extraActivities: string[];
}

const steps = [
  { key: "personal", label: "Personal Info", icon: <FiUser /> },
  { key: "education", label: "Education", icon: <FiBook /> },
  { key: "semesters", label: "Semesters", icon: <FiLayers /> },
  { key: "skills", label: "Skills", icon: <FiCode /> },
  { key: "projects", label: "Projects", icon: <FiBriefcase /> },
  { key: "experience", label: "Experience & Certs", icon: <FiAward /> },
];

const defaultFormData: FormData = {
  name: "",
  email: "",
  dob: "",
  phone: "",
  address: "",
  photo: "",
  linkedin: "",
  github: "",
  portfolio: "",
  objective: "",
  college: "Government College of Engineering, Karad",
  branch: "",
  enrollmentYear: "",
  graduationYear: "",
  diplomaCollege: "",
  diplomaBranch: "",
  diplomaPercentage: "",
  diplomaYear: "",
  school12th: "",
  board12th: "",
  percentage12th: "",
  year12th: "",
  school10th: "",
  board10th: "",
  percentage10th: "",
  year10th: "",
  semesters: [
    { number: 1, sgpa: 0, subjects: [], backlog: 0 },
    { number: 2, sgpa: 0, subjects: [], backlog: 0 },
    { number: 3, sgpa: 0, subjects: [], backlog: 0 },
    { number: 4, sgpa: 0, subjects: [], backlog: 0 },
    { number: 5, sgpa: 0, subjects: [], backlog: 0 },
    { number: 6, sgpa: 0, subjects: [], backlog: 0 },
    { number: 7, sgpa: 0, subjects: [], backlog: 0 },
    { number: 8, sgpa: 0, subjects: [], backlog: 0 },
  ],
  skills: [],
  projects: [],
  certifications: [],
  internships: [],
  extraActivities: [],
};

export default function BuilderPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Auth guard
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Reset form when user changes and load profile
  useEffect(() => {
    if (status === "authenticated") {
      // Reset to defaults first to clear any previous user's data
      setFormData({ ...defaultFormData });
      setCurrentStep(0);

      fetch("/api/profile")
        .then((res) => {
          if (!res.ok) throw new Error("Failed to load profile");
          return res.json();
        })
        .then((data: any) => {
          setFormData({
            name: data.name || "",
            email: data.email || "",
            dob: data.dob || "",
            phone: data.phone || "",
            address: data.address || "",
            photo: data.photo || "",
            linkedin: data.linkedin || "",
            github: data.github || "",
            portfolio: data.portfolio || "",
            objective: data.objective || "",
            college: "Government College of Engineering, Karad",
            branch: data.branch || "",
            enrollmentYear: data.enrollmentYear?.toString() || "",
            graduationYear: data.graduationYear?.toString() || "",
            diplomaCollege: data.diplomaCollege || "",
            diplomaBranch: data.diplomaBranch || "",
            diplomaPercentage: data.diplomaPercentage || "",
            diplomaYear: data.diplomaYear || "",
            school12th: data.school12th || "",
            board12th: data.board12th || "",
            percentage12th: data.percentage12th || "",
            year12th: data.year12th || "",
            school10th: data.school10th || "",
            board10th: data.board10th || "",
            percentage10th: data.percentage10th || "",
            year10th: data.year10th || "",
            semesters: data.semesters?.length > 0 ? data.semesters : defaultFormData.semesters,
            skills: data.skills?.map((s: any) => ({
              name: s.name || "",
              category: s.category || "Technical",
              proficiency: s.proficiency || 50,
            })) || [],
            projects: data.projects?.map((p: any) => ({
              title: p.title || "",
              description: p.description || "",
              techStack: p.techStack || [],
              github: p.github || "",
              liveDemo: p.liveDemo || "",
            })) || [],
            certifications: data.certifications?.map((c: any) => ({
              title: c.title || "",
              issuer: c.issuer || "",
              date: c.date || "",
              url: c.url || "",
              image: c.image || "",
            })) || [],
            internships: data.internships?.map((i: any) => ({
              company: i.company || "",
              role: i.role || "",
              duration: i.duration || "",
              description: i.description || "",
            })) || [],
            extraActivities: data.extraActivities || [],
          });
          setLoading(false);
        })
        .catch(() => {
          setFormData({ ...defaultFormData });
          setLoading(false);
        });
    }
  }, [status, session?.user?.email]);

  const save = useCallback(async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast.success("Progress saved!");
      } else {
        const err = await res.json().catch(() => null);
        console.error("Save error:", res.status, err);
        toast.error(err?.error || "Failed to save.");
      }
    } catch (e) {
      console.error("Save exception:", e);
      toast.error("Failed to save.");
    } finally {
      setSaving(false);
    }
  }, [formData]);

  const validateStep = useCallback((step: number): string | null => {
    const dobYear = formData.dob ? new Date(formData.dob).getFullYear() : 0;

    if (step === 0) {
      if (!formData.name.trim()) return "Full Name is required.";
      if (formData.name.trim().length < 2) return "Name must be at least 2 characters.";
      if (!formData.email.trim()) return "Email is required.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return "Enter a valid email address.";
      if (!formData.dob) return "Date of Birth is required.";
      if (dobYear > new Date().getFullYear() - 15) return "You must be at least 15 years old.";
      if (dobYear < 1970) return "Please enter a valid date of birth.";
      if (!formData.phone.trim()) return "Phone number is required.";
      if (!/^[\d+\-\s()]{10,15}$/.test(formData.phone.trim())) return "Enter a valid phone number (10-15 digits).";
      if (!formData.address.trim()) return "Address is required.";
      if (!formData.photo) return "Please upload your photo before proceeding.";
    }

    if (step === 1) {
      if (!formData.branch) return "Please select your branch.";
      if (!formData.enrollmentYear) return "Enrollment year is required.";
      if (!formData.graduationYear) return "Graduation year is required.";
      const enroll = parseInt(formData.enrollmentYear);
      const grad = parseInt(formData.graduationYear);
      const currentYear = new Date().getFullYear();
      if (isNaN(enroll) || enroll < 2000 || enroll > currentYear + 1) return "Enter a valid enrollment year.";
      if (isNaN(grad) || grad < enroll) return "Graduation year must be after enrollment year.";
      if (grad - enroll > 6) return "Course duration cannot exceed 6 years.";
      if (dobYear && enroll < dobYear + 15) return `Enrollment year (${enroll}) is not valid for DOB year (${dobYear}). Must be at least 15 years after birth.`;

      // Diploma validation
      if (formData.diplomaCollege || formData.diplomaPercentage || formData.diplomaYear) {
        if (!formData.diplomaCollege.trim()) return "Diploma college name is required.";
        if (!formData.diplomaBranch.trim()) return "Diploma branch is required.";
        if (!formData.diplomaPercentage.trim()) return "Diploma percentage/CGPA is required.";
        if (!formData.diplomaYear.trim()) return "Diploma passing year is required.";
        const yDip = parseInt(formData.diplomaYear);
        if (isNaN(yDip) || yDip < 2000 || yDip > currentYear) return "Enter a valid diploma passing year.";
        if (dobYear && yDip < dobYear + 13) return `Diploma year (${yDip}) is not valid for DOB year (${dobYear}).`;
        if (yDip > enroll) return `Diploma year (${yDip}) must be before or equal to engineering enrollment year (${enroll}).`;
      }

      // 12th validation
      if (formData.school12th || formData.percentage12th || formData.year12th) {
        if (!formData.school12th.trim()) return "12th school name is required.";
        if (!formData.percentage12th.trim()) return "12th percentage/CGPA is required.";
        if (!formData.year12th.trim()) return "12th passing year is required.";
        const y12 = parseInt(formData.year12th);
        if (isNaN(y12) || y12 < 2000 || y12 > currentYear) return "Enter a valid 12th passing year.";
        if (dobYear && y12 < dobYear + 16) return `12th year (${y12}) is not valid for DOB year (${dobYear}). Must be at least 16 years after birth.`;
        if (y12 > enroll) return `12th year (${y12}) must be before or equal to engineering enrollment year (${enroll}).`;
      }

      // 10th validation
      if (formData.school10th || formData.percentage10th || formData.year10th) {
        if (!formData.school10th.trim()) return "10th school name is required.";
        if (!formData.percentage10th.trim()) return "10th percentage/CGPA is required.";
        if (!formData.year10th.trim()) return "10th passing year is required.";
        const y10 = parseInt(formData.year10th);
        if (isNaN(y10) || y10 < 2000 || y10 > currentYear) return "Enter a valid 10th passing year.";
        if (dobYear && y10 < dobYear + 14) return `10th year (${y10}) is not valid for DOB year (${dobYear}). Must be at least 14 years after birth.`;
        const y12 = parseInt(formData.year12th);
        if (!isNaN(y12) && y10 >= y12) return "10th year must be before 12th year.";
        const yDip = parseInt(formData.diplomaYear);
        if (!isNaN(yDip) && y10 >= yDip) return "10th year must be before diploma year.";
      }

      // Must have either 12th or diploma
      const has12th = !!(formData.school12th && formData.year12th);
      const hasDiploma = !!(formData.diplomaCollege && formData.diplomaYear);
      if (!has12th && !hasDiploma) return "Please fill either 12th Standard or Diploma details.";
    }

    if (step === 2) {
      for (const sem of formData.semesters) {
        if (sem.sgpa < 0 || sem.sgpa > 100) return `Semester ${sem.number}: Value must be between 0 and 100.`;
        if (sem.backlog < 0) return `Semester ${sem.number}: Backlogs cannot be negative.`;
      }
    }

    if (step === 3) {
      for (const skill of formData.skills) {
        if (!skill.name.trim()) return "Skill name cannot be empty.";
        if (skill.proficiency < 10 || skill.proficiency > 100) return `${skill.name}: Proficiency must be 10-100%.`;
      }
    }

    if (step === 4) {
      for (const proj of formData.projects) {
        if (!proj.title.trim()) return "Project title cannot be empty.";
      }
    }

    return null;
  }, [formData]);

  const goToStep = useCallback(
    async (next: number) => {
      // Always save current data
      await save();
      // Validate current step when moving forward
      if (next > currentStep) {
        const error = validateStep(currentStep);
        if (error) {
          toast.error(error);
          return;
        }
      }
      setDirection(next > currentStep ? 1 : -1);
      setCurrentStep(next);
    },
    [currentStep, save, validateStep]
  );

  const updateField = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Semester helpers
  const updateSemester = (idx: number, field: string, value: any) => {
    const updated = [...formData.semesters];
    (updated[idx] as any)[field] = value;
    updateField("semesters", updated);
  };

  // Skill helpers
  const addSkill = () => {
    updateField("skills", [
      ...formData.skills,
      { name: "", category: "Programming", proficiency: 50 },
    ]);
  };
  const removeSkill = (idx: number) => {
    updateField(
      "skills",
      formData.skills.filter((_, i) => i !== idx)
    );
  };
  const updateSkill = (idx: number, field: string, value: any) => {
    const updated = [...formData.skills];
    (updated[idx] as any)[field] = value;
    updateField("skills", updated);
  };

  // Project helpers
  const addProject = () => {
    updateField("projects", [
      ...formData.projects,
      { title: "", description: "", techStack: [], github: "", liveDemo: "" },
    ]);
  };
  const removeProject = (idx: number) => {
    updateField(
      "projects",
      formData.projects.filter((_, i) => i !== idx)
    );
  };
  const updateProject = (idx: number, field: string, value: any) => {
    const updated = [...formData.projects];
    (updated[idx] as any)[field] = value;
    updateField("projects", updated);
  };

  // Internship helpers
  const addInternship = () => {
    updateField("internships", [
      ...formData.internships,
      { company: "", role: "", duration: "", description: "" },
    ]);
  };
  const removeInternship = (idx: number) => {
    updateField(
      "internships",
      formData.internships.filter((_, i) => i !== idx)
    );
  };
  const updateInternship = (idx: number, field: string, value: any) => {
    const updated = [...formData.internships];
    (updated[idx] as any)[field] = value;
    updateField("internships", updated);
  };

  // Certification helpers
  const addCertification = () => {
    updateField("certifications", [
      ...formData.certifications,
      { title: "", issuer: "", date: "", url: "", image: "" },
    ]);
  };
  const removeCertification = (idx: number) => {
    updateField(
      "certifications",
      formData.certifications.filter((_, i) => i !== idx)
    );
  };
  const updateCertification = (idx: number, field: string, value: any) => {
    const updated = [...formData.certifications];
    (updated[idx] as any)[field] = value;
    updateField("certifications", updated);
  };

  // CGPA calculation
  const filledSemesters = formData.semesters.filter((s) => s.sgpa > 0);
  const cgpa =
    filledSemesters.length > 0
      ? (
          filledSemesters.reduce((sum, s) => sum + (s.sgpa || 0), 0) /
          filledSemesters.length
        ).toFixed(2)
      : "N/A";

  // Step completion check
  const isStepCompleted = (idx: number): boolean => {
    switch (idx) {
      case 0:
        return !!(formData.name && formData.email && formData.dob && formData.phone && formData.address && formData.photo);
      case 1:
        return !!formData.branch;
      case 2:
        return formData.semesters.some((s) => s.sgpa > 0);
      case 3:
        return formData.skills.length > 0;
      case 4:
        return formData.projects.length > 0;
      case 5:
        return formData.internships.length > 0 || formData.certifications.length > 0;
      default:
        return false;
    }
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  if (status === "loading" || loading) {
    return (
      <>
        <Navbar />
        <div className="aurora-bg min-h-screen pt-28 pb-12 px-6">
          <div className="max-w-full px-2">
            <div className="skeleton h-10 w-64 mb-6" />
            <div className="skeleton h-16 w-full mb-6 rounded-2xl" />
            <div className="skeleton h-96 w-full rounded-2xl" />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="aurora-bg min-h-screen pt-28 pb-12 px-6">
        <div className="max-w-full px-2 relative z-10">
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-8 text-gradient"
            style={{ fontFamily: "var(--font-space)" }}
          >
            Build Your Resume
          </motion.h1>

          {/* Step Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center justify-between mb-8"
          >
            {steps.map((step, idx) => (
              <div key={step.key} className="flex items-center flex-1 last:flex-none">
                {/* Dot */}
                <button
                  onClick={() => goToStep(idx)}
                  className="flex flex-col items-center gap-1.5 group relative"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      idx === currentStep
                        ? "bg-[#6366F1] text-white shadow-lg shadow-indigo-500/30"
                        : isStepCompleted(idx)
                        ? "bg-[#14B8A6] text-white"
                        : "border-2 border-slate-600 text-slate-500"
                    }`}
                  >
                    {isStepCompleted(idx) && idx !== currentStep ? (
                      <FiCheck size={16} />
                    ) : (
                      idx + 1
                    )}
                  </div>
                  <span
                    className={`text-xs hidden md:block transition-colors ${
                      idx === currentStep
                        ? "text-[#6366F1] font-semibold"
                        : "text-slate-500"
                    }`}
                  >
                    {step.label}
                  </span>
                </button>
                {/* Line */}
                {idx < steps.length - 1 && (
                  <div className="flex-1 mx-2">
                    <div
                      className={`h-0.5 rounded-full transition-colors duration-300 ${
                        isStepCompleted(idx)
                          ? "bg-[#14B8A6]"
                          : "bg-indigo-100"
                      }`}
                    />
                  </div>
                )}
              </div>
            ))}
          </motion.div>

          {/* Step Content */}
          <div className="bento-card overflow-hidden min-h-[480px] relative">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentStep}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {/* Step 0 - Personal Info */}
                {currentStep === 0 && (
                  <div>
                    <h2
                      className="text-xl font-semibold mb-6 flex items-center gap-2"
                      style={{ fontFamily: "var(--font-space)" }}
                    >
                      <FiUser className="text-[#6366F1]" /> Personal Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <InputField
                        label="Full Name"
                        value={formData.name}
                        onChange={(v) => updateField("name", v)}
                        placeholder="John Doe"
                        required
                      />
                      <InputField
                        label="Email"
                        value={formData.email}
                        onChange={(v) => updateField("email", v)}
                        placeholder="john@example.com"
                        type="email"
                        required
                      />
                      <div>
                        <label className="text-sm text-slate-500 mb-1.5 block">
                          Date of Birth<span className="text-red-500 ml-0.5">*</span>
                        </label>
                        <input
                          type="date"
                          className="input-field w-full"
                          value={formData.dob}
                          onChange={(e) => updateField("dob", e.target.value)}
                          max={new Date().toISOString().split("T")[0]}
                        />
                      </div>
                      <InputField
                        label="Phone"
                        value={formData.phone}
                        onChange={(v) => updateField("phone", v)}
                        placeholder="+91 9876543210"
                        required
                      />
                      <InputField
                        label="Address"
                        value={formData.address}
                        onChange={(v) => updateField("address", v)}
                        placeholder="City, State"
                        required
                      />
                      <InputField
                        label="LinkedIn"
                        value={formData.linkedin}
                        onChange={(v) => updateField("linkedin", v)}
                        placeholder="https://linkedin.com/in/..."
                      />
                      <InputField
                        label="GitHub"
                        value={formData.github}
                        onChange={(v) => updateField("github", v)}
                        placeholder="https://github.com/..."
                      />
                      <InputField
                        label="Portfolio"
                        value={formData.portfolio}
                        onChange={(v) => updateField("portfolio", v)}
                        placeholder="https://yourportfolio.com"
                      />
                      <div>
                        <label className="text-sm text-slate-500 mb-1.5 block">
                          Student Photo<span className="text-red-500 ml-0.5">*</span>
                        </label>
                        {formData.photo && (
                          <img
                            src={formData.photo}
                            alt="Preview"
                            className="w-20 h-20 rounded-xl object-cover border border-[var(--border)] mb-2"
                          />
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          className="input-field w-full text-sm file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-indigo-600 file:text-white file:text-sm file:cursor-pointer"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            if (file.size > 2 * 1024 * 1024) {
                              toast.error("Photo must be under 2MB");
                              return;
                            }
                            const reader = new FileReader();
                            reader.onload = () => {
                              updateField("photo", reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          }}
                        />
                        <p className="text-xs text-slate-500 mt-1">Max 2MB. JPG, PNG supported.</p>
                      </div>
                    </div>
                    <div className="mt-5">
                      <label className="text-sm text-slate-500 mb-1.5 block">
                        Career Objective
                      </label>
                      <textarea
                        className="input-field w-full min-h-[100px] resize-y"
                        value={formData.objective}
                        onChange={(e) => updateField("objective", e.target.value)}
                        placeholder="A brief summary of your career goals and aspirations..."
                      />
                    </div>
                  </div>
                )}

                {/* Step 1 - Education */}
                {currentStep === 1 && (
                  <div>
                    <h2
                      className="text-xl font-semibold mb-6 flex items-center gap-2"
                      style={{ fontFamily: "var(--font-space)" }}
                    >
                      <FiBook className="text-[#6366F1]" /> Education
                    </h2>

                    {/* 1. Engineering (Latest) */}
                    <p className="text-sm text-[#6366F1] font-semibold mb-3 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-indigo-100 text-[#6366F1] flex items-center justify-center text-xs font-bold">1</span>
                      Engineering (B.E. / B.Tech)
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                      <div>
                        <label className="text-sm text-slate-500 mb-1.5 block">College</label>
                        <input
                          type="text"
                          className="input-field w-full"
                          value="Government College of Engineering, Karad"
                          disabled
                          style={{ opacity: 0.7, cursor: "not-allowed" }}
                        />
                      </div>
                      <div>
                        <label className="text-sm text-slate-500 mb-1.5 block">
                          Branch<span className="text-red-500 ml-0.5">*</span>
                        </label>
                        <select
                          className="input-field w-full"
                          value={formData.branch}
                          onChange={(e) => updateField("branch", e.target.value)}
                        >
                          <option value="">Select Branch</option>
                          <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                          <option value="Information Technology">Information Technology</option>
                          <option value="Artificial Intelligence & Data Science">Artificial Intelligence & Data Science</option>
                          <option value="Electronics & Telecommunication">Electronics & Telecommunication</option>
                          <option value="Electrical Engineering">Electrical Engineering</option>
                          <option value="Mechanical Engineering">Mechanical Engineering</option>
                          <option value="Civil Engineering">Civil Engineering</option>
                          <option value="Chemical Engineering">Chemical Engineering</option>
                          <option value="Instrumentation Engineering">Instrumentation Engineering</option>
                          <option value="Production Engineering">Production Engineering</option>
                          <option value="Automobile Engineering">Automobile Engineering</option>
                          <option value="Biomedical Engineering">Biomedical Engineering</option>
                          <option value="Environmental Engineering">Environmental Engineering</option>
                          <option value="Textile Engineering">Textile Engineering</option>
                          <option value="Mining Engineering">Mining Engineering</option>
                          <option value="Aeronautical Engineering">Aeronautical Engineering</option>
                          <option value="Metallurgy Engineering">Metallurgy Engineering</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <InputField
                        label="Enrollment Year"
                        value={formData.enrollmentYear}
                        onChange={(v) => updateField("enrollmentYear", v)}
                        placeholder="2021"
                        required
                      />
                      <InputField
                        label="Graduation Year"
                        value={formData.graduationYear}
                        onChange={(v) => updateField("graduationYear", v)}
                        placeholder="2025"
                        required
                      />
                    </div>

                    {/* 2. Diploma (Optional) */}
                    <p className="text-sm text-[#F59E0B] font-semibold mb-3 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-amber-100 text-[#F59E0B] flex items-center justify-center text-xs font-bold">2</span>
                      Diploma (Optional — skip if you did 12th)
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                      <InputField
                        label="Diploma College"
                        value={formData.diplomaCollege}
                        onChange={(v) => updateField("diplomaCollege", v)}
                        placeholder="Polytechnic College Name"
                      />
                      <div>
                        <label className="text-sm text-slate-500 mb-1.5 block">Diploma Branch</label>
                        <select
                          className="input-field w-full"
                          value={formData.diplomaBranch}
                          onChange={(e) => updateField("diplomaBranch", e.target.value)}
                        >
                          <option value="">Select Branch</option>
                          <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                          <option value="Information Technology">Information Technology</option>
                          <option value="Artificial Intelligence & Data Science">Artificial Intelligence & Data Science</option>
                          <option value="Electronics & Telecommunication">Electronics & Telecommunication</option>
                          <option value="Electrical Engineering">Electrical Engineering</option>
                          <option value="Mechanical Engineering">Mechanical Engineering</option>
                          <option value="Civil Engineering">Civil Engineering</option>
                          <option value="Chemical Engineering">Chemical Engineering</option>
                          <option value="Instrumentation Engineering">Instrumentation Engineering</option>
                          <option value="Production Engineering">Production Engineering</option>
                          <option value="Automobile Engineering">Automobile Engineering</option>
                          <option value="Biomedical Engineering">Biomedical Engineering</option>
                          <option value="Environmental Engineering">Environmental Engineering</option>
                          <option value="Textile Engineering">Textile Engineering</option>
                          <option value="Mining Engineering">Mining Engineering</option>
                          <option value="Aeronautical Engineering">Aeronautical Engineering</option>
                          <option value="Metallurgy Engineering">Metallurgy Engineering</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <InputField
                        label="Percentage / CGPA"
                        value={formData.diplomaPercentage}
                        onChange={(v) => updateField("diplomaPercentage", v)}
                        placeholder="85% or 8.5"
                      />
                      <InputField
                        label="Passing Year"
                        value={formData.diplomaYear}
                        onChange={(v) => updateField("diplomaYear", v)}
                        placeholder="2021"
                      />
                    </div>

                    {/* 3. 12th Standard */}
                    <p className="text-sm text-[#14B8A6] font-semibold mb-3 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-teal-100 text-[#14B8A6] flex items-center justify-center text-xs font-bold">3</span>
                      12th Standard (HSC) — skip if you did Diploma
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                      <InputField
                        label="School / College Name"
                        value={formData.school12th}
                        onChange={(v) => updateField("school12th", v)}
                        placeholder="School / Junior College Name"
                      />
                      <InputField
                        label="Board"
                        value={formData.board12th}
                        onChange={(v) => updateField("board12th", v)}
                        placeholder="CBSE / ICSE / State Board"
                      />
                      <InputField
                        label="Percentage / CGPA"
                        value={formData.percentage12th}
                        onChange={(v) => updateField("percentage12th", v)}
                        placeholder="92% or 9.2"
                      />
                      <InputField
                        label="Passing Year"
                        value={formData.year12th}
                        onChange={(v) => updateField("year12th", v)}
                        placeholder="2021"
                      />
                    </div>

                    {/* 4. 10th Standard */}
                    <p className="text-sm text-[#8B5CF6] font-semibold mb-3 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-violet-100 text-[#8B5CF6] flex items-center justify-center text-xs font-bold">4</span>
                      10th Standard (SSC)
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <InputField
                        label="School Name"
                        value={formData.school10th}
                        onChange={(v) => updateField("school10th", v)}
                        placeholder="School Name"
                      />
                      <InputField
                        label="Board"
                        value={formData.board10th}
                        onChange={(v) => updateField("board10th", v)}
                        placeholder="CBSE / ICSE / State Board"
                      />
                      <InputField
                        label="Percentage / CGPA"
                        value={formData.percentage10th}
                        onChange={(v) => updateField("percentage10th", v)}
                        placeholder="95% or 9.5"
                      />
                      <InputField
                        label="Passing Year"
                        value={formData.year10th}
                        onChange={(v) => updateField("year10th", v)}
                        placeholder="2019"
                      />
                    </div>
                  </div>
                )}

                {/* Step 2 - Semesters */}
                {currentStep === 2 && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2
                        className="text-xl font-semibold flex items-center gap-2"
                        style={{ fontFamily: "var(--font-space)" }}
                      >
                        <FiLayers className="text-[#6366F1]" /> Semesters (1-8)
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {formData.semesters.map((sem, idx) => (
                        <div key={idx} className="bento-card !p-5">
                          <h3
                            className="text-base font-semibold text-[#14B8A6] mb-4"
                            style={{ fontFamily: "var(--font-space)" }}
                          >
                            Semester {sem.number}
                          </h3>
                          <div className="grid grid-cols-2 gap-4">
                            <InputField
                              label="SGPA / CGPA / %"
                              value={sem.sgpa.toString()}
                              onChange={(v) =>
                                updateSemester(idx, "sgpa", parseFloat(v) || 0)
                              }
                              placeholder="8.5 or 85%"
                            />
                            <InputField
                              label="Backlogs"
                              value={sem.backlog.toString()}
                              onChange={(v) =>
                                updateSemester(idx, "backlog", parseInt(v) || 0)
                              }
                              placeholder="0"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 text-center">
                      <p className="text-slate-500 text-sm">
                        CGPA / %:{" "}
                        <span
                          className="text-gradient font-bold text-lg"
                          style={{ fontFamily: "var(--font-space)" }}
                        >
                          {cgpa}
                        </span>
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 3 - Skills */}
                {currentStep === 3 && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2
                        className="text-xl font-semibold flex items-center gap-2"
                        style={{ fontFamily: "var(--font-space)" }}
                      >
                        <FiCode className="text-[#6366F1]" /> Skills
                      </h2>
                      <button onClick={addSkill} className="btn-accent">
                        <FiPlus size={16} /> Add Skill
                      </button>
                    </div>

                    {formData.skills.length === 0 && (
                      <p className="text-slate-500 text-sm text-center py-8">
                        No skills added yet. Click &quot;Add Skill&quot; to begin.
                      </p>
                    )}

                    <div className="flex flex-col gap-4">
                      {formData.skills.map((skill, idx) => (
                        <div
                          key={idx}
                          className="flex flex-col md:flex-row items-start md:items-end gap-4 p-4 rounded-xl"
                          style={{ background: "var(--surface-light)" }}
                        >
                          <div className="flex-1 w-full md:w-auto">
                            <InputField
                              label="Skill Name"
                              value={skill.name}
                              onChange={(v) => updateSkill(idx, "name", v)}
                              placeholder="e.g. AutoCAD, MATLAB, Surveying, C++..."
                            />
                          </div>
                          <div className="w-full md:w-44">
                            <label className="text-sm text-slate-500 mb-1.5 block">
                              Category
                            </label>
                            <select
                              className="input-field w-full"
                              value={skill.category}
                              onChange={(e) =>
                                updateSkill(idx, "category", e.target.value)
                              }
                            >
                              <option value="Technical">Technical</option>
                              <option value="Programming">Programming</option>
                              <option value="Tools & Software">Tools & Software</option>
                              <option value="Domain Knowledge">Domain Knowledge</option>
                              <option value="Laboratory">Laboratory</option>
                              <option value="Design & Analysis">Design & Analysis</option>
                              <option value="Soft Skills">Soft Skills</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                          <div className="w-full md:w-48">
                            <label className="text-sm text-slate-500 mb-1.5 block">
                              Proficiency: {skill.proficiency}%
                            </label>
                            <input
                              type="range"
                              min="10"
                              max="100"
                              value={skill.proficiency}
                              onChange={(e) =>
                                updateSkill(
                                  idx,
                                  "proficiency",
                                  parseInt(e.target.value)
                                )
                              }
                              className="w-full accent-[#6366F1] h-2 bg-indigo-100 rounded-full appearance-none cursor-pointer"
                            />
                          </div>
                          <button
                            onClick={() => removeSkill(idx)}
                            className="text-red-400 hover:text-red-300 transition-colors p-2 rounded-lg hover:bg-red-400/10 shrink-0"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 4 - Projects */}
                {currentStep === 4 && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2
                        className="text-xl font-semibold flex items-center gap-2"
                        style={{ fontFamily: "var(--font-space)" }}
                      >
                        <FiBriefcase className="text-[#6366F1]" /> Projects
                      </h2>
                      <button onClick={addProject} className="btn-accent">
                        <FiPlus size={16} /> Add Project
                      </button>
                    </div>

                    {formData.projects.length === 0 && (
                      <p className="text-slate-500 text-sm text-center py-8">
                        No projects added yet. Click &quot;Add Project&quot; to begin.
                      </p>
                    )}

                    <div className="flex flex-col gap-5">
                      {formData.projects.map((proj, idx) => (
                        <div key={idx} className="bento-card !p-5">
                          <div className="flex items-center justify-between mb-4">
                            <h3
                              className="text-base font-semibold text-[#14B8A6]"
                              style={{ fontFamily: "var(--font-space)" }}
                            >
                              Project {idx + 1}
                            </h3>
                            <button
                              onClick={() => removeProject(idx)}
                              className="text-red-400 hover:text-red-300 transition-colors p-1.5 rounded-lg hover:bg-red-400/10"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <InputField
                              label="Title"
                              value={proj.title}
                              onChange={(v) => updateProject(idx, "title", v)}
                              placeholder="Project Name"
                            />
                            <InputField
                              label="Tech Stack (comma-separated)"
                              value={proj.techStack.join(", ")}
                              onChange={(v) =>
                                updateProject(
                                  idx,
                                  "techStack",
                                  v.split(",").map((s: string) => s.trim()).filter(Boolean)
                                )
                              }
                              placeholder="e.g. MATLAB, SolidWorks, Arduino"
                            />
                            <InputField
                              label="GitHub URL"
                              value={proj.github}
                              onChange={(v) => updateProject(idx, "github", v)}
                              placeholder="https://github.com/..."
                            />
                            <InputField
                              label="Live Demo URL"
                              value={proj.liveDemo}
                              onChange={(v) => updateProject(idx, "liveDemo", v)}
                              placeholder="https://demo.example.com"
                            />
                          </div>
                          <div>
                            <label className="text-sm text-slate-500 mb-1.5 block">
                              Description
                            </label>
                            <textarea
                              className="input-field w-full min-h-[80px] resize-y"
                              value={proj.description}
                              onChange={(e) =>
                                updateProject(idx, "description", e.target.value)
                              }
                              placeholder="Describe what this project does..."
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 5 - Experience & Certs */}
                {currentStep === 5 && (
                  <div>
                    <h2
                      className="text-xl font-semibold mb-6 flex items-center gap-2"
                      style={{ fontFamily: "var(--font-space)" }}
                    >
                      <FiAward className="text-[#6366F1]" /> Experience &
                      Certifications
                    </h2>

                    {/* Internships */}
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-4">
                        <h3
                          className="text-lg font-semibold text-slate-600"
                          style={{ fontFamily: "var(--font-space)" }}
                        >
                          Internships
                        </h3>
                        <button onClick={addInternship} className="btn-accent">
                          <FiPlus size={16} /> Add Internship
                        </button>
                      </div>

                      {formData.internships.length === 0 && (
                        <p className="text-slate-500 text-sm text-center py-4">
                          No internships added yet.
                        </p>
                      )}

                      <div className="flex flex-col gap-4">
                        {formData.internships.map((intern, idx) => (
                          <div
                            key={idx}
                            className="bento-card !p-5"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-sm font-semibold text-[#14B8A6]">
                                Internship {idx + 1}
                              </h4>
                              <button
                                onClick={() => removeInternship(idx)}
                                className="text-red-400 hover:text-red-300 transition-colors p-1.5 rounded-lg hover:bg-red-400/10"
                              >
                                <FiTrash2 size={16} />
                              </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                              <InputField
                                label="Company"
                                value={intern.company}
                                onChange={(v) =>
                                  updateInternship(idx, "company", v)
                                }
                                placeholder="Company Name"
                              />
                              <InputField
                                label="Role"
                                value={intern.role}
                                onChange={(v) =>
                                  updateInternship(idx, "role", v)
                                }
                                placeholder="e.g. Engineering Intern"
                              />
                              <InputField
                                label="Duration"
                                value={intern.duration}
                                onChange={(v) =>
                                  updateInternship(idx, "duration", v)
                                }
                                placeholder="Jun 2024 - Aug 2024"
                              />
                            </div>
                            <div>
                              <label className="text-sm text-slate-500 mb-1.5 block">
                                Description
                              </label>
                              <textarea
                                className="input-field w-full min-h-[60px] resize-y"
                                value={intern.description}
                                onChange={(e) =>
                                  updateInternship(
                                    idx,
                                    "description",
                                    e.target.value
                                  )
                                }
                                placeholder="What did you work on?"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Certifications */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3
                          className="text-lg font-semibold text-slate-600"
                          style={{ fontFamily: "var(--font-space)" }}
                        >
                          Certifications
                        </h3>
                        <button onClick={addCertification} className="btn-accent">
                          <FiPlus size={16} /> Add Certification
                        </button>
                      </div>

                      {formData.certifications.length === 0 && (
                        <p className="text-slate-500 text-sm text-center py-4">
                          No certifications added yet.
                        </p>
                      )}

                      <div className="flex flex-col gap-4">
                        {formData.certifications.map((cert, idx) => (
                          <div
                            key={idx}
                            className="bento-card !p-5"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-sm font-semibold text-[#F59E0B]">
                                Certification {idx + 1}
                              </h4>
                              <button
                                onClick={() => removeCertification(idx)}
                                className="text-red-400 hover:text-red-300 transition-colors p-1.5 rounded-lg hover:bg-red-400/10"
                              >
                                <FiTrash2 size={16} />
                              </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <InputField
                                label="Title"
                                value={cert.title}
                                onChange={(v) =>
                                  updateCertification(idx, "title", v)
                                }
                                placeholder="e.g. NPTEL, Coursera, IITB"
                              />
                              <InputField
                                label="Issuer"
                                value={cert.issuer}
                                onChange={(v) =>
                                  updateCertification(idx, "issuer", v)
                                }
                                placeholder="e.g. NPTEL / Coursera / MSBTE"
                              />
                              <InputField
                                label="Date"
                                value={cert.date}
                                onChange={(v) =>
                                  updateCertification(idx, "date", v)
                                }
                                placeholder="Jan 2024"
                              />
                              <InputField
                                label="URL"
                                value={cert.url}
                                onChange={(v) =>
                                  updateCertification(idx, "url", v)
                                }
                                placeholder="https://credential.url"
                              />
                            </div>
                            <div className="mt-4">
                              <label className="text-sm text-slate-500 mb-1.5 block">
                                Upload Certificate (Image)
                              </label>
                              {cert.image && (
                                <div className="mb-2 relative inline-block">
                                  <img
                                    src={cert.image}
                                    alt="Certificate"
                                    className="max-h-40 rounded-lg border border-slate-700"
                                  />
                                  <button
                                    onClick={() => updateCertification(idx, "image", "")}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                                  >
                                    ✕
                                  </button>
                                </div>
                              )}
                              <input
                                type="file"
                                accept="image/*"
                                className="input-field w-full text-sm file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-indigo-600 file:text-white file:text-sm file:cursor-pointer"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  if (file.size > 3 * 1024 * 1024) {
                                    toast.error("Certificate image must be under 3MB");
                                    return;
                                  }
                                  const reader = new FileReader();
                                  reader.onload = () => {
                                    updateCertification(idx, "image", reader.result as string);
                                  };
                                  reader.readAsDataURL(file);
                                }}
                              />
                              <p className="text-xs text-slate-500 mt-1">Max 3MB. JPG, PNG supported.</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center justify-between mt-6"
          >
            <button
              onClick={() => goToStep(currentStep - 1)}
              disabled={currentStep === 0}
              className={`btn-secondary ${
                currentStep === 0 ? "opacity-40 cursor-not-allowed" : ""
              }`}
            >
              <FiChevronLeft size={16} /> Previous
            </button>

            <button
              onClick={save}
              disabled={saving}
              className="btn-primary"
            >
              <FiSave size={16} /> {saving ? "Saving..." : "Save Progress"}
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                onClick={() => goToStep(currentStep + 1)}
                className="btn-accent"
              >
                Next <FiChevronRight size={16} />
              </button>
            ) : (
              <Link href="/preview" className="btn-accent">
                Preview Resume <FiChevronRight size={16} />
              </Link>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-sm text-slate-500 mb-1.5 block">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        className="input-field w-full"
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
