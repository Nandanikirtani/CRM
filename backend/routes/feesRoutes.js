// routes/feesRoutes.js

import express from "express";
import {
  getFeesByClass,
  updateMonthlyStatus,
} from "../controllers/feesController.js";

const router = express.Router();

router.get("/:className", getFeesByClass);

router.patch("/:id", updateMonthlyStatus);

export default router;