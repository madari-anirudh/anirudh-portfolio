"use client";

import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import {
  motion,
  Variants,
  useMotionValue,
  useTransform,
  useSpring,
} from "framer-motion";
import { getLeetCodeStats } from "./actions";

// --- ANIMATION VARIANTS ---
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } 
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

// --- GROUNDED INTERACTIVE CARD ---
function ProCard({
  children,
  className = "",
  tilt = true,
}: {
  children: React.ReactNode;
  className?: string;
  tilt?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [4, -4]), {
    stiffness: 220,
    damping: 25,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-4, 4]), {
    stiffness: 220,
    damping: 25,
  });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current || !tilt) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <motion.div
      ref={ref}
      variants={fadeInUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchEnd={handleMouseLeave}
      style={{
        rotateX: tilt ? rotateX : 0,
        rotateY: tilt ? rotateY : 0,
        perspective: 1000,
      }}
      className={`relative rounded-xl border border-white/10 bg-slate-900/50 backdrop-blur-md shadow-lg transition-all duration-300 hover:border-blue-500/40 hover:bg-slate-900/80 hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.15)] ${className}`}
    >
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-xl bg-gradient-to-r from-transparent via-white/20 to-transparent" 
      />
      {children}
    </motion.div>
  );
}

// --- LEETCODE COMPONENT ---
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

