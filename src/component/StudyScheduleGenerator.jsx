import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Brain,
  Sparkles,
  ArrowLeft,
  Printer,
  Copy,
  Save,
  Plus,
  Trash2,
  Edit2,
  Check,
  CheckCircle2,
  Moon,
  Zap,
  Dumbbell,
  RotateCcw,
  Calendar,
  Download,
  Play,
  Pause,
  Timer,
  X
} from "lucide-react";
import {
  generateSmartSchedule,
  generateWeeklyPlan,
  PERSONA_PRESETS
} from "../utils/aiScheduler";

export default function StudyScheduleGenerator() {
  const location = useLocation();
  const navigate = useNavigate();
  const inputAnswers = location.state;

  // View mode: 'daily' | 'weekly'
  const [viewMode, setViewMode] = useState("daily");

  // Initialize schedule from state or localStorage or default preset
  const [scheduleData, setScheduleData] = useState(() => {
    const saved = localStorage.getItem("adaptiveops_saved_schedule");
    if (inputAnswers && Object.keys(inputAnswers).length > 0) {
      return generateSmartSchedule(inputAnswers);
    }
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing saved schedule", e);
      }
    }
    return generateSmartSchedule(PERSONA_PRESETS[0].defaults);
  });

  const [weeklyPlan] = useState(() =>
    generateWeeklyPlan(inputAnswers || PERSONA_PRESETS[0].defaults)
  );

  const [activeFilter, setActiveFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ time: "", title: "", description: "" });
  const [toastMessage, setToastMessage] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({
    time: "4:00 PM - 5:00 PM",
    title: "New Task / Activity",
    category: "deep_work",
    badge: "Custom",
    description: "Added to your personalized schedule."
  });

  // Focus Timer (Pomodoro) State
  const [activeTimerTask, setActiveTimerTask] = useState(null);
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [timerTotalSeconds, setTimerTotalSeconds] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  // Play soft chime on timer completion
  const playChime = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch (err) {
      console.log("Audio notification skipped", err);
    }
  };

  // Timer Tick Effect
  useEffect(() => {
    let interval = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            playChime();
            showToast("🎉 Focus session completed! Great job.");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Toggle complete
  const handleToggleComplete = (id) => {
    setScheduleData((prev) => {
      const updated = prev.schedule.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      );
      return { ...prev, schedule: updated };
    });
  };

  // Start inline editing
  const handleStartEdit = (item) => {
    setEditingId(item.id);
    setEditForm({ time: item.time, title: item.title, description: item.description || "" });
  };

  // Save inline edit
  const handleSaveEdit = (id) => {
    setScheduleData((prev) => {
      const updated = prev.schedule.map((item) =>
        item.id === id
          ? { ...item, time: editForm.time, title: editForm.title, description: editForm.description }
          : item
      );
      return { ...prev, schedule: updated };
    });
    setEditingId(null);
    showToast("Activity updated successfully!");
  };

  // Delete activity
  const handleDeleteItem = (id) => {
    setScheduleData((prev) => ({
      ...prev,
      schedule: prev.schedule.filter((item) => item.id !== id)
    }));
    showToast("Removed from timetable.");
  };

  // Add new activity
  const handleAddNewActivity = (e) => {
    e.preventDefault();
    if (!newItem.title.trim()) return;
    const createdItem = {
      id: `custom_${Date.now()}`,
      time: newItem.time,
      title: newItem.title,
      category: newItem.category,
      badge: newItem.category === "deep_work" ? "Deep Focus" : newItem.category === "health" ? "Health" : "Routine",
      description: newItem.description,
      completed: false
    };

    setScheduleData((prev) => ({
      ...prev,
      schedule: [...prev.schedule, createdItem]
    }));
    setShowAddModal(false);
    showToast("New activity added!");
  };

  // Save to localStorage
  const handleSaveToBrowser = () => {
    localStorage.setItem("adaptiveops_saved_schedule", JSON.stringify(scheduleData));
    showToast("Schedule saved in browser!");
  };

  // Copy timetable text
  const handleCopyTimetable = () => {
    const text = scheduleData.schedule
      .map((item) => `[${item.time}] ${item.title} (${item.badge}) - ${item.description}`)
      .join("\n");
    navigator.clipboard.writeText(text);
    showToast("Timetable copied to clipboard!");
  };

  // Export to Calendar (.ics file)
  const handleExportCalendar = () => {
    const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    let ics = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//AdaptiveOps AI//Personalized Scheduler//EN\n";
    scheduleData.schedule.forEach((item, index) => {
      ics += "BEGIN:VEVENT\n";
      ics += `UID:${Date.now()}_${index}@adaptiveops.ai\n`;
      ics += `SUMMARY:${item.title}\n`;
      ics += `DESCRIPTION:${item.description || item.title}\n`;
      ics += `DTSTART:${todayStr}T090000Z\n`;
      ics += `DTEND:${todayStr}T100000Z\n`;
      ics += "END:VEVENT\n";
    });
    ics += "END:VCALENDAR";

    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "daily_schedule.ics");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Calendar (.ics) downloaded!");
  };

  // Print timetable
  const handlePrint = () => {
    window.print();
  };

  // Regenerate with AI
  const handleRegenerate = () => {
    const fresh = generateSmartSchedule(inputAnswers || PERSONA_PRESETS[0].defaults);
    setScheduleData(fresh);
    showToast("Schedule regenerated by AI!");
  };

  // Open timer for a task
  const handleStartTimer = (task, durationMinutes = 25) => {
    setActiveTimerTask(task);
    setTimerTotalSeconds(durationMinutes * 60);
    setTimerSeconds(durationMinutes * 60);
    setIsTimerRunning(true);
  };

  // Filter items for daily view
  const filteredSchedule = scheduleData.schedule.filter((item) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "focus") return item.category === "deep_work";
    if (activeFilter === "health") return item.category === "health";
    if (activeFilter === "breaks") return item.category === "break" || item.category === "sleep";
    return true;
  });

  // Calculate completion percentage
  const totalTasks = scheduleData.schedule.length;
  const completedTasks = scheduleData.schedule.filter((i) => i.completed).length;
  const progressPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Format timer MM:SS
  const formatTimer = (sec) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 relative selection:bg-cyan-500 selection:text-white">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-10 right-1/4 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 left-10 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[160px]" />
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-slate-900 border border-cyan-500/60 text-cyan-300 font-semibold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Navigation / Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-all"
              title="Back to Home"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <Brain className="w-3.5 h-3.5" />
                  AdaptiveOps AI Schedule Studio
                </span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-300 text-[10px] font-bold">
                  Active
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                Your Optimized Schedule
              </h1>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-3.5 h-3.5 text-cyan-400" />
              <span>Add Block</span>
            </button>

            <button
              onClick={handleSaveToBrowser}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Save className="w-3.5 h-3.5 text-emerald-400" />
              <span>Save</span>
            </button>

            <button
              onClick={handleExportCalendar}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-all"
              title="Download .ics Calendar file"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Calendar (.ics)</span>
            </button>

            <button
              onClick={handleCopyTimetable}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Copy className="w-3.5 h-3.5 text-blue-400" />
              <span>Copy</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Printer className="w-3.5 h-3.5 text-purple-400" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={handleRegenerate}
              className="px-4 py-2 rounded-xl bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 flex items-center gap-1.5 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Rebalance AI</span>
            </button>
          </div>
        </header>

        {/* View Switcher: Daily vs 7-Day Weekly */}
        <div className="flex items-center justify-between gap-4 mb-6 bg-slate-900/60 border border-slate-800 p-2 rounded-2xl">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("daily")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                viewMode === "daily"
                  ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/25"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Daily Timetable (24h)</span>
            </button>
            <button
              onClick={() => setViewMode("weekly")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                viewMode === "weekly"
                  ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/25"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>7-Day Weekly Blueprint</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Chronotype & Ultradian Rhythm Active</span>
          </div>
        </div>

        {/* 📊 Analytics Dashboard */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-cyan-500/30 relative overflow-hidden backdrop-blur-md">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
              <span>Deep Focus Time</span>
              <Zap className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-black text-cyan-300">
              {scheduleData.analytics.deepWorkHours} <span className="text-xs font-normal text-slate-400">hours</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">High-cognitive output</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-purple-500/30 relative overflow-hidden backdrop-blur-md">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
              <span>Sleep Target</span>
              <Moon className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-black text-purple-300">
              {scheduleData.analytics.sleepHours} <span className="text-xs font-normal text-slate-400">hours</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Neurological recovery</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-emerald-500/30 relative overflow-hidden backdrop-blur-md">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
              <span>Health & Movement</span>
              <Dumbbell className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-300">
              {scheduleData.analytics.healthHours} <span className="text-xs font-normal text-slate-400">hours</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Active movement & meals</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-amber-500/30 relative overflow-hidden backdrop-blur-md">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
              <span>Daily Progress</span>
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-300">
              {progressPct}% <span className="text-xs font-normal text-slate-400">completed</span>
            </div>
            <div className="w-full h-1 bg-slate-800 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-amber-400 to-emerald-400 transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </section>

        {/* 🧠 AI Coaching Insights */}
        {scheduleData.tips && scheduleData.tips.length > 0 && (
          <section className="mb-8 p-5 rounded-3xl bg-linear-to-r from-cyan-950/40 via-blue-950/30 to-slate-900/80 border border-cyan-500/40 shadow-xl">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-cyan-200">AI Daily Synchronization Insights</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {scheduleData.tips.map((tip, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                  {tip}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* VIEW 1: DAILY 24-HOUR TIMETABLE */}
        {viewMode === "daily" && (
          <>
            {/* Category Filter Chips */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: "all", label: "All Activities" },
                  { id: "focus", label: "⚡ Deep Focus" },
                  { id: "health", label: "🥗 Health & Meals" },
                  { id: "breaks", label: "☕ Breaks & Sleep" }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setActiveFilter(f.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                      activeFilter === f.id
                        ? "bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20"
                        : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="text-xs text-slate-500">
                Click checkbox to mark done • Click play to launch Pomodoro
              </div>
            </div>

            {/* Timetable Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSchedule.map((item) => {
                const isEditing = editingId === item.id;

                let cardBorder = "border-slate-800 hover:border-slate-700";
                let tagBadge = "bg-slate-800 text-slate-300";

                if (item.isLocked || item.badge === "Event" || item.badge === "Commitment") {
                  cardBorder = "border-amber-500/50 hover:border-amber-400/60 bg-amber-950/15";
                  tagBadge = "bg-amber-950/80 text-amber-300 border border-amber-700 font-bold";
                } else if (item.category === "deep_work") {
                  cardBorder = "border-blue-900/50 hover:border-blue-500/50 bg-blue-950/10";
                  tagBadge = "bg-blue-950/80 text-blue-300 border border-blue-800";
                } else if (item.category === "health") {
                  cardBorder = "border-emerald-900/50 hover:border-emerald-500/50 bg-emerald-950/10";
                  tagBadge = "bg-emerald-950/80 text-emerald-300 border border-emerald-800";
                } else if (item.category === "break") {
                  cardBorder = "border-amber-900/50 hover:border-amber-500/50 bg-amber-950/10";
                  tagBadge = "bg-amber-950/80 text-amber-300 border border-amber-800";
                } else if (item.category === "sleep") {
                  cardBorder = "border-purple-900/50 hover:border-purple-500/50 bg-purple-950/10";
                  tagBadge = "bg-purple-950/80 text-purple-300 border border-purple-800";
                }

                return (
                  <div
                    key={item.id}
                    className={`p-5 rounded-2xl bg-slate-900/80 border ${cardBorder} shadow-lg backdrop-blur-md transition-all flex flex-col justify-between ${
                      item.completed ? "opacity-60 bg-slate-950/80" : ""
                    }`}
                  >
                    {isEditing ? (
                      /* Edit Form Mode */
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editForm.time}
                          onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                          placeholder="e.g. 9:00 AM - 10:30 AM"
                        />
                        <input
                          type="text"
                          value={editForm.title}
                          onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-bold"
                          placeholder="Title"
                        />
                        <textarea
                          rows={2}
                          value={editForm.description}
                          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-300 resize-none"
                          placeholder="Notes or description"
                        />
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-3 py-1 rounded-lg bg-slate-800 text-slate-400 text-xs"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveEdit(item.id)}
                            className="px-3 py-1 rounded-lg bg-cyan-500 text-slate-950 text-xs font-bold"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Standard Display Mode */
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleToggleComplete(item.id)}
                              className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                                item.completed
                                  ? "bg-emerald-500 border-emerald-400 text-slate-950"
                                  : "border-slate-700 hover:border-cyan-400"
                              }`}
                            >
                              {item.completed && <Check className="w-3.5 h-3.5 stroke-3" />}
                            </button>
                            <span className="text-xs font-bold text-slate-300">{item.time}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${tagBadge}`}>
                              {item.badge}
                            </span>
                            <button
                              onClick={() => handleStartEdit(item)}
                              className="p-1 hover:text-cyan-400 text-slate-500 transition-colors"
                              title="Edit activity"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              className="p-1 hover:text-rose-400 text-slate-500 transition-colors"
                              title="Delete activity"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <h4
                          className={`text-base font-bold text-white mb-1 ${
                            item.completed ? "line-through text-slate-400" : ""
                          }`}
                        >
                          {item.title}
                        </h4>

                        {item.description && (
                          <p className="text-xs text-slate-400 leading-relaxed mb-3">{item.description}</p>
                        )}

                        {/* Quick Start Focus Timer Button for Focus Tasks */}
                        {item.category === "deep_work" && (
                          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                            <span className="text-[11px] text-slate-500 flex items-center gap-1">
                              <Timer className="w-3 h-3 text-cyan-400" />
                              Focus Block
                            </span>
                            <button
                              onClick={() => handleStartTimer(item, 25)}
                              className="px-3 py-1 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-800/80 text-[11px] font-semibold flex items-center gap-1.5 transition-all"
                            >
                              <Play className="w-3 h-3 text-cyan-400 fill-cyan-400" />
                              <span>Start Pomodoro</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* VIEW 2: 7-DAY WEEKLY BLUEPRINT */}
        {viewMode === "weekly" && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
              <div>
                <strong>7-Day Strategic Distribution:</strong> Weekdays emphasize core mastery and work, while weekends introduce recovery buffers and comprehensive review.
              </div>
              <span className="text-cyan-400 font-bold">~38.5 hrs Total Focused Output / Week</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {weeklyPlan.map((planDay, idx) => (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl border transition-all ${
                    planDay.isWeekend
                      ? "bg-slate-900/60 border-purple-900/40 hover:border-purple-500/40"
                      : "bg-slate-900/80 border-slate-800 hover:border-cyan-500/40"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-extrabold text-white">{planDay.day}</span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                        planDay.isWeekend
                          ? "bg-purple-950/80 border-purple-800 text-purple-300"
                          : "bg-cyan-950/80 border-cyan-800 text-cyan-300"
                      }`}
                    >
                      {planDay.hours}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white mb-2">{planDay.theme}</h4>

                  <ul className="space-y-1.5 text-xs text-slate-400">
                    {planDay.highlights.map((h, hIdx) => (
                      <li key={hIdx} className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ⏱️ Floating Pomodoro Focus Modal */}
        {activeTimerTask && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl p-8 max-w-md w-full shadow-2xl relative text-center">
              <button
                onClick={() => {
                  setActiveTimerTask(null);
                  setIsTimerRunning(false);
                }}
                className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-300 text-xs font-semibold mb-4">
                <Timer className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                Focus Mode Session
              </div>

              <h3 className="text-xl font-extrabold text-white mb-1">
                {activeTimerTask.title}
              </h3>
              <p className="text-xs text-slate-400 mb-6">
                Block distractions. Immerse yourself completely until the bell rings.
              </p>

              {/* Countdown Digits */}
              <div className="text-6xl font-black text-cyan-300 tracking-wider mb-6 font-mono">
                {formatTimer(timerSeconds)}
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-6">
                <div
                  className="h-full bg-linear-to-r from-cyan-400 to-blue-500 transition-all duration-300"
                  style={{ width: `${((timerTotalSeconds - timerSeconds) / timerTotalSeconds) * 100}%` }}
                />
              </div>

              {/* Duration Presets */}
              <div className="flex justify-center gap-2 mb-6">
                {[15, 25, 45, 50].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => {
                      setTimerTotalSeconds(mins * 60);
                      setTimerSeconds(mins * 60);
                      setIsTimerRunning(false);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold border ${
                      timerTotalSeconds === mins * 60
                        ? "bg-cyan-500 text-slate-950 border-cyan-400 font-bold"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>

              {/* Timer Controls */}
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="px-8 py-3.5 rounded-2xl bg-linear-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm shadow-xl shadow-cyan-500/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                  {isTimerRunning ? (
                    <>
                      <Pause className="w-4 h-4" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-white" />
                      <span>Resume Focus</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    setTimerSeconds(timerTotalSeconds);
                    setIsTimerRunning(false);
                  }}
                  className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
                  title="Reset timer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal to Add Custom Block */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl">
              <h3 className="text-lg font-bold text-white mb-4">Add Custom Schedule Block</h3>
              <form onSubmit={handleAddNewActivity} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Time Slot</label>
                  <input
                    type="text"
                    value={newItem.time}
                    onChange={(e) => setNewItem({ ...newItem, time: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    placeholder="e.g. 4:00 PM - 5:00 PM"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Activity Title</label>
                  <input
                    type="text"
                    value={newItem.title}
                    onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    placeholder="e.g. Chemistry Review / Coding Sprint"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Category</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="deep_work">Deep Focus / Study</option>
                    <option value="health">Health / Nutrition / Workout</option>
                    <option value="break">Break / Recreation</option>
                    <option value="routine">Routine / Commute</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Description / Notes</label>
                  <textarea
                    rows={2}
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white resize-none"
                    placeholder="Key focus, books, or notes..."
                  />
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold"
                  >
                    Add Block
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Bottom CTA / Back to questionnaire */}
        <div className="mt-12 p-6 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-white text-sm">Need to adjust your core schedule preferences?</h4>
            <p className="text-xs text-slate-400">Re-run the questionnaire wizard anytime to re-sync your wake/sleep timings.</p>
          </div>
          <button
            onClick={() => navigate("/questions")}
            className="px-5 py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all"
          >
            Edit Inputs in Wizard
          </button>
        </div>
      </div>
    </div>
  );
}
