"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getLeetCodeStats } from "../app/actions";

interface LeetCodeData {
  status: "success" | "error";
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  totalSubmissions: number;
  ranking: number;
  streak: number;
  badges: { name: string; icon: string }[];
  languages: { languageName: string; problemsSolved: number }[];
}

interface ProjectModule {
  name: string;
  github: string;
  live: string;
}

interface Project {
  title: string;
  description: string;
  tech: string[];
  modules?: ProjectModule[];
  github?: string;
  live?: string;
}

const projects: Project[] = [
  {
    title: "Space Debris Tracker",
    description:
      "A real-time 3D orbital visualization platform tracking active satellites and high-risk orbital debris fields using ephemeris data.",
    tech: ["React.js", "Three.js", "Node.js", "Satellite.js"],
    modules: [
      {
        name: "Web Interface",
        github:
          "https://github.com/madari-anirudh/space-debris-tracker",
        live: "https://space-debris-tracker1.netlify.app",
      },
      {
        name: "Backend API",
        github: "#",
        live: "#",
      },
    ],
  },
  {
    title: "Lost & Found System",
    description:
      "A distributed tracking infrastructure facilitating item verification, real-time status logging, and secure recovery protocols across multiple client interfaces.",
    tech: ["Android Studio", "React.js", "Node.js", "MongoDB"],
    modules: [
      {
        name: "Android App",
        github:
          "https://github.com/madari-anirudh/lost-and-found-app",
        live:
          "https://github.com/madari-anirudh/lost-and-found-app/releases/download/v1.1/lostandfound.V1.1.apk",
      },
      {
        name: "Admin Dashboard",
        github:
          "https://github.com/madari-anirudh/lost-found-admin",
        live: "https://lost-found-admin-delta.vercel.app/",
      },
      {
        name: "Backend Server",
        github:
          "https://github.com/madari-anirudh/lost-found-backend",
        live: "https://lost-found-api-q597.onrender.com/",
      },
    ],
  },
  {
    title: "Procto",
    description:
      "An AI-powered Android virtual assistant with secure authentication, context streaming, and voice command parsing.",
    tech: ["React", "Firebase", "Gen AI", "JWT"],
    github:
      "https://github.com/madari-anirudh/procto-gemini-api",
    live: "#",
  },
];

const skillCategories = [
  {
    title: "Core & Languages",
    short: "Languages",
    skills: [
      "Java",
      "Python",
      "C",
      "JavaScript",
      "SQL",
      "Data Structures",
      "OOP Architecture",
    ],
  },
  {
    title: "Full-Stack Development",
    short: "Full-Stack",
    skills: [
      "React.js",
      "Node.js",
      "Express.js",
      "Next.js",
      "REST APIs",
      "Three.js",
    ],
  },
  {
    title: "Databases & Cloud",
    short: "Cloud",
    skills: [
      "MongoDB",
      "AWS",
      "Firebase",
      "JWT Auth",
      "Cloudinary",
      "Docker",
    ],
  },
  {
    title: "Tooling & Machine Learning",
    short: "AI & Tools",
    skills: [
      "Generative AI",
      "Git",
      "Android SDK",
      "Postman",
      "Vercel",
      "Linux",
    ],
  },
];

const education = [
  {
    institution: "Teerthanker Mahaveer University",
    degree: "B.Tech in CSE (AI & ML)",
    duration: "2024 – 2028",
    details: "Undergraduate Program",
  },
  {
    institution: "Sri Chaitanya Junior College",
    degree: "Intermediate · Class XII",
    duration: "2022 – 2024",
    details: "Score: 97%",
  },
  {
    institution: "MJPTBCWREIS",
    degree: "Secondary School Certificate",
    duration: "2022",
    details: "GPA: 9.3 / 10.0",
  },
];

function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-6">
      <p className="mb-1 text-[10px] font-mono uppercase tracking-[0.2em] text-blue-400">
        {eyebrow}
      </p>

      <h2 className="text-2xl font-bold tracking-tight text-white">
        {title}
      </h2>

      {description && (
        <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
          {description}
        </p>
      )}
    </div>
  );
}

