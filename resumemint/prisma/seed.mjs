import pg from "pg";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const { Pool } = pg;
const pool = new Pool({ connectionString: "postgres://postgres:postgres@localhost:5432/resumemint?sslmode=disable" });

function cuid() {
  return "c" + crypto.randomBytes(12).toString("hex");
}

const testStudents = [
  // CS Branch (5)
  { name: "Aarav Sharma", email: "aarav.sharma@gcek.ac.in", phone: "+919876543201", branch: "Computer Science & Engineering", dob: "12 Jan 2003", address: "Pune, Maharashtra" },
  { name: "Sneha Kulkarni", email: "sneha.kulkarni@gcek.ac.in", phone: "+919876543202", branch: "Computer Science & Engineering", dob: "5 Mar 2003", address: "Satara, Maharashtra" },
  { name: "Rohan Deshmukh", email: "rohan.deshmukh@gcek.ac.in", phone: "+919876543203", branch: "Computer Science & Engineering", dob: "22 Jul 2002", address: "Kolhapur, Maharashtra" },
  { name: "Ananya Joshi", email: "ananya.joshi@gcek.ac.in", phone: "+919876543204", branch: "Computer Science & Engineering", dob: "18 Sep 2003", address: "Sangli, Maharashtra" },
  { name: "Vikram Patil", email: "vikram.patil@gcek.ac.in", phone: "+919876543205", branch: "Computer Science & Engineering", dob: "3 Nov 2002", address: "Karad, Maharashtra" },
  // IT Branch (4)
  { name: "Priya Bhosale", email: "priya.bhosale@gcek.ac.in", phone: "+919876543206", branch: "Information Technology", dob: "14 Feb 2003", address: "Solapur, Maharashtra" },
  { name: "Amit Jadhav", email: "amit.jadhav@gcek.ac.in", phone: "+919876543207", branch: "Information Technology", dob: "27 Apr 2003", address: "Pune, Maharashtra" },
  { name: "Kavita More", email: "kavita.more@gcek.ac.in", phone: "+919876543208", branch: "Information Technology", dob: "9 Jun 2002", address: "Nashik, Maharashtra" },
  { name: "Rahul Shinde", email: "rahul.shinde@gcek.ac.in", phone: "+919876543209", branch: "Information Technology", dob: "30 Aug 2003", address: "Karad, Maharashtra" },
  // ENTC Branch (3)
  { name: "Deepak Gaikwad", email: "deepak.gaikwad@gcek.ac.in", phone: "+919876543210", branch: "Electronics & Telecommunication", dob: "7 Jan 2003", address: "Pune, Maharashtra" },
  { name: "Sakshi Pawar", email: "sakshi.pawar@gcek.ac.in", phone: "+919876543211", branch: "Electronics & Telecommunication", dob: "16 May 2002", address: "Satara, Maharashtra" },
  { name: "Tushar Kale", email: "tushar.kale@gcek.ac.in", phone: "+919876543212", branch: "Electronics & Telecommunication", dob: "25 Oct 2003", address: "Kolhapur, Maharashtra" },
  // Mech Branch (3)
  { name: "Aditya Nikam", email: "aditya.nikam@gcek.ac.in", phone: "+919876543213", branch: "Mechanical Engineering", dob: "11 Mar 2003", address: "Sangli, Maharashtra" },
  { name: "Pooja Salunkhe", email: "pooja.salunkhe@gcek.ac.in", phone: "+919876543214", branch: "Mechanical Engineering", dob: "20 Jul 2002", address: "Karad, Maharashtra" },
  { name: "Saurabh Mane", email: "saurabh.mane@gcek.ac.in", phone: "+919876543215", branch: "Mechanical Engineering", dob: "2 Dec 2003", address: "Pune, Maharashtra" },
  // Civil Branch (2)
  { name: "Shreya Thombare", email: "shreya.thombare@gcek.ac.in", phone: "+919876543216", branch: "Civil Engineering", dob: "8 Apr 2003", address: "Kolhapur, Maharashtra" },
  { name: "Omkar Chavan", email: "omkar.chavan@gcek.ac.in", phone: "+919876543217", branch: "Civil Engineering", dob: "19 Sep 2002", address: "Satara, Maharashtra" },
];