function LeetCodeStats({ username }: { username: string }) {
  const [data, setData] = useState<LeetCodeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        const stats = await getLeetCodeStats(username);

        console.log("CLIENT LEETCODE DATA:", stats);

        if (mounted && stats?.status === "success") {
          setData(stats);
        } else if (mounted) {
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
      } catch (error) {
        console.error("CLIENT LEETCODE ERROR:", error);

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

    loadData();

    return () => {
      mounted = false;
    };
  }, [username]);

  // -----------------------------
  // LOADING
  // -----------------------------

  if (loading) {
    return (
      <div className="w-full min-h-[180px] rounded-xl border border-white/10 bg-slate-900/50 backdrop-blur-md flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />
          <span className="text-sm font-mono text-slate-500">
            Connecting to LeetCode...
          </span>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  // -----------------------------
  // ERROR
  // -----------------------------

  if (data.status === "error") {
    return (
      <div className="w-full rounded-xl border border-yellow-500/10 bg-slate-900/50 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-300">
              LeetCode Statistics
            </h3>

            <p className="mt-1 text-sm font-mono text-slate-500">
              Live statistics are temporarily unavailable.
            </p>
          </div>

          <a
            href={`https://leetcode.com/u/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-fit rounded-md border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-xs font-mono text-blue-400 hover:bg-blue-500/20 transition-colors"
          >
            @{username} ↗
          </a>
        </div>
      </div>
    );
  }

  // -----------------------------
  // SUCCESS
  // -----------------------------

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full rounded-xl border border-white/10 bg-slate-900/50 backdrop-blur-md shadow-lg overflow-hidden"
    >
      {/* Top highlight */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent" />

      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              {/* LeetCode icon */}
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 fill-yellow-500"
                aria-hidden="true"
              >
                <path d="M16.102 17.93l-2.697 2.607c-.466.467-1.111.662-1.823.662s-1.357-.195-1.824-.662l-4.332-4.363c-.467-.467-.702-1.15-.702-1.863s.235-1.357.702-1.824l4.319-4.38c.467-.467 1.125-.645 1.837-.645s1.357.195 1.823.662l2.697 2.606c.514.515 1.365.497 1.9-.038.535-.536.553-1.387.039-1.901l-2.609-2.636a5.055 5.055 0 0 0-2.445-1.337l2.467-2.503c.513-.514.498-1.366-.037-1.901-.535-.535-1.387-.552-1.902-.038l-10.1 10.101c-.981.982-1.494 2.337-1.494 3.835 0 1.498.513 2.895 1.494 3.875l4.347 4.361c.981.979 2.337 1.452 3.834 1.452s2.853-.473 3.833-1.452l2.697-2.606c.514-.515.498-1.366-.038-1.901-.535-.535-1.387-.552-1.902-.038z" />
              </svg>

              <h3 className="text-lg font-semibold text-slate-100">
                LeetCode Statistics
              </h3>

              <a
                href={`https://leetcode.com/u/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-0.5 rounded-md border border-blue-500/20 bg-blue-500/10 text-xs font-mono text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 transition-colors"
              >
                @{username}
              </a>
            </div>

            {/* Secondary stats */}
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm font-mono text-slate-400">
                Global Rank:{" "}
                <span className="text-slate-200">
                  {data.ranking.toLocaleString()}
                </span>
              </p>

              <div className="hidden sm:block h-3 w-px bg-slate-700" />

              <p className="text-sm font-mono text-orange-400">
                🔥 {data.streak} Day Streak
              </p>

              <div className="hidden sm:block h-3 w-px bg-slate-700" />

              <p className="text-sm font-mono text-slate-400">
                Submissions:{" "}
                <span className="text-slate-200">
                  {data.totalSubmissions.toLocaleString()}
                </span>
              </p>
            </div>
          </div>

          {/* Problem metrics */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <span className="block text-3xl font-bold text-white">
                {data.totalSolved}
              </span>

              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500">
                Solved
              </span>
            </div>

            <div className="h-12 w-px bg-white/10" />

            <div className="grid grid-cols-[auto_auto] gap-x-4 gap-y-1 text-sm font-mono">
              <span className="text-teal-400">Easy</span>
              <span className="text-right text-slate-300">
                {data.easySolved}
              </span>

              <span className="text-yellow-400">Medium</span>
              <span className="text-right text-slate-300">
                {data.mediumSolved}
              </span>

              <span className="text-red-400">Hard</span>
              <span className="text-right text-slate-300">
                {data.hardSolved}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-6 pt-5 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Badges */}
          <div>
            <h4 className="mb-3 text-[11px] font-mono uppercase tracking-widest text-slate-500">
              Achievements & Badges
            </h4>

            {data.badges.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {data.badges.map((badge, index) => (
                  <div
                    key={`${badge.name}-${index}`}
                    className="flex items-center gap-2 rounded-lg border border-white/10 bg-slate-900/50 px-2.5 py-1.5 text-xs font-mono text-slate-300"
                  >
                    <img
                      src={
                        badge.icon.startsWith("http")
                          ? badge.icon
                          : `https://leetcode.com${badge.icon}`
                      }
                      alt={badge.name}
                      className="h-4 w-4 object-contain"
                    />

                    {badge.name}
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-fit rounded-lg border border-dashed border-white/5 bg-slate-900/30 px-3 py-1.5 text-xs font-mono text-slate-500">
                🏆 Awaiting Milestones
              </div>
            )}
          </div>

          {/* Languages */}
          <div>
            <h4 className="mb-3 text-[11px] font-mono uppercase tracking-widest text-slate-500">
              Languages Solved
            </h4>

            {data.languages.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {data.languages.map((language, index) => (
                  <div
                    key={`${language.languageName}-${index}`}
                    className="flex items-center gap-1.5 rounded-md border border-white/10 bg-slate-900/50 px-2.5 py-1 text-xs font-mono text-slate-300 hover:border-blue-500/30 transition-colors"
                  >
                    <span className="text-blue-400">
                      {language.languageName}
                    </span>

                    <span className="font-bold text-slate-500">
                      {language.problemsSolved}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-xs font-mono text-slate-500">
                No language data found
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Home() {
  // --- DATA ---
  const projects = [
    {
      title: "Space Debris Tracker",
      description:
        "A real-time 3D orbital visualization platform tracking active satellites and high-risk orbital debris fields using ephemeris data.",
      tech: ["React.js", "Three.js", "Node.js", "Satellite.js"],
      // Converted Space Debris to a multi-module architecture
      modules: [
        { 
          name: "Web Interface", 
          github: "https://github.com/madari-anirudh/space-debris-tracker", 
          live: "https://space-debris-tracker1.netlify.app" // Replace with your live Vercel/Netlify URL when ready
        },
        { 
          name: "Backend API", 
          github: "#", 
          live: "#" // Replace with your live Render/Heroku URL when ready
        }
      ]
    },
    {
      title: "Lost & Found System(RECLAIM)",
      description:
        "A distributed tracking infrastructure facilitating item verification, real-time status logging, and secure recovery protocols across multiple client interfaces.",
      tech: ["Android Studio", "React.js", "Node.js", "MongoDB"],
      modules: [
        { 
          name: "Android App", 
          github: "https://github.com/madari-anirudh/lost-and-found-app", 
          live: "https://github.com/madari-anirudh/lost-and-found-app/releases/download/v1.1/lostandfound.V1.1.apk" 
        },
        { 
          name: "Admin Dashboard", 
          github: "https://github.com/madari-anirudh/lost-found-admin", // Update if your repo name is different
          live: "https://lost-found-admin-delta.vercel.app/" 
        },
        { 
          name: "Backend Server", 
          github: "https://github.com/madari-anirudh/lost-found-backend", // Update if your repo name is different
          live: "https://lost-found-api-q597.onrender.com/" 
        }
      ]
    },
    {
      title: "Procto – AI-Powered Virtual Assistant",
      description:
        "An AI-powered Android virtual assistant with secure authentication, context streaming, and voice command parsing.",
      tech: ["React", "Firebase", "Gen AI", "JWT"],
      github: "https://github.com/madari-anirudh/procto-gemini-api",
      live: "#",
    },
  ];

  const skillCategories = [
    {
      title: "Core & Languages",
      skills: ["Java", "Python", "C", "JavaScript", "SQL", "Data Structures", "OOP Architecture"],
    },
    {
      title: "Full-Stack Development",
      skills: ["React.js", "Node.js", "Express.js", "Next.js", "REST APIs", "Three.js"],
    },
    {
      title: "Databases & Cloud",
      skills: ["MongoDB", "AWS", "Firebase", "JWT Auth", "Cloudinary", "Docker"],
    },
    {
      title: "Tooling & Machine Learning",
      skills: ["Generative AI", "Git", "Android SDK", "Postman", "Vercel", "Linux"],
    },
  ];

  const education = [
    {
      institution: "Teerthanker Mahaveer University",
      degree: "Bachelor of Technology in CSE (AI & ML)",
      duration: "2024 – 2028",
      details: "Undergraduate Program",
    },
    {
      institution: "Sri Chaitanya Junior College",
      degree: "Intermediate (Class XII)",
      duration: "2022 – 2024",
      details: "Score: 97%",
    },
    {
      institution: "MJPTBCWREIS",
      degree: "Secondary School Certificate (SSC)",
      duration: "2022",
      details: "GPA: 9.3 / 10.0",
    },
  ];

  return (
    <main className="relative min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-500/30 selection:text-blue-200">
      {/* --- TECHNICAL DARK BACKGROUND --- */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-gradient-to-b from-blue-600/15 via-indigo-600/5 to-transparent blur-[140px] rounded-full" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* --- MAIN CONTENT WRAPPER --- */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 py-20 sm:px-12 lg:px-16">
        
        {/* HERO SECTION */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="pb-16 pt-8 text-center sm:text-left"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-mono text-blue-400 mb-6 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
            AI Engineer & Full-Stack
          </div>
          
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-white">
            Madari Anirudh
          </h1>
          
          <p className="mt-4 max-w-2xl text-lg text-slate-300 leading-relaxed sm:text-xl">
            Specializing in high-performance web systems, full-stack applications, and intelligent AI architectures.
          </p>

          {/* Primary Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center sm:justify-start gap-4 font-mono text-sm">
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition-all duration-200 hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] active:scale-[0.98] flex items-center gap-2"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
              </svg>
              View Resume
            </a>
            <Link
              href="mailto:anirudhmahendra2006@gmail.com"
              className="rounded-lg border border-white/10 bg-white/[0.04] px-5 py-2.5 font-medium text-slate-300 transition-all duration-200 hover:border-white/20 hover:bg-white/[0.08] hover:text-white flex items-center gap-2"
            >
              Email Me
            </Link>
          </div>

          {/* Social & Contact Links */}
          <div className="mt-6 flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-6 font-mono text-[13px] text-slate-400">
            <Link href="tel:+919618562368" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
              <span>📱</span> Phone
            </Link>
            <span className="hidden sm:inline text-slate-700">|</span>
            <Link href="https://github.com/madari-anirudh" target="_blank" className="hover:text-white transition-colors flex items-center gap-1">
              GitHub ↗
            </Link>
            <span className="hidden sm:inline text-slate-700">|</span>
            <Link href="https://www.linkedin.com/in/madari-anirudh-03237b32a/" target="_blank" className="hover:text-white transition-colors flex items-center gap-1">
              LinkedIn ↗
            </Link>
            <span className="hidden sm:inline text-slate-700">|</span>
            <Link href="https://leetcode.com/u/madari-anirudh" target="_blank" className="hover:text-white transition-colors flex items-center gap-1">
              LeetCode ↗
            </Link>
          </div>
        </motion.section>

        {/* LEETCODE LIVE TRACKER */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeInUp}
          className="py-12 border-t border-slate-800/80"
        >
          <LeetCodeStats username="madari-anirudh" />
        </motion.section>

        {/* TECHNICAL LOADOUT / SKILLS */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeInUp}
          className="py-16 border-t border-slate-800/80 space-y-8"
        >
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Technical Arsenal
            </h2>
            <p className="text-sm text-slate-400 font-mono">
              Core technologies, frameworks, and system proficiencies
            </p>
          </div>

          <motion.div variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {skillCategories.map((category, index) => (
              <ProCard key={index} tilt={false} className="p-6">
                <h3 className="text-base font-semibold text-slate-200 border-b border-white/5 pb-3 mb-4 flex items-center justify-between">
                  <span>{category.title}</span>
                  <span className="text-xs font-mono text-blue-400/80">0{index + 1}</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-white/[0.03] border border-white/10 text-slate-300 text-xs font-mono rounded transition-colors duration-200 hover:border-blue-400/50 hover:text-blue-300 hover:bg-blue-500/5 cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </ProCard>
            ))}
          </motion.div>
        </motion.section>

        {/* PROJECTS SECTION */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeInUp}
          className="py-16 border-t border-slate-800/80 space-y-8"
        >
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Featured Engineering
            </h2>
            <p className="text-sm text-slate-400 font-mono">
              Production builds, architectural prototypes, and full-stack systems
            </p>
          </div>

          <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <ProCard key={index} className="overflow-hidden flex flex-col group">
                <div className="bg-slate-950/60 px-4 py-2.5 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-700 group-hover:bg-red-500/70 transition-colors" />
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-700 group-hover:bg-yellow-500/70 transition-colors" />
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-700 group-hover:bg-green-500/70 transition-colors" />
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">
                    sys/v{index + 1}.0
                  </span>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold text-slate-100 group-hover:text-blue-400 transition-colors duration-200">
                    {project.title}
                  </h3>
                  <p className="text-slate-400 mt-2 text-sm leading-relaxed flex-grow">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 my-6">
                    {project.tech.map((tech, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-blue-500/10 text-blue-300 border border-blue-500/20 text-[11px] font-mono rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* MULTI-MODULE OR SINGLE LINK RENDERING */}
                  <div className="mt-auto pt-4 border-t border-white/5 font-mono text-xs">
                    {project.modules ? (
                      <div className="flex flex-col gap-2.5">
                        {project.modules.map((mod, i) => (
                          <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between bg-white/[0.02] px-3 py-2 rounded-md border border-white/5 gap-2">
                            <span className="text-slate-300 font-semibold">{mod.name}</span>
                            <div className="flex items-center gap-4">
                              <Link href={mod.github} target="_blank" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1">
                                <span aria-hidden="true">[</span> Source Code <span aria-hidden="true">]</span>
                              </Link>
                              {mod.live !== "#" && (
                                <Link href={mod.live} target="_blank" className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
                                  <span aria-hidden="true">[</span> Live <span aria-hidden="true">]</span>
                                </Link>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center gap-5">
                        <Link
                          href={project.github || "#"}
                          target="_blank"
                          aria-label={`Source code for ${project.title}`}
                          className="text-slate-400 hover:text-white transition-colors flex items-center gap-1"
                        >
                          <span aria-hidden="true">[</span> Source Code <span aria-hidden="true">]</span>
                        </Link>
                        {project.live && project.live !== "#" && (
                          <Link
                            href={project.live}
                            target="_blank"
                            aria-label={`Live demo for ${project.title}`}
                            className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                          >
                            <span aria-hidden="true">[</span> Live Demo <span aria-hidden="true">]</span>
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </ProCard>
            ))}
          </motion.div>
        </motion.section>

        {/* EDUCATION SECTION */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeInUp}
          className="py-16 border-t border-slate-800/80 space-y-8"
        >
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Academic Background
            </h2>
            <p className="text-sm text-slate-400 font-mono">
              Institutional training and formal qualifications
            </p>
          </div>

          <motion.div variants={staggerContainer} className="space-y-4">
            {education.map((edu, index) => (
              <ProCard key={index} tilt={false} className="p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-100">{edu.institution}</h3>
                    <p className="text-slate-400 text-sm mt-0.5">{edu.degree}</p>
                    <p className="text-xs font-mono text-blue-400 mt-2">{edu.details}</p>
                  </div>
                  <div className="self-start text-xs font-mono text-slate-400 bg-white/[0.03] px-3 py-1 rounded border border-white/10">
                    {edu.duration}
                  </div>
                </div>
              </ProCard>
            ))}
          </motion.div>
        </motion.section>

        {/* FOOTER */}
        <footer className="pt-12 mt-12 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-slate-500">
          <p>© {new Date().getFullYear()} Madari Anirudh. Built with Next.js & Tailwind CSS.</p>
          <p className="text-slate-600">All systems operational</p>
        </footer>
      </div>
    </main>
  );
}