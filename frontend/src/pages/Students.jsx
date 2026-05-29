import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlusCircle,
  Search,
  Filter,
  User,
  Phone,
  Book,
  Layers,
  MoreVertical,
  Trash2,
} from "lucide-react";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [form, setForm] = useState({
    name: "",
    phone: "",
    class: "",
    subject: [], // multiple subjects
    type: "Institution",
    fees: "",
    joiningDate: "",
  });

  const subjectsList = [
    "Mathematics",
    "Science",
    "English",
    "Social Studies",
    "Computer Science",
    "Accounts",
    "Economics",
  ];
  // Filters
  const [classFilter, setClassFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [feeFilter, setFeeFilter] = useState("All");
  const [toast, setToast] = useState(null);

  const fetchStudents = async () => {
    try {
      const response = await fetch(`${API_URL}/api/students`);

      if (!response.ok) {
        throw new Error("Failed to fetch students");
      }

      const data = await response.json();

      setStudents(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleAddStudent = async () => {
    try {
      const method = editingStudent ? "PUT" : "POST";

      const url = editingStudent
        ? `${API_URL}/api/students/${editingStudent._id}`
        : `${API_URL}/api/students`;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);

        alert(errorData.message || "Failed to save student");
        return;
      }

      fetchStudents();

      setShowForm(false);
      setEditingStudent(null);

      // RESET FORM
      setForm({
        name: "",
        phone: "",
        class: "",
        subject: [],
        type: "Institution",
        fees: "",
      });
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    await fetch(`${API_URL}/api/students/${id}`, {
      method: "DELETE",
    });
    setSelectedStudent(null);
    fetchStudents();
  };

  const handleUpdate = async (id, updatedData) => {
    await fetch(`${API_URL}/api/students/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });

    fetchStudents();

    setSuccessMsg("Saved successfully ✅");

    setTimeout(() => {
      setSuccessMsg("");
    }, 2000);
  };

  const handleSubjectChange = (subject) => {
    setForm((prev) => {
      const exists = prev.subject.includes(subject);
      return {
        ...prev,
        subject: exists
          ? prev.subject.filter((s) => s !== subject)
          : [...prev.subject, subject],
      };
    });
  };

  const filteredStudents = students.filter((s) => {
    return (
      s.name.toLowerCase().includes(search.toLowerCase()) &&
      (classFilter === "All" || s.class === classFilter) &&
      (typeFilter === "All" || s.type === typeFilter) &&
      (subjectFilter === "All" || s.subject?.includes(subjectFilter)) &&
      (feeFilter === "All" ||
        (feeFilter === "low" && s.fees < 3000) ||
        (feeFilter === "medium" && s.fees >= 3000 && s.fees <= 6000) ||
        (feeFilter === "high" && s.fees > 6000))
    );
  });
  return (
    <div className="p-4 md:p-6 w-full bg-gray-50 min-h-screen">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search student..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-xl"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="flex items-center justify-center gap-2 bg-black text-white px-4 py-2 rounded-xl"
        >
          <PlusCircle size={18} /> Add Student
        </motion.button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <Filter size={18} className="text-gray-500" />

        <select
          onChange={(e) => setClassFilter(e.target.value)}
          className="px-4 py-2 border rounded-xl"
        >
          <option value="All">Classes</option>
          <option value="Nursery">Nursery</option>
          <option value="KG">KG</option>
          <option value="1st">1st</option>
          <option value="2nd">2nd</option>
          <option value="3rd">3rd</option>
          <option value="4th">4th</option>
          <option value="5th">5th</option>
          <option value="6th">6th</option>
          <option value="7th">7th</option>
          <option value="8th">8th</option>
          <option value="9th">9th</option>
          <option value="10th">10th</option>
          <option value="11th">11th</option>
          <option value="12th">12th</option>
        </select>

        <select
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2 border rounded-xl"
        >
          <option value="All">Type</option>
          <option value="Home">Home Tuition</option>
          <option value="Institution">Institution</option>
        </select>

        <select
          onChange={(e) => setSubjectFilter(e.target.value)}
          className="px-4 py-2 border rounded-xl"
        >
          <option value="All">Subjects</option>
          <option value="Mathematics">Mathematics</option>
          <option value="Science">Science</option>
          <option value="English">English</option>
          <option value="Accounts">Accounts</option>
        </select>

        <select
          onChange={(e) => setFeeFilter(e.target.value)}
          className="px-4 py-2 border rounded-xl"
        >
          <option value="All">Fees</option>
          <option value="low">Below ₹3000</option>
          <option value="medium">₹3000 - ₹6000</option>
          <option value="high">Above ₹6000</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-sm">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Class</th>
              <th className="p-3">Subject</th>
              <th className="p-3">Type</th>
              <th className="p-3">Fees</th>
              <th className="p-3">Joining Date</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {filteredStudents.map((s) => (
              <tr key={s._id} className="border-b">
                <td className="p-3">{s.name}</td>
                <td className="p-3">{s.phone}</td>
                <td className="p-3">{s.class}</td>
                <td className="p-3">{s.subject.join(" ")}</td>
                <td className="p-3">{s.type}</td>
                <td className="p-3">₹{s.fees}</td>
                <td className="p-3">
                  {new Date(s.joiningDate).toLocaleDateString("en-GB")}
                </td>

                <td className="p-3 text-right">
                  <button
                    onClick={() => {
                      setSelectedStudent(s);
                      setForm(s);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <MoreVertical size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Student Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center px-4 z-50">
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <PlusCircle size={20} /> Add Student
              </h2>
            </div>

            {/* Name */}
            <div className="flex items-center border rounded-xl mb-3 px-3 focus-within:ring-2 focus-within:ring-black/20">
              <User size={16} className="text-gray-500" />
              <input
                placeholder="Student Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full p-2 outline-none"
              />
            </div>

            {/* Phone */}
            <div className="flex items-center border rounded-xl mb-3 px-3 focus-within:ring-2 focus-within:ring-black/20">
              <Phone size={16} className="text-gray-500" />
              <input
                placeholder="Phone Number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full p-2 outline-none"
              />
            </div>

            {/* Class */}
            <select
              value={form.class}
              onChange={(e) => setForm({ ...form, class: e.target.value })}
              className="w-full mb-3 px-3 py-2 border rounded-xl focus:ring-2 focus:ring-black/20"
            >
              <option value="">Select Class</option>
              <option>Nursery</option>
              <option>KG</option>
              <option>1st</option>
              <option>2nd</option>
              <option>3rd</option>
              <option>4th</option>
              <option>5th</option>
              <option>6th</option>
              <option>7th</option>
              <option>8th</option>
              <option>9th</option>
              <option>10th</option>
              <option>11th</option>
              <option>12th</option>
            </select>

            {/* Subjects */}
            <div className="mb-4">
              <p className="text-sm font-medium mb-2 flex items-center gap-2">
                <Book size={16} /> Subjects
              </p>
              <div className="flex flex-wrap gap-2">
                {subjectsList.map((sub) => (
                  <motion.button
                    key={sub}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={() => handleSubjectChange(sub)}
                    className={`px-3 py-1 rounded-full text-sm border transition ${
                      form.subject.includes(sub)
                        ? "bg-black text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    {sub}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Type */}
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full mb-3 px-3 py-2 border rounded-xl focus:ring-2 focus:ring-black/20"
            >
              <option value="Institution">Institution</option>
              <option value="Home">Home Tuition</option>
            </select>

            {/* Fees */}
            <div className="flex items-center border rounded-xl mb-3 px-3 focus-within:ring-2 focus-within:ring-black/20">
              <Layers size={16} className="text-gray-500" />
              <input
                placeholder="Fees Amount"
                value={form.fees}
                onChange={(e) => setForm({ ...form, fees: e.target.value })}
                className="w-full p-2 outline-none"
              />
            </div>
            {/* JOINING DATE */}

            <div className="flex items-center border rounded-xl mb-3 px-3 focus-within:ring-2 focus-within:ring-black/20">
              <input
                type="date"
                value={form.joiningDate}
                onChange={(e) =>
                  setForm({
                    ...form,
                    joiningDate: e.target.value,
                  })
                }
                className="w-full p-2 outline-none"
              />
            </div>
            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-xl border hover:bg-gray-100"
              >
                Cancel
              </button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleAddStudent}
                className="px-4 py-2 rounded-xl bg-black text-white hover:opacity-90"
              >
                Save Student
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
      {/* RIGHT DRAWER */}
      {/* RIGHT DRAWER */}
      <AnimatePresence>
        {selectedStudent && (
          <>
            {/* BACKDROP */}
            <motion.div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStudent(null)}
            />

            {/* SIDEBAR */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 120 }}
              className="fixed right-0 top-0 h-full w-[390px] bg-white shadow-2xl z-50 p-6 overflow-y-auto"
            >
              {/* HEADER */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Manage Student</h2>

                <button
                  onClick={() => setSelectedStudent(null)}
                  className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-xl"
                >
                  ✕
                </button>
              </div>

              {/* FORM */}
              <div className="space-y-4">
                {/* NAME */}
                <div>
                  <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <User size={16} />
                    Student Name
                  </label>

                  <input
                    type="text"
                    value={form.name || ""}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Enter name"
                    className="w-full border border-gray-200 p-3 rounded-xl mt-1 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                {/* PHONE */}
                <div>
                  <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <Phone size={16} />
                    Phone Number
                  </label>

                  <input
                    type="text"
                    value={form.phone || ""}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    placeholder="Enter phone number"
                    className="w-full border border-gray-200 p-3 rounded-xl mt-1 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                {/* CLASS */}
                <div>
                  <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <Layers size={16} />
                    Class
                  </label>

                  <select
                    value={form.class || ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        class: e.target.value,
                      })
                    }
                    className="w-full border border-gray-200 p-3 rounded-xl mt-1 focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="">Select Class</option>
                    <option value="Nursery">Nursery</option>
                    <option value="KG">KG</option>
                    <option value="1st">1st</option>
                    <option value="2nd">2nd</option>
                    <option value="3rd">3rd</option>
                    <option value="4th">4th</option>
                    <option value="5th">5th</option>
                    <option value="6th">6th</option>
                    <option value="7th">7th</option>
                    <option value="8th">8th</option>
                    <option value="9th">9th</option>
                    <option value="10th">10th</option>
                    <option value="11th">11th</option>
                    <option value="12th">12th</option>
                  </select>
                </div>

                {/* SUBJECTS */}
                <div>
                  <label className="text-sm font-medium text-gray-600 flex items-center gap-2 mb-3">
                    <Book size={16} />
                    Subjects
                  </label>

                  <div className="flex flex-wrap gap-2">
                    {subjectsList.map((subject) => (
                      <button
                        type="button"
                        key={subject}
                        onClick={() => {
                          const alreadySelected =
                            form.subject?.includes(subject);

                          setForm({
                            ...form,
                            subject: alreadySelected
                              ? form.subject.filter((s) => s !== subject)
                              : [...(form.subject || []), subject],
                          });
                        }}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-300
                  ${
                    form.subject?.includes(subject)
                      ? "bg-black text-white border-black scale-105"
                      : "bg-white text-black border-gray-300 hover:bg-gray-100"
                  }`}
                      >
                        {subject}
                      </button>
                    ))}
                  </div>
                </div>

                {/* TUITION TYPE */}
                <div>
                  <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <Book size={16} />
                    Tuition Type
                  </label>

                  <select
                    value={form.type || ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        type: e.target.value,
                      })
                    }
                    className="w-full border border-gray-200 p-3 rounded-xl mt-1 focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="">Select Type</option>
                    <option value="Institution">Institution</option>
                    <option value="Home">Home Tuition</option>
                  </select>
                </div>

                {/* FEES */}
                <div>
                  <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <Layers size={16} />
                    Fees
                  </label>

                  <input
                    type="number"
                    value={form.fees || ""}
                    onChange={(e) => setForm({ ...form, fees: e.target.value })}
                    placeholder="Enter fees"
                    className="w-full border border-gray-200 p-3 rounded-xl mt-1 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>

              {/* BUTTONS */}
              <div className="mt-8 space-y-3">
                {/* SAVE */}
                <button
                  onClick={async () => {
                    await handleUpdate(selectedStudent._id, form);

                    setSelectedStudent(null);

                    setToast({
                      type: "success",
                      message: "✅ Student updated successfully",
                    });

                    setTimeout(() => {
                      setToast(null);
                    }, 2000);
                  }}
                  className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02]"
                >
                  Save Changes
                </button>

                {/* DELETE */}
                <button
                  onClick={async () => {
                    await handleDelete(selectedStudent._id);

                    setSelectedStudent(null);

                    setToast({
                      type: "delete",
                      message: "🗑️ Student deleted successfully",
                    });

                    setTimeout(() => {
                      setToast(null);
                    }, 2000);
                  }}
                  className="w-full flex items-center justify-center gap-2 text-red-600 border border-red-200 hover:bg-red-50 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02]"
                >
                  <Trash2 size={16} />
                  Delete Student
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {/* TOAST MESSAGE */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className={`fixed top-5 right-5 z-[100] px-5 py-3 rounded-xl shadow-lg text-white font-medium
      ${toast.type === "success" ? "bg-green-500" : "bg-red-500"}`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
