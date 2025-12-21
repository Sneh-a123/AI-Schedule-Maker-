import { useLocation } from "react-router-dom";
import { useState } from "react";

/* 🎨 Colors */
const colors = {
  Study: "bg-blue-100",
  Play: "bg-green-100",
  Sleep: "bg-purple-100",
  Breakfast: "bg-yellow-100",
  Lunch: "bg-yellow-200",
  "School / College": "bg-gray-100",
  Revision: "bg-indigo-100",
  "Wake up & Freshen up": "bg-orange-100",
  "Exercise / Yoga": "bg-emerald-100",
  "Light Study": "bg-blue-50",
};

/* ⏱ Time helper */
const addMinutes = (time, mins) => {
  const [t, meridiem] = time.split(" ");
  let [h, m] = t.split(":").map(Number);
  if (meridiem === "PM" && h !== 12) h += 12;
  if (meridiem === "AM" && h === 12) h = 0;

  let total = h * 60 + m + mins;
  let nh = Math.floor(total / 60) % 24;
  let nm = total % 60;

  const period = nh >= 12 ? "PM" : "AM";
  nh = nh % 12 || 12;

  return `${nh}:${nm.toString().padStart(2, "0")} ${period}`;
};

const timeToMinutes = (time) => {
  const [t, mer] = time.split(" ");
  let [h, m] = t.split(":").map(Number);
  if (mer === "PM" && h !== 12) h += 12;
  if (mer === "AM" && h === 12) h = 0;
  return h * 60 + m;
};

