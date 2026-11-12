export interface ProjectModule {
  name: string;
  github: string;
  live: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: "all" | "ai" | "fullstack" | "mobile";
  featured: boolean;
  tech: string[];
  modules?: ProjectModule[];
  github?: string;
  live?: string;
  caseStudyUrl?: string;
}

export interface SkillCategory {
  title: string;
  short: string;
  skills: string[];
}

export interface EducationItem {
  institution: string;
  degree: string;
  duration: string;
  details: string;
  score?: string;
}

export interface BioHighlight {
  label: string;
  value: string;
  icon: string;
}

export interface StatHighlight {
  value: string;
  label: string;
  detail: string;
}

export const personalInfo = {
  name: "Madari Anirudh",
  role: "AI & Full-Stack Software Engineer",
  headline: "Building Intelligent AI Architectures, High-Performance Web Platforms & Native Android Systems",
  shortBio:
    "Computer Science undergraduate specializing in Artificial Intelligence & Machine Learning at Teerthanker Mahaveer University. I design and build production-grade web systems, distributed native Android applications, and Generative AI-powered architectures.",
  aboutParagraphs: [
    "I am an engineering undergraduate pursuing a B.Tech in Computer Science & Engineering (AI & ML) at Teerthanker Mahaveer University (2024 – 2028), based in Telangana, India. My passion lies at the intersection of intelligent AI systems, high-performance web applications, and scalable mobile architectures.",
    "My engineering approach grounds modern tools in solid computer science fundamentals—data structures, algorithmic efficiency, and object-oriented design. Whether calculating orbital ephemeris coordinates for 3D satellite visualization using Three.js and Satellite.js, or building distributed Lost & Found infrastructure with role-based JWT auth and native Android clients, I build end-to-end systems designed for real-world reliability.",
    "As an active problem solver on LeetCode with an ongoing daily streak across Java, Python, and C, I value discipline, clean architecture, and continuous learning. I hold a strong academic track record (97% in Class XII, 9.3/10.0 SSC) and am eager to contribute to forward-thinking engineering teams.",
  ],
  keyHighlights: [
    {
      label: "Specialization",
      value: "Artificial Intelligence, Deep Learning & Full-Stack Systems",
      icon: "🧠",
    },
    {
      label: "Current Degree",
      value: "B.Tech in CSE (AI & ML) · TMU (2024 – 2028)",
      icon: "🎓",
    },
    {
      label: "Core Stacks",
      value: "Next.js, React, Node.js, Express, Android SDK, MongoDB",
      icon: "⚡",
    },
    {
      label: "Spatial & 3D Web",
      value: "Three.js, WebGL, Satellite.js Ephemeris Modeling",
      icon: "🛰️",
    },
    {
      label: "Algorithmic Problem Solving",
      value: "Consistent LeetCode Practitioner (Java, Python, C)",
      icon: "💻",
    },
    {
      label: "Location & Languages",
      value: "Telangana, India · English, Telugu, Hindi",
      icon: "📍",
    },
  ] as BioHighlight[],
  statsSummary: [
    {
      value: "B.Tech",
      label: "CSE (AI & ML)",
      detail: "TMU 2024 – 2028",
    },
    {
      value: "97%",
      label: "Class XII Score",
      detail: "Sri Chaitanya Jr. College",
    },
    {
      value: "9.3 / 10",
      label: "SSC CGPA",
      detail: "Secondary Education",
    },
    {
      value: "Active",
      label: "LeetCode Daily",
      detail: "Algorithmic Discipline",
    },
  ] as StatHighlight[],
  email: "anirudhmahendra2006@gmail.com",
  phone: "+91 9618562368",
  phoneHref: "tel:+919618562368",
  location: "Pargi, Telangana, India",
  leetcodeUsername: "madari-anirudh",
  socials: {
    github: "https://github.com/madari-anirudh",
    linkedin: "https://www.linkedin.com/in/madari-anirudh-03237b32a/",
    leetcode: "https://leetcode.com/u/madari-anirudh",
  },
  resumeUrl: "/resume.pdf",
};

