// pages/FeesPage.jsx

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { MoreVertical, X } from "lucide-react";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const classes = [
  "Nursery",
  "KG",
  "1st",
  "2nd",
  "3rd",
  "4th",
  "5th",
  "6th",
  "7th",
  "8th",
  "9th",
  "10th",
  "11th",
  "12th",
];

const months = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];

const getLastThreeMonths = () => {
  const currentMonth = new Date().getMonth();

  let result = [];

  for (let i = 2; i >= 0; i--) {
    const monthIndex = (currentMonth - i + 12) % 12;

    result.push(months[monthIndex]);
  }

  return result;
};

export default function FeesPage() {
  const [selectedClass, setSelectedClass] = useState("12th");

  const [students, setStudents] = useState([]);

  const [drawer, setDrawer] = useState(null);

  const [breakdownDrawer, setBreakdownDrawer] = useState(null);

  const visibleMonths = getLastThreeMonths();

  const [paymentFilter, setPaymentFilter] = useState("All");

  const fetchStudents = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/fees/${selectedClass}`,
      );

      setStudents(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [selectedClass]);

  const updateStatus = async () => {
    try {
      await axios.patch(`${API_URL}/api/fees/${drawer._id}`, {
        monthlyStatus: drawer.monthlyStatus,
      });

      toast.success("Saved Successfully");

      setDrawer(null);

      fetchStudents();
    } catch (error) {
      console.log(error);
    }
  };
  const filteredStudents = students.filter((item) => {
    if (paymentFilter === "All") return true;

    // only check visible months
    const visibleStatuses = visibleMonths.map(
      (month) => item.monthlyStatus?.[month],
    );

    if (paymentFilter === "Pending") {
      return visibleStatuses.some(
        (status) => status === "Pending" || status === "Overdue",
      );
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-slate-100 p-3 sm:p-6">
      {/* HEADER */}

      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">
          Fees Console
        </h1>

        <p className="text-slate-500 mt-2">
          Manage student monthly fees and statuses
        </p>
      </div>

      {/* CLASS TABS */}

      <div className="flex gap-3 overflow-x-auto pb-2 mb-6">
        {classes.map((cls) => (
          <button
            key={cls}
            onClick={() => setSelectedClass(cls)}
            className={`px-5 py-2 rounded-2xl whitespace-nowrap font-medium transition-all duration-300 border ${
              selectedClass === cls
                ? "bg-indigo-600 text-white border-indigo-600 shadow-lg"
                : "bg-white hover:bg-slate-50"
            }`}
          >
            {cls}
          </button>
        ))}
      </div>

      {/* PAYMENT FILTER */}

      <div className="flex gap-3 mb-6 flex-wrap">
        {["All", "Pending"].map((filter) => (
          <button
            key={filter}
            onClick={() => setPaymentFilter(filter)}
            className={`px-5 py-2 rounded-2xl text-sm font-medium transition-all duration-300 border ${
              paymentFilter === filter
                ? "bg-red-600 text-white border-red-600"
                : "bg-white hover:bg-slate-50"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
      {/* TABLE */}

      <div className="bg-white rounded-3xl shadow overflow-x-auto">
        <table className="min-w-[950px] w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left px-6 py-5">Student</th>

              <th className="text-left">Fees</th>

              {visibleMonths.map((month) => (
                <th key={month} className="uppercase text-sm">
                  {month}
                </th>
              ))}


              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredStudents.map((item, index) => (
              <motion.tr
                key={item._id}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: index * 0.05,
                }}
                className="border-t hover:bg-slate-50 transition-all"
              >
                {/* STUDENT */}

                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-lg">
                      {item.studentId.name?.slice(0, 2).toUpperCase()}
                    </div>

                    <div>
                      <h1 className="font-semibold text-slate-800">
                        {item.studentId.name}
                      </h1>

                      <p className="text-sm text-slate-500">
                        {item.studentId.class}
                      </p>
                    </div>
                  </div>
                </td>

                {/* FEES */}

                <td className="font-bold text-slate-700">
                  ₹{item.studentId.fees}
                </td>

                {/* MONTHS */}

                {visibleMonths.map((month) => (
                  <td key={month} className="text-center">
                    <StatusBadge status={item.monthlyStatus[month]} />
                  </td>
                ))}

           

                {/* ACTION */}

                <td className="text-center">
                  <button
                    onClick={() => setDrawer(item)}
                    className="p-2 rounded-xl hover:bg-slate-100 transition-all"
                  >
                    <MoreVertical size={18} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* EDIT DRAWER */}

      {drawer && (
        <div className="fixed inset-0 bg-black/30 z-50 flex justify-end">
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            className="w-full sm:w-[420px] bg-white h-full p-6 overflow-y-auto"
          >
            {/* TOP */}

            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold">Edit Fees</h1>

                <p className="text-slate-500 mt-1">Update monthly statuses</p>
              </div>

              <button
                onClick={() => setDrawer(null)}
                className="p-2 rounded-xl hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* STUDENT */}

            <div className="bg-slate-100 rounded-2xl p-4 mb-8">
              <h1 className="font-bold text-lg">{drawer.studentId.name}</h1>

              <p className="text-slate-500">{drawer.studentId.class}</p>

              <h2 className="mt-3 text-2xl font-bold text-indigo-600">
                ₹{drawer.studentId.fees}
              </h2>
            </div>

            {/* MONTH STATUS */}

            <div className="space-y-5">
              {visibleMonths.map((month) => (
                <div
                  key={month}
                  className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl"
                >
                  <h1 className="capitalize font-semibold text-slate-700">
                    {month}
                  </h1>

                  <select
                    value={drawer.monthlyStatus[month]}
                    onChange={(e) =>
                      setDrawer({
                        ...drawer,

                        monthlyStatus: {
                          ...drawer.monthlyStatus,

                          [month]: e.target.value,
                        },
                      })
                    }
                    className="border rounded-xl px-4 py-2 outline-none"
                  >
                    <option>Paid</option>

                    <option>Pending</option>

                    <option>Overdue</option>
                  </select>
                </div>
              ))}
            </div>

            {/* SAVE */}

            <button
              onClick={updateStatus}
              className="mt-8 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-semibold transition-all"
            >
              Save Changes
            </button>
          </motion.div>
        </div>
      )}

      {/* BREAKDOWN DRAWER */}

      {breakdownDrawer && (
        <div className="fixed inset-0 bg-black/30 z-50 flex justify-end">
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            className="w-full sm:w-[400px] bg-white h-full p-6 overflow-y-auto"
          >
            {/* TOP */}

            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold">Fees Breakdown</h1>

                <p className="text-slate-500 mt-1">Subject-wise fees</p>
              </div>

              <button
                onClick={() => setBreakdownDrawer(null)}
                className="p-2 rounded-xl hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* STUDENT */}

            <div className="bg-slate-100 rounded-2xl p-4 mb-8">
              <h1 className="font-bold text-lg">
                {breakdownDrawer.studentId.name}
              </h1>

              <p className="text-slate-500">
                {breakdownDrawer.studentId.class}
              </p>
            </div>

            {/* SUBJECTS */}

            <div className="space-y-4">
              {breakdownDrawer.studentId.subject.map((subject, index) => (
                <div
                  key={index}
                  className="bg-slate-50 rounded-2xl px-5 py-4 flex items-center justify-between"
                >
                  <h1 className="font-medium text-slate-700">{subject}</h1>

                  <p className="font-bold text-indigo-600">
                    ₹
                    {Math.floor(
                      breakdownDrawer.studentId.fees /
                        breakdownDrawer.studentId.subject.length,
                    )}
                  </p>
                </div>
              ))}
            </div>

            {/* TOTAL */}

            <div className="mt-8 border-t pt-6 flex items-center justify-between">
              <h1 className="text-xl font-bold">Total Fees</h1>

              <p className="text-3xl font-bold text-indigo-600">
                ₹{breakdownDrawer.studentId.fees}
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Paid: "bg-green-100 text-green-700",

    Pending: "bg-yellow-100 text-yellow-700",

    Overdue: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-4 py-2 rounded-full text-xs font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  );
}
