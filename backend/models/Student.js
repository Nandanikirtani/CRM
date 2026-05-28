import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    class: {
      type: String,
      required: true,
    },

    subject: [{ type: String }],

    type: {
      type: String,
      enum: ["Home", "Institution"],
      required: true,
    },

    fees: {
      type: Number,
      required: true,
    },

    // NEW
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
    },

    // NEW
    teacherShare: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: [
        "Paid",
        "Pending",
        "Overdue",
      ],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Student",
  studentSchema
);