import Teacher from "../models/Teacher.js";
import Student from "../models/Student.js";


// GET ALL TEACHERS

export const getTeachers = async (
  req,
  res
) => {
  try {
    const teachers =
      await Teacher.find();

    const teacherData =
      await Promise.all(
        teachers.map(
          async (teacher) => {
            const students =
              await Student.find({
                teacher:
                  teacher._id,
              });

            const totalSalary =
              students.reduce(
                (sum, student) =>
                  sum +
                  student.teacherShare,
                0
              );

            return {
              ...teacher._doc,
              students,
              totalSalary,
            };
          }
        )
      );

    res.json(teacherData);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// ADD TEACHER

export const addTeacher =
  async (req, res) => {
    try {

      console.log("BODY:", req.body);

      const teacher =
        await Teacher.create(
          req.body
        );

      res.json(teacher);

    } catch (error) {

      console.log(
        "ERROR:",
        error
      );

      res.status(500).json({
        message: error.message,
      });
    }
  };

export const addStudentToTeacher =
  async (req, res) => {
    try {

      const {
        studentId,
        teacherShare,
      } = req.body;

      const student =
        await Student.findById(
          studentId
        );

      student.teacher =
        req.params.id;

      student.teacherShare =
        teacherShare;

      await student.save();

      res.json(student);

    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };
// DELETE TEACHER

export const deleteTeacher =
  async (req, res) => {
    try {
      await Teacher.findByIdAndDelete(
        req.params.id
      );

      // REMOVE TEACHER FROM STUDENTS

      await Student.updateMany(
        {
          teacher:
            req.params.id,
        },
        {
          $unset: {
            teacher: "",
          },

          teacherShare: 0,
        }
      );

      res.json({
        message:
          "Teacher Deleted",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };