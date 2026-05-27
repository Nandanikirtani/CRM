// controllers/feesController.js

import Fees from "../models/Fees.js";
import Student from "../models/Student.js";

export const getFeesByClass = async (req, res) => {
  try {
    const { className } = req.params;
    
    const students = await Student.find({
      class: className,
    });

    const studentIds = students.map((s) => s._id);

    let fees = await Fees.find({
      studentId: { $in: studentIds },
    }).populate("studentId");

    // create fees record automatically
    for (const student of students) {
      const exists = fees.find(
        (f) => f.studentId._id.toString() === student._id.toString()
      );

      if (!exists) {
        const created = await Fees.create({
          studentId: student._id,
        });

        const populated = await Fees.findById(
          created._id
        ).populate("studentId");

        fees.push(populated);
      }
    }

    res.json(fees);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateMonthlyStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Fees.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};