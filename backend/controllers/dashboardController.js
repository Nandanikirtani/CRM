import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";
import Fees from "../models/Fees.js";

export const getDashboardData = async (req, res) => {
  try {
    const students = await Student.find();
    const teachers = await Teacher.find();
    const feesRecords = await Fees.find().populate("studentId");
    const totalStudents = students.length;
    const totalTeachers = teachers.length;

    const monthKeys = [
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

const currentMonthKey =
  monthKeys[new Date().getMonth()];

    // ===== FEES =====

    const totalFees = students.reduce(
      (total, student) =>
        total + Number(student.fees || 0),
      0
    );

    const collectedFees = feesRecords.reduce(
  (total, fee) => {
    if (
      fee.monthlyStatus?.[currentMonthKey] ===
      "Paid"
    ) {
      return (
        total +
        Number(
          fee.studentId?.fees || 0
        )
      );
    }

    return total;
  },
  0
);

    const pendingFees =
      totalFees - collectedFees;

    // ===== TEACHER SALARY =====

    const totalSalary = teachers.reduce(
      (total, teacher) =>
        total +
        teacher.students.reduce(
          (sum, s) =>
            sum + Number(s.teacherShare || 0),
          0
        ),
      0
    );

    // ===== PROFIT =====

    const totalProfit =
      collectedFees - totalSalary;

    // ===== STATUS COUNTS =====

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

    // ===== CURRENT MONTH =====

    const now = new Date();

    const currentMonth =
      now.getMonth();

    const currentYear =
      now.getFullYear();

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
          student.status === "Paid"
            ? total +
              Number(
                student.fees || 0
              )
            : total,
        0
      );

    const currentMonthStudentIds =
      new Set(
        currentMonthStudents.map(
          (s) =>
            s._id.toString()
        )
      );

    let currentMonthSalary = 0;

    teachers.forEach((teacher) => {
      teacher.students.forEach(
        (s) => {
          if (
            currentMonthStudentIds.has(
              s.student.toString()
            )
          ) {
            currentMonthSalary +=
              Number(
                s.teacherShare || 0
              );
          }
        }
      );
    });

    const currentMonthProfit =
      currentMonthRevenue -
      currentMonthSalary;

    // ===== PREVIOUS MONTH =====

    const previousDate =
      new Date();

    previousDate.setMonth(
      previousDate.getMonth() - 1
    );

    const previousMonth =
      previousDate.getMonth();

    const previousYear =
      previousDate.getFullYear();

    const previousMonthStudents =
      students.filter((student) => {
        const date = new Date(
          student.createdAt
        );

        return (
          date.getMonth() ===
            previousMonth &&
          date.getFullYear() ===
            previousYear
        );
      });

    const previousMonthRevenue =
      previousMonthStudents.reduce(
        (total, student) =>
          student.status === "Paid"
            ? total +
              Number(
                student.fees || 0
              )
            : total,
        0
      );

      

    const previousMonthStudentIds =
      new Set(
        previousMonthStudents.map(
          (s) =>
            s._id.toString()
        )
      );

    let previousMonthSalary = 0;

    teachers.forEach((teacher) => {
      teacher.students.forEach(
        (s) => {
          if (
            previousMonthStudentIds.has(
              s.student.toString()
            )
          ) {
            previousMonthSalary +=
              Number(
                s.teacherShare || 0
              );
          }
        }
      );
    });

    const previousMonthProfit =
      previousMonthRevenue -
      previousMonthSalary;

    // ===== MONTHLY CHART =====

    const months = [
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
    ];

    const monthlyData =
      months.map(
        (month, index) => {
          const monthStudents =
            students.filter(
              (student) => {
                const date =
                  new Date(
                    student.createdAt
                  );

                return (
                  date.getMonth() ===
                  index
                );
              }
            );

          const revenue =
            monthStudents.reduce(
              (
                total,
                student
              ) =>
                student.status ===
                "Paid"
                  ? total +
                    Number(
                      student.fees ||
                        0
                    )
                  : total,
              0
            );

          const monthStudentIds =
            new Set(
              monthStudents.map(
                (s) =>
                  s._id.toString()
              )
            );

          let salary = 0;

          teachers.forEach(
            (teacher) => {
              teacher.students.forEach(
                (s) => {
                  if (
                    monthStudentIds.has(
                      s.student.toString()
                    )
                  ) {
                    salary +=
                      Number(
                        s.teacherShare ||
                          0
                      );
                  }
                }
              );
            }
          );

          return {
            month,
            revenue,
            salary,
            profit:
              revenue - salary,
          };
        }
      );

    // ===== RECENT ACTIVITY =====

    const recentStudents =
      await Student.find()
        .sort({
          createdAt: -1,
        })
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

      totalFees,
      collectedFees,
      pendingFees,

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
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};