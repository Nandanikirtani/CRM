import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Students from "./pages/Students";

export default function App() {
  return (
    <Router>
      <div className="flex">
        <Sidebar />

        <div className="flex-1 md:ml-64 mt-16 md:mt-0 p-4">
          <Routes>
            <Route path="/students" element={<Students />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}