const skillSets = {
  "Computer Science & Engineering": [
    { name: "JavaScript", category: "Programming" }, { name: "Python", category: "Programming" },
    { name: "React", category: "Frontend" }, { name: "Node.js", category: "Backend" },
    { name: "MongoDB", category: "Database" }, { name: "Docker", category: "DevOps" }, { name: "Git", category: "Tools" },
  ],
  "Information Technology": [
    { name: "Java", category: "Programming" }, { name: "PHP", category: "Programming" },
    { name: "MySQL", category: "Database" }, { name: "Angular", category: "Frontend" },
    { name: "Spring Boot", category: "Backend" }, { name: "AWS", category: "Cloud" },
  ],
  "Electronics & Telecommunication": [
    { name: "MATLAB", category: "Tools" }, { name: "Embedded C", category: "Programming" },
    { name: "VHDL", category: "Hardware" }, { name: "Arduino", category: "Embedded" },
    { name: "Python", category: "Programming" }, { name: "PCB Design", category: "Hardware" },
  ],
  "Mechanical Engineering": [
    { name: "AutoCAD", category: "Design" }, { name: "SolidWorks", category: "Design" },
    { name: "ANSYS", category: "Simulation" }, { name: "MATLAB", category: "Tools" },
    { name: "Python", category: "Programming" }, { name: "3D Printing", category: "Manufacturing" },
  ],
  "Civil Engineering": [
    { name: "AutoCAD", category: "Design" }, { name: "STAAD Pro", category: "Structural" },
    { name: "Revit", category: "BIM" }, { name: "MS Project", category: "Planning" },
    { name: "ETABS", category: "Structural" }, { name: "Python", category: "Programming" },
  ],
};

const projectsByBranch = {
  "Computer Science & Engineering": [
    { title: "ResumeMint", description: "Full-stack resume builder for college students with PDF export", techStack: ["Next.js", "React", "Prisma", "PostgreSQL"] },
    { title: "Chat Application", description: "Real-time chat app with WebSocket support", techStack: ["Node.js", "Socket.io", "React", "MongoDB"] },
  ],
  "Information Technology": [
    { title: "E-Commerce Platform", description: "Online marketplace with payment integration", techStack: ["Java", "Spring Boot", "Angular", "MySQL"] },
    { title: "Student Management System", description: "ERP for managing student records and grades", techStack: ["PHP", "Laravel", "MySQL", "Bootstrap"] },
  ],
  "Electronics & Telecommunication": [
    { title: "IoT Home Automation", description: "Smart home system with sensor monitoring", techStack: ["Arduino", "ESP32", "MQTT", "Python"] },
    { title: "Signal Processing Toolkit", description: "MATLAB-based toolkit for audio signal analysis", techStack: ["MATLAB", "Python", "NumPy"] },
  ],
  "Mechanical Engineering": [
    { title: "CNC Machine Simulator", description: "3D simulation of CNC machining operations", techStack: ["SolidWorks", "MATLAB", "Python"] },
    { title: "Solar Tracker System", description: "Automated solar panel tracking for maximum efficiency", techStack: ["Arduino", "SolidWorks", "AutoCAD"] },
  ],
  "Civil Engineering": [
    { title: "Bridge Load Analysis", description: "Structural analysis tool for bridge designs", techStack: ["STAAD Pro", "Python", "AutoCAD"] },
    { title: "Green Building Design", description: "Sustainable building design with BIM modeling", techStack: ["Revit", "AutoCAD", "ETABS"] },
  ],
};

