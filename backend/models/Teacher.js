import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  salaryPercentage: {
    type: Number,
    default: 100,
  },

  students: [
    {
      student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },

      teacherShare: {
        type: Number,
        default: 0,
      },
    },
  ],
});

export default mongoose.model("Teacher", teacherSchema);
