import express from "express";
import {
  getStudents,
  addStudent,
  deleteStudent,
  updateStudent,
} from "../controllers/studentController.js";

const router = express.Router();

router.get("/", getStudents);
router.post("/", addStudent);
router.delete("/:id", deleteStudent);
router.put("/:id", updateStudent);

export default router;