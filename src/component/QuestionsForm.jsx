import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion as Motion } from "framer-motion";
import {
  Brain,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Sun,
  Moon,
  Briefcase,
  BookOpen,
  Dumbbell,
  CheckCircle2,
  Zap,
  Target,
  Wand2,
  Heart
} from "lucide-react";
import { PERSONA_PRESETS, parseNaturalLanguagePrompt } from "../utils/aiScheduler";

export default function QuestionsForm() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("wizard"); // 'wizard' | 'express'
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  // Form State
  const [formData, setFormData] = useState({
    persona: "student",
    goal: "exam_prep",
    wakeUp: "6:30 AM",
    sleepTime: "11:00 PM",
    peakEnergy: "morning",
    isHoliday: "no",
    fixedTime: "9:00 AM - 3:00 PM",
    fixedLabel: "School / College Classes",
    hasSpecialPlan: "no",
    specialPlanTime: "",
    primaryTasks: "Mathematics, Physics, English",
    highPriority: "Mathematics",
    workoutTime: "30 min",
    breakType: "pomodoro"
  });

  const [expressText, setExpressText] = useState("");
  const [validationError, setValidationError] = useState("");

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setValidationError("");
  };

  const handleNext = () => {
    // Step-specific basic validation
    if (step === 3 && formData.isHoliday === "no" && !formData.fixedTime.trim()) {
      setValidationError("Please enter your work/college hours or select 'Holiday / Free Day'");
      return;
    }
    if (step === 4 && !formData.primaryTasks.trim()) {
      setValidationError("Please enter at least one subject or priority task");
      return;
    }

    setValidationError("");
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Done! Forward to schedule generator
      navigate("/study-schedule", { state: formData });
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
      setValidationError("");
    }
  };

  const handleExpressSubmit = (e) => {
    e.preventDefault();
    if (!expressText.trim()) {
      setValidationError("Please write a few words about your routine");
      return;
    }
    const parsed = parseNaturalLanguagePrompt(expressText);
    navigate("/study-schedule", { state: parsed });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-8 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 max-w-4xl mx-auto w-full flex items-center justify-between py-2">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Brain className="w-5 h-5" />
          </div>
          <span className="font-bold text-sm text-slate-200">AdaptiveOps AI Routine Assistant</span>
        </div>

        {/* Toggle Mode */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-full p-1 text-xs">
          <button
            onClick={() => setMode("wizard")}
            className={`px-3 py-1 rounded-full font-medium transition-all ${
              mode === "wizard" ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-400 hover:text-white"
            }`}
          >
            Step-by-Step
          </button>
          <button
            onClick={() => setMode("express")}
            className={`px-3 py-1 rounded-full font-medium transition-all ${
              mode === "express" ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-400 hover:text-white"
            }`}
          >
            Express (1-Line)
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 max-w-2xl mx-auto w-full my-auto py-8">
        {mode === "express" ? (
          /* ⚡ Express Text Mode */
          <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-800 text-cyan-300 text-xs font-semibold mb-3">
                <Wand2 className="w-3.5 h-3.5" />
                AI Natural Language Parser
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
                Describe Your Day in 1 Line
              </h2>
              <p className="text-sm text-slate-400">
                Describe your daily routine in simple English. Our AI automatically identifies your wake-up time, commitments, workout, and priorities.
              </p>
            </div>

            <form onSubmit={handleExpressSubmit}>
              <textarea
                rows={4}
                value={expressText}
                onChange={(e) => {
                  setExpressText(e.target.value);
                  setValidationError("");
                }}
                placeholder="Example: I wake up at 7:00 AM, work hours 9:30 AM to 5:30 PM, workout for 45 minutes, need 2 hours for coding practice, and sleep at 11:30 PM."
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/80 transition-all resize-none mb-4"
              />

              {validationError && (
                <p className="text-rose-400 text-xs mb-4 font-medium">{validationError}</p>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 mb-6">
                <span>Try quick templates:</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setExpressText("Wake at 6:30 AM, college from 9 to 3, study physics & maths, gym at 5:30 PM, sleep at 11 PM.")}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300"
                  >
                    College Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setExpressText("Wake 7 AM, office 10 AM to 6 PM, workout 45m, coding project 1 hr, sleep 11:30 PM.")}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300"
                  >
                    Software Engineer
                  </button>
                  <button
                    type="button"
                    onClick={() => setExpressText("Wake 6 AM, full day exam preparation for UPSC, GS-1 & mock tests, sleep 10:30 PM.")}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300"
                  >
                    Exam Aspirant
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-linear-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate My Smart Schedule</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          /* 🧙 Step-by-Step Guided Wizard */
          <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl relative">
            {/* Top Step Indicator & Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
                <span className="text-cyan-400">Step {step} of {totalSteps}</span>
                <span>{Math.round((step / totalSteps) * 100)}% Complete</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-cyan-400 to-blue-500 transition-all duration-300 rounded-full"
                  style={{ width: `${(step / totalSteps) * 100}%` }}
                />
              </div>
            </div>

            {/* Step Contents with Smooth Animation */}
            <AnimatePresence mode="wait">
              {step === 1 && (
                <Motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                      Who are you & what is your primary goal? 🎯
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400">
                      AI tailors the pacing and focus blocks based on your daily lifestyle.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { id: "student", label: "Student / College", icon: BookOpen, desc: "Classes, homework & exams" },
                      { id: "competitive", label: "Exam Aspirant (UPSC/JEE/NEET)", icon: Target, desc: "Intense mock tests & deep review" },
                      { id: "professional", label: "Working Professional", icon: Briefcase, desc: "Office/remote work & balance" },
                      { id: "freelancer", label: "Freelancer / Creator", icon: Zap, desc: "Self-driven projects & clients" },
                      { id: "wellness", label: "Healthy Lifestyle & Routine", icon: Heart, desc: "Consistency, habits & wellness" }
                    ].map((p) => {
                      const Icon = p.icon;
                      const isSel = formData.persona === p.id;
                      return (
                        <div
                          key={p.id}
                          onClick={() => {
                            updateField("persona", p.id);
                            const matched = PERSONA_PRESETS.find((preset) => preset.id === p.id);
                            if (matched && matched.defaults) {
                              setFormData((prev) => ({
                                ...prev,
                                persona: p.id,
                                wakeUp: matched.defaults.wakeUp || prev.wakeUp,
                                sleepTime: matched.defaults.sleepTime || prev.sleepTime,
                                fixedTime: matched.defaults.fixedTime || prev.fixedTime,
                                fixedLabel: matched.defaults.fixedLabel || prev.fixedLabel,
                                primaryTasks: matched.defaults.primaryTasks || prev.primaryTasks,
                                highPriority: matched.defaults.highPriority || prev.highPriority,
                                workoutTime: matched.defaults.workoutTime || prev.workoutTime,
                                peakEnergy: matched.defaults.peakEnergy || prev.peakEnergy,
                                breakType: matched.defaults.breakType || prev.breakType
                              }));
                            }
                          }}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                            isSel
                              ? "bg-cyan-950/40 border-cyan-400 shadow-md shadow-cyan-950"
                              : "bg-slate-950/50 border-slate-800 hover:border-slate-700"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-xl ${isSel ? "bg-cyan-500 text-slate-950" : "bg-slate-800 text-slate-400"}`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-white">{p.label}</h4>
                              <p className="text-[11px] text-slate-400">{p.desc}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Motion.div>
              )}

              {step === 2 && (
                <Motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                      When do you wake up & sleep? ⏰
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400">
                      Circadian rhythm synchronization ensures high mental energy during your hardest tasks.
                    </p>
                  </div>

                  {/* Wake Up Time */}
                  <div>
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-2">
                      <Sun className="w-4 h-4 text-amber-400" />
                      Wake Up Time
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {["5:30 AM", "6:00 AM", "6:30 AM", "7:00 AM", "8:00 AM"].map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => updateField("wakeUp", time)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                            formData.wakeUp === time
                              ? "bg-cyan-500 text-slate-950 border-cyan-400"
                              : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700"
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={formData.wakeUp}
                      onChange={(e) => updateField("wakeUp", e.target.value)}
                      placeholder="e.g. 7:00 AM"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  {/* Sleep Time */}
                  <div>
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-2">
                      <Moon className="w-4 h-4 text-purple-400" />
                      Bedtime / Sleep Time
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {["10:00 PM", "10:30 PM", "11:00 PM", "11:30 PM", "12:00 AM", "12:30 AM", "1:00 AM"].map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => updateField("sleepTime", time)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                            formData.sleepTime === time
                              ? "bg-purple-500 text-white border-purple-400 font-bold"
                              : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700"
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={formData.sleepTime}
                      onChange={(e) => updateField("sleepTime", e.target.value)}
                      placeholder="e.g. 11:30 PM or 12:00 AM"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  {/* Peak Energy */}
                  <div>
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-2">
                      <Zap className="w-4 h-4 text-cyan-400" />
                      When do you feel most alert?
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: "morning", label: "Morning 🌅" },
                        { id: "afternoon", label: "Afternoon ☀️" },
                        { id: "night", label: "Night 🌙" }
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => updateField("peakEnergy", item.id)}
                          className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                            formData.peakEnergy === item.id
                              ? "bg-cyan-950/80 border-cyan-400 text-cyan-300"
                              : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </Motion.div>
              )}

              {step === 3 && (
                <Motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                      Fixed Commitments & Schedule 🏢
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400">
                      Do you have school, college, office or is today a free holiday?
                    </p>
                  </div>

                  {/* Holiday toggle */}
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-2">
                      Is today a holiday or free day?
                    </label>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => updateField("isHoliday", "no")}
                        className={`flex-1 py-3 rounded-xl text-xs font-bold border transition-all ${
                          formData.isHoliday === "no"
                            ? "bg-cyan-950/80 border-cyan-400 text-cyan-300"
                            : "bg-slate-950 border-slate-800 text-slate-400"
                        }`}
                      >
                        No (I have classes/work)
                      </button>
                      <button
                        type="button"
                        onClick={() => updateField("isHoliday", "yes")}
                        className={`flex-1 py-3 rounded-xl text-xs font-bold border transition-all ${
                          formData.isHoliday === "yes"
                            ? "bg-cyan-950/80 border-cyan-400 text-cyan-300"
                            : "bg-slate-950 border-slate-800 text-slate-400"
                        }`}
                      >
                        Yes (Today is a holiday / Sunday / WFH)
                      </button>
                    </div>
                  </div>

                  {/* Commitments time */}
                  {formData.isHoliday === "no" && (
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-2">
                        What are your school/college/office hours?
                      </label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {["9:00 AM - 3:00 PM", "9:00 AM - 4:00 PM", "10:00 AM - 6:00 PM"].map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => updateField("fixedTime", preset)}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold border ${
                              formData.fixedTime === preset
                                ? "bg-cyan-500 text-slate-950 border-cyan-400"
                                : "bg-slate-950 border-slate-800 text-slate-300"
                            }`}
                          >
                            {preset}
                          </button>
                        ))}
                      </div>
                      <input
                        type="text"
                        value={formData.fixedTime}
                        onChange={(e) => updateField("fixedTime", e.target.value)}
                        placeholder="e.g. 9:00 AM - 3:00 PM"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  )}

                  {/* Special plan */}
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-2">
                      Any special appointments / fixed event timing today? (Optional)
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {[
                        "4:30 PM - 5:30 PM Tuition",
                        "5:00 PM - 6:00 PM Gym",
                        "7:00 PM - 8:00 PM Meeting",
                        "None"
                      ].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => updateField("specialPlanTime", preset === "None" ? "" : preset)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold border ${
                            formData.specialPlanTime === preset
                              ? "bg-cyan-500 text-slate-950 border-cyan-400 font-bold"
                              : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700"
                          }`}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={formData.specialPlanTime}
                      onChange={(e) => updateField("specialPlanTime", e.target.value)}
                      placeholder="e.g. 4:30 PM - 5:30 PM Coaching / Doctor / Gym"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </Motion.div>
              )}

              {step === 4 && (
                <Motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                      Subjects, Tasks & Fitness Goals 📚
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400">
                      What do you want to accomplish today? Mention your key subjects or work priorities.
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-2">
                      Subjects / Projects to cover today (comma separated)
                    </label>
                    <input
                      type="text"
                      value={formData.primaryTasks}
                      onChange={(e) => updateField("primaryTasks", e.target.value)}
                      placeholder="e.g. Mathematics, Physics, Chemistry, English"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 mb-1"
                    />
                    <p className="text-[11px] text-slate-500">e.g. Coding, Math, System Design, Organic Chemistry</p>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-2">
                      Which subject/task requires maximum focus & time?
                    </label>
                    <input
                      type="text"
                      value={formData.highPriority}
                      onChange={(e) => updateField("highPriority", e.target.value)}
                      placeholder="e.g. Mathematics"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-2">
                      <Dumbbell className="w-4 h-4 text-emerald-400" />
                      Exercise & Movement Preference
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {["None", "30 min", "45 min", "60 min"].map((dur) => (
                        <button
                          key={dur}
                          type="button"
                          onClick={() => updateField("workoutTime", dur)}
                          className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                            formData.workoutTime === dur
                              ? "bg-emerald-950/80 border-emerald-400 text-emerald-300"
                              : "bg-slate-950 border-slate-800 text-slate-400"
                          }`}
                        >
                          {dur}
                        </button>
                      ))}
                    </div>
                  </div>
                </Motion.div>
              )}

              {step === 5 && (
                <Motion.div
                  key="step5"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                      Study / Work Technique & Breaks ⏳
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400">
                      Choose how you prefer to break down your focus blocks to maintain peak dopamine & stamina.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {[
                      {
                        id: "pomodoro",
                        title: "Pomodoro Rhythm (25m Focus / 5m Break)",
                        desc: "Best for high energy, rapid problem solving, and zero burnout."
                      },
                      {
                        id: "deep_work",
                        title: "Deep Work Protocol (50m Focus / 10m Break)",
                        desc: "Best for deep writing, complex coding, and exam mock tests."
                      },
                      {
                        id: "standard",
                        title: "Standard Flow (90m Sprint / 15m Break)",
                        desc: "Aligned with natural 90-minute ultradian rhythm cycles."
                      }
                    ].map((style) => (
                      <div
                        key={style.id}
                        onClick={() => updateField("breakType", style.id)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                          formData.breakType === style.id
                            ? "bg-cyan-950/40 border-cyan-400 text-white"
                            : "bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-white">{style.title}</h4>
                          {formData.breakType === style.id && (
                            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-1">{style.desc}</p>
                      </div>
                    ))}
                  </div>

                  {/* Summary Preview */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
                    <p className="font-semibold text-cyan-300">Ready to assemble your day:</p>
                    <p>• Day starts at <strong>{formData.wakeUp}</strong> and winds down at <strong>{formData.sleepTime}</strong></p>
                    <p>• Focus subjects: <strong>{formData.primaryTasks}</strong> (Priority: {formData.highPriority || "Balanced"})</p>
                    <p>• Daily workout: <strong>{formData.workoutTime}</strong></p>
                  </div>
                </Motion.div>
              )}
            </AnimatePresence>

            {/* Error Message */}
            {validationError && (
              <p className="text-rose-400 text-xs mt-4 font-semibold">{validationError}</p>
            )}

            {/* Bottom Navigation Buttons */}
            <div className="flex items-center justify-between gap-4 mt-8 pt-6 border-t border-slate-800">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold text-sm transition-all flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>
              ) : (
                <div />
              )}

              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-3 rounded-xl bg-linear-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                {step === totalSteps ? (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate AI Schedule</span>
                  </>
                ) : (
                  <>
                    <span>Next</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer info */}
      <footer className="relative z-10 max-w-4xl mx-auto w-full text-center text-xs text-slate-500 py-2">
        <p>AdaptiveOps AI • Real-Time Daily Schedule & Habit Engine</p>
      </footer>
    </div>
  );
}
