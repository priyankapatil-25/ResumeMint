# ResumeMint - Product Requirements Document (PRD)

## 1. Product Overview

**Product Name:** ResumeMint
**Tagline:** "Mint Your Future — The Digital Resume Platform for Engineering Students"
**Version:** 2.0 (Complete Rebuild)

ResumeMint is a full-stack web application that enables engineering students to create stunning digital resumes with semester-wise academic tracking, skill visualization, project showcases, and one-click PDF export. It features a unique shareable public profile with QR code for recruiter access.

---

## 2. Target Users

- Engineering students (all branches — CS, IT, Mechanical, Civil, Electronics, etc.)
- College placement cells
- Fresh graduates entering the job market

---

## 3. UI/UX Design Direction — "Aurora Bento"

### Design Philosophy
A premium, modern design combining **Bento Grid layouts** with **Aurora gradient effects** — moving away from generic glassmorphism to a more unique, professional identity.

### Design System

**Color Palette:**
- Background: Deep navy `#060B18` with subtle blue-black gradients
- Primary: Electric Indigo `#6366F1` (indigo-500)
- Secondary: Soft Teal `#14B8A6` (teal-500)
- Accent: Warm Amber `#F59E0B` for highlights/CTAs
- Surface Cards: `#0F1629` with `#1A2138` borders
- Text Primary: `#F1F5F9` (slate-100)
- Text Secondary: `#94A3B8` (slate-400)
- Success: `#22C55E`, Error: `#EF4444`

**Typography:**
- Headings: `Space Grotesk` — bold, modern, techy feel
- Body: `Inter` — clean readability
- Code/Data: `JetBrains Mono` — for CGPA, SGPA, technical data

**Layout:**
- Bento Grid: Asymmetric card layouts with varied sizes
- Cards have subtle 1px borders, no heavy shadows
- Micro-interactions on hover (scale 1.02, border glow)
- Smooth page transitions with Framer Motion
- Aurora gradient blobs in backgrounds (animated, subtle)

**Unique UI Elements:**
- Animated gradient mesh backgrounds (not simple blobs)
- Bento grid dashboard with varied card sizes
- Pill-shaped navigation tabs
- Progress rings with animated stroke
- Skill bars with gradient fills and percentage labels
- Semester timeline as connected dot-line visualization
- Floating action buttons with tooltip labels
- Toast notifications for save/success/error
- Skeleton loading states for all data sections

---

## 4. Core Features

### 4.1 Authentication
- **Signup:** Name, Email, Password with validation
- **Login:** Email + Password with NextAuth JWT
- **Forgot Password:** Email-based reset flow
- **Session Management:** Persistent JWT sessions
- **Protected Routes:** Middleware-based auth guard

### 4.2 Landing Page
- Hero section with animated headline + aurora mesh background
- Live animated resume mockup/preview card
- Bento grid features showcase (6 features)
- Stats counter section (animated numbers)
- Testimonials section
- CTA section with gradient border card
- Footer with links

### 4.3 Dashboard
- Welcome banner with user name + avatar
- Bento grid layout with:
  - Resume completion progress (animated ring)
  - Quick action cards (Build, Preview, Download, Share)
  - Recent activity timeline
  - Profile completeness checklist
  - CGPA highlight card
  - Skills count card
  - Projects count card

### 4.4 Resume Builder (Multi-Step Form)
**Step 1 - Personal Information:**
- Full Name, Email, Phone, Address
- Photo Upload (Cloudinary or base64 preview)
- LinkedIn, GitHub, Portfolio URLs
- Career Objective (textarea)

**Step 2 - Education:**
- College/University name
- Branch/Department
- Enrollment Year, Graduation Year
- 10th & 12th School Info (School name, Board, Percentage/CGPA, Year)

**Step 3 - Semester Records:**
- Dynamic add/remove semesters
- Each semester: Semester Number, SGPA, Subjects (comma-separated), Backlogs
- Auto CGPA calculation displayed live
- Visual semester progress bars

**Step 4 - Skills:**
- Dynamic add/remove skills
- Skill Name, Category (Programming/Tools/Soft Skills/Domain), Proficiency (slider 10-100%)
- Visual skill bars preview while adding

**Step 5 - Projects:**
- Dynamic add/remove projects
- Title, Description, Tech Stack (tags), GitHub Link, Live Demo Link
- Project image upload option

**Step 6 - Experience & Certifications:**
- Internships: Company, Role, Duration, Description
- Certifications: Title, Issuer, Date, Certificate URL
- Extra-curricular Activities (list)

**Builder UX:**
- Step indicator with connected dots
- Auto-save on step change
- "Save Progress" button always visible
- Animated transitions between steps
- Validation with inline error messages