export const projects: Project[] = [
  {
    id: "space-debris-tracker",
    title: "Space Debris Tracker",
    caseStudyUrl: "/projects/space-debris-tracker",
    description:
      "A real-time 3D orbital visualization platform tracking active satellites and high-risk orbital debris fields using TLE ephemeris data, Satellite.js coordinate propagation, and interactive Three.js graphics.",
    category: "fullstack",
    featured: true,
    tech: ["React.js", "Three.js", "Node.js", "Satellite.js", "Web3D", "Tailwind CSS"],
    modules: [
      {
        name: "Web 3D Interface",
        github: "https://github.com/madari-anirudh/Space_Debries_Tracker",
        live: "https://space-debries-tracker.vercel.app/",
      },
    ],
    github: "https://github.com/madari-anirudh/Space_Debries_Tracker",
    live: "https://space-debries-tracker.vercel.app/",
  },
  {
    id: "reclaim-lost-and-found",
    title: "Lost & Found System (RECLAIM)",
    description:
      "A distributed tracking infrastructure facilitating item verification, real-time status logging, and secure recovery protocols across Android and Web interfaces with role-based JWT auth and Cloudinary storage.",
    category: "mobile",
    featured: true,
    tech: ["Android Studio", "React.js", "Node.js", "MongoDB", "Express.js", "Cloudinary"],
    modules: [
      {
        name: "Android App (Client)",
        github: "https://github.com/madari-anirudh/lost-and-found-app",
        live: "https://github.com/madari-anirudh/lost-and-found-app/releases/download/v1.1/lostandfound.V1.1.apk",
      },
      {
        name: "Admin Dashboard",
        github: "https://github.com/madari-anirudh/lost-found-admin",
        live: "https://lost-found-admin-delta.vercel.app/",
      },
      {
        name: "Backend REST API",
        github: "https://github.com/madari-anirudh/lost-found-backend",
        live: "https://lost-found-api-q597.onrender.com/",
      },
    ],
  },
  {
    id: "procto-ai",
    title: "Procto – AI Virtual Assistant",
    description:
      "An intelligent Android virtual assistant engineered with secure multi-factor authentication (Email, Google, Phone OTP, Voice), context streaming via Gemini API, smart reminders, and voice synthesis.",
    category: "ai",
    featured: true,
    tech: ["React", "Firebase", "Gen AI", "Gemini API", "JWT", "Android SDK", "Node.js"],
    github: "https://github.com/madari-anirudh/procto-gemini-api",
    live: "#",
  },
];

export const skillCategories: SkillCategory[] = [
  {
    title: "Core & Languages",
    short: "Languages",
    skills: [
      "Java",
      "Python",
      "C",
      "JavaScript (ESNext)",
      "TypeScript",
      "SQL",
      "Data Structures & Algorithms",
      "OOP Architecture",
    ],
  },
  {
    title: "Full-Stack Development",
    short: "Full-Stack",
    skills: [
      "React.js",
      "Next.js (App Router)",
      "Node.js",
      "Express.js",
      "REST APIs",
      "Three.js & WebGL",
      "Tailwind CSS",
    ],
  },
  {
    title: "Databases & Cloud",
    short: "Cloud & DB",
    skills: [
      "MongoDB & Atlas",
      "AWS",
      "Firebase Firestore",
      "JWT Auth & RBAC",
      "Cloudinary Media",
      "Docker",
    ],
  },
  {
    title: "Tooling & Machine Learning",
    short: "AI & Tools",
    skills: [
      "Generative AI & Prompting",
      "Android SDK & Studio",
      "Git & GitHub",
      "Postman",
      "Vercel & Render",
      "Linux",
    ],
  },
];

export const education: EducationItem[] = [
  {
    institution: "Teerthanker Mahaveer University",
    degree: "Bachelor of Technology in CSE (AI & ML)",
    duration: "2024 – 2028",
    details: "Undergraduate Engineering Program · Specializing in AI & Deep Learning",
    score: "Pursuing",
  },
  {
    institution: "Sri Chaitanya Junior College",
    degree: "Intermediate (Class XII)",
    duration: "2022 – 2024",
    details: "Board of Intermediate Education, Telangana",
    score: "Score: 97%",
  },
  {
    institution: "MJPTBCWREIS",
    degree: "Secondary School Certificate (SSC)",
    duration: "2022",
    details: "Board of Secondary Education, Telangana",
    score: "GPA: 9.3 / 10.0",
  },
];
