import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";

export const getDashboardData =
  async (req, res) => {
    try {
      const students =
        await Student.find();

      const teachers =
        await Teacher.find();

      const totalStudents =
        students.length;

      const totalTeachers =
        teachers.length;

      const totalRevenue =
        students.reduce(
          (total, student) =>
            total +
            Number(student.fees || 0),
          0
        );

      const totalSalary =
        students.reduce(
          (total, student) =>
            total +
            Number(
              student.teacherShare || 0
            ),
          0
        );

      const totalProfit =
        totalRevenue - totalSalary;

      const paidStudents =
        students.filter(
          (student) =>
            student.status === "Paid"
        ).length;

      const pendingStudents =
        students.filter(
          (student) =>
            student.status === "Pending"
        ).length;

      const overdueStudents =
        students.filter(
          (student) =>
            student.status === "Overdue"
        ).length;

      const now = new Date();

      const currentMonth =
        now.getMonth();

      const currentYear =
        now.getFullYear();

      // CURRENT MONTH

      const currentMonthStudents =
        students.filter((student) => {
          const date = new Date(
            student.createdAt
          );

          return (
            date.getMonth() ===
              currentMonth &&
            date.getFullYear() ===
              currentYear
          );
        });

      const currentMonthRevenue =
        currentMonthStudents.reduce(
          (total, student) =>
            total +
            Number(student.fees || 0),
          0
        );

      const currentMonthSalary =
        currentMonthStudents.reduce(
          (total, student) =>
            total +
            Number(
              student.teacherShare || 0
            ),
          0
        );

      const currentMonthProfit =
        currentMonthRevenue -
        currentMonthSalary;

      // PREVIOUS MONTH

      const previousMonthStudents =
        students.filter((student) => {
          const date = new Date(
            student.createdAt
          );

          return (
            date.getMonth() ===
              currentMonth - 1 &&
            date.getFullYear() ===
              currentYear
          );
        });

      const previousMonthRevenue =
        previousMonthStudents.reduce(
          (total, student) =>
            total +
            Number(student.fees || 0),
          0
        );

      const previousMonthSalary =
        previousMonthStudents.reduce(
          (total, student) =>
            total +
            Number(
              student.teacherShare || 0
            ),
          0
        );

      const previousMonthProfit =
        previousMonthRevenue -
        previousMonthSalary;

      const monthlyData = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ].map((month, index) => {
        const monthStudents =
          students.filter((student) => {
            const date = new Date(
              student.createdAt
            );

            return (
              date.getMonth() ===
              index
            );
          });

        const revenue =
          monthStudents.reduce(
            (total, student) =>
              total +
              Number(
                student.fees || 0
              ),
            0
          );

        const salary =
          monthStudents.reduce(
            (total, student) =>
              total +
              Number(
                student.teacherShare ||
                  0
              ),
            0
          );

        return {
          month,
          revenue,
          salary,
          profit:
            revenue - salary,
        };
      });

      const recentStudents =
        await Student.find()
          .sort({ createdAt: -1 })
          .limit(5);

      const recentActivity =
        recentStudents.map(
          (student) => ({
            id: student._id,

            text: `${student.name} joined ${student.class}`,

            createdAt:
              student.createdAt,
          })
        );

      res.json({
        totalStudents,
        totalTeachers,

        totalRevenue,
        totalSalary,
        totalProfit,

        paidStudents,
        pendingStudents,
        overdueStudents,

        currentMonthProfit,
        previousMonthProfit,

        monthlyData,

        recentActivity,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Server Error",
      });
    }
  };