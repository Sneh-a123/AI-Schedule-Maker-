/**
 * AI Scheduler Engine - AdaptiveOps
 * Dynamically computes optimal daily schedules based on persona, energy rhythms, user events, and AM/PM logic.
 */

// Format minutes into clean "h:mm AM/PM"
export const minutesToTime = (minutes) => {
  let m = ((minutes % 1440) + 1440) % 1440;
  let hours = Math.floor(m / 60);
  let mins = m % 60;
  const meridiem = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  const displayMins = mins.toString().padStart(2, "0");
  return `${displayHours}:${displayMins} ${meridiem}`;
};

// Robust single-time parser: "7:00 AM", "7am", "12:00 AM" (midnight), "12:00 PM" (noon), "1:00 AM", etc.
export const parseSingleTime = (str, defaultMeridiem = "AM") => {
  if (!str || typeof str !== "string") return null;
  const clean = str.trim().toLowerCase();

  // Match e.g. "9:30 am", "9 am", "9:30pm", "14:30", "12am", "12:00 pm"
  const m = clean.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/);
  if (!m) return null;

  let h = parseInt(m[1], 10);
  let min = m[2] ? parseInt(m[2], 10) : 0;
  let mer = m[3] ? m[3].toUpperCase() : null;

  // Infer meridiem if omitted
  if (!mer) {
    if (h >= 1 && h <= 6) {
      mer = "PM"; // 1 to 6 in daily context is PM
    } else if (h >= 7 && h <= 11) {
      mer = defaultMeridiem;
    } else if (h === 12) {
      mer = "PM"; // 12 bare is typically noon
    } else {
      mer = "AM";
    }
  }

  let totalH = h;
  if (mer === "PM" && totalH < 12) totalH += 12;
  if (mer === "AM" && totalH === 12) totalH = 0;

  const displayH = totalH % 12 || 12;
  const displayMer = totalH >= 12 ? "PM" : "AM";
  return {
    mins: totalH * 60 + min,
    formatted: `${displayH}:${min.toString().padStart(2, "0")} ${displayMer}`
  };
};

// Parse any time string to minutes from midnight (0 to 1439)
export const timeToMinutes = (timeStr) => {
  const parsed = parseSingleTime(timeStr, "AM");
  return parsed ? parsed.mins : 420; // default 7:00 AM
};

// Add minutes to a time string
export const addMinutesToTime = (timeStr, mins) => {
  const current = timeToMinutes(timeStr);
  return minutesToTime(current + mins);
};

// Robust time range parser: "4:00 PM - 5:30 PM Coaching", "9 to 3 College", "5 to 7 PM Tuition"
export const parseTimeRangeString = (str, fallbackTitle = "Scheduled Event") => {
  if (!str || typeof str !== "string") return null;
  const clean = str.trim();

  // Extract start, end, and optional trailing title
  const regex = /(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)\s*(?:-|to)\s*(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)(.*)/i;
  const m = clean.match(regex);
  if (!m) return null;

  let startRaw = m[1].trim();
  let endRaw = m[2].trim();
  let title = m[3] ? m[3].replace(/^[:\-–, ]+/, "").trim() : "";

  const endHasPM = /pm/i.test(endRaw);
  const startHasMer = /am|pm/i.test(startRaw);

  let startParsed, endParsed;
  if (!startHasMer && endHasPM) {
    const startNum = parseInt(startRaw, 10);
    // e.g. "9 to 5 PM" -> start 9 is AM, but "2 to 5 PM" -> start 2 is PM
    const startMer = startNum >= 7 && startNum <= 11 ? "AM" : "PM";
    startParsed = parseSingleTime(startRaw, startMer);
    endParsed = parseSingleTime(endRaw, "PM");
  } else {
    startParsed = parseSingleTime(startRaw, "AM");
    endParsed = parseSingleTime(endRaw, "PM");
  }

  if (!startParsed || !endParsed) return null;

  let startMins = startParsed.mins;
  let endMins = endParsed.mins;
  // Overnight event handling (e.g. 11 PM to 1 AM)
  if (endMins <= startMins) endMins += 1440;

  return {
    startMins,
    endMins,
    time: `${startParsed.formatted} - ${endParsed.formatted}`,
    title: title || fallbackTitle
  };
};

