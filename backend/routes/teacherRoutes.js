import express from "express";

import {
  getTeachers,
  addTeacher,
  deleteTeacher,
  addStudentToTeacher,
  removeStudentFromTeacher,
} from "../controllers/teacherController.js";

const router = express.Router();

router.get("/", getTeachers);

router.post("/", addTeacher);
router.post(
  "/:id/add-student",
  addStudentToTeacher
);
router.delete("/:id", deleteTeacher);
router.delete(
  "/:teacherId/remove-student/:studentId",
  removeStudentFromTeacher,
);
export default router;