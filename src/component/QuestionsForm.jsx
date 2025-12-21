import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion as Motion } from "framer-motion";

const questions = [
  {
    id: 1,
    question: "Today is holiday?",
    placeholder: "Enter yes or no",
  },
  {
    id: 2,
    question: "Is the whole week a holiday?",
    placeholder: "Enter yes or no",
  },
  {
    id: 3,
    question: "In which time you go college and school and when come?",
    placeholder: "Enter time (e.g. 9:00 AM - 3:00 PM) ",
  },
  {
    id: 4,
    question: "You have a another plan in this week or today?",
    placeholder: "Enter yes or no",
  },
  {
    id: 5,
    question: "In which time You have another plan?",
    placeholder: "Enter time (e.g. 3:00 PM - 4:00 PM) ",
  },
  {
    id: 6,
    question: "What time does the you wake up?",
    placeholder: "e.g. 7:00 AM",
  },
  {
    id: 7,
    question: "How much subject You have write name of subject?",
    placeholder: "e.g. Math, English, Hindi",
  },
  {
    id: 8,
    question: "What time does the you go to sleep?",
    placeholder: "e.g. 9:00 PM",
  },
  {
    id: 9,
    question: "Which Subject need more time?",
    placeholder: "Enter subject name",
  },
  {
    id: 10,
    question: "Which Subject need less time?",
    placeholder: "Enter subject name",
  },
];

// Helper function to validate time format (e.g., "9:00 AM" or "9:00 AM - 3:00 PM")
const isValidTime = (time) => {
  const timeRegex = /^(\d{1,2}:\d{2} (AM|PM))( - \d{1,2}:\d{2} (AM|PM))?$/;
  return timeRegex.test(time);
};

// Helper function to validate yes/no
const isValidYesNo = (answer) => {
  const lower = answer.toLowerCase();
  return lower === "yes" || lower === "no";
};

export default function QuestionsForm() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState(""); // For validation errors

  const handleNext = () => {
    const answer = answers[questions[current].id]?.trim();
    if (!answer) {
      setError("Please provide an answer.");
      return;
    }

    // Validation based on question type
    if ([1, 2, 4].includes(questions[current].id)) {
      if (!isValidYesNo(answer)) {
        setError("Please enter 'yes' or 'no'.");
        return;
      }
    } else if ([3, 5, 6, 8].includes(questions[current].id)) {
      if (!isValidTime(answer)) {
        setError(
          "Please enter a valid time format (e.g., 9:00 AM or 9:00 AM - 3:00 PM)."
        );
        return;
      }
    } else if (questions[current].id === 7) {
      if (!answer) {
        setError("Please enter at least one subject.");
        return;
      }
    } else if ([9, 10].includes(questions[current].id)) {
      if (!answer) {
        setError("Please enter a subject name.");
        return;
      }
      // Optional: Check if the subject is in the list from Q7
      const subjects =
        answers[7]?.split(/[, ]+/).map((s) => s.trim().toLowerCase()) || [];
      if (!subjects.includes(answer.toLowerCase())) {
        setError("Please enter a subject from your list.");
        return;
      }
    }

    setError(""); // Clear error

    // Conditional navigation logic
    if (current === 0) {
      if (answer.toLowerCase() === "yes") {
        setCurrent(1); // Q2
      } else {
        setCurrent(2); // Q3
      }
      return;
    }

    if (current === 1) {
      setCurrent(3); // Q4
      return;
    }

    if (current === 3 && answer.toLowerCase() === "no") {
      setCurrent(5); // Skip Q5
      return;
    }

    // Normal next
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      console.log("Final Answers:", answers);
      navigate("/study-schedule", { state: answers });
    }
  };

  const handlePrevious = () => {
    let prevIndex = current - 1;

    // Adjust for skips based on answers
    if (current === 1) {
      // From Q2, previous is Q1
      prevIndex = 0;
    } else if (current === 2) {
      // From Q3, previous is Q1
      prevIndex = 0;
    } else if (current === 3) {
      // From Q4, previous is Q2 if Q1 was yes, else Q3
      if (answers[1]?.toLowerCase() === "yes") {
        prevIndex = 1;
      } else {
        prevIndex = 2;
      }
    } else if (current === 4) {
      // From Q5, previous is Q4
      prevIndex = 3;
    } else if (current === 5) {
      // From Q6, previous is Q4 if Q4 was no, else Q5
      if (answers[4]?.toLowerCase() === "no") {
        prevIndex = 3;
      } else {
        prevIndex = 4;
      }
    } else if (current > 5) {
      // For Q7 onwards, normal previous
      prevIndex = current - 1;
    }

    if (prevIndex >= 0) {
      setCurrent(prevIndex);
      setError(""); // Clear error on back
    }
  };

  const handleChange = (e) => {
    setAnswers({
      ...answers,
      [questions[current].id]: e.target.value,
    });
    setError(""); // Clear error on change
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-100 to-purple-100 p-4">
      <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-lg text-center">
        <p className="text-sm text-gray-500 mb-2">
          Question {current + 1} of {questions.length}
        </p>

        <AnimatePresence mode="wait">
          <Motion.div
            key={questions[current].id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-xl font-semibold mb-4">
              {questions[current].question}
            </h2>

            <input
              type="text"
              placeholder={questions[current].placeholder}
              onChange={handleChange}
              value={answers[questions[current].id] || ""}
              className="w-full border rounded-xl px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          </Motion.div>
        </AnimatePresence>

        <div className="flex gap-2">
          {current > 0 && (
            <button
              onClick={handlePrevious}
              className="flex-1 bg-gray-600 text-white py-2 rounded-xl hover:bg-gray-700 transition"
            >
              Previous
            </button>
          )}
          <button
            onClick={handleNext}
            className="flex-1 bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
          >
            {current === questions.length - 1 ? "Finish" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
