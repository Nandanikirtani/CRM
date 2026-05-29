import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";

import Students from "./pages/Students";

import FeesPage from "./pages/Fees";

import TeachersPage from "./pages/Teachers";

import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-100">
        {/* SIDEBAR */}

        <Sidebar />

        {/* MAIN CONTENT */}

        <main
          className="
            transition-all duration-300

            md:ml-64

            pt-[72px]
            md:pt-0

            min-h-screen
          "
        >
          <Routes>
            <Route path="/students" element={<Students />} />
            <Route path="/fees" element={<FeesPage />} />
            <Route path="/teachers" element={<TeachersPage />} />
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
