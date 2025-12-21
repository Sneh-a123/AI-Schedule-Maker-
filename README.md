AI Study Timetable Generator
Overview

AI Study Timetable Generator is a React-based application that creates a personalized daily schedule for students based on their inputs. The app intelligently handles school/college timings, study priorities, break times, and personal activities using a rule-based approach. Students can also edit activities directly in the UI for flexibility.

The generated timetable includes blocks for:

Morning routine (wake up, freshen up, exercise, breakfast)

School/College (fixed timing if applicable)

Study sessions (priority subject & subject-wise allocation)

Lunch and rest

Breaks and play

Revision and main study

Dinner/family time and wind-down

Sleep

The timetable adapts for college days, holidays, and custom activities.

Features

Dynamic schedule generation based on user inputs.

Handles college vs holiday logic automatically.

Subject priority handling: Allocate more or less time for specific subjects.

Flexible activity blocks: Users can edit activities directly in the UI.

Color-coded activities for better visualization:

Study: Blue

Play: Green

Sleep: Purple

Meals: Yellow

School/College: Gray

Exercise: Emerald

Revision: Indigo

Technologies Used

React (Function Components)

React Router (useLocation) for passing user inputs

Framer Motion (for animations)

Tailwind CSS for styling

JavaScript (ES6)
How to Use

Provide your inputs through a form (or via location.state in React Router):

Wake Up Time

Sleep Time

Is Today a Holiday?

Is Whole Week a Holiday?

School/College Timing

Other Activities (optional)

Subjects (comma-separated)

Priority Subject (more time)

Less Time Subject (optional)

The AI generates a daily schedule automatically.

Click on any activity block to edit the activity manually.

Example Schedule Output
7:00 AM - 7:30 AM   Wake up & Freshen up
7:30 AM - 8:00 AM   Exercise / Yoga
8:00 AM - 8:30 AM   Breakfast
9:00 AM - 3:00 PM   School / College
12:30 PM - 1:15 PM  Lunch + Rest
1:15 PM - 2:45 PM   Study (Priority Subject)
2:45 PM - 3:15 PM   Break / Relax
3:15 PM - 5:00 PM   Study (Software ML FSWD SR DWDM)
5:00 PM - 6:00 PM   Play
6:00 PM - 7:30 PM   Study (Other Subjects)
7:30 PM - 8:15 PM   Revision (Less Time Subject)
8:15 PM - 9:00 PM   Dinner + Family Time
9:00 PM - 10:00 PM  Relax / Wind Down
10:00 PM - 7:00 AM Sleep

Customization

Add/Remove subjects: Update the subjectsInput array in the input form.

Change activity duration: Modify constants like TOTAL_STUDY_MINUTES, LUNCH_DURATION, or block-specific minutes in generateSchedule.

Add more activity types: Add new entries in the colors object for automatic color coding.

Change UI styles: Modify Tailwind classes in StudyScheduleGenerator.jsx.

Folder Structure
/src
 ├─ /components
 │    └─ StudyScheduleGenerator.jsx
 ├─ /pages
 ├─ App.jsx
 ├─ index.js
 └─ styles.css

Notes

The app automatically adjusts schedule blocks if there is a conflict with Other Activities.

School/College blocks are treated as fixed; AI schedules the rest around them.

Works for both college-going days and holiday days.

Future Improvements

Add weekly timetable generation.

Integrate notifications or reminders for each activity.

Add AI suggestions for time optimization.

Save schedule to PDF or shareable link.