function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45 }}
      className={`relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl ${className}`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      {children}
    </motion.div>
  );
}

function LeetCodeMobile() {
  const [data, setData] = useState<LeetCodeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const result = await getLeetCodeStats("madari-anirudh");

        if (mounted) {
          setData(result);
        }
      } catch (error) {
        console.error("Mobile LeetCode error:", error);

        if (mounted) {
          setData({
            status: "error",
            totalSolved: 0,
            easySolved: 0,
            mediumSolved: 0,
            hardSolved: 0,
            totalSubmissions: 0,
            ranking: 0,
            streak: 0,
            badges: [],
            languages: [],
          });
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <GlassCard className="flex min-h-[250px] items-center justify-center">
        <div className="flex items-center gap-3 text-xs font-mono text-slate-500">
          <span className="h-2 w-2 animate-pulse rounded-full bg-yellow-400" />
          Connecting to LeetCode...
        </div>
      </GlassCard>
    );
  }

  if (!data || data.status === "error") {
    return (
      <GlassCard className="p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-200">
              LeetCode
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Statistics temporarily unavailable.
            </p>
          </div>

          <a
            href="https://leetcode.com/u/madari-anirudh"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-blue-500/20 bg-blue-500/10 px-3 py-2 text-[11px] font-mono text-blue-400"
          >
            Profile ↗
          </a>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard>
      <div className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-yellow-500/20 bg-yellow-500/10">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 fill-yellow-500"
              >
                <path d="M16.102 17.93l-2.697 2.607c-.466.467-1.111.662-1.823.662s-1.357-.195-1.824-.662l-4.332-4.363c-.467-.467-.702-1.15-.702-1.863s.235-1.357.702-1.824l4.319-4.38c.467-.467 1.125-.645 1.837-.645s1.357.195 1.823.662l2.697 2.606c.514.515 1.365.497 1.9-.038.535-.536.553-1.387.039-1.901l-2.609-2.636a5.055 5.055 0 0 0-2.445-1.337l2.467-2.503c.513-.514.498-1.366-.037-1.901-.535-.535-1.387-.552-1.902-.038l-10.1 10.101c-.981.982-1.494 2.337-1.494 3.835 0 1.498.513 2.895 1.494 3.875l4.347 4.361c.981.979 2.337 1.452 3.834 1.452s2.853-.473 3.833-1.452l2.697-2.606c.514-.515.498-1.366-.038-1.901-.535-.535-1.387-.552-1.902-.038z" />
              </svg>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white">
                LeetCode
              </h3>

              <a
                href="https://leetcode.com/u/madari-anirudh"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-mono text-blue-400"
              >
                @madari-anirudh ↗
              </a>
            </div>
          </div>

          <div className="rounded-full border border-orange-500/20 bg-orange-500/10 px-2.5 py-1 text-[10px] font-mono text-orange-400">
            🔥 {data.streak}
          </div>
        </div>

        {/* Main solved metric */}
        <div className="mt-7 text-center">
          <p className="text-5xl font-black tracking-tight text-white">
            {data.totalSolved}
          </p>

          <p className="mt-1 text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500">
            Problems Solved
          </p>
        </div>

        {/* Difficulty */}
        <div className="mt-7 grid grid-cols-3 gap-2">
          <div className="rounded-xl border border-teal-500/10 bg-teal-500/5 p-3 text-center">
            <p className="text-lg font-bold text-teal-400">
              {data.easySolved}
            </p>
            <p className="mt-0.5 text-[9px] font-mono uppercase tracking-wider text-slate-500">
              Easy
            </p>
          </div>

          <div className="rounded-xl border border-yellow-500/10 bg-yellow-500/5 p-3 text-center">
            <p className="text-lg font-bold text-yellow-400">
              {data.mediumSolved}
            </p>
            <p className="mt-0.5 text-[9px] font-mono uppercase tracking-wider text-slate-500">
              Medium
            </p>
          </div>

          <div className="rounded-xl border border-red-500/10 bg-red-500/5 p-3 text-center">
            <p className="text-lg font-bold text-red-400">
              {data.hardSolved}
            </p>
            <p className="mt-0.5 text-[9px] font-mono uppercase tracking-wider text-slate-500">
              Hard
            </p>
          </div>
        </div>

        {/* Rank + submissions */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-white/5 bg-white/[0.025] p-3">
            <p className="text-[9px] font-mono uppercase tracking-wider text-slate-500">
              Global Rank
            </p>
            <p className="mt-1 text-sm font-bold text-slate-200">
              #{data.ranking.toLocaleString()}
            </p>
          </div>

          <div className="rounded-xl border border-white/5 bg-white/[0.025] p-3">
            <p className="text-[9px] font-mono uppercase tracking-wider text-slate-500">
              Submissions
            </p>
            <p className="mt-1 text-sm font-bold text-slate-200">
              {data.totalSubmissions.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Languages */}
        <div className="mt-6">
          <p className="mb-2.5 text-[9px] font-mono uppercase tracking-[0.18em] text-slate-500">
            Languages Solved
          </p>

          <div className="flex flex-wrap gap-1.5">
            {data.languages.map((language, index) => (
              <div
                key={`${language.languageName}-${index}`}
                className="rounded-lg border border-white/10 bg-white/[0.025] px-2.5 py-1.5 text-[10px] font-mono"
              >
                <span className="text-blue-400">
                  {language.languageName}
                </span>{" "}
                <span className="text-slate-500">
                  {language.problemsSolved}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Badge */}
        <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4">
          <span className="text-[10px] font-mono text-slate-500">
            Achievements
          </span>

          <span className="text-[10px] font-mono text-slate-600">
            {data.badges.length > 0
              ? `${data.badges.length} badges`
              : "No badges yet"}
          </span>
        </div>
      </div>
    </GlassCard>
  );
}

function SkillsMobile() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-2.5">
      {skillCategories.map((category, index) => {
        const isOpen = open === index;

        return (
          <div
  key={category.title}
  className="overflow-hidden rounded-xl border border-white/10 bg-slate-900/50"
>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : index)}
              className="flex w-full items-center justify-between px-4 py-4 text-left"
            >
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-blue-400">
                  0{index + 1}
                </span>

                <span className="text-sm font-medium text-slate-200">
                  {category.title}
                </span>
              </div>

              <motion.span
                animate={{ rotate: isOpen ? 45 : 0 }}
                className="text-xl font-light text-slate-500"
              >
                +
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="border-t border-white/5 px-4 pb-4 pt-3">
                    <div className="flex flex-wrap gap-1.5">
                      {category.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-[10px] font-mono text-slate-400"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="min-w-[88%] snap-center">
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60">
        {/* Browser header */}
        <div className="flex items-center justify-between border-b border-white/5 bg-slate-950/60 px-4 py-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-red-500/50" />
            <span className="h-2 w-2 rounded-full bg-yellow-500/50" />
            <span className="h-2 w-2 rounded-full bg-green-500/50" />
          </div>

          <span className="text-[9px] font-mono text-slate-600">
            project/{String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <div className="p-5">
          <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-blue-400">
            Featured Engineering
          </p>

          <h3 className="mt-2 text-xl font-bold text-white">
            {project.title}
          </h3>

          <p className="mt-2.5 text-xs leading-relaxed text-slate-400">
            {project.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.tech.map((tech) => (
              <span
                key={tech}
                className="rounded-md border border-blue-500/15 bg-blue-500/5 px-2 py-1 text-[9px] font-mono text-blue-300"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Modules */}
          {project.modules && (
            <div className="mt-5">
              <button
                type="button"
                onClick={() => setExpanded(!expanded)}
                className="flex w-full items-center justify-between border-t border-white/5 pt-4 text-left"
              >
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                  System Modules
                </span>

                <span className="text-xs text-blue-400">
                  {expanded ? "Hide" : "View"}
                </span>
              </button>

              <AnimatePresence>
                {expanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 space-y-2 overflow-hidden"
                  >
                    {project.modules.map((module) => (
                      <div
                        key={module.name}
                        className="rounded-xl border border-white/5 bg-white/[0.02] p-3"
                      >
                        <p className="text-[11px] font-semibold text-slate-300">
                          {module.name}
                        </p>

                        <div className="mt-2 flex gap-4 text-[10px] font-mono">
                          {module.github !== "#" && (
                            <a
                              href={module.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-slate-400"
                            >
                              Source ↗
                            </a>
                          )}

                          {module.live !== "#" && (
                            <a
                              href={module.live}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400"
                            >
                              Live ↗
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Single project links */}
          {!project.modules && (
            <div className="mt-5 flex gap-3 border-t border-white/5 pt-4">
              {project.github && project.github !== "#" && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-[10px] font-mono text-slate-300"
                >
                  Source ↗
                </a>
              )}

              {project.live && project.live !== "#" && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-blue-500/20 bg-blue-500/10 px-3 py-2 text-[10px] font-mono text-blue-400"
                >
                  Live ↗
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EducationMobile() {
  return (
    <div className="relative ml-2 border-l border-white/10 pl-6">
      {education.map((item, index) => (
        <motion.div
          key={item.institution}
          initial={{ opacity: 0, x: -15 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: index * 0.08 }}
          className="relative mb-7 last:mb-0"
        >
          <span className="absolute -left-[31px] top-1 h-2.5 w-2.5 rounded-full border-2 border-slate-950 bg-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.5)]" />

          <p className="text-[9px] font-mono uppercase tracking-wider text-blue-400">
            {item.duration}
          </p>

          <h3 className="mt-1.5 text-sm font-semibold text-slate-200">
            {item.institution}
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            {item.degree}
          </p>

          <p className="mt-1 text-[10px] font-mono text-slate-600">
            {item.details}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

export default function MobilePortfolio() {
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const sections = ["home", "skills", "projects", "education"];

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]) {
          setActiveSection(visible[0].target.id);
        }
      },
      {
        rootMargin: "-20% 0px -65% 0px",
        threshold: [0.1, 0.25, 0.5],
      }
    );

    sections.forEach((id) => {
      const element = document.getElementById(id);

      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-slate-950 text-slate-100">
      {/* Background */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <div className="absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-blue-600/10 blur-[110px]" />

        <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] [background-size:28px_28px]" />
      </div>

      {/* Mobile header */}
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/5 bg-slate-950/75 px-5 py-3 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => scrollTo("home")}
            className="flex items-center gap-2"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-500/20 bg-blue-500/10 text-xs font-bold text-blue-400">
              MA
            </span>

            <span className="text-xs font-semibold tracking-wide text-slate-300">
              Madari Anirudh
            </span>
          </button>

          <div className="flex items-center gap-1.5 text-[9px] font-mono text-green-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
            ONLINE
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="relative z-10 px-5 pb-28 pt-24">
        {/* HERO */}
        <section id="home" className="scroll-mt-20">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-[10px] font-mono text-blue-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400" />
              AI ENGINEER · FULL-STACK
            </div>

            <h1 className="text-[42px] font-black leading-[0.98] tracking-[-0.04em] text-white">
              Madari
              <br />
              <span className="text-slate-500">Anirudh.</span>
            </h1>

            <p className="mt-5 text-sm leading-6 text-slate-400">
              Building high-performance web systems, full-stack applications,
              and intelligent AI architectures.
            </p>

            <div className="mt-7 grid grid-cols-2 gap-2.5">
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-xs font-semibold text-white shadow-lg shadow-blue-900/20 active:scale-[0.98]"
              >
                View Resume
              </a>

              <a
                href="mailto:anirudhmahendra2006@gmail.com"
                className="flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs font-semibold text-slate-300 active:scale-[0.98]"
              >
                Email Me
              </a>
            </div>

            <div className="mt-5 flex items-center gap-5 text-[11px] font-mono text-slate-500">
              <a href="tel:+919618562368" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
               Phone
            </a>
              <a
                href="https://github.com/madari-anirudh"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-white"
              >
                GitHub ↗
              </a>

              <a
                href="https://www.linkedin.com/in/madari-anirudh-03237b32a/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-white"
              >
                LinkedIn ↗
              </a>

              <a
                href="https://leetcode.com/u/madari-anirudh"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-white"
              >
                LeetCode ↗
              </a>
            </div>
          </motion.div>
        </section>

        {/* LEETCODE */}
        <section className="mt-12 scroll-mt-20">
          <SectionTitle
            eyebrow="01 / Activity"
            title="Coding Profile"
            description="Live problem-solving statistics."
          />

          <LeetCodeMobile />
        </section>

        {/* SKILLS */}
        <section
          id="skills"
          className="mt-16 scroll-mt-20 border-t border-white/5 pt-12"
        >
          <SectionTitle
            eyebrow="02 / Stack"
            title="Technical Arsenal"
            description="Technologies I use to build and ship systems."
          />

          <SkillsMobile />
        </section>

        {/* PROJECTS */}
        <section
          id="projects"
          className="mt-16 scroll-mt-20 border-t border-white/5 pt-12"
        >
          <SectionTitle
            eyebrow="03 / Builds"
            title="Featured Projects"
            description="Production builds and engineering prototypes."
          />

          <div className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.title}
                project={project}
                index={index}
              />
            ))}
          </div>

          <div className="mt-3 text-center text-[9px] font-mono text-slate-600">
            SWIPE TO EXPLORE →
          </div>
        </section>

        {/* EDUCATION */}
        <section
          id="education"
          className="mt-16 scroll-mt-20 border-t border-white/5 pt-12"
        >
          <SectionTitle
            eyebrow="04 / Background"
            title="Education"
            description="Academic training and qualifications."
          />

          <EducationMobile />
        </section>

        {/* CONTACT */}
        <section className="mt-16 border-t border-white/5 pt-12">
          <GlassCard className="p-6 text-center">
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-blue-400">
              Let's Connect
            </p>

            <h2 className="mt-2 text-2xl font-bold text-white">
              Build something.
            </h2>

            <p className="mx-auto mt-2 max-w-xs text-xs leading-relaxed text-slate-500">
              Open to opportunities, collaborations, and interesting
              engineering problems.
            </p>

            <a
              href="mailto:anirudhmahendra2006@gmail.com"
              className="mt-5 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-xs font-semibold text-white shadow-lg shadow-blue-900/20"
            >
              Start a Conversation
            </a>
          </GlassCard>
        </section>

        {/* FOOTER */}
        <footer className="mt-12 border-t border-white/5 pt-6 text-center">
          <p className="text-[9px] font-mono text-slate-600">
            © {new Date().getFullYear()} Madari Anirudh
          </p>

          <p className="mt-1 text-[9px] font-mono text-slate-700">
            Next.js · Tailwind CSS · Framer Motion
          </p>
        </footer>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/5 bg-slate-950/85 px-3 pb-[max(10px,env(safe-area-inset-bottom))] pt-2 backdrop-blur-2xl">
        <div className="mx-auto grid max-w-md grid-cols-4">
          {[
            { id: "home", label: "Home", icon: "⌂" },
            { id: "skills", label: "Skills", icon: "◇" },
            { id: "projects", label: "Projects", icon: "▣" },
            { id: "education", label: "Education", icon: "◎" },
          ].map((item) => {
            const active = activeSection === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollTo(item.id)}
                className={`flex flex-col items-center gap-0.5 py-1.5 transition-colors ${
                  active ? "text-blue-400" : "text-slate-600"
                }`}
              >
                <span className="text-base leading-none">
                  {item.icon}
                </span>

                <span className="text-[8px] font-mono">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </main>
  );
}