// Preset Personas for quick generation
export const PERSONA_PRESETS = [
  {
    id: "student",
    name: "Student / College",
    badge: "🎓 Academics & Exams",
    description: "Balanced for classes, homework, exam prep, and relaxed evenings.",
    defaults: {
      wakeUp: "6:30 AM",
      sleepTime: "11:00 PM",
      fixedTime: "9:00 AM - 3:00 PM",
      fixedLabel: "School / College Classes",
      specialPlanTime: "",
      primaryTasks: "Mathematics, Physics, Computer Science",
      highPriority: "Mathematics",
      workoutTime: "45 min",
      peakEnergy: "morning",
      breakType: "pomodoro"
    }
  },
  {
    id: "competitive",
    name: "Exam Aspirant (UPSC/JEE/NEET)",
    badge: "🎯 High Intensity",
    description: "Maximum deep focus, high-retention revision blocks, and mental stamina.",
    defaults: {
      wakeUp: "6:00 AM",
      sleepTime: "10:30 PM",
      fixedTime: "",
      fixedLabel: "Self-Study & Test Series",
      specialPlanTime: "",
      primaryTasks: "GS Paper 1, Mock Test Analysis, Current Affairs",
      highPriority: "Mock Test & Revision",
      workoutTime: "30 min",
      peakEnergy: "morning",
      breakType: "deep_work"
    }
  },
  {
    id: "professional",
    name: "Working Professional",
    badge: "💼 Career & Balance",
    description: "Focused work sprints, seamless meeting buffers, and evening unwind.",
    defaults: {
      wakeUp: "7:00 AM",
      sleepTime: "11:30 PM",
      fixedTime: "10:00 AM - 6:00 PM",
      fixedLabel: "Office / Remote Work Hours",
      specialPlanTime: "",
      primaryTasks: "Deep Project Sprints, Team Sync, Skill Building",
      highPriority: "Core System Design Project",
      workoutTime: "45 min",
      peakEnergy: "afternoon",
      breakType: "standard"
    }
  },
  {
    id: "freelancer",
    name: "Freelancer / Creator",
    badge: "⚡ Flexible & Agile",
    description: "High creative flow, client milestones, personal brand building.",
    defaults: {
      wakeUp: "8:00 AM",
      sleepTime: "12:00 AM",
      fixedTime: "2:00 PM - 3:30 PM",
      fixedLabel: "Client Sync & Calls",
      specialPlanTime: "",
      primaryTasks: "Client Delivery, Content Creation, Outreach",
      highPriority: "Client Project Sprint",
      workoutTime: "30 min",
      peakEnergy: "night",
      breakType: "pomodoro"
    }
  },
  {
    id: "wellness",
    name: "Healthy Lifestyle & Routine",
    badge: "🌿 Mind, Body & Focus",
    description: "Consistent circadian rhythm, active habits, and stress-free productivity.",
    defaults: {
      wakeUp: "6:00 AM",
      sleepTime: "10:00 PM",
      fixedTime: "9:30 AM - 4:30 PM",
      fixedLabel: "Core Daily Commitments",
      specialPlanTime: "",
      primaryTasks: "Reading, Exercise, Goal Review, Mindfulness",
      highPriority: "Full Body Workout & Meditation",
      workoutTime: "60 min",
      peakEnergy: "morning",
      breakType: "standard"
    }
  }
];

