import { useNavigate } from "react-router-dom";
import { Brain } from "lucide-react";
import Spline from "@splinetool/react-spline";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen ">
      {/* 🔵 NAVBAR (NO SPLINE HERE) */}
      <header className="bg-black backdrop-blur-md shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Brain className="w-8 h-8 text-cyan-400" />
            <span className="text-xl font-semibold text-white tracking-wide">
              AdaptiveOps
            </span>
          </div>
        </div>
      </header>

      {/* 🔵 HERO + WEBSITE BACKGROUND */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Spline background starts HERE */}
        {/* Spline */}
        <div className="absolute inset-0">
          <Spline scene="https://prod.spline.design/duvnyPiYtAEEpfvu/scene.splinecode" />
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-32 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 drop-shadow-lg">
            Personalized Study & Work Schedules Powered by AI
          </h1>

          <p className="text-blue-200 text-lg mb-12 max-w-2xl mx-auto">
            Smart AI-powered schedules tailored to your goals, time, and
            productivity.
          </p>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate("/questions")}
              className="px-8 py-4 bg-linear-to-r from-cyan-500 to-blue-600 text-white 
             rounded-full shadow-xl hover:scale-105 transition-all duration-300"
            >
              📘 Generate Study Schedule
            </button>

            {/* <button
              className="px-8 py-4 bg-white/90 text-blue-700 rounded-full shadow-lg
             hover:bg-white hover:scale-105 transition-all duration-300"
            >
              📝 Generate Work Schedule
            </button> */}
          </div>
        </div>
      </section>
    </div>
  );
}
