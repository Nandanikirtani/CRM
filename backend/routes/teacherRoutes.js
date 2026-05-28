import express from "express";

import {
  getTeachers,
  addTeacher,
  deleteTeacher,
  addStudentToTeacher,
} from "../controllers/teacherController.js";

const router = express.Router();

router.get("/", getTeachers);

router.post("/", addTeacher);
router.post(
  "/:id/add-student",
  addStudentToTeacher
);
router.delete("/:id", deleteTeacher);

export default router;