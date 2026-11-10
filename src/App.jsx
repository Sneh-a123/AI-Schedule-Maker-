import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./component/Home";
import StudyScheduleGenerator from "./component/StudyScheduleGenerator";
import QuestionsForm from "./component/QuestionsForm";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/study-schedule" element={<StudyScheduleGenerator />} />
        <Route path="/schedule" element={<StudyScheduleGenerator />} />
        <Route path="/questions" element={<QuestionsForm />} />
      </Routes>
    </BrowserRouter>
  );
}