export default function StudyScheduleGenerator() {
  const location = useLocation();
  const answers = location.state || {};

  const generateSchedule = (answers) => {
    const schedule = [];
    const wakeUp = answers[6] || "7:00 AM";
    const sleepTime = answers[8] || "9:00 PM";

    let sleepMinutes = timeToMinutes(sleepTime);
    if (sleepTime === "12:00 AM") sleepMinutes = 1440; // Handle midnight as end of day for comparisons

    const isTodayHoliday = (answers[1] || "no").toLowerCase() === "yes";
    const isWholeWeekHoliday = (answers[2] || "no").toLowerCase() === "yes";

    const schoolTime = answers[3];
    const hasOtherPlan = (answers[4] || "no").toLowerCase() === "yes";
    const otherPlanTime = answers[5];
    const subjectsInput = answers[7] || "";
    const moreTimeSubject = answers[9];
    const lessTimeSubject = answers[10];

    // Split subjects by comma or space for flexibility
    const subjectsArray = subjectsInput
      .split(/[, ]+/)
      .map((s) => s.trim())
      .filter(Boolean);

    let currentTime = wakeUp;

    // Morning routine
    const freshEnd = addMinutes(currentTime, 30);
    schedule.push({
      time: `${currentTime} - ${freshEnd}`,
      activity: "Wake up & Freshen up",
    });
    currentTime = freshEnd;

    const exerciseEnd = addMinutes(currentTime, 30);
    schedule.push({
      time: `${currentTime} - ${exerciseEnd}`,
      activity: "Exercise / Yoga",
    });
    currentTime = exerciseEnd;

    const breakfastEnd = addMinutes(currentTime, 30);
    schedule.push({
      time: `${currentTime} - ${breakfastEnd}`,
      activity: "Breakfast",
    });
    currentTime = breakfastEnd;

    // School / Holiday
    if (!isTodayHoliday && !isWholeWeekHoliday && schoolTime) {
      schedule.push({ time: schoolTime, activity: "School / College" });
      currentTime = schoolTime.split("-")[1].trim();
    } else {
      const studyEnd = addMinutes(currentTime, 120);
      schedule.push({
        time: `${currentTime} - ${studyEnd}`,
        activity: moreTimeSubject
          ? `Study (${moreTimeSubject})`
          : "Light Study",
      });
      currentTime = studyEnd;
    }

    // Lunch (adjusted to be after currentTime if school ends late)
    const LUNCH_DURATION = 45;
    let lunchStartTime = "12:30 PM";
    if (timeToMinutes(currentTime) > timeToMinutes(lunchStartTime)) {
      lunchStartTime = currentTime;
    }
    const lunchEnd = addMinutes(lunchStartTime, LUNCH_DURATION);
    if (timeToMinutes(currentTime) < timeToMinutes(lunchStartTime)) {
      schedule.push({
        time: `${currentTime} - ${lunchStartTime}`,
        activity: "Light Study / Reading",
      });
    }
    schedule.push({
      time: `${lunchStartTime} - ${lunchEnd}`,
      activity: "Lunch + Rest",
    });
    currentTime = lunchEnd;

    // After lunch - Priority Study with other plan handling
    let firstStudyEnd = addMinutes(currentTime, 90);
    if (hasOtherPlan && otherPlanTime) {
      const [planStart, planEnd] = otherPlanTime
        .split("-")
        .map((t) => t.trim());
      const planStartMin = timeToMinutes(planStart);
      const firstStudyEndMin = timeToMinutes(firstStudyEnd);
      const currentMin = timeToMinutes(currentTime);

      if (currentMin < planStartMin && firstStudyEndMin > planStartMin) {
        // Part 1: study before other activity
        const firstPartEnd = planStart;
        schedule.push({
          time: `${currentTime} - ${firstPartEnd}`,
          activity: "Study (Priority Subject)",
        });

        // Other activity
        schedule.push({
          time: otherPlanTime,
          activity: "Other Activity / Personal Work",
        });

        // Part 2: study after other activity
        const remainingMinutes = firstStudyEndMin - planStartMin;
        currentTime = planEnd;
        firstStudyEnd = addMinutes(currentTime, remainingMinutes);
        schedule.push({
          time: `${currentTime} - ${firstStudyEnd}`,
          activity: "Study (Priority Subject)",
        });
        currentTime = firstStudyEnd;
      } else {
        // No overlap, add normally
        schedule.push({
          time: `${currentTime} - ${firstStudyEnd}`,
          activity: "Study (Priority Subject)",
        });
        currentTime = firstStudyEnd;
      }
    } else {
      schedule.push({
        time: `${currentTime} - ${firstStudyEnd}`,
        activity: "Study (Priority Subject)",
      });
      currentTime = firstStudyEnd;
    }

    // Break with other plan handling
    let breakEnd = addMinutes(currentTime, 30);
    if (hasOtherPlan && otherPlanTime) {
      const [planStart, planEnd] = otherPlanTime
        .split("-")
        .map((t) => t.trim());
      const planStartMin = timeToMinutes(planStart);
      const breakEndMin = timeToMinutes(breakEnd);
      const currentMin = timeToMinutes(currentTime);

      if (currentMin < planStartMin && breakEndMin > planStartMin) {
        // Part 1: break before other activity
        const firstPartEnd = planStart;
        schedule.push({
          time: `${currentTime} - ${firstPartEnd}`,
          activity: "Break / Relax",
        });

        // Other activity (if not already added)
        if (
          !schedule.some(
            (item) => item.activity === "Other Activity / Personal Work"
          )
        ) {
          schedule.push({
            time: otherPlanTime,
            activity: "Other Activity / Personal Work",
          });
        }

        // Part 2: break after other activity
        const remainingMinutes = breakEndMin - planStartMin;
        currentTime = planEnd;
        breakEnd = addMinutes(currentTime, remainingMinutes);
        schedule.push({
          time: `${currentTime} - ${breakEnd}`,
          activity: "Break / Relax",
        });
        currentTime = breakEnd;
      } else {
        // No overlap, add normally
        schedule.push({
          time: `${currentTime} - ${breakEnd}`,
          activity: "Break / Relax",
        });
        currentTime = breakEnd;
      }
    } else {
      schedule.push({
        time: `${currentTime} - ${breakEnd}`,
        activity: "Break / Relax",
      });
      currentTime = breakEnd;
    }

    // Flexible subject-wise study with other activity handling
    const TOTAL_STUDY_MINUTES = 180;
    const baseTime = subjectsArray.length
      ? Math.floor(TOTAL_STUDY_MINUTES / subjectsArray.length)
      : 60;

    subjectsArray.forEach((subject) => {
      let minutes = baseTime;
      if (
        moreTimeSubject &&
        subject.toLowerCase() === moreTimeSubject.toLowerCase()
      )
        minutes += 15;
      if (
        lessTimeSubject &&
        subject.toLowerCase() === lessTimeSubject.toLowerCase()
      )
        minutes -= 15;

      let studyEnd = addMinutes(currentTime, minutes);

      // Handle overlap with other activity
      if (hasOtherPlan && otherPlanTime) {
        const [planStart, planEnd] = otherPlanTime
          .split("-")
          .map((t) => t.trim());
        const planStartMin = timeToMinutes(planStart);
        const studyEndMin = timeToMinutes(studyEnd);
        const currentMin = timeToMinutes(currentTime);

        if (currentMin < planStartMin && studyEndMin > planStartMin) {
          // Part 1: study before other activity
          const firstPartEnd = planStart;
          schedule.push({
            time: `${currentTime} - ${firstPartEnd}`,
            activity: `Study (${subject})`,
          });

          // Other activity (if not already added)
          if (
            !schedule.some(
              (item) => item.activity === "Other Activity / Personal Work"
            )
          ) {
            schedule.push({
              time: otherPlanTime,
              activity: "Other Activity / Personal Work",
            });
          }

          // Part 2: study after other activity
          const remainingMinutes = studyEndMin - planStartMin;
          currentTime = planEnd;
          studyEnd = addMinutes(currentTime, remainingMinutes);
          schedule.push({
            time: `${currentTime} - ${studyEnd}`,
            activity: `Study (${subject})`,
          });
          currentTime = studyEnd;
          return; // next subject
        }
      }

      // Normal study block
      schedule.push({
        time: `${currentTime} - ${studyEnd}`,
        activity: `Study (${subject})`,
      });
      currentTime = studyEnd;
    });

    // Play (only if before sleep time)
    if (timeToMinutes(currentTime) < sleepMinutes) {
      const playEnd = addMinutes(currentTime, 60);
      if (timeToMinutes(playEnd) <= sleepMinutes) {
        schedule.push({
          time: `${currentTime} - ${playEnd}`,
          activity: "Play",
        });
        currentTime = playEnd;
      } else {
        // Adjust play to end at sleep time
        schedule.push({
          time: `${currentTime} - ${sleepTime}`,
          activity: "Play",
        });
        currentTime = sleepTime;
      }
    }

    // Main Study (only if before sleep time)
    if (timeToMinutes(currentTime) < sleepMinutes) {
      const mainStudyEnd = addMinutes(currentTime, 90);
      if (timeToMinutes(mainStudyEnd) <= sleepMinutes) {
        schedule.push({
          time: `${currentTime} - ${mainStudyEnd}`,
          activity: moreTimeSubject ? `Study (${moreTimeSubject})` : "Study",
        });
        currentTime = mainStudyEnd;
      } else {
        // Adjust to end at sleep time
        schedule.push({
          time: `${currentTime} - ${sleepTime}`,
          activity: moreTimeSubject ? `Study (${moreTimeSubject})` : "Study",
        });
        currentTime = sleepTime;
      }
    }

    // Revision (only if before sleep time)
    if (timeToMinutes(currentTime) < sleepMinutes) {
      const revisionEnd = addMinutes(currentTime, 45);
      if (timeToMinutes(revisionEnd) <= sleepMinutes) {
        schedule.push({
          time: `${currentTime} - ${revisionEnd}`,
          activity: lessTimeSubject
            ? `Revision (${lessTimeSubject})`
            : "Revision",
        });
        currentTime = revisionEnd;
      } else {
        // Adjust to end at sleep time
        schedule.push({
          time: `${currentTime} - ${sleepTime}`,
          activity: lessTimeSubject
            ? `Revision (${lessTimeSubject})`
            : "Revision",
        });
        currentTime = sleepTime;
      }
    }

    // Dinner / relax (only if before sleep time)
    if (timeToMinutes(currentTime) < sleepMinutes) {
      const relaxEnd = addMinutes(currentTime, 45);
      if (timeToMinutes(relaxEnd) <= sleepMinutes) {
        schedule.push({
          time: `${currentTime} - ${relaxEnd}`,
          activity: "Dinner + Family Time",
        });
        currentTime = relaxEnd;
      } else {
        // Adjust to end at sleep time
        schedule.push({
          time: `${currentTime} - ${sleepTime}`,
          activity: "Dinner + Family Time",
        });
        currentTime = sleepTime;
      }
    }

    // Wind down before sleep
    if (timeToMinutes(currentTime) < sleepMinutes) {
      schedule.push({
        time: `${currentTime} - ${sleepTime}`,
        activity: "Relax / Wind Down (No Screen)",
      });
    }

    // Sleep
    const sleepMin = timeToMinutes(sleepTime);
    const wakeMin = timeToMinutes(wakeUp);
    if (sleepMin < wakeMin) {
      schedule.push({ time: `${sleepTime} - ${wakeUp}`, activity: "Sleep" });
    } else {
      schedule.push({ time: `${sleepTime} - 11:59 PM`, activity: "Sleep" });
      schedule.push({ time: `12:00 AM - ${wakeUp}`, activity: "Sleep" });
    }

    return schedule;
  };

  const [schedule, setSchedule] = useState(() =>
    generateSchedule(answers || {})
  );
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-purple-50 p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-700">
        AI Study Timetable
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {schedule.map((item, index) => {
          const activityType = Object.keys(colors).find((key) =>
            item.activity.includes(key)
          );
          const bgColor = colors[activityType] || "bg-white";

          return (
            <div
              key={index}
              className={`${bgColor} p-4 rounded-2xl shadow-lg cursor-pointer`}
              onClick={() => setActiveIndex(index)}
            >
              <div className="font-semibold text-gray-600 mb-1">
                {item.time}
              </div>
              {activeIndex === index ? (
                <input
                  value={item.activity}
                  onChange={(e) => {
                    const updated = [...schedule];
                    updated[index].activity = e.target.value;
                    setSchedule(updated);
                  }}
                  className="w-full border rounded px-2 py-1"
                />
              ) : (
                <div className="font-medium text-gray-800">{item.activity}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
