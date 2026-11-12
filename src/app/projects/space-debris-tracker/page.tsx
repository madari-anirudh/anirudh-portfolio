"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SpaceDebrisTrackerSimple() {
  const [activeWorkflow, setActiveWorkflow] = useState<number>(1);

  const tools = [
    {
      name: "Three.js",
      role: "3D Globe & WebGL Graphics",
      spec: "WebGL / GLSL Shaders",
      desc: "Renders the interactive 3D Earth, rotating space particles, and orbital rings directly in the browser.",
      icon: "🌐",
      color: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    },
    {
      name: "Satellite.js",
      role: "Orbital Physics & Math Engine",
      spec: "SGP4 / Keplerian Math",
      desc: "Calculates the exact real-time 3D position (X, Y, Z) and speed of each satellite from orbital data.",
      icon: "⚡",
      color: "border-amber-500/30 bg-amber-500/10 text-amber-400",
    },
    {
      name: "React.js",
      role: "Frontend UI & Controls",
      spec: "React 19 / Reactive State",
      desc: "Powers the clean user interface, search filters, zoom controls, and interactive telemetry cards.",
      icon: "⚛️",
      color: "border-blue-500/30 bg-blue-500/10 text-blue-400",
    },
    {
      name: "Node.js & Express",
      role: "Backend Data Fetcher",
      spec: "CORS Proxy / REST API",
      desc: "Retrieves live satellite tracking records (TLE data) from CelesTrak and serves them to the frontend.",
      icon: "🚀",
      color: "border-purple-500/30 bg-purple-500/10 text-purple-400",
    },
    {
      name: "Vercel",
      role: "Cloud Deployment",
      spec: "Edge Network / CI/CD",
      desc: "Provides fast, global CDN hosting with automatic builds and instant live access.",
      icon: "☁️",
      color: "border-slate-500/30 bg-slate-500/10 text-slate-300",
    },
  ];

  const workflowSteps = [
    {
      step: 1,
      id: "fetch",
      title: "Fetch Satellite Data",
      subtitle: "Live CelesTrak Ingestion",
      icon: "📡",
      color: "border-blue-500/40 bg-blue-500/10 text-blue-400",
      stageBadge: "Stage 01: Ingestion",
      desc: "Our backend service queries CelesTrak orbital repositories to pull Two-Line Elements (TLEs). These contain raw orbital parameters like inclination, eccentricity, and mean anomaly for thousands of tracked objects.",
      properties: [
        {
          label: "Input Property",
          value: "Raw TLE Data (NORAD Catalog Sets)",
          desc: "Two 69-character lines encoding Keplerian ephemeris coordinates",
          icon: "📥",
        },
        {
          label: "Core Function",
          value: "axios.get('celestrak.org/NORAD/elements/')",
          desc: "Node.js proxy pulls live orbital files and bypasses browser CORS",
          icon: "⚙️",
        },
        {
          label: "Processing Operation",
          value: "Format Normalization & Caching",
          desc: "Parses satellite ID, launch year, and orbital epoch timestamps",
          icon: "🔄",
        },
        {
          label: "Output Property",
          value: "Array of SatRec Data Objects",
          desc: "Clean JSON structures ready for mathematical propagation",
          icon: "📤",
        },
      ],
      metrics: [
        { label: "Data Source", value: "CelesTrak NORAD" },
        { label: "Update Frequency", value: "Daily Ephemeris" },
        { label: "Payload Size", value: "~1.2 MB Cached" },
      ],
    },
    {
      step: 2,
      id: "calculate",
      title: "Calculate 3D Coordinates",
      subtitle: "SGP4 Real-Time Math",
      icon: "⚡",
      color: "border-amber-500/40 bg-amber-500/10 text-amber-400",
      stageBadge: "Stage 02: Physics Engine",
      desc: "Satellite.js runs the standard SGP4/SDP4 perturbation algorithm to project Keplerian elements forward in time to the exact current millisecond, converting them into 3D Cartesian coordinates around Earth.",
      properties: [
        {
          label: "Input Property",
          value: "SatRec Record + Current UTC Time",
          desc: "Target satellite object paired with Date.now() timestamp",
          icon: "📥",
        },
        {
          label: "Core Function",
          value: "satellite.propagate(satrec, new Date())",
          desc: "Evaluates standard SGP4 orbital equations per frame",
          icon: "⚙️",
        },
        {
          label: "Processing Operation",
          value: "ECI to ECEF Vector Transformation",
          desc: "Translates inertial frame into Greenwich Hour Angle (GHA) coordinates",
          icon: "🔄",
        },
        {
          label: "Output Property",
          value: "Scaled 3D Vector (X, Y, Z, Velocity)",
          desc: "Kilometer coordinates mapped to Three.js Earth radius scale",
          icon: "📤",
        },
      ],
      metrics: [
        { label: "Algorithm", value: "Simplified General Perturbations (SGP4)" },
        { label: "Compute Speed", value: "< 2.5ms / 1000 items" },
        { label: "Vector Precision", value: "± 1.0 km in LEO" },
      ],
    },
    {
      step: 3,
      id: "render",
      title: "Render on 3D Earth",
      subtitle: "60 FPS WebGL Scene",
      icon: "🌍",
      color: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
      stageBadge: "Stage 03: WebGL Engine",
      desc: "Three.js creates a WebGL scene containing a textured 3D Earth globe, solar lighting, orbital rings, and dynamic particle systems. Positions update dynamically each frame at a smooth 60 frames per second.",
      properties: [
        {
          label: "Input Property",
          value: "Array of (X, Y, Z) Vectors & Orbit Rings",
          desc: "Scaled points mapped around the 3D globe geometry",
          icon: "📥",
        },
        {
          label: "Core Function",
          value: "renderer.render(scene, camera)",
          desc: "Hardware-accelerated WebGL draw call executing at 60 FPS",
          icon: "⚙️",
        },
        {
          label: "Processing Operation",
          value: "Instanced GPU Buffer Updates",
          desc: "Colors points by debris classification (LEO, GEO, Debris)",
          icon: "🔄",
        },
        {
          label: "Output Property",
          value: "Interactive 3D WebGL Canvas",
          desc: "Rotatable, zoomable Earth scene displayed in the browser DOM",
          icon: "📤",
        },
      ],
      metrics: [
        { label: "Render Target", value: "Smooth 60 FPS" },
        { label: "Geometry", value: "Instanced Points & Textured Mesh" },
        { label: "Lighting", value: "Directional Solar Angle" },
      ],
    },
    {
      step: 4,
      id: "interact",
      title: "User Explores & Clicks",
      subtitle: "Interactive Telemetry HUD",
      icon: "🖱️",
      color: "border-purple-500/40 bg-purple-500/10 text-purple-400",
      stageBadge: "Stage 04: Interactivity",
      desc: "Users can rotate the globe, zoom in on orbital clusters, or tap on any satellite. A Three.js Raycaster detects the clicked object, queries its ephemeris data, and displays its live telemetry HUD.",
      properties: [
        {
          label: "Input Property",
          value: "Mouse Pointer / Touch Coordinate (X, Y)",
          desc: "User click or touch on the WebGL canvas viewport",
          icon: "📥",
        },
        {
          label: "Core Function",
          value: "raycaster.intersectObjects(debrisPoints)",
          desc: "Casts a mathematical ray from camera through screen pixels",
          icon: "⚙️",
        },
        {
          label: "Processing Operation",
          value: "Index Match & Ephemeris Lookup",
          desc: "Resolves particle index to satellite name, altitude & speed",
          icon: "🔄",
        },
        {
          label: "Output Property",
          value: "Live Telemetry Heads-Up Display (HUD)",
          desc: "Popup card showing real-time velocity (km/h), altitude, and NORAD ID",
          icon: "📤",
        },
      ],
      metrics: [
        { label: "Hit Detection", value: "Sub-pixel Raycaster" },
        { label: "Telemetry Latency", value: "< 16ms (Instant)" },
        { label: "Navigation", value: "Touch & OrbitControls" },
      ],
    },
  ];

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

      {/* Top Navbar */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 px-6 py-3.5 backdrop-blur-xl shadow-lg shadow-black/20">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-mono text-slate-300 hover:text-white transition-colors group"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-md border border-white/10 bg-white/[0.04] text-slate-400 group-hover:border-blue-500/30 group-hover:bg-blue-500/10 group-hover:text-blue-400 transition-all">
              ←
            </span>
            <span className="font-semibold text-slate-200 group-hover:text-white">Back to Portfolio</span>
          </Link>

          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="inline-flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live & Operational
            </span>
            <a
              href="https://space-debries-tracker.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-blue-600 px-3.5 py-1.5 font-medium text-white hover:bg-blue-500 transition-colors shadow shadow-blue-600/30"
            >
              Launch Live App ↗
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 py-12 sm:px-12 space-y-16">
        
        {/* HERO: PROJECT OVERVIEW */}
        <section className="text-center sm:text-left space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-mono text-blue-400">
            <span>🛰️</span> Real-Time 3D Orbital Visualization
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            Space Debris Tracker
          </h1>

          <p className="max-w-2xl text-base sm:text-lg text-slate-300 leading-relaxed">
            A high-performance 3D web platform tracking active satellites and hazardous space junk orbiting Earth in real time — right in your browser.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 font-mono text-xs">
            <a
              href="https://space-debries-tracker.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-all flex items-center gap-2"
            >
              <span>🌐</span> Open Live 3D Simulation ↗
            </a>

            <a
              href="https://github.com/madari-anirudh/Space_Debries_Tracker"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 font-semibold text-slate-200 hover:bg-white/[0.08] hover:text-white transition-all flex items-center gap-2"
            >
              <span>💻</span> View Source Code on GitHub ↗
            </a>
          </div>
        </section>

        {/* SECTION 1: THE MOTIVE & GOAL */}
        <section className="space-y-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-blue-400">
              01 / The Goal
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              Why We Built This
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Box 1 */}
            <div className="h-full flex flex-col justify-between rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6 space-y-4">
              <div className="space-y-3">
                <span className="text-3xl block">⚠️</span>
                <h3 className="text-lg font-bold text-white">The Problem</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Earth&apos;s orbit is cluttered with over <strong>36,000 pieces of space junk</strong> flying at <strong>28,000 km/h</strong> (Mach 23). Even a 1cm fragment carries enough kinetic energy to destroy a critical satellite.
                </p>
              </div>
              <div className="pt-2 border-t border-rose-500/10">
                <span className="inline-block text-[10px] font-mono uppercase tracking-wider text-rose-400">
                  Critical Orbital Risk
                </span>
              </div>
            </div>

            {/* Box 2 */}
            <div className="h-full flex flex-col justify-between rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6 space-y-4">
              <div className="space-y-3">
                <span className="text-3xl block">🎯</span>
                <h3 className="text-lg font-bold text-white">Our Goal</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Make orbital situational awareness <strong>open and accessible</strong>. Anyone with a web browser should be able to view, understand, and inspect space debris in 3D without installing heavy desktop software.
                </p>
              </div>
              <div className="pt-2 border-t border-blue-500/10">
                <span className="inline-block text-[10px] font-mono uppercase tracking-wider text-blue-400">
                  Zero-Barrier Web 3D
                </span>
              </div>
            </div>

            {/* Box 3 */}
            <div className="h-full flex flex-col justify-between rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-4">
              <div className="space-y-3">
                <span className="text-3xl block">💡</span>
                <h3 className="text-lg font-bold text-white">What We Built</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  A lightweight 3D web platform running at a solid <strong>60 FPS</strong>. Users can spin Earth, zoom in, and tap any satellite to inspect its live speed, altitude, and NORAD catalog ID in real time.
                </p>
              </div>
              <div className="pt-2 border-t border-emerald-500/10">
                <span className="inline-block text-[10px] font-mono uppercase tracking-wider text-emerald-400">
                  60 FPS WebGL Engine
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: THE TOOLS WE USED */}
        <section className="space-y-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-blue-400">
              02 / The Toolkit
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              Tools & Technologies Used
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-mono mt-1">
              The 5 essential building blocks behind the platform
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((tool) => (
              <div
                key={tool.name}
                className="h-full flex flex-col justify-between rounded-xl border border-white/10 bg-slate-900/50 p-5 space-y-3 backdrop-blur-md hover:border-blue-500/40 hover:bg-slate-900/80 transition-all shadow-sm"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{tool.icon}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${tool.color}`}>
                      {tool.name}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white pt-1">
                    {tool.role}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {tool.desc}
                  </p>
                </div>
                <div className="pt-2 border-t border-white/5">
                  <span className="text-[10px] font-mono text-slate-500">
                    {tool.spec}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3: SYSTEM ARCHITECTURE (CONNECTED 4-BOX FLOW) */}
        <section className="space-y-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-blue-400">
              03 / System Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              How the System Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-mono mt-1">
              Click any stage box below to inspect its live engineering function and properties
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl">
            {/* Visual 4-Box Connected Flow */}
            <div className="flex flex-col md:flex-row items-stretch justify-between gap-3">
              
              {/* Box 1 */}
              <button
                type="button"
                onClick={() => setActiveWorkflow(1)}
                className={`w-full md:flex-1 min-h-[185px] flex flex-col justify-between rounded-xl border p-5 text-center space-y-3 transition-all cursor-pointer ${
                  activeWorkflow === 1
                    ? "border-blue-500 bg-blue-500/20 ring-2 ring-blue-500/50 shadow-lg shadow-blue-500/20"
                    : "border-blue-500/30 bg-blue-500/10 hover:border-blue-500/60 hover:bg-blue-500/15"
                }`}
              >
                <div className="space-y-2">
                  <span className="text-3xl block">📡</span>
                  <span className="text-[10px] font-mono text-blue-400 font-bold block">STAGE 1</span>
                  <h3 className="text-sm font-bold text-white">Live Data Source</h3>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    CelesTrak satellite database feeds current orbital parameters.
                  </p>
                </div>
                <div className="pt-2 border-t border-blue-500/20">
                  <span className={`inline-block text-[9px] font-mono px-2 py-0.5 rounded ${
                    activeWorkflow === 1
                      ? "bg-blue-500 text-white font-bold"
                      : "text-blue-300 bg-blue-500/20"
                  }`}>
                    {activeWorkflow === 1 ? "● Active View" : "Click to Inspect"}
                  </span>
                </div>
              </button>

              {/* Arrow */}
              <div className="hidden md:flex items-center justify-center text-slate-500 text-lg font-mono px-1 select-none">→</div>
              <div className="flex md:hidden justify-center text-slate-500 text-lg font-mono py-1 select-none">↓</div>

              {/* Box 2 */}
              <button
                type="button"
                onClick={() => setActiveWorkflow(2)}
                className={`w-full md:flex-1 min-h-[185px] flex flex-col justify-between rounded-xl border p-5 text-center space-y-3 transition-all cursor-pointer ${
                  activeWorkflow === 2
                    ? "border-amber-500 bg-amber-500/20 ring-2 ring-amber-500/50 shadow-lg shadow-amber-500/20"
                    : "border-amber-500/30 bg-amber-500/10 hover:border-amber-500/60 hover:bg-amber-500/15"
                }`}
              >
                <div className="space-y-2">
                  <span className="text-3xl block">⚡</span>
                  <span className="text-[10px] font-mono text-amber-400 font-bold block">STAGE 2</span>
                  <h3 className="text-sm font-bold text-white">Physics Math</h3>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Satellite.js calculates exact 3D coordinates (X, Y, Z) per frame.
                  </p>
                </div>
                <div className="pt-2 border-t border-amber-500/20">
                  <span className={`inline-block text-[9px] font-mono px-2 py-0.5 rounded ${
                    activeWorkflow === 2
                      ? "bg-amber-500 text-white font-bold"
                      : "text-amber-300 bg-amber-500/20"
                  }`}>
                    {activeWorkflow === 2 ? "● Active View" : "Click to Inspect"}
                  </span>
                </div>
              </button>

              {/* Arrow */}
              <div className="hidden md:flex items-center justify-center text-slate-500 text-lg font-mono px-1 select-none">→</div>
              <div className="flex md:hidden justify-center text-slate-500 text-lg font-mono py-1 select-none">↓</div>

              {/* Box 3 */}
              <button
                type="button"
                onClick={() => setActiveWorkflow(3)}
                className={`w-full md:flex-1 min-h-[185px] flex flex-col justify-between rounded-xl border p-5 text-center space-y-3 transition-all cursor-pointer ${
                  activeWorkflow === 3
                    ? "border-emerald-500 bg-emerald-500/20 ring-2 ring-emerald-500/50 shadow-lg shadow-emerald-500/20"
                    : "border-emerald-500/30 bg-emerald-500/10 hover:border-emerald-500/60 hover:bg-emerald-500/15"
                }`}
              >
                <div className="space-y-2">
                  <span className="text-3xl block">🌍</span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold block">STAGE 3</span>
                  <h3 className="text-sm font-bold text-white">3D WebGL Engine</h3>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Three.js renders the 3D rotating Earth and colored satellite dots.
                  </p>
                </div>
                <div className="pt-2 border-t border-emerald-500/20">
                  <span className={`inline-block text-[9px] font-mono px-2 py-0.5 rounded ${
                    activeWorkflow === 3
                      ? "bg-emerald-500 text-white font-bold"
                      : "text-emerald-300 bg-emerald-500/20"
                  }`}>
                    {activeWorkflow === 3 ? "● Active View" : "Click to Inspect"}
                  </span>
                </div>
              </button>

              {/* Arrow */}
              <div className="hidden md:flex items-center justify-center text-slate-500 text-lg font-mono px-1 select-none">→</div>
              <div className="flex md:hidden justify-center text-slate-500 text-lg font-mono py-1 select-none">↓</div>

              {/* Box 4 */}
              <button
                type="button"
                onClick={() => setActiveWorkflow(4)}
                className={`w-full md:flex-1 min-h-[185px] flex flex-col justify-between rounded-xl border p-5 text-center space-y-3 transition-all cursor-pointer ${
                  activeWorkflow === 4
                    ? "border-purple-500 bg-purple-500/20 ring-2 ring-purple-500/50 shadow-lg shadow-purple-500/20"
                    : "border-purple-500/30 bg-purple-500/10 hover:border-purple-500/60 hover:bg-purple-500/15"
                }`}
              >
                <div className="space-y-2">
                  <span className="text-3xl block">🖱️</span>
                  <span className="text-[10px] font-mono text-purple-400 font-bold block">STAGE 4</span>
                  <h3 className="text-sm font-bold text-white">Interactive Screen</h3>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    User spins the globe, zooms in, and clicks satellites for live stats.
                  </p>
                </div>
                <div className="pt-2 border-t border-purple-500/20">
                  <span className={`inline-block text-[9px] font-mono px-2 py-0.5 rounded ${
                    activeWorkflow === 4
                      ? "bg-purple-500 text-white font-bold"
                      : "text-purple-300 bg-purple-500/20"
                  }`}>
                    {activeWorkflow === 4 ? "● Active View" : "Click to Inspect"}
                  </span>
                </div>
              </button>

            </div>
          </div>
        </section>

        {/* SECTION 4: STEP-BY-STEP WORKFLOW WITH PROPERTIES & FUNCTIONS */}
        <section className="space-y-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-blue-400">
              04 / Engineering Workflow & Properties
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              How We Engineered It
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-mono mt-1">
              Select a stage below to inspect its exact inputs, core functions, and output properties
            </p>
          </div>

          {/* Stepper Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
            {workflowSteps.map((item) => {
              const isSelected = activeWorkflow === item.step;
              return (
                <button
                  key={item.step}
                  type="button"
                  onClick={() => setActiveWorkflow(item.step)}
                  className={`relative p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 min-h-[110px] ${
                    isSelected
                      ? "border-blue-500 bg-blue-500/20 text-white font-bold shadow-lg shadow-blue-500/20 ring-1 ring-blue-500/50"
                      : "border-white/10 bg-slate-900/50 text-slate-400 hover:text-white hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-2xl">{item.icon}</span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        isSelected
                          ? "bg-blue-500/30 text-blue-300 font-bold"
                          : "text-slate-500 bg-white/[0.04]"
                      }`}
                    >
                      Step 0{item.step}
                    </span>
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-white">{item.title}</div>
                    <div className="text-[10px] sm:text-[11px] text-slate-400 font-normal mt-0.5">{item.subtitle}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Step Details & Properties (Animated Switching) */}
          <AnimatePresence mode="wait">
            {(() => {
              const current = workflowSteps.find((s) => s.step === activeWorkflow) || workflowSteps[0];
              return (
                <motion.div
                  key={current.step}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-2xl border border-blue-500/30 bg-slate-900/70 p-6 sm:p-8 space-y-6 backdrop-blur-xl shadow-xl"
                >
                  {/* Step Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-5">
                    <div className="flex items-center gap-3.5">
                      <span className="text-4xl p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
                        {current.icon}
                      </span>
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 block">
                          Step 0{current.step} of 04 · {current.subtitle}
                        </span>
                        <h3 className="text-xl sm:text-2xl font-bold text-white">
                          {current.title}
                        </h3>
                      </div>
                    </div>

                    <span className="w-fit rounded-lg border border-blue-500/30 bg-blue-500/15 px-3 py-1 text-xs font-mono text-blue-300 font-semibold shadow-sm">
                      {current.stageBadge}
                    </span>
                  </div>

                  {/* High-level Description */}
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {current.desc}
                  </p>

                  {/* 4 Properties & Functions Sub-Boxes Grid */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between">
                      <span>Engineered Properties & Execution Logic:</span>
                      <span className="text-[10px] text-blue-400">Step 0{current.step} Breakdown</span>
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {current.properties.map((prop, idx) => (
                        <div
                          key={idx}
                          className="min-h-[145px] flex flex-col justify-between rounded-xl border border-white/10 bg-slate-950/70 p-4.5 space-y-2.5 hover:border-blue-500/30 transition-all"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-base select-none">{prop.icon}</span>
                              <span className="text-[11px] font-mono text-blue-400 font-semibold uppercase tracking-wider">
                                {prop.label}
                              </span>
                            </div>
                            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-slate-400">
                              Prop #{idx + 1}
                            </span>
                          </div>

                          <div className="font-mono text-xs font-semibold text-emerald-400 bg-black/40 px-3 py-2 rounded-lg border border-white/5 break-all select-all flex items-center justify-between gap-2">
                            <span>{prop.value}</span>
                            <span className="text-[9px] text-slate-500 font-mono select-none">CODE</span>
                          </div>

                          <p className="text-xs text-slate-300 leading-relaxed">
                            {prop.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Metrics Bar */}
                  <div className="pt-4 border-t border-white/10">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {current.metrics.map((metric, i) => (
                        <div
                          key={i}
                          className="min-h-[72px] flex flex-col justify-center items-center rounded-xl border border-white/5 bg-white/[0.02] p-3 text-center space-y-1"
                        >
                          <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-400">
                            {metric.label}
                          </span>
                          <span className="block text-sm font-bold font-mono text-emerald-400">
                            {metric.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })()}
          </AnimatePresence>
        </section>

        {/* SECTION 5: LIVE TEST CTA */}
        <section className="rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-950/40 via-slate-900/60 to-blue-950/40 p-8 text-center backdrop-blur-xl space-y-4 shadow-xl">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-mono text-blue-400">
            Ready to Try
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Experience the Live 3D Tracker
          </h2>
          <p className="mx-auto max-w-xl text-slate-400 text-xs sm:text-sm leading-relaxed">
            Rotate the Earth, zoom in, and tap any satellite to inspect its live speed and altitude in real time.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4 font-mono text-xs">
            <a
              href="https://space-debries-tracker.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-all"
            >
              Launch Live App ↗
            </a>
            <a
              href="https://github.com/madari-anirudh/Space_Debries_Tracker"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-white/10 bg-white/[0.05] px-6 py-3 font-semibold text-slate-200 hover:bg-white/[0.1] hover:text-white transition-all"
            >
              View GitHub Repo ↗
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-slate-500">
          <p>© 2026 Madari Anirudh · Space Debris Tracker</p>
          <Link href="/" className="hover:text-white transition-colors">
            Return to Portfolio Home →
          </Link>
        </footer>
      </div>
    </main>
  );
}