async function main() {
  console.log("Seeding test students...\n");
  const password = await bcrypt.hash("Test@1234", 12);
  const now = new Date().toISOString();

  for (const s of testStudents) {
    // Check if exists
    const existing = await pool.query("SELECT id FROM \"User\" WHERE email = $1", [s.email]);
    if (existing.rows.length > 0) {
      console.log(`  Skipping ${s.name} (already exists)`);
      continue;
    }

    const userId = cuid();
    const objective = `Aspiring ${s.branch.split(" ")[0].toLowerCase()} engineer seeking opportunities to apply technical skills and contribute to innovative projects in a dynamic environment.`;

    // Insert user
    await pool.query(
      `INSERT INTO "User" (id, name, email, password, phone, dob, address, branch, college, "enrollmentYear", "graduationYear", objective, "school10th", "board10th", "percentage10th", "year10th", "school12th", "board12th", "percentage12th", "year12th", linkedin, github, "extraActivities", role, "createdAt", "updatedAt")
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26)`,
      [
        userId, s.name, s.email, password, s.phone, s.dob, s.address, s.branch,
        "Government College of Engineering, Karad", 2021, 2025, objective,
        "Maharashtra State Board School", "Maharashtra State Board",
        (80 + Math.random() * 15).toFixed(1), "2019",
        "Maharashtra State Board Jr College", "Maharashtra State Board",
        (75 + Math.random() * 18).toFixed(1), "2021",
        `linkedin.com/in/${s.name.toLowerCase().replace(/ /g, "-")}`,
        `github.com/${s.name.toLowerCase().replace(/ /g, "")}`,
        `{${["Member of college coding club", "Participated in state-level technical event"].map(a => `"${a}"`).join(",")}}`,
        "USER", now, now,
      ]
    );

    // Insert skills
    const skills = skillSets[s.branch] || [];
    for (const sk of skills) {
      await pool.query(
        `INSERT INTO "Skill" (id, name, category, proficiency, "userId") VALUES ($1,$2,$3,$4,$5)`,
        [cuid(), sk.name, sk.category, 60 + Math.floor(Math.random() * 35), userId]
      );
    }

    // Insert projects
    const projects = projectsByBranch[s.branch] || [];
    for (const p of projects) {
      await pool.query(
        `INSERT INTO "Project" (id, title, description, "techStack", "userId") VALUES ($1,$2,$3,$4,$5)`,
        [cuid(), p.title, p.description, `{${p.techStack.map(t => `"${t}"`).join(",")}}`, userId]
      );
    }

    // Insert semesters
    const semCount = Math.floor(Math.random() * 3) + 4;
    for (let i = 1; i <= semCount; i++) {
      const sgpa = parseFloat((7 + Math.random() * 2.5).toFixed(2));
      const backlog = Math.random() < 0.1 ? 1 : 0;
      await pool.query(
        `INSERT INTO "Semester" (id, number, sgpa, backlog, "userId") VALUES ($1,$2,$3,$4,$5)`,
        [cuid(), i, sgpa, backlog, userId]
      );
    }

    // Insert certification
    await pool.query(
      `INSERT INTO "Certification" (id, title, issuer, date, "userId") VALUES ($1,$2,$3,$4,$5)`,
      [cuid(), `${s.branch.split(" ")[0]} Fundamentals`, "Coursera", "March 2024", userId]
    );

    // Insert internship
    await pool.query(
      `INSERT INTO "Internship" (id, company, role, duration, description, "userId") VALUES ($1,$2,$3,$4,$5,$6)`,
      [cuid(), "Tech Solutions Pvt Ltd", `${s.branch.split(" ")[0]} Intern`, "Jun-Aug 2024",
        `Worked on ${s.branch.toLowerCase()} projects and gained industry experience.`, userId]
    );

    console.log(`  Created: ${s.name} (${s.branch})`);
  }

  console.log("\nDone! Students by branch:");
  const branches = ["Computer Science & Engineering", "Information Technology", "Electronics & Telecommunication", "Mechanical Engineering", "Civil Engineering"];
  for (const b of branches) {
    const count = testStudents.filter(s => s.branch === b).length;
    console.log(`  ${b}: ${count}`);
  }
  console.log("\nAll test accounts use password: Test@1234");

  await pool.end();
}

main().catch(e => { console.error(e); process.exit(1); });
