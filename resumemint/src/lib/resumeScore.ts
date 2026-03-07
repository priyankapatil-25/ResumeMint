export interface ScoreResult {
  total: number;
  sections: { label: string; score: number; max: number; tip: string }[];
}

export function calculateResumeScore(profile: {
  phone?: string; objective?: string; college?: string; branch?: string;
  school10th?: string; school12th?: string;
  semesters?: unknown[]; skills?: unknown[]; projects?: unknown[];
  certifications?: unknown[]; internships?: unknown[];
}): ScoreResult {
  const sections = [
    {
      label: "Personal Info",
      score: profile.phone ? 10 : 0,
      max: 10,
      tip: profile.phone ? "Complete" : "Add your phone number and contact details",
    },
    {
      label: "Career Objective",
      score: profile.objective ? 10 : 0,
      max: 10,
      tip: profile.objective ? "Complete" : "Write a brief career objective",
    },
    {
      label: "Education",
      score: (profile.college ? 5 : 0) + (profile.branch ? 5 : 0),
      max: 10,
      tip: profile.college && profile.branch ? "Complete" : "Add your college and branch details",
    },
    {
      label: "School (10th & 12th)",
      score: (profile.school10th ? 5 : 0) + (profile.school12th ? 5 : 0),
      max: 10,
      tip: profile.school10th && profile.school12th ? "Complete" : "Add your 10th and 12th school information",
    },
    {
      label: "Semesters",
      score: Math.min((profile.semesters?.length || 0) * 5, 15),
      max: 15,
      tip: (profile.semesters?.length || 0) >= 3 ? "Complete" : "Add at least 3 semester records",
    },
    {
      label: "Skills",
      score: Math.min((profile.skills?.length || 0) * 3, 15),
      max: 15,
      tip: (profile.skills?.length || 0) >= 5 ? "Complete" : "Add at least 5 skills",
    },
    {
      label: "Projects",
      score: Math.min((profile.projects?.length || 0) * 7, 20),
      max: 20,
      tip: (profile.projects?.length || 0) >= 2 ? "Complete" : "Add at least 2 projects to impress recruiters",
    },
    {
      label: "Certifications",
      score: Math.min((profile.certifications?.length || 0) * 5, 10),
      max: 10,
      tip: (profile.certifications?.length || 0) >= 1 ? "Complete" : "Add certifications to stand out",
    },
  ];

  return { total: sections.reduce((a, s) => a + s.score, 0), sections };
}
