import mongoose from "mongoose";

const teacherSchema =
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },

    students: [
      {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],

    totalSalary: {
      type: Number,
      default: 0,
    },
  });

export default mongoose.model(
  "Teacher",
  teacherSchema
);