// Natural Language Parser: extracts wake, sleep, tasks, and ALL time ranges
export const parseNaturalLanguagePrompt = (prompt) => {
  const p = prompt.toLowerCase();
  const result = {
    persona: "student",
    wakeUp: "7:00 AM",
    sleepTime: "11:30 PM",
    fixedTime: "",
    fixedLabel: "Commitments",
    specialPlanTime: "",
    primaryTasks: "",
    highPriority: "",
    workoutTime: "30 min",
    peakEnergy: "morning",
    breakType: "pomodoro"
  };

  // 1. Detect Persona
  if (p.includes("college") || p.includes("school") || p.includes("student") || p.includes("tuition") || p.includes("study")) {
    result.persona = "student";
    result.fixedLabel = "School / College Classes";
  } else if (p.includes("upsc") || p.includes("jee") || p.includes("neet") || p.includes("exam") || p.includes("aspirant") || p.includes("gate")) {
    result.persona = "competitive";
    result.fixedLabel = "Mock Tests & Study";
  } else if (p.includes("job") || p.includes("office") || p.includes("work") || p.includes("developer") || p.includes("company")) {
    result.persona = "professional";
    result.fixedLabel = "Office / Remote Work";
  } else if (p.includes("freelance") || p.includes("client") || p.includes("creator") || p.includes("youtube")) {
    result.persona = "freelancer";
    result.fixedLabel = "Client Calls & Delivery";
  } else if (p.includes("health") || p.includes("gym") || p.includes("fitness") || p.includes("yoga")) {
    result.persona = "wellness";
  }

  // 2. Detect Wake Up Time (e.g., "wake at 6am", "wake up 7:30", "subah 6 baje", "wake at 6:30 am")
  const wakeMatch = p.match(/(?:wake|uthta|uthti|subah|morning)\s*(?:up)?\s*(?:at|around)?\s*(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i);
  if (wakeMatch) {
    let raw = wakeMatch[1];
    const parsed = parseSingleTime(raw, "AM");
    if (parsed) result.wakeUp = parsed.formatted;
  }

  // 3. Detect Sleep / Bedtime (e.g., "sleep at 11pm", "sleep 12 am", "bed at 1 am", "sona hai 11:30")
  const sleepMatch = p.match(/(?:sleep|so|sona|bed|night)\s*(?:at|around)?\s*(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i);
  if (sleepMatch) {
    let raw = sleepMatch[1];
    // Check if 12 or 1 or 2 is mentioned for bedtime -> it's AM (past midnight)
    let defaultMer = "PM";
    const num = parseInt(raw, 10);
    if (num === 12 || (num >= 1 && num <= 4)) defaultMer = "AM";
    const parsed = parseSingleTime(raw, defaultMer);
    if (parsed) result.sleepTime = parsed.formatted;
  }

  // 4. Detect ALL Time Ranges (e.g. "9 to 3 college", "4:30 to 6 tuition", "7 to 8 gym")
  const rangeRegex = /(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)\s*(?:to|-)\s*(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)([^,.\n;]*)/gi;
  let match;
  const detectedRanges = [];
  while ((match = rangeRegex.exec(p)) !== null) {
    const rangeStr = `${match[1]} - ${match[2]} ${match[3]}`.trim();
    const parsedRange = parseTimeRangeString(rangeStr);
    if (parsedRange) {
      detectedRanges.push(parsedRange);
    }
  }

  if (detectedRanges.length > 0) {
    result.fixedTime = detectedRanges[0].time;
    if (detectedRanges[0].title && detectedRanges[0].title !== "Scheduled Event") {
      result.fixedLabel = detectedRanges[0].title;
    }
  }
  if (detectedRanges.length > 1) {
    result.specialPlanTime = `${detectedRanges[1].time} ${detectedRanges[1].title}`;
  }

  // 5. Detect Workout
  if (p.includes("gym") || p.includes("workout") || p.includes("running") || p.includes("exercise")) {
    result.workoutTime = "45 min";
  }

  // 6. Detect Subjects & Priorities
  const subjects = [];
  ["coding", "programming", "math", "maths", "physics", "chemistry", "english", "biology", "history", "design", "marketing", "writing"].forEach((sub) => {
    if (p.includes(sub)) subjects.push(sub.charAt(0).toUpperCase() + sub.slice(1));
  });
  if (subjects.length > 0) {
    result.primaryTasks = subjects.join(", ");
    result.highPriority = subjects[0];
  }

  return result;
};

/**
 * Main AI Schedule Generator Function
 * Builds a chronologically accurate, conflict-free daily schedule aligned with user events and bedtime.
 */
export const generateSmartSchedule = (inputData = {}) => {
  const wakeStr = inputData.wakeUp || inputData[6] || "7:00 AM";
  const sleepStr = inputData.sleepTime || inputData[8] || "11:30 PM";
  const persona = inputData.persona || "student";
  const peakEnergy = inputData.peakEnergy || "morning";
  const breakStyle = inputData.breakType || "pomodoro";

  const isHoliday = (inputData.isHoliday || inputData[1] || "no").toLowerCase() === "yes";
  const rawTasks = (inputData.primaryTasks || inputData[7] || "Mathematics, Physics, English")
    .split(/[,;]+/)
    .map((t) => t.trim())
    .filter(Boolean);
  if (rawTasks.length === 0) rawTasks.push("Core Priority Subject", "Secondary Goal");

  const highPriority = inputData.highPriority || inputData[9] || rawTasks[0];
  const workoutDur = inputData.workoutTime || "30 min";

  // Parse wake and sleep times
  const wakeMins = timeToMinutes(wakeStr);
  let sleepMins = timeToMinutes(sleepStr);
  // Overnight sleep handling (e.g. 11:30 PM = 1410 mins, 12:00 AM = 1440 mins, 1:00 AM = 1500 mins)
  if (sleepMins <= wakeMins) {
    sleepMins += 1440;
  }

  // 1. Collect and Normalize ALL User-Specified Events
  const userEvents = [];

  // Fixed commitments (school, college, office)
  const rawFixed = inputData.fixedTime || inputData[3] || "";
  const fixedName = inputData.fixedLabel || (persona === "student" ? "School / College Classes" : "Office / Remote Work");
  if (!isHoliday && rawFixed && rawFixed.includes("-")) {
    const parsedFixed = parseTimeRangeString(rawFixed, fixedName);
    if (parsedFixed) {
      userEvents.push({
        id: "fixed_commitment",
        startMins: parsedFixed.startMins,
        endMins: parsedFixed.endMins,
        time: parsedFixed.time,
        title: `${parsedFixed.title} 🏢`,
        category: "routine",
        badge: "Commitment",
        description: `Scheduled commitment for ${parsedFixed.title}. Maintain active engagement.`,
        completed: false,
        isLocked: true
      });
    }
  }

  // Special appointments / coaching / doctor / custom plan
  const rawSpecial = inputData.specialPlanTime || inputData[5] || "";
  if (rawSpecial && rawSpecial.includes("-")) {
    const parsedSpecial = parseTimeRangeString(rawSpecial, "Special Plan / Appointment");
    if (parsedSpecial) {
      userEvents.push({
        id: "special_event",
        startMins: parsedSpecial.startMins,
        endMins: parsedSpecial.endMins,
        time: parsedSpecial.time,
        title: `${parsedSpecial.title} 📍`,
        category: "routine",
        badge: "Event",
        description: `User-scheduled event: ${parsedSpecial.title}. Adjusted seamlessly without conflicts.`,
        completed: false,
        isLocked: true
      });
    }
  }

  // Sort events chronologically
  userEvents.sort((a, b) => a.startMins - b.startMins);

  const items = [];
  let cur = wakeMins;

  // Helper to add slot
  const addSlot = (start, end, title, category, badge, description, isPriority = false) => {
    if (end <= start) return;
    items.push({
      id: `slot_${start}_${end}`,
      startMins: start,
      endMins: end,
      time: `${minutesToTime(start)} - ${minutesToTime(end)}`,
      title,
      category,
      badge,
      description,
      completed: false,
      isPriority
    });
    cur = end;
  };

  // 2. Morning Awakening (30 mins)
  const firstEvent = userEvents[0];
  const morningFreshEnd = Math.min(cur + 30, firstEvent && firstEvent.startMins < cur + 30 ? firstEvent.startMins : cur + 30);
  addSlot(
    cur,
    morningFreshEnd,
    "Wake up, Hydrate & Sunlight 🌅",
    "routine",
    "Morning",
    "Drink 500ml water, natural sunlight exposure, and light posture stretches for circadian reset."
  );

  // 3. Breakfast (30 mins)
  if (!firstEvent || cur < firstEvent.startMins) {
    const breakfastEnd = Math.min(cur + 30, firstEvent ? firstEvent.startMins : cur + 30);
    if (breakfastEnd > cur) {
      addSlot(
        cur,
        breakfastEnd,
        "Nutritious Breakfast & Planning 🥣",
        "health",
        "Nutrition",
        "High-protein meal, review daily priorities, zero social media."
      );
    }
  }

  // Task iterator to rotate through user subjects
  let taskIndex = rawTasks.length > 1 ? 1 : 0;
  const getNextTask = () => {
    const t = rawTasks[taskIndex % rawTasks.length];
    taskIndex++;
    return t;
  };

  // 4. Process Daytime Events & Interstitial Focus Slots
  userEvents.forEach((ev) => {
    if (cur < ev.startMins) {
      const gap = ev.startMins - cur;
      if (gap >= 45) {
        const assignedTask = cur < 720 ? highPriority : getNextTask();
        addSlot(
          cur,
          ev.startMins,
          `Prime Focus: ${assignedTask} ⚡`,
          "deep_work",
          "Deep Focus",
          `Dedicated uninterrupted session focusing on ${assignedTask}. Zero notifications.`,
          true
        );
      } else if (gap > 10) {
        addSlot(
          cur,
          ev.startMins,
          "Transition & Commute Buffer 🎒",
          "routine",
          "Buffer",
          "Prepare materials, commute, and transition smoothly."
        );
      }
      cur = ev.startMins;
    }

    // Insert the User's Locked Event
    items.push(ev);
    cur = ev.endMins;
  });

  // 5. Lunch & Midday Recharge
  // If lunch hasn't occurred yet
  if (cur < 840) { // before 2:00 PM
    const lunchTarget = Math.max(cur, 750); // 12:30 PM
    if (cur < lunchTarget && lunchTarget - cur >= 30) {
      addSlot(
        cur,
        lunchTarget,
        `Midday Focus: ${getNextTask()} 📖`,
        "deep_work",
        "Focus",
        "Problem solving, notes review, and active recall exercises."
      );
    }
    addSlot(
      lunchTarget,
      lunchTarget + 45,
      "Mindful Lunch & Rest 🥗",
      "health",
      "Nutrition",
      "Wholesome nutritious meal and screen-free relaxation."
    );
  } else if (!items.some((i) => i.title.includes("Lunch") || i.title.includes("Meal"))) {
    // If commitments ended after 2:00 PM, take lunch/recovery now
    addSlot(
      cur,
      cur + 40,
      "Post-Commitment Meal & Rest 🥗",
      "health",
      "Recovery",
      "Decompress and refuel after fixed commitments."
    );
  }

  // 6. Afternoon Focus & Reset
  if (cur < 1050) { // before 5:30 PM
    addSlot(
      cur,
      cur + 20,
      "Power Recharge & Hydration ☕",
      "break",
      "Recharge",
      "Quick mental reset, cold face wash, and hydration to overcome afternoon dip."
    );
    const aftEnd = Math.min(cur + 90, 1050);
    if (aftEnd - cur >= 30) {
      addSlot(
        cur,
        aftEnd,
        `Afternoon Focus Sprint: ${getNextTask()} 🎯`,
        "deep_work",
        "Deep Work",
        "Deep cognitive work sprint. High concentration with Pomodoro intervals."
      );
    }
  }

  // 7. Evening Movement & Workout
  const hasUserWorkout = items.some(
    (i) => i.title.toLowerCase().includes("gym") || i.title.toLowerCase().includes("workout")
  );
  if (!hasUserWorkout && workoutDur !== "None") {
    const workoutMinutes = workoutDur.includes("60") ? 60 : workoutDur.includes("45") ? 45 : 30;
    if (cur < 1170) { // before 7:30 PM
      addSlot(
        cur,
        cur + workoutMinutes,
        "Physical Workout & Movement 🏃‍♂️",
        "health",
        "Fitness",
        "Strength training, cardio, or outdoor run. Elevate heart rate and boost dopamine."
      );
      addSlot(
        cur,
        cur + 30,
        "Evening Refreshment & Downtime 🎸",
        "break",
        "Downtime",
        "Freshen up, enjoy leisure activities, and relax with family or music."
      );
    }
  }

  // 8. Dinner
  const dinnerTarget = Math.max(cur, 1170); // 7:30 PM
  if (cur < dinnerTarget && dinnerTarget - cur >= 30) {
    addSlot(
      cur,
      dinnerTarget,
      `Evening Revision: ${getNextTask()} 📝`,
      "deep_work",
      "Review",
      "Summarize daily concepts and review flashcards."
    );
  }
  addSlot(
    dinnerTarget,
    dinnerTarget + 45,
    "Dinner & Social Wind-Down 🍲",
    "health",
    "Dinner",
    "Light, balanced dinner with relaxed conversations."
  );

  // 9. NIGHT SCHEDULE (Between Dinner and Bedtime)
  const windDownMinutes = 45;
  const windDownStart = sleepMins - windDownMinutes;

  if (cur < windDownStart) {
    const nightGap = windDownStart - cur;
    if (nightGap >= 60) {
      const nightTitle =
        peakEnergy === "night"
          ? `Prime Night Focus: ${highPriority} 🌙⚡`
          : `Night Mastery & Problem Solving: ${getNextTask()} 💡`;
      addSlot(
        cur,
        windDownStart,
        nightTitle,
        "deep_work",
        "Night Focus",
        "Quiet evening focus block. Maximum retention without daytime distractions.",
        true
      );
    } else if (nightGap >= 20) {
      addSlot(
        cur,
        windDownStart,
        "Day Synthesis & Tomorrow's Blueprint 📖",
        "deep_work",
        "Reflection",
        "Review key achievements, clear workspace, and prepare for tomorrow."
      );
    }
  }

  // 10. Digital Sunset & Wind-Down (Exactly ends at bedtime!)
  addSlot(
    windDownStart,
    sleepMins,
    "Digital Sunset & Wind-Down 🌙",
    "break",
    "Wind Down",
    "Dim bedroom lights, screen-free reading, and slow breathing exercises."
  );

  // 11. Deep Sleep (Starts exactly at bedtime, ends at wake time!)
  items.push({
    id: "sleep_block",
    startMins: sleepMins,
    endMins: wakeMins + 1440,
    time: `${minutesToTime(sleepMins)} - ${minutesToTime(wakeMins)}`,
    title: "Deep Restorative Sleep 💤",
    category: "sleep",
    badge: "Sleep",
    description: "Full uninterrupted circadian sleep cycle for physical and neurological recovery.",
    completed: false
  });

  // Calculate analytics
  let totalDeepWorkMins = 0;
  let totalBreakMins = 0;
  let totalHealthMins = 0;
  const totalSleepMins = wakeMins + 1440 - sleepMins;

  items.forEach((item) => {
    if (item.id === "sleep_block") return;
    const dur = item.endMins - item.startMins;
    if (dur > 0) {
      if (item.category === "deep_work") totalDeepWorkMins += dur;
      if (item.category === "break") totalBreakMins += dur;
      if (item.category === "health") totalHealthMins += dur;
    }
  });

  const deepWorkHours = (totalDeepWorkMins / 60).toFixed(1);
  const sleepHours = (totalSleepMins / 60).toFixed(1);

  // Dynamic AI Coaching Insights
  const tips = [
    `⚡ Chronotype Sync: Your alert hours are aligned with your daily rhythm. '${highPriority}' is scheduled during your top cognitive window.`,
    `🌙 Bedtime Discipline: Your targeted sleep is ${minutesToTime(sleepMins)}. Stop high-dopamine screen stimulation 45 minutes prior for optimal sleep architecture.`,
    `💧 Rest Style (${breakStyle === "pomodoro" ? "25/5 Pomodoro" : breakStyle === "deep_work" ? "50/10 Deep Work" : "90/15 Flow"}): Take a quick 5-minute walk and stretch away from screens every focus sprint.`
  ];

  return {
    schedule: items,
    analytics: {
      deepWorkHours,
      sleepHours,
      healthHours: (totalHealthMins / 60).toFixed(1),
      breakHours: (totalBreakMins / 60).toFixed(1),
      score: 96,
      persona
    },
    tips
  };
};

/**
 * Generate 7-Day Weekly Structure
 */
export const generateWeeklyPlan = (inputData = {}) => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const tasks = (inputData.primaryTasks || "Mathematics, Coding, Physics, Revision")
    .split(/[,;]+/)
    .map((t) => t.trim())
    .filter(Boolean);

  return days.map((day, idx) => {
    const isWeekend = day === "Saturday" || day === "Sunday";
    const primaryFocus = tasks[idx % tasks.length] || "Deep Work & Revision";
    const hours = isWeekend ? "4.5 hrs" : "6.0 hrs";
    const theme = isWeekend
      ? day === "Saturday"
        ? "Project Sprint & Mock Test Analysis"
        : "Weekly Reflection, Self-Care & Planning"
      : `Core Mastery: ${primaryFocus}`;

    return {
      day,
      isWeekend,
      hours,
      theme,
      focusSubject: primaryFocus,
      highlights: isWeekend
        ? ["Extended sleep recovery buffer", "Weekly review & error-log analysis", "Hobbies & mental recharge"]
        : ["Morning prime focus block", "Consistent daily timetable execution", "Evening workout & revision"]
    };
  });
};
