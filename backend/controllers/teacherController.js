import Teacher from "../models/Teacher.js";
import Student from "../models/Student.js";


// GET ALL TEACHERS

export const getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().populate(
      "students.student"
    );

    const teacherData = teachers.map(
      (teacher) => {
        const totalSalary =
          teacher.students.reduce(
            (sum, item) =>
              sum + item.teacherShare,
            0
          );

        return {
          ...teacher._doc,

          students:
            teacher.students.map(
              (item) => ({
                ...item.student._doc,
                teacherShare:
                  item.teacherShare,
              })
            ),

          totalSalary,
        };
      }
    );

    res.json(teacherData);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// ADD TEACHER

export const addTeacher = async (
  req,
  res
) => {
  try {
    const teacher =
      await Teacher.create({
        name: req.body.name,
      });

    res.json(teacher);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// ADD STUDENT TO TEACHER

export const addStudentToTeacher =
  async (req, res) => {
    try {
      const {
        studentId,
        teacherShare,
      } = req.body;

      const teacher =
        await Teacher.findById(
          req.params.id
        );

      if (!teacher) {
        return res.status(404).json({
          message: "Teacher not found",
        });
      }

      const student =
        await Student.findById(
          studentId
        );

      if (!student) {
        return res.status(404).json({
          message: "Student not found",
        });
      }

      const alreadyAssigned =
        teacher.students.find(
          (item) =>
            item.student.toString() ===
            studentId
        );

      if (alreadyAssigned) {
        return res.status(400).json({
          message:
            "Student already assigned to this teacher",
        });
      }

      teacher.students.push({
        student: studentId,
        teacherShare: Number(
          teacherShare
        ),
      });

      await teacher.save();

      res.json({
        message:
          "Student assigned successfully",
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: error.message,
      });
    }
  };


// DELETE TEACHER

export const deleteTeacher =
  async (req, res) => {
    try {
      const teacher =
        await Teacher.findByIdAndDelete(
          req.params.id
        );

      if (!teacher) {
        return res.status(404).json({
          message: "Teacher not found",
        });
      }

      res.json({
        message:
          "Teacher deleted successfully",
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: error.message,
      });
    }
  };


// REMOVE STUDENT FROM TEACHER

export const removeStudentFromTeacher =
  async (req, res) => {
    try {
      const {
        teacherId,
        studentId,
      } = req.params;

      const teacher =
        await Teacher.findById(
          teacherId
        );

      if (!teacher) {
        return res.status(404).json({
          message: "Teacher not found",
        });
      }

      teacher.students =
        teacher.students.filter(
          (item) =>
            item.student.toString() !==
            studentId
        );

      await teacher.save();

      res.json({
        message:
          "Student removed successfully",
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: error.message,
      });
    }
  };