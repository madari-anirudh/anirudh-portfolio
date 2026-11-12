"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useEffect, useState } from "react";
import {
  motion,
  Variants,
  useMotionValue,
  useTransform,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import { getLeetCodeStats, type LeetCodeResult } from "./actions";
import MobilePortfolio from "../components/MobilePortfolio";
import {
  personalInfo,
  projects,
  skillCategories,
  education,
} from "../data/portfolio";

// --- ANIMATION VARIANTS ---
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

// --- INTERACTIVE 3D PERSPECTIVE CARD ---
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

// --- LEETCODE LIVE COMPONENT ---
function LeetCodeStats({ username }: { username: string }) {
  const [data, setData] = useState<LeetCodeResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        const stats = await getLeetCodeStats(username);
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

  if (loading) {
    return (
      <div className="w-full min-h-[180px] rounded-xl border border-white/10 bg-slate-900/50 backdrop-blur-md flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-sm font-mono text-slate-400">
            Syncing live metrics from LeetCode GraphQL API...
          </span>
        </div>
      </div>
    );
  }

  if (!data || data.status === "error") {
    return (
      <div className="w-full rounded-xl border border-amber-500/20 bg-slate-900/50 p-6 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              <h3 className="text-lg font-semibold text-slate-200">
                LeetCode Profile
              </h3>
            </div>
            <p className="mt-1 text-sm font-mono text-slate-400">
              Live statistics are temporarily rate-limited or unavailable.
            </p>
          </div>

          <a
            href={`https://leetcode.com/u/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-fit rounded-lg border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-xs font-mono text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 transition-colors flex items-center gap-1.5"
          >
            <span>View Profile @{username}</span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    );
  }

  const total = data.totalSolved > 0 ? data.totalSolved : 1;
  const easyPct = Math.round((data.easySolved / total) * 100);
  const medPct = Math.round((data.mediumSolved / total) * 100);
  const hardPct = Math.round((data.hardSolved / total) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-xl overflow-hidden"
    >
      <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />

      <div className="p-6 sm:p-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20">
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4 fill-amber-400"
                  aria-hidden="true"
                >
                  <path d="M16.102 17.93l-2.697 2.607c-.466.467-1.111.662-1.823.662s-1.357-.195-1.824-.662l-4.332-4.363c-.467-.467-.702-1.15-.702-1.863s.235-1.357.702-1.824l4.319-4.38c.467-.467 1.125-.645 1.837-.645s1.357.195 1.823.662l2.697 2.606c.514.515 1.365.497 1.9-.038.535-.536.553-1.387.039-1.901l-2.609-2.636a5.055 5.055 0 0 0-2.445-1.337l2.467-2.503c.513-.514.498-1.366-.037-1.901-.535-.535-1.387-.552-1.902-.038l-10.1 10.101c-.981.982-1.494 2.337-1.494 3.835 0 1.498.513 2.895 1.494 3.875l4.347 4.361c.981.979 2.337 1.452 3.834 1.452s2.853-.473 3.833-1.452l2.697-2.606c.514-.515.498-1.366-.038-1.901-.535-.535-1.387-.552-1.902-.038z" />
                </svg>
              </div>

              <h3 className="text-xl font-bold tracking-tight text-white">
                LeetCode Performance
              </h3>

              <a
                href={`https://leetcode.com/u/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded-md border border-blue-500/20 bg-blue-500/10 text-xs font-mono text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 transition-colors"
              >
                @{username} ↗
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-950/60 px-3 py-1 text-xs font-mono text-slate-300">
                <span className="text-slate-500">Rank:</span>{" "}
                <span className="text-white font-semibold">
                  #{data.ranking.toLocaleString()}
                </span>
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-mono text-orange-400">
                <span className="animate-pulse">🔥</span> {data.streak} Day Active Streak
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-950/60 px-3 py-1 text-xs font-mono text-slate-400">
                <span>Submissions:</span>{" "}
                <span className="text-slate-200">
                  {data.totalSubmissions.toLocaleString()}
                </span>
              </span>
            </div>
          </div>

          {/* Aggregate Problem Counts */}
          <div className="flex items-center gap-6 rounded-xl border border-white/5 bg-slate-950/50 p-4">
            <div className="text-center pr-2">
              <span className="block text-4xl font-extrabold text-white tracking-tight">
                {data.totalSolved}
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
                Total Solved
              </span>
            </div>

            <div className="h-10 w-px bg-white/10" />

            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs font-mono">
              <span className="text-emerald-400">Easy</span>
              <span className="text-right font-medium text-slate-200">
                {data.easySolved}
              </span>

              <span className="text-amber-400">Medium</span>
              <span className="text-right font-medium text-slate-200">
                {data.mediumSolved}
              </span>

              <span className="text-rose-400">Hard</span>
              <span className="text-right font-medium text-slate-200">
                {data.hardSolved}
              </span>
            </div>
          </div>
        </div>

        {/* Visual Progress Breakdown Bar */}
        <div className="mt-6 space-y-2">
          <div className="flex justify-between text-xs font-mono text-slate-400">
            <span>Difficulty Breakdown</span>
            <span>
              {easyPct}% Easy · {medPct}% Med · {hardPct}% Hard
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800/80 flex">
            <div
              style={{ width: `${easyPct}%` }}
              className="bg-emerald-400 transition-all duration-500"
              title={`Easy: ${data.easySolved}`}
            />
            <div
              style={{ width: `${medPct}%` }}
              className="bg-amber-400 transition-all duration-500"
              title={`Medium: ${data.mediumSolved}`}
            />
            <div
              style={{ width: `${hardPct}%` }}
              className="bg-rose-400 transition-all duration-500"
              title={`Hard: ${data.hardSolved}`}
            />
          </div>
        </div>

        {/* Badges & Languages */}
        <div className="mt-6 pt-5 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <h4 className="mb-3 text-[11px] font-mono uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
              <span>🏅</span> Achievements & Badges
            </h4>

            {data.badges.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {data.badges.map((badge, index) => (
                  <div
                    key={`${badge.name}-${index}`}
                    className="flex items-center gap-2 rounded-lg border border-white/10 bg-slate-950/60 px-3 py-1.5 text-xs font-mono text-slate-300"
                  >
                    <Image
                      src={
                        badge.icon.startsWith("http")
                          ? badge.icon
                          : `https://leetcode.com${badge.icon}`
                      }
                      alt={badge.name}
                      width={16}
                      height={16}
                      unoptimized
                      className="h-4 w-4 object-contain"
                    />
                    <span>{badge.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-fit rounded-lg border border-dashed border-white/10 bg-slate-950/30 px-3 py-1.5 text-xs font-mono text-slate-500">
                🏆 Multiple Contests & Milestones Active
              </div>
            )}
          </div>

          <div>
            <h4 className="mb-3 text-[11px] font-mono uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
              <span>⚡</span> Language Distribution
            </h4>

            {data.languages.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {data.languages.map((language, index) => (
                  <div
                    key={`${language.languageName}-${index}`}
                    className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-slate-950/60 px-2.5 py-1 text-xs font-mono text-slate-300 hover:border-blue-500/40 transition-colors"
                  >
                    <span className="text-blue-400 font-medium">
                      {language.languageName}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      ({language.problemsSolved})
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-xs font-mono text-slate-500">
                Java, Python, C, JavaScript
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// --- DESKTOP PORTFOLIO ---
function DesktopPortfolio() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [categoryFilter, setCategoryFilter] = useState<
    "all" | "ai" | "fullstack" | "mobile"
  >("all");

  const navItems = [
    { id: "hero", label: "Home" },
    { id: "about", label: "About" },
    { id: "leetcode", label: "LeetCode" },
    { id: "arsenal", label: "Arsenal" },
    { id: "projects", label: "Projects" },
    { id: "education", label: "Education" },
    { id: "contact", label: "Contact" },
  ] as const;

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;
      const sectionIds = ["hero", "about", "leetcode", "arsenal", "projects", "education", "contact"];

      let current = "hero";
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            current = id;
          }
        }
      }

      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 50
      ) {
        current = "contact";
      }

      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const filteredProjects =
    categoryFilter === "all"
      ? projects
      : projects.filter((p) => p.category === categoryFilter);

  const copyEmail = () => {
    navigator.clipboard.writeText(personalInfo.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <main className="relative min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-500/30 selection:text-blue-200">
      {/* Background Ambience */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-blue-600/15 via-indigo-600/5 to-transparent blur-[140px] rounded-full" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* Floating Top Header / Dock Taskbar */}
      <nav className="sticky top-4 z-50 mx-auto max-w-4xl px-4 transition-all">
        <div className="flex items-center justify-between rounded-full border border-white/10 bg-slate-900/80 px-4 py-2 backdrop-blur-xl shadow-2xl shadow-black/40">
          {/* Logo / Brand Button */}
          <button
            type="button"
            onClick={() => scrollTo("hero")}
            className="flex items-center gap-2 group text-left cursor-pointer shrink-0"
            aria-label="Scroll to top"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-blue-500/30 bg-blue-500/10 text-xs font-mono font-bold text-blue-400 group-hover:bg-blue-500/20 group-hover:border-blue-400 transition-all shadow-sm">
              MA
            </span>
            <span className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors hidden sm:inline-block">
              Madari Anirudh
            </span>
          </button>

          {/* Navigation Links with animated active pill */}
          <div className="flex items-center gap-1 font-mono text-xs">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollTo(item.id)}
                  className={`relative rounded-full px-3 py-1.5 transition-all text-xs cursor-pointer ${
                    isActive
                      ? "text-white font-medium shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeDesktopNav"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      className="absolute inset-0 rounded-full bg-blue-600/20 border border-blue-500/40"
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Actions (Copy Email & Resume) */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={copyEmail}
              className={`rounded-full border px-3 py-1 text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                copied
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                  : "border-white/10 bg-white/[0.04] text-slate-300 hover:border-white/20 hover:text-white"
              }`}
              title="Click to copy email address"
            >
              {copied ? (
                <>
                  <span className="text-emerald-400">✓</span> Copied!
                </>
              ) : (
                <>
                  <span>✉</span> Copy Email
                </>
              )}
            </button>
            <a
              href={personalInfo.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-blue-600 px-3.5 py-1 text-xs font-mono font-medium text-white hover:bg-blue-500 transition-colors shadow-sm"
            >
              Resume ↗
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 py-12 sm:px-12 lg:px-16">
        {/* HERO SECTION */}
        <motion.section
          id="hero"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="pb-16 pt-8 text-center sm:text-left scroll-mt-24"
        >
          {/* Status badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-mono text-blue-400 mb-6 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
            </span>
            Available for Software & AI Engineering Roles
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-white">
            {personalInfo.name}
          </h1>

          <p className="mt-3 text-base sm:text-lg font-mono text-blue-400 max-w-2xl">
            {personalInfo.headline}
          </p>

          <p className="mt-4 max-w-2xl text-base text-slate-300 leading-relaxed sm:text-lg">
            {personalInfo.shortBio}
          </p>

          {/* Primary Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center sm:justify-start gap-4 font-mono text-sm">
            <a
              href={personalInfo.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition-all duration-200 hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] active:scale-[0.98] flex items-center gap-2"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              View Resume
            </a>

            <button
              type="button"
              onClick={copyEmail}
              className="rounded-lg border border-white/10 bg-white/[0.04] px-5 py-2.5 font-medium text-slate-300 transition-all duration-200 hover:border-white/20 hover:bg-white/[0.08] hover:text-white flex items-center gap-2"
            >
              {copied ? (
                <>
                  <span className="text-emerald-400">✓</span> Copied Address!
                </>
              ) : (
                <>
                  <span>✉</span> Copy Email
                </>
              )}
            </button>

            <Link
              href={`mailto:${personalInfo.email}`}
              className="rounded-lg border border-white/5 bg-transparent px-4 py-2.5 font-medium text-slate-400 hover:text-white transition-colors"
            >
              Send Email →
            </Link>
          </div>

          {/* Social & Contact Links */}
          <div className="mt-8 flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-6 font-mono text-[13px] text-slate-400">
            <Link
              href={personalInfo.phoneHref}
              className="hover:text-blue-400 transition-colors flex items-center gap-1.5"
            >
              <span>📱</span> {personalInfo.phone}
            </Link>
            <span className="hidden sm:inline text-slate-700">|</span>
            <span className="text-slate-400 flex items-center gap-1">
              <span>📍</span> {personalInfo.location}
            </span>
            <span className="hidden sm:inline text-slate-700">|</span>
            <Link
              href={personalInfo.socials.github}
              target="_blank"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              GitHub ↗
            </Link>
            <span className="hidden sm:inline text-slate-700">|</span>
            <Link
              href={personalInfo.socials.linkedin}
              target="_blank"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              LinkedIn ↗
            </Link>
            <span className="hidden sm:inline text-slate-700">|</span>
            <Link
              href={personalInfo.socials.leetcode}
              target="_blank"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              LeetCode ↗
            </Link>
          </div>
        </motion.section>

        {/* ABOUT & ENGINEERING BIO SECTION */}
        <motion.section
          id="about"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeInUp}
          className="py-16 border-t border-slate-800/80 space-y-8 scroll-mt-24"
        >
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-widest text-blue-400">
                01 / Engineering Profile
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              About Me & Engineering Focus
            </h2>
            <p className="text-sm text-slate-400 font-mono">
              Academic background, system architecture focus, and technical philosophy
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Narrative Paragraphs (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <ProCard tilt={false} className="p-6 sm:p-7 space-y-4 text-slate-300 leading-relaxed text-sm sm:text-base">
                {personalInfo.aboutParagraphs.map((para, i) => (
                  <p key={i} className="text-slate-300 leading-relaxed">
                    {para}
                  </p>
                ))}

                <div className="pt-4 border-t border-white/5 flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400">
                  <span className="text-slate-500">Spoken Languages:</span>
                  {["English (Professional)", "Telugu (Native)", "Hindi (Fluent)"].map((lang) => (
                    <span
                      key={lang}
                      className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/5 text-slate-300"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </ProCard>
            </div>

            {/* Key Highlights & Fast Facts (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              {/* 4 Stat Highlights */}
              <div className="grid grid-cols-2 gap-3">
                {personalInfo.statsSummary.map((stat, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-white/10 bg-slate-900/50 p-4 backdrop-blur-md"
                  >
                    <span className="block text-2xl font-bold text-white tracking-tight">
                      {stat.value}
                    </span>
                    <span className="text-xs font-semibold text-blue-400 font-mono">
                      {stat.label}
                    </span>
                    <span className="block text-[11px] text-slate-500 mt-0.5">
                      {stat.detail}
                    </span>
                  </div>
                ))}
              </div>

              {/* Highlights List */}
              <ProCard tilt={false} className="p-5 space-y-3">
                <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 pb-2 border-b border-white/5 flex items-center justify-between">
                  <span>Quick Highlights</span>
                  <span className="text-blue-400 font-mono text-[11px]">Core Capabilities</span>
                </h3>
                <div className="space-y-3">
                  {personalInfo.keyHighlights.map((highlight, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs">
                      <span className="text-base select-none mt-0.5">{highlight.icon}</span>
                      <div>
                        <span className="font-mono text-slate-400 block text-[11px]">
                          {highlight.label}
                        </span>
                        <span className="text-slate-200 font-medium">
                          {highlight.value}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </ProCard>
            </div>
          </div>
        </motion.section>

        {/* LEETCODE SECTION */}
        <motion.section
          id="leetcode"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeInUp}
          className="py-12 border-t border-slate-800/80 scroll-mt-24"
        >
          <LeetCodeStats username={personalInfo.leetcodeUsername} />
        </motion.section>

        {/* TECHNICAL LOADOUT / SKILLS */}
        <motion.section
          id="arsenal"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeInUp}
          className="py-16 border-t border-slate-800/80 space-y-8 scroll-mt-24"
        >
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Technical Arsenal
            </h2>
            <p className="text-sm text-slate-400 font-mono">
              Core technologies, frameworks, runtime environments, and system proficiencies
            </p>
          </div>

          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 gap-5"
          >
            {skillCategories.map((category, index) => (
              <ProCard key={category.title} tilt={false} className="p-6 h-full flex flex-col justify-start">
                <h3 className="text-base font-semibold text-slate-200 border-b border-white/5 pb-3 mb-4 flex items-center justify-between">
                  <span>{category.title}</span>
                  <span className="text-xs font-mono text-blue-400/80">
                    0{index + 1}
                  </span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
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

        {/* FEATURED PROJECTS SECTION */}
        <motion.section
          id="projects"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeInUp}
          className="py-16 border-t border-slate-800/80 space-y-8 scroll-mt-24"
        >
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Featured Engineering
              </h2>
              <p className="text-sm text-slate-400 font-mono">
                Production builds, distributed architectures, and AI integrations
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-slate-900/60 p-1 font-mono text-xs">
              {(
                [
                  { id: "all", label: "All", count: projects.length },
                  { id: "ai", label: "AI & ML", count: projects.filter((p) => p.category === "ai").length },
                  { id: "fullstack", label: "Full-Stack", count: projects.filter((p) => p.category === "fullstack").length },
                  { id: "mobile", label: "Mobile", count: projects.filter((p) => p.category === "mobile").length },
                ] as const
              ).map((tab) => {
                const isSelected = categoryFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setCategoryFilter(tab.id)}
                    className={`relative rounded-lg px-3 py-1.5 transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? "text-white font-semibold"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {isSelected && (
                      <motion.span
                        layoutId="activeCategoryFilter"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        className="absolute inset-0 rounded-lg bg-blue-600 shadow-md shadow-blue-600/30"
                      />
                    )}
                    <span className="relative z-10">{tab.label}</span>
                    <span
                      className={`relative z-10 text-[10px] rounded-full px-1.5 py-0.2 ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-white/[0.06] text-slate-500"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <motion.div
            layout
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="h-full"
                >
                  <ProCard
                    className={`overflow-hidden flex flex-col group h-full transition-all ${
                      project.caseStudyUrl
                        ? "cursor-pointer hover:border-blue-500/50 hover:shadow-[0_0_35px_-5px_rgba(59,130,246,0.25)]"
                        : ""
                    }`}
                  >
                    <div
                      onClick={(e) => {
                        if (!project.caseStudyUrl) return;
                        const target = e.target as HTMLElement;
                        if (target.closest("a") || target.closest("button")) return;
                        router.push(project.caseStudyUrl);
                      }}
                      className="flex flex-col flex-grow h-full"
                    >
                      {/* Simulated terminal tab bar */}
                      {project.caseStudyUrl ? (
                        <Link
                          href={project.caseStudyUrl}
                          className="bg-slate-950/80 hover:bg-blue-950/40 px-4 py-2.5 border-b border-white/10 flex items-center justify-between transition-colors cursor-pointer group/tab"
                        >
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5">
                              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                              <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                            </div>
                            <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 flex items-center gap-1">
                              <span>tab:</span>
                              <span className="text-white font-semibold">{project.id}.page</span>
                            </span>
                          </div>
                          <span className="text-[11px] text-blue-400 group-hover/tab:text-blue-300 font-mono flex items-center gap-1">
                            <span>Open Page Tab</span>
                            <span className="text-xs">↗</span>
                          </span>
                        </Link>
                      ) : (
                        <div className="bg-slate-950/60 px-4 py-2.5 border-b border-white/5 flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-slate-700 group-hover:bg-red-500/70 transition-colors" />
                            <div className="w-2.5 h-2.5 rounded-full bg-slate-700 group-hover:bg-yellow-500/70 transition-colors" />
                            <div className="w-2.5 h-2.5 rounded-full bg-slate-700 group-hover:bg-green-500/70 transition-colors" />
                          </div>
                          <span className="text-[11px] text-slate-500 font-mono">
                            sys/{project.category}/0{index + 1}
                          </span>
                        </div>
                      )}

                      <div className="p-6 flex flex-col flex-grow justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-4 min-h-[32px]">
                            <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors duration-200">
                              {project.caseStudyUrl ? (
                                <Link
                                  href={project.caseStudyUrl}
                                  className="hover:underline flex items-center gap-1.5"
                                >
                                  <span>{project.title}</span>
                                  <span className="text-xs text-blue-400 font-mono">↗</span>
                                </Link>
                              ) : (
                                project.title
                              )}
                            </h3>
                            <div className="flex items-center gap-2 shrink-0">
                              {project.caseStudyUrl && (
                                <Link
                                  href={project.caseStudyUrl}
                                  className="rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-mono text-blue-300 hover:bg-blue-500/20 transition-colors"
                                >
                                  Tap to Open ↗
                                </Link>
                              )}
                              {project.live && project.live !== "#" && (
                                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-mono text-emerald-400">
                                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                  Live
                                </span>
                              )}
                            </div>
                          </div>

                          <p className="text-slate-400 mt-2 text-sm leading-relaxed min-h-[60px]">
                            {project.description}
                          </p>

                          <div className="flex flex-wrap gap-1.5 my-4 min-h-[32px] items-center">
                            {project.tech.map((tech) => (
                              <span
                                key={tech}
                                className="px-2 py-0.5 bg-blue-500/10 text-blue-300 border border-blue-500/20 text-[11px] font-mono rounded"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Multi-Module or Direct Link Action Area */}
                        <div className="mt-auto pt-4 border-t border-white/5 font-mono text-xs">
                          {project.modules ? (
                            <div className="flex flex-col gap-2">
                              {project.modules.map((mod) => (
                                <div
                                  key={mod.name}
                                  className="flex flex-col sm:flex-row sm:items-center justify-between bg-white/[0.02] px-3 py-2 rounded-lg border border-white/5 gap-2"
                                >
                                  <span className="text-slate-300 font-semibold text-xs">
                                    {mod.name}
                                  </span>
                                  <div className="flex items-center gap-3">
                                    {mod.github !== "#" && (
                                      <Link
                                        href={mod.github}
                                        target="_blank"
                                        onClick={(e) => e.stopPropagation()}
                                        className="text-slate-400 hover:text-white transition-colors"
                                      >
                                        Source ↗
                                      </Link>
                                    )}
                                    {mod.live !== "#" && (
                                      <Link
                                        href={mod.live}
                                        target="_blank"
                                        onClick={(e) => e.stopPropagation()}
                                        className="text-blue-400 hover:text-blue-300 transition-colors"
                                      >
                                        Demo ↗
                                      </Link>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="flex items-center gap-5">
                              {project.github && project.github !== "#" && (
                                <Link
                                  href={project.github}
                                  target="_blank"
                                  onClick={(e) => e.stopPropagation()}
                                  aria-label={`Source code for ${project.title}`}
                                  className="text-slate-400 hover:text-white transition-colors flex items-center gap-1"
                                >
                                  [ Source Code ]
                                </Link>
                              )}
                              {project.live && project.live !== "#" && (
                                <Link
                                  href={project.live}
                                  target="_blank"
                                  onClick={(e) => e.stopPropagation()}
                                  aria-label={`Live demo for ${project.title}`}
                                  className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                                >
                                  [ Live Demo ]
                                </Link>
                              )}
                            </div>
                          )}

                          {project.caseStudyUrl && (
                            <Link
                              href={project.caseStudyUrl}
                              className="mt-3 flex items-center justify-center gap-1.5 rounded-lg border border-blue-500/30 bg-blue-500/10 px-3.5 py-2 font-mono text-xs font-semibold text-blue-300 hover:bg-blue-500/20 hover:text-white transition-all w-full"
                            >
                              <span>Tap to Open Case Study, Architecture & AI Workflow</span>
                              <span aria-hidden="true">→</span>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </ProCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </motion.section>

        {/* EDUCATION SECTION */}
        <motion.section
          id="education"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeInUp}
          className="py-16 border-t border-slate-800/80 space-y-8 scroll-mt-24"
        >
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Academic Background
            </h2>
            <p className="text-sm text-slate-400 font-mono">
              Institutional credentials, foundational milestones, and coursework
            </p>
          </div>

          <motion.div variants={staggerContainer} className="space-y-4">
            {education.map((edu) => (
              <ProCard key={edu.institution} tilt={false} className="p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-100">
                      {edu.institution}
                    </h3>
                    <p className="text-slate-400 text-sm mt-0.5">
                      {edu.degree}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs font-mono text-blue-400">
                        {edu.details}
                      </span>
                      {edu.score && (
                        <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                          {edu.score}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="self-start text-xs font-mono text-slate-400 bg-white/[0.03] px-3 py-1 rounded border border-white/10">
                    {edu.duration}
                  </div>
                </div>
              </ProCard>
            ))}
          </motion.div>
        </motion.section>

        {/* CONTACT & GET IN TOUCH */}
        <motion.section
          id="contact"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeInUp}
          className="py-16 border-t border-slate-800/80 scroll-mt-24"
        >
          <div className="relative overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-b from-blue-950/30 to-slate-900/60 p-8 sm:p-12 text-center backdrop-blur-xl">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />

            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-mono text-blue-400">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400" /> Let&apos;s Connect
            </span>

            <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-white">
              Ready to engineer high-impact solutions.
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-slate-400 text-sm sm:text-base leading-relaxed">
              Whether you have an upcoming project, an engineering role, or an interesting architectural problem, my inbox is always open.
            </p>

            <div className="mt-8 flex flex-wrap justify-center items-center gap-4 font-mono text-sm">
              <Link
                href={`mailto:${personalInfo.email}`}
                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-all active:scale-[0.98]"
              >
                Send an Email ✉
              </Link>
              <button
                type="button"
                onClick={copyEmail}
                className="rounded-xl border border-white/10 bg-white/[0.05] px-6 py-3 font-semibold text-slate-200 hover:bg-white/[0.1] hover:text-white transition-all"
              >
                {copied ? "✓ Copied to Clipboard!" : "Copy Email Address"}
              </button>
            </div>
          </div>
        </motion.section>

        {/* FOOTER */}
        <footer className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-slate-500">
          <p>© {new Date().getFullYear()} {personalInfo.name}. Built with Next.js & Tailwind CSS.</p>
          <div className="flex items-center gap-4">
            <Link
              href={personalInfo.socials.github}
              target="_blank"
              className="hover:text-slate-300 transition-colors"
            >
              GitHub
            </Link>
            <span>·</span>
            <Link
              href={personalInfo.socials.linkedin}
              target="_blank"
              className="hover:text-slate-300 transition-colors"
            >
              LinkedIn
            </Link>
            <span>·</span>
            <Link
              href={personalInfo.socials.leetcode}
              target="_blank"
              className="hover:text-slate-300 transition-colors"
            >
              LeetCode
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}

// --- ROOT HOME PAGE ---
export default function Home() {
  return (
    <>
      {/* Mobile rendering for small viewport screens */}
      <div className="block md:hidden">
        <MobilePortfolio />
      </div>

      {/* Desktop rendering for tablet/laptop/desktop viewports */}
      <div className="hidden md:block">
        <DesktopPortfolio />
      </div>
    </>
  );
}
