// models/Fees.js

import mongoose from "mongoose";

const feesSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      unique: true,
    },

    monthlyStatus: {
      jan: {
        type: String,
        enum: ["Paid", "Pending", "Overdue"],
        default: "Pending",
      },

      feb: {
        type: String,
        enum: ["Paid", "Pending", "Overdue"],
        default: "Pending",
      },

      mar: {
        type: String,
        enum: ["Paid", "Pending", "Overdue"],
        default: "Pending",
      },

      apr: {
        type: String,
        enum: ["Paid", "Pending", "Overdue"],
        default: "Pending",
      },

      may: {
        type: String,
        enum: ["Paid", "Pending", "Overdue"],
        default: "Pending",
      },

      jun: {
        type: String,
        enum: ["Paid", "Pending", "Overdue"],
        default: "Pending",
      },

      jul: {
        type: String,
        enum: ["Paid", "Pending", "Overdue"],
        default: "Pending",
      },

      aug: {
        type: String,
        enum: ["Paid", "Pending", "Overdue"],
        default: "Pending",
      },

      sep: {
        type: String,
        enum: ["Paid", "Pending", "Overdue"],
        default: "Pending",
      },

      oct: {
        type: String,
        enum: ["Paid", "Pending", "Overdue"],
        default: "Pending",
      },

      nov: {
        type: String,
        enum: ["Paid", "Pending", "Overdue"],
        default: "Pending",
      },

      dec: {
        type: String,
        enum: ["Paid", "Pending", "Overdue"],
        default: "Pending",
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Fees", feesSchema);