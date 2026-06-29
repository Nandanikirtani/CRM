import { useEffect, useState } from "react";

import axios from "axios";

import { motion } from "framer-motion";

import {
  ChevronDown,
  Trash2,
  Plus,
  UserPlus,
  GraduationCap,
  Users,
  IndianRupee,
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function TeachersPage() {
  const [teachers, setTeachers] = useState([]);

  const [students, setStudents] = useState([]);

  const [openId, setOpenId] = useState(null);

  const [teacherName, setTeacherName] = useState("");

  const [selectedStudent, setSelectedStudent] = useState({});

  const [teacherShare, setTeacherShare] = useState({});

  const [salaryPercentage, setSalaryPercentage] = useState({});

  // FETCH TEACHERS

  const fetchTeachers = async () => {
    try {
      const res = await axios.get(`${API}/api/teachers`);

      setTeachers(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // FETCH STUDENTS

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${API}/api/students`);

      setStudents(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTeachers();
    fetchStudents();
  }, []);

  // UPDATE SALARY PERCENTAGE
  const updatePercentage = async (teacherId, percentage) => {
    try {
      await axios.put(`${API}/api/teachers/${teacherId}/percentage`, {
        percentage,
      });

      fetchTeachers();
    } catch (error) {
      console.log(error);
    }
  };

  // ADD TEACHER

  const addTeacher = async () => {
    if (!teacherName.trim()) return;

    try {
      await axios.post(`${API}/api/teachers`, {
        name: teacherName,
      });

      setTeacherName("");

      fetchTeachers();
    } catch (error) {
      console.log(error);
    }
  };

  // DELETE TEACHER

  const deleteTeacher = async (id) => {
    try {
      await axios.delete(`${API}/api/teachers/${id}`);

      fetchTeachers();
    } catch (error) {
      console.log(error);
    }
  };

  // DELETE STUDENT FROM TEACHER

  const deleteStudent = async (teacherId, studentId) => {
    try {
      await axios.delete(
        `${API}/api/teachers/${teacherId}/remove-student/${studentId}`,
      );

      fetchTeachers();
    } catch (error) {
      console.log(error);
    }
  };

  // ASSIGN STUDENT

  const assignStudent = async (teacherId) => {
    try {
      await axios.post(`${API}/api/teachers/${teacherId}/add-student`, {
        studentId: selectedStudent[teacherId]?.id,

        teacherShare: teacherShare[teacherId],
      });

      setSelectedStudent({
        ...selectedStudent,
        [teacherId]: "",
      });

      setTeacherShare({
        ...teacherShare,
        [teacherId]: "",
      });

      fetchTeachers();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-indigo-50 p-4 md:p-6">
      {/* HEADER */}

      <motion.div
        initial={{
          opacity: 0,
          y: -20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
        }}
        className="mb-8"
      >
        <div className="flex items-center gap-4">
          <div className="bg-indigo-600 p-4 rounded-3xl shadow-lg">
            <GraduationCap size={28} className="text-white" />
          </div>

          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-slate-800 tracking-tight">
              Teachers Dashboard
            </h1>

            <p className="text-slate-500 mt-1 text-sm md:text-base">
              Manage teachers, students and payouts
            </p>
          </div>
        </div>
      </motion.div>

      {/* ADD TEACHER */}

      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
        }}
        className="bg-white/80 backdrop-blur-lg border border-white/40 rounded-3xl shadow-xl p-5 md:p-6 mb-8"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="bg-indigo-100 p-3 rounded-2xl">
            <Plus className="text-indigo-600" />
          </div>

          <div>
            <h2 className="text-lg md:text-xl font-semibold text-slate-800">
              Add Teacher
            </h2>

            <p className="text-slate-500 text-sm">Create new teacher profile</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Enter teacher name..."
            value={teacherName}
            onChange={(e) => setTeacherName(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            onClick={addTeacher}
            className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all duration-300 text-white rounded-2xl px-6 py-3 text-sm font-semibold shadow-lg"
          >
            Add Teacher
          </button>
        </div>
      </motion.div>

      {/* TEACHERS */}

      <div className="space-y-6">
        {teachers.map((teacher) => {
          const percentage = salaryPercentage[teacher._id] ?? 100;
          const payableSalary = (teacher.totalSalary * percentage) / 100;

          return (
            <motion.div
              key={teacher._id}
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.4,
              }}
              className="bg-white/80 backdrop-blur-lg border border-white/40 rounded-3xl shadow-xl overflow-hidden"
            >
              {/* TOP */}

              <button
                onClick={() =>
                  setOpenId(openId === teacher._id ? null : teacher._id)
                }
                className="w-full p-5 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-indigo-100 p-3 rounded-2xl">
                    <Users size={22} className="text-indigo-600" />
                  </div>

                  <div className="text-left">
                    <h1 className="text-lg md:text-2xl font-bold text-slate-800">
                      {teacher.name}
                    </h1>

                    <p className="text-slate-500 text-sm mt-1">
                      {teacher.students.length}
                      &nbsp;Students
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-[11px] md:text-xs text-slate-500">
                      Total Salary
                    </p>

                    <h2 className="text-lg md:text-2xl font-bold text-green-600">
                      ₹{(teacher.totalSalary * teacher.salaryPercentage) / 100}
                    </h2>
                  </div>

                  <motion.div
                    animate={{
                      rotate: openId === teacher._id ? 180 : 0,
                    }}
                    transition={{
                      duration: 0.3,
                    }}
                    className="bg-slate-100 p-3 rounded-2xl"
                  >
                    <ChevronDown />
                  </motion.div>
                </div>
              </button>

              {/* BODY */}

              {openId === teacher._id && (
                <motion.div
                  initial={{
                    opacity: 0,
                    height: 0,
                  }}
                  animate={{
                    opacity: 1,
                    height: "auto",
                  }}
                  transition={{
                    duration: 0.3,
                  }}
                  className="border-t border-slate-200 p-5"
                >
                  {/* ASSIGN STUDENT */}

                  <div className="bg-slate-50 rounded-3xl p-4 mb-6">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="bg-indigo-100 p-3 rounded-2xl">
                        <UserPlus className="text-indigo-600" />
                      </div>

                      <div>
                        <h2 className="text-base md:text-lg font-semibold text-slate-800">
                          Assign Student
                        </h2>

                        <p className="text-slate-500 text-sm">
                          Add student and payout
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search student..."
                          value={selectedStudent[teacher._id]?.name || ""}
                          onChange={(e) => {
                            const value = e.target.value;

                            setSelectedStudent({
                              ...selectedStudent,
                              [teacher._id]: {
                                name: value,
                                id: "",
                                selected: false,
                              },
                            });
                          }}
                          className="bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                        />

                        {/* SUGGESTIONS */}

                        {selectedStudent[teacher._id]?.name &&
                          !selectedStudent[teacher._id]?.selected && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl max-h-52 overflow-y-auto z-50">
                              {students
                                .filter((student) =>
                                  student.name
                                    .toLowerCase()
                                    .includes(
                                      selectedStudent[
                                        teacher._id
                                      ]?.name.toLowerCase(),
                                    ),
                                )
                                .map((student) => (
                                  <button
                                    key={student._id}
                                    onClick={() => {
                                      setSelectedStudent({
                                        ...selectedStudent,
                                        [teacher._id]: {
                                          name: student.name,
                                          id: student._id,
                                          selected: true,
                                        },
                                      });
                                    }}
                                    className="w-full text-left px-4 py-3 hover:bg-slate-100 transition-all border-b last:border-none"
                                  >
                                    <div className="font-medium text-slate-800">
                                      {student.name}
                                    </div>

                                    <div className="text-xs text-slate-500">
                                      {student.class}
                                    </div>
                                  </button>
                                ))}
                            </div>
                          )}
                      </div>

                      <input
                        type="number"
                        placeholder="Teacher Payment"
                        value={teacherShare[teacher._id] || ""}
                        onChange={(e) =>
                          setTeacherShare({
                            ...teacherShare,
                            [teacher._id]: e.target.value,
                          })
                        }
                        className="bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                      />

                      <button
                        onClick={() => assignStudent(teacher._id)}
                        className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all duration-300 text-white rounded-2xl px-6 py-3 text-sm font-semibold shadow-md"
                      >
                        Add Student
                      </button>
                    </div>
                  </div>

                  {/* STUDENTS */}

                  {/* STUDENTS */}

                  <div className="space-y-4">
                    {teacher.students.map((student) => (
                      <motion.div
                        whileHover={{
                          scale: 1.01,
                        }}
                        key={student._id}
                        className="bg-slate-50 hover:bg-slate-100 transition-all duration-300 rounded-3xl p-4 flex items-center justify-between gap-3 overflow-hidden"
                      >
                        {/* LEFT */}
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="bg-indigo-100 p-2 md:p-3 rounded-2xl flex-shrink-0">
                            <Users size={16} className="text-indigo-600" />
                          </div>

                          <div className="min-w-0">
                            <h1 className="font-semibold text-sm md:text-lg text-slate-800 truncate">
                              {student.name}
                            </h1>

                            <p className="text-slate-500 text-xs md:text-sm truncate">
                              {student.class}
                            </p>
                          </div>
                        </div>

                        {/* RIGHT */}
                        <div className="flex items-center gap-2 md:gap-5 flex-shrink-0">
                          <div className="text-right hidden sm:block">
                            <p className="text-[10px] md:text-xs text-slate-500">
                              Fees
                            </p>

                            <h2 className="text-sm md:text-base font-semibold text-slate-700">
                              ₹{student.fees}
                            </h2>
                          </div>

                          <div className="bg-green-100 text-green-700 px-2 md:px-3 py-2 rounded-2xl flex items-center gap-1 md:gap-2">
                            <IndianRupee size={14} />

                            <span className="font-bold text-sm md:text-base">
                              {student.teacherShare}
                            </span>
                          </div>

                          {/* DELETE BUTTON */}
                          <button
                            onClick={() =>
                              deleteStudent(teacher._id, student._id)
                            }
                            className="bg-red-100 hover:bg-red-500 text-red-600 hover:text-white transition-all duration-300 p-2 md:p-3 rounded-2xl active:scale-95 flex-shrink-0"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* FOOTER */}

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="border-t border-slate-200 mt-6 pt-6"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                      {/* Left */}
                      <div>
                        <h1 className="text-base md:text-2xl font-bold text-slate-800">
                          Total Salary
                        </h1>

                        <p className="text-slate-500 text-xs md:text-sm mt-1">
                          Monthly payout based on percentage
                        </p>
                      </div>

                      {/* Right */}
                      <div className="flex flex-col md:flex-row items-center gap-4">
                        {/* Percentage Input */}
                        <motion.div
                          whileHover={{ scale: 1.04 }}
                          whileFocus={{ scale: 1.04 }}
                          className="flex items-center bg-slate-100 rounded-2xl px-4 py-3 shadow-sm"
                        >
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={teacher.salaryPercentage}
                            onChange={(e) =>
                              updatePercentage(
                                teacher._id,
                                Number(e.target.value),
                              )
                            }
                            className="w-16 bg-transparent outline-none text-center font-bold text-lg"
                          />

                          <span className="font-bold text-slate-600 text-lg">
                            %
                          </span>
                        </motion.div>

                        {/* Salary Card */}
                        <motion.div
                          layout
                          whileHover={{
                            scale: 1.05,
                            rotate: -1,
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 250,
                          }}
                          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-3xl shadow-xl flex items-center gap-3"
                        >
                          <IndianRupee size={30} />

                          <div>
                            <p className="text-xs text-green-100">
                              Payable Salary
                            </p>

                            <motion.h1
                              key={payableSalary}
                              initial={{
                                scale: 0.8,
                                opacity: 0,
                              }}
                              animate={{
                                scale: 1,
                                opacity: 1,
                              }}
                              transition={{
                                duration: 0.25,
                              }}
                              className="text-2xl md:text-3xl font-black"
                            >
                              {payableSalary.toFixed(0)}
                            </motion.h1>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>

                  {/* DELETE */}

                  <button
                    onClick={() => deleteTeacher(teacher._id)}
                    className="mt-6 bg-red-500 hover:bg-red-600 active:scale-95 transition-all duration-300 text-white px-6 py-3 rounded-2xl flex items-center justify-center gap-3 w-full md:w-fit shadow-lg"
                  >
                    <Trash2 size={18} />
                    Delete Teacher
                  </button>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