### 4.5 Resume Preview & Templates
**Template 1 — "Aurora" (Dark Premium):**
- Dark navy background with indigo/teal accents
- Bento-style section cards
- Gradient skill bars
- Connected-dot semester timeline
- QR code in corner

**Template 2 — "Minimal" (Light Clean):**
- White background, clean typography
- Subtle indigo accent colors
- Traditional section layout
- ATS-friendly formatting
- Print optimized

**Template 3 — "Bold" (Creative):**
- Two-column layout (sidebar + main)
- Colored sidebar with photo, contact, skills
- Main area with education, projects, experience
- Modern card-based sections

**Template Features:**
- Live preview as you switch templates
- Template selector sidebar with thumbnails
- Responsive preview (desktop/mobile toggle)

### 4.6 PDF Download
- One-click PDF generation via html2canvas + jsPDF
- Template-aware rendering (dark/light)
- A4 format, multi-page support
- Filename: `{Name}_Resume_ResumeMint.pdf`
- Loading state during generation

### 4.7 Public Profile Page
- Shareable URL: `/profile/{userId}`
- Full digital resume view with animations
- QR Code auto-generated (links to this page)
- Stats banner (CGPA, Skills, Projects, Semesters)
- Semester journey visualization
- Skills grouped by category with hover tooltips
- Project cards with GitHub/Live links
- "Built with ResumeMint" footer branding
- Open Graph meta tags for social sharing

### 4.8 Resume Score & Tips
- Real-time resume completeness score (0-100)
- Section-wise scoring:
  - Personal Info filled: +15
  - Education filled: +15
  - At least 2 semesters: +15
  - At least 3 skills: +15
  - At least 1 project: +20
  - At least 1 certification: +10
  - Objective written: +10
- Tips/suggestions for improvement
- Visual score ring on dashboard

---

## 5. Technical Architecture

### 5.1 Tech Stack
| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS v4 + Custom CSS |
| Animations | Framer Motion |
| Icons | React Icons (Feather set) |
| Auth | NextAuth.js v4 (Credentials + JWT) |
| Database | PostgreSQL (Prisma ORM) |
| Local Dev DB | `prisma dev` (built-in local PostgreSQL) |
| Production DB | Neon (free serverless PostgreSQL) |
| PDF Generation | html2canvas + jsPDF |
| QR Code | `qrcode` npm package |
| Image Upload | Base64 encoding (local), Cloudinary (production) |
| Deployment | Vercel |

### 5.2 Database Schema (Prisma)
- **User** — id, name, email, password, photo, phone, address, linkedin, github, portfolio, objective, college, branch, enrollmentYear, graduationYear, school10th, board10th, percentage10th, year10th, school12th, board12th, percentage12th, year12th, extraActivities[]
- **Semester** — id, number, sgpa, subjects[], backlog, userId
- **Skill** — id, name, category, proficiency, userId
- **Project** — id, title, description, techStack[], github, liveDemo, image, userId
- **Certification** — id, title, issuer, date, url, userId
- **Internship** — id, company, role, duration, description, userId

### 5.3 API Routes
- `POST /api/auth/signup` — Register new user
- `POST /api/auth/[...nextauth]` — NextAuth login/session
- `GET /api/profile` — Get authenticated user profile
- `PUT /api/profile` — Update user profile + relations
- `GET /api/profile/[id]` — Get public profile by ID

### 5.4 Pages
| Route | Page | Auth Required |
|---|---|---|
| `/` | Landing Page | No |
| `/login` | Login | No |
| `/signup` | Signup | No |
| `/dashboard` | Dashboard | Yes |
| `/builder` | Resume Builder | Yes |
| `/preview` | Resume Preview + Download | Yes |
| `/profile/[id]` | Public Profile | No |

---

## 6. Non-Functional Requirements

- **Performance:** Lighthouse score > 90
- **Responsive:** Fully mobile-friendly (all pages)
- **Accessibility:** Proper labels, contrast ratios, keyboard navigation
- **Security:** Bcrypt password hashing, JWT auth, input validation
- **SEO:** Meta tags, Open Graph for public profiles

---

## 7. Deployment Plan

1. **Development:** `prisma dev` + `npm run dev`
2. **Production Database:** Neon free tier PostgreSQL
3. **Hosting:** Vercel (auto-deploy from GitHub)
4. **Environment Variables:** DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL

---

## 8. Future Enhancements (Post-MVP)
- Google OAuth login
- AI-powered resume content suggestions
- Multiple resume versions per user
- Resume analytics (view count tracking)
- Multi-language resume support
- Admin panel for college placement cells
