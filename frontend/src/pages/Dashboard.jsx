import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  motion,
} from "framer-motion";

import {
  Users,
  GraduationCap,
  Wallet,
  IndianRupee,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function Dashboard() {
  const [data, setData] =
    useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard =
    async () => {
      try {
        const response =
          await axios.get(
            "http://localhost:5000/api/dashboard"
          );

        setData(response.data);
      } catch (error) {
        console.log(error);
      }
    };

  if (!data) {
    return (
      <div className="p-10">
        Loading...
      </div>
    );
  }

  const stats = [
    {
      title: "Students",
      value: data.totalStudents,
      icon: Users,
    },

    {
      title: "Teachers",
      value: data.totalTeachers,
      icon: GraduationCap,
    },

    {
      title: "Revenue",
      value: `₹${data.totalRevenue}`,
      icon: IndianRupee,
    },

    {
      title: "Profit",
      value: `₹${data.totalProfit}`,
      icon: Wallet,
    },
  ];

  const pieData = [
    {
      name: "Paid",
      value: data.paidStudents,
    },

    {
      name: "Pending",
      value: data.pendingStudents,
    },

    {
      name: "Overdue",
      value: data.overdueStudents,
    },
  ];

  return (
    <div className="p-6 bg-slate-100 min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-800">
          Dashboard
        </h1>

        <p className="text-slate-500 mt-2">
          Tuition Analytics
        </p>
      </div>

      {/* TOP CARDS */}

      {/* TOP CARDS */}

<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
  {stats.map((item, index) => {
    const Icon = item.icon;

    const colors = [
      "from-blue-500 to-indigo-600",
      "from-purple-500 to-pink-500",
      "from-emerald-500 to-green-600",
      "from-orange-500 to-red-500",
    ];

    return (
      <motion.div
        key={index}
        initial={{
          opacity: 0,
          y: 25,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.4,
          delay: index * 0.1,
        }}
        whileHover={{
          scale: 1.03,
          y: -4,
        }}
        className={`relative overflow-hidden rounded-3xl p-4 md:p-6 shadow-lg bg-gradient-to-r ${colors[index]}`}
      >
        {/* GLOW */}

        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl" />

        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-white/80 text-xs md:text-sm font-medium">
              {item.title}
            </p>

            <h2 className="text-xl md:text-4xl font-bold mt-2 md:mt-3 text-white">
              {item.value}
            </h2>
          </div>

          <motion.div
            whileHover={{
              rotate: 10,
              scale: 1.1,
            }}
            className="w-10 h-10 md:w-16 md:h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center"
          >
            <Icon className="text-white w-5 h-5 md:w-8 md:h-8" />
          </motion.div>
        </div>

        {/* BOTTOM LINE */}

        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20" />
      </motion.div>
    );
  })}
</div>

      {/* MONTH COMPARISON */}

      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="bg-white rounded-3xl p-6 shadow-sm mb-8"
      >
        <div className="flex items-center gap-3 mb-5">
          <TrendingUp className="text-green-600" />

          <h2 className="text-2xl font-bold text-slate-800">
            Monthly Profit
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-100 rounded-2xl p-5">
            <p className="text-slate-500">
              Current Month
            </p>

            <h1 className="text-4xl font-bold mt-3 text-green-600">
              ₹
              {
                data.currentMonthProfit
              }
            </h1>
          </div>

          <div className="bg-slate-100 rounded-2xl p-5">
            <p className="text-slate-500">
              Previous Month
            </p>

            <h1 className="text-4xl font-bold mt-3 text-blue-600">
              ₹
              {
                data.previousMonthProfit
              }
            </h1>
          </div>
        </div>
      </motion.div>

      {/* CHARTS */}

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* LINE CHART */}

        <motion.div
          initial={{
            opacity: 0,
            x: -20,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          className="bg-white rounded-3xl p-6 shadow-sm"
        >
          <h2 className="text-2xl font-bold mb-5 text-slate-800">
            Revenue Analytics
          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <LineChart
              data={data.monthlyData}
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="month" />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="profit"
                stroke="#2563eb"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* PIE CHART */}

        <motion.div
          initial={{
            opacity: 0,
            x: 20,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          className="bg-white rounded-3xl p-6 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-5">
            <AlertCircle className="text-orange-500" />

            <h2 className="text-2xl font-bold text-slate-800">
              Fee Status
            </h2>
          </div>

          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                outerRadius={100}
                label
              >
                <Cell fill="#22c55e" />

                <Cell fill="#f59e0b" />

                <Cell fill="#ef4444" />
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* RECENT ACTIVITY */}

      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="bg-white rounded-3xl p-6 shadow-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-slate-800">
          Recent Activity
        </h2>

        <div className="space-y-4">
          {data.recentActivity.map(
            (activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between bg-slate-100 p-4 rounded-2xl"
              >
                <p className="font-medium text-slate-700">
                  {activity.text}
                </p>

                <p className="text-sm text-slate-500">
                  {new Date(
                    activity.createdAt
                  ).toLocaleDateString()}
                </p>
              </div>
            )
          )}
        </div>
      </motion.div>
    </div>
  );
}