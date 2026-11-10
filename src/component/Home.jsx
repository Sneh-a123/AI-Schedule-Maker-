import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Brain,
  Sparkles,
  Zap,
  Clock,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Target,
  Smile,
  ShieldCheck,
  TrendingUp,
  Award,
  ArrowRight,
  BookOpen,
  Briefcase,
  Dumbbell,
  Coffee,
  Moon,
  Sun,
  Flame,
  Wand2,
  Sliders,
  Play
} from "lucide-react";
import Spline from "@splinetool/react-spline";
import { PERSONA_PRESETS, parseNaturalLanguagePrompt, generateSmartSchedule } from "../utils/aiScheduler";

export default function Home() {
  const navigate = useNavigate();
  const [selectedPersonaId, setSelectedPersonaId] = useState("student");
  const [customPrompt, setCustomPrompt] = useState("");
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [quickSchedulePreview, setQuickSchedulePreview] = useState(() => {
    return generateSmartSchedule(PERSONA_PRESETS[0].defaults);
  });
  const [isGenerating, setIsGenerating] = useState(false);

  // Handle fast generation from persona chip
  const handleSelectPersona = (persona) => {
    setSelectedPersonaId(persona.id);
    setIsGenerating(true);
    setTimeout(() => {
      const result = generateSmartSchedule({
        ...persona.defaults,
        persona: persona.id
      });
      setQuickSchedulePreview(result);
      setIsGenerating(false);
    }, 350);
  };

  // Handle natural language generation
  const handleGenerateFromPrompt = (e) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      const parsed = parseNaturalLanguagePrompt(customPrompt);
      const result = generateSmartSchedule(parsed);
      setQuickSchedulePreview(result);
      setIsGenerating(false);
    }, 400);
  };

  // Navigate to full schedule with current preview state
  const handleOpenInStudio = () => {
    const currentPersona = PERSONA_PRESETS.find(p => p.id === selectedPersonaId) || PERSONA_PRESETS[0];
    const stateToPass = customPrompt
      ? parseNaturalLanguagePrompt(customPrompt)
      : currentPersona.defaults;
    navigate("/study-schedule", { state: stateToPass });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden">
      {/* 🔮 Background Glow Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-cyan-600/15 rounded-full blur-[140px] animate-pulse-glow" />
        <div className="absolute top-[35%] -left-40 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px]" />
        <div className="absolute top-[60%] -right-40 w-[650px] h-[650px] bg-purple-600/15 rounded-full blur-[160px]" />
      </div>

      {/* 🔵 NAVBAR */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <div className="relative p-2 rounded-xl bg-linear-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25">
              <Brain className="w-6 h-6 text-white" />
              <Sparkles className="w-3 h-3 text-cyan-200 absolute top-1 right-1 animate-ping" />
            </div>
            <div>
              <span className="text-xl font-bold bg-linear-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
                AdaptiveOps <span className="text-cyan-400 font-extrabold text-xs tracking-wider uppercase px-2 py-0.5 rounded-full bg-cyan-950/70 border border-cyan-800/80 ml-1">AI</span>
              </span>
              <p className="text-[10px] text-slate-400 font-medium tracking-tight">Smart Routine & Schedule Engine</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#how-it-works" className="hover:text-cyan-400 transition-colors">How AI Works</a>
            <a href="#personas" className="hover:text-cyan-400 transition-colors">For Who</a>
            <a href="#live-demo" className="hover:text-cyan-400 transition-colors">Live Generator</a>
            <a href="#features" className="hover:text-cyan-400 transition-colors">Features</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/questions")}
              className="px-5 py-2.5 rounded-full text-sm font-semibold bg-linear-to-r from-cyan-500 via-blue-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 flex items-center gap-2"
            >
              <Wand2 className="w-4 h-4" />
              <span>Create Schedule</span>
            </button>
          </div>
        </div>
      </header>

      {/* 🚀 HERO SECTION */}
      <section className="relative z-10 min-h-[92vh] flex items-center justify-center pt-8 pb-20 px-6">
        {/* Background 3D Spline Canvas (With Graceful Fallback) */}
        <div className={`absolute inset-0 z-0 mix-blend-screen pointer-events-none overflow-hidden transition-opacity duration-700 ${splineLoaded ? "opacity-40" : "opacity-20"}`}>
          <Spline
            scene="https://prod.spline.design/duvnyPiYtAEEpfvu/scene.splinecode"
            onLoad={() => setSplineLoaded(true)}
          />
        </div>

        {/* Ambient Grid Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-6 shadow-md shadow-cyan-950/50 backdrop-blur-md animate-float">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Powered Daily Schedule & Routine Generator</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.12]">
            AI That Learns About You & <br className="hidden sm:inline" />
            <span className="bg-linear-to-r from-cyan-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
              Builds Your Perfect Schedule
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-slate-300 text-base sm:text-xl max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
            Share a few key details about your wake time, sleep schedule, work or college commitments, and priorities.
            Our intelligent AI builds a <span className="text-cyan-300 font-semibold">100% personalized, stress-free daily routine</span> synchronized with your natural energy levels.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={() => navigate("/questions")}
              className="w-full sm:w-auto px-8 py-4 rounded-full font-bold text-base bg-linear-to-r from-cyan-500 via-blue-500 to-indigo-600 text-white shadow-xl shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 group"
            >
              <Zap className="w-5 h-5 text-cyan-200 group-hover:rotate-12 transition-transform" />
              <span>Start Smart AI Wizard (2 Mins)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <a
              href="#live-demo"
              className="w-full sm:w-auto px-8 py-4 rounded-full font-semibold text-base bg-slate-900/80 hover:bg-slate-800/90 text-slate-200 border border-slate-700/80 shadow-lg hover:border-cyan-500/40 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-md"
            >
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>Instant AI Generator (Try Below)</span>
            </a>
          </div>

          {/* 🌟 Floating Live Schedule Preview Mockup */}
          <div className="relative max-w-4xl mx-auto text-left">
            <div className="absolute -inset-1 bg-linear-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-75" />
            <div className="relative bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
              {/* Window Header */}
              <div className="flex items-center justify-between pb-5 border-b border-slate-800 mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 ml-2">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    AI Adaptive Timetable — Live Preview
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-950/80 border border-cyan-800 text-cyan-300">
                    96% Balance Score ⚡
                  </span>
                </div>
              </div>

              {/* Sample Timetable Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-800/60 border border-cyan-500/20 hover:border-cyan-500/50 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">06:30 AM - 07:15 AM</span>
                    <Sun className="w-4 h-4 text-amber-400" />
                  </div>
                  <h4 className="font-semibold text-white text-sm mb-1">Morning Energizer & Prep</h4>
                  <p className="text-xs text-slate-400">Sunlight, hydration, quick posture stretch & planning.</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/80 border border-blue-500/30 hover:border-blue-500/60 transition-all relative overflow-hidden">
                  <div className="absolute top-0 right-0 px-2 py-0.5 bg-blue-500 text-[10px] font-bold text-white rounded-bl-lg">
                    PEAK FOCUS
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">08:00 AM - 10:30 AM</span>
                    <Zap className="w-4 h-4 text-cyan-300" />
                  </div>
                  <h4 className="font-semibold text-white text-sm mb-1">Deep Work / High Priority Subject</h4>
                  <p className="text-xs text-slate-400">Zero distractions, Pomodoro flow, maximum retention.</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/60 border border-emerald-500/20 hover:border-emerald-500/50 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">05:30 PM - 06:15 PM</span>
                    <Dumbbell className="w-4 h-4 text-emerald-400" />
                  </div>
                  <h4 className="font-semibold text-white text-sm mb-1">Workout & Endorphin Boost</h4>
                  <p className="text-xs text-slate-400">Fitness, cardio, or outdoor walk for mental reset.</p>
                </div>
              </div>

              {/* Bottom Quick Bar */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Deep Work: <strong>5.5 hrs</strong>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Moon className="w-4 h-4 text-purple-400" />
                    Sleep: <strong>7.5 hrs</strong>
                  </span>
                  <span className="flex items-center gap-1.5 hidden sm:flex">
                    <Coffee className="w-4 h-4 text-amber-400" />
                    Anti-Burnout Breaks: <strong>Auto-scheduled</strong>
                  </span>
                </div>
                <button
                  onClick={() => navigate("/questions")}
                  className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 text-xs"
                >
                  Generate yours now <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ⚡ INTERACTIVE ON-PAGE AI QUICK GENERATOR */}
      <section id="live-demo" className="relative z-10 py-20 px-6 bg-slate-900/50 border-y border-slate-800/60">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/70 text-cyan-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Live Interactive AI Generator
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Select Your Profile Or Describe Your Routine
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
              Try it instantly! Select a persona preset below or describe your daily routine in natural English.
              Watch our AI build your optimized schedule in real time.
            </p>
          </div>

          {/* Persona Selection Chips */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            {PERSONA_PRESETS.map((persona) => {
              const isSelected = selectedPersonaId === persona.id && !customPrompt;
              return (
                <button
                  key={persona.id}
                  onClick={() => {
                    setCustomPrompt("");
                    handleSelectPersona(persona);
                  }}
                  className={`px-5 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 border ${
                    isSelected
                      ? "bg-linear-to-r from-cyan-500 to-blue-600 text-white border-cyan-400 shadow-lg shadow-cyan-500/25 scale-105"
                      : "bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white"
                  }`}
                >
                  <span>{persona.name}</span>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full ${isSelected ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"}`}>
                    {persona.badge.split(" ")[0]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Natural Language Prompt Box */}
          <div className="max-w-3xl mx-auto mb-10">
            <form onSubmit={handleGenerateFromPrompt} className="relative">
              <div className="flex flex-col sm:flex-row items-stretch gap-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-2 shadow-2xl focus-within:border-cyan-500/60 transition-all">
                <input
                  type="text"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="e.g. Wake up at 6:30 AM, college from 9 AM to 3 PM, focus on physics & coding, sleep at 11:00 PM"
                  className="flex-1 bg-transparent px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="px-6 py-3 rounded-xl bg-linear-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold shadow-md shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  {isGenerating ? (
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 animate-spin" />
                      Analyzing...
                    </span>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4" />
                      <span>Generate AI Schedule</span>
                    </>
                  )}
                </button>
              </div>
            </form>
            <div className="flex items-center justify-between text-xs text-slate-500 mt-2 px-2">
              <span>💡 Tip: Describe your day in plain English or click a sample preset.</span>
              <button
                onClick={() => {
                  setCustomPrompt("Wake up at 6:00 AM, office 10am-6pm, want 45m gym in evening, need 1 hr coding before 11:30 PM sleep");
                  const parsed = parseNaturalLanguagePrompt("Wake up at 6:00 AM, office 10am-6pm, want 45m gym in evening, need 1 hr coding before 11:30 PM sleep");
                  setQuickSchedulePreview(generateSmartSchedule(parsed));
                }}
                className="text-cyan-400 hover:underline"
              >
                Use sample prompt
              </button>
            </div>
          </div>

          {/* Real-time Generated Timetable Display */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
            {/* Header / Stats */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Generated Routine</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  Personalized 24-Hour Adaptive Blueprint
                </h3>
              </div>

              {/* Analytics Badges */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs">
                  <span className="text-slate-400">Focus Time:</span>{" "}
                  <strong className="text-cyan-400">{quickSchedulePreview.analytics.deepWorkHours} hrs</strong>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs">
                  <span className="text-slate-400">Sleep:</span>{" "}
                  <strong className="text-purple-400">{quickSchedulePreview.analytics.sleepHours} hrs</strong>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs">
                  <span className="text-slate-400">Wellness:</span>{" "}
                  <strong className="text-emerald-400">{quickSchedulePreview.analytics.healthHours} hrs</strong>
                </div>
                <button
                  onClick={handleOpenInStudio}
                  className="px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <span>Edit in Full Studio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* AI Coaching Tips */}
            <div className="my-6 p-4 rounded-2xl bg-cyan-950/30 border border-cyan-800/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-cyan-200">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>
                  <strong>AI Smart Insight:</strong> {quickSchedulePreview.tips[0]}
                </span>
              </div>
              <span className="text-[11px] text-cyan-400 font-semibold uppercase tracking-wider shrink-0">
                Cognitive Flow Optimized
              </span>
            </div>

            {/* Timetable Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickSchedulePreview.schedule.map((item, idx) => {
                let badgeColor = "bg-slate-800 text-slate-300 border-slate-700";
                let borderColor = "border-slate-800";

                if (item.isLocked || item.badge === "Event" || item.badge === "Commitment") {
                  badgeColor = "bg-amber-950/80 text-amber-300 border-amber-600 font-bold";
                  borderColor = "border-amber-500/50 hover:border-amber-400/60 bg-amber-950/20";
                } else if (item.category === "deep_work") {
                  badgeColor = "bg-blue-950/80 text-blue-300 border-blue-800";
                  borderColor = "border-blue-900/50 hover:border-blue-500/50";
                } else if (item.category === "health") {
                  badgeColor = "bg-emerald-950/80 text-emerald-300 border-emerald-800";
                  borderColor = "border-emerald-900/50 hover:border-emerald-500/50";
                } else if (item.category === "break") {
                  badgeColor = "bg-amber-950/80 text-amber-300 border-amber-800";
                  borderColor = "border-amber-900/50 hover:border-amber-500/50";
                } else if (item.category === "sleep") {
                  badgeColor = "bg-purple-950/80 text-purple-300 border-purple-800";
                  borderColor = "border-purple-900/50 hover:border-purple-500/50";
                }

                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl bg-slate-800/40 border ${borderColor} hover:bg-slate-800/70 transition-all flex flex-col justify-between`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-300">{item.time}</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${badgeColor}`}>
                          {item.badge}
                        </span>
                      </div>
                      <h4 className="font-semibold text-white text-sm mb-1">{item.title}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Callout */}
            <div className="mt-8 text-center pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-slate-400">
                Want to tweak timings, add subjects, or export to PDF & Calendar?
              </p>
              <button
                onClick={handleOpenInStudio}
                className="px-6 py-3 rounded-full text-xs font-bold bg-linear-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all flex items-center gap-2"
              >
                <span>Customize & Export Full Schedule</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 🧭 HOW IT WORKS (3 Simple Steps) */}
      <section id="how-it-works" className="py-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/70 text-cyan-300 text-xs font-semibold mb-3">
              <Brain className="w-3.5 h-3.5" />
              How AI Understands You
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
              From Your Habits to an Optimized Day
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-base">
              No need to spend hours drafting complex schedules. Our AI analyzes your routine in 3 intuitive steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative p-8 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
                <Clock className="w-7 h-7" />
              </div>
              <span className="text-xs font-extrabold text-cyan-400 tracking-widest uppercase">Step 01</span>
              <h3 className="text-xl font-bold text-white mt-1 mb-3">Share Daily Anchors</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Tell us when you wake up, your sleep target, and your fixed commitments (college, school, office, or free day).
              </p>
            </div>

            <div className="relative p-8 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/40 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                <Target className="w-7 h-7" />
              </div>
              <span className="text-xs font-extrabold text-blue-400 tracking-widest uppercase">Step 02</span>
              <h3 className="text-xl font-bold text-white mt-1 mb-3">Define Focus & Rhythm</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Choose your difficult subjects, workout goals, and whether you focus best in the morning, afternoon, or evening.
              </p>
            </div>

            <div className="relative p-8 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                <Sparkles className="w-7 h-7" />
              </div>
              <span className="text-xs font-extrabold text-indigo-400 tracking-widest uppercase">Step 03</span>
              <h3 className="text-xl font-bold text-white mt-1 mb-3">Adaptive Schedule Ready</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Get a balanced, scientifically paced timetable with micro-breaks, Pomodoro focus windows, and printable export.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 👥 WHO IS THIS FOR? (Personas) */}
      <section id="personas" className="py-20 px-6 bg-slate-900/30 border-t border-slate-800/80 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Designed For Every Lifestyle & Goal
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
              Every person operates on a unique schedule. Whether you are a student, working professional, or creator, our AI tailors to you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all">
              <div className="p-3 w-fit rounded-xl bg-cyan-500/10 text-cyan-400 mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Students & College</h3>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Balances homework, exam syllabus, tough vs easy subjects, and evening sports without burnout.
              </p>
              <ul className="text-xs text-slate-300 space-y-1.5">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Subject-wise balancing</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Active recall revision</li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/40 transition-all">
              <div className="p-3 w-fit rounded-xl bg-blue-500/10 text-blue-400 mb-4">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Working Professionals</h3>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Protects deep work hours from endless meetings, carves out gym time, and enforces real evening wind-downs.
              </p>
              <ul className="text-xs text-slate-300 space-y-1.5">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400" /> Deep work focus blocks</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400" /> Work-life balance guard</li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 transition-all">
              <div className="p-3 w-fit rounded-xl bg-purple-500/10 text-purple-400 mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Competitive Aspirants</h3>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                For UPSC, JEE, NEET, GATE. Intense morning test mocks, high-retention notes review, and endurance management.
              </p>
              <ul className="text-xs text-slate-300 space-y-1.5">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-purple-400" /> High stamina pacing</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-purple-400" /> Strategic mock slots</li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-all">
              <div className="p-3 w-fit rounded-xl bg-emerald-500/10 text-emerald-400 mb-4">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Freelancers & Creators</h3>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Structure unstructured days. Gives client deadlines clarity, personal projects space, and flexible hours.
              </p>
              <ul className="text-xs text-slate-300 space-y-1.5">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Dynamic creative blocks</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Client communication buffers</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 💎 FEATURES COMPARISON */}
      <section id="features" className="py-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
              Why Adaptive AI Beats Ordinary Timetables
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-base">
              Discover why traditional static timetables quickly fail, and how an adaptive AI schedule keeps you effortlessly consistent.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Old Way */}
            <div className="p-8 rounded-3xl bg-slate-900/40 border border-rose-900/30 relative">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm mb-4">
                <span>❌ Traditional Rigid Timetables</span>
              </div>
              <ul className="space-y-4 text-slate-400 text-sm">
                <li className="flex items-start gap-3">
                  <span className="text-rose-400 font-bold">•</span>
                  <span><strong>Unrealistic 12-hour study blocks:</strong> Causes instant burnout and procrastination.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-400 font-bold">•</span>
                  <span><strong>No energy awareness:</strong> Puts hard math right when you have post-lunch food coma.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-400 font-bold">•</span>
                  <span><strong>Zero recovery time:</strong> One missed session ruins the entire week's motivation.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-400 font-bold">•</span>
                  <span><strong>Hard to modify:</strong> Once written on paper, changing it requires rewriting everything.</span>
                </li>
              </ul>
            </div>

            {/* AI Way */}
            <div className="p-8 rounded-3xl bg-linear-to-b from-cyan-950/40 to-slate-900/80 border border-cyan-500/40 relative shadow-xl shadow-cyan-950/40">
              <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm mb-4">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>✨ AdaptiveOps AI Timetable</span>
              </div>
              <ul className="space-y-4 text-slate-200 text-sm">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Circadian Energy Matching:</strong> Heavy cognitive loads scheduled during your natural mental peak.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Science-Backed Rest Buffers:</strong> Automatic 15-30 min micro-recharges keep dopamine levels high.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Instant 1-Click Adjustments:</strong> Drag, edit, or regenerate anytime your day changes.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Export to Print, PDF & Local Storage:</strong> Save directly to browser or pin on your study wall.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 🚀 CALL TO ACTION BANNER */}
      <section className="py-20 px-6 relative z-10">
        <div className="max-w-5xl mx-auto rounded-3xl bg-linear-to-r from-cyan-900/50 via-blue-900/40 to-indigo-900/50 border border-cyan-500/40 p-8 sm:p-14 text-center relative overflow-hidden shadow-2xl backdrop-blur-xl">
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-4">
              Ready to Own Your 24 Hours?
            </h2>
            <p className="text-cyan-100 text-base sm:text-lg max-w-2xl mx-auto mb-8">
              Answer 5 simple questions or describe your day — get your tailored, stress-free schedule in under 60 seconds.
            </p>
            <button
              onClick={() => navigate("/questions")}
              className="px-10 py-5 rounded-full font-extrabold text-base sm:text-lg bg-linear-to-r from-cyan-400 to-blue-500 text-slate-950 hover:text-white shadow-2xl shadow-cyan-400/40 hover:scale-105 active:scale-95 transition-all duration-300"
            >
              🚀 Generate My AI Schedule Now
            </button>
          </div>
        </div>
      </section>

      {/* 🦶 FOOTER */}
      <footer className="border-t border-slate-900 py-12 px-6 relative z-10 bg-slate-950 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-cyan-400" />
            <span className="font-bold text-slate-300 text-sm">AdaptiveOps AI</span>
            <span>— Personalized Productivity & Daily Routine Engine</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#how-it-works" className="hover:text-cyan-400 transition-colors">How it Works</a>
            <a href="#personas" className="hover:text-cyan-400 transition-colors">Personas</a>
            <button onClick={() => navigate("/questions")} className="hover:text-cyan-400 transition-colors">Questionnaire</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
