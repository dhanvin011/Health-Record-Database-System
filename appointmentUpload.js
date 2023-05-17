const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  appointmentNo: {
    type: Number,
    required: true,
    unique: true,
  },
  rollNo: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  symptoms: {
    type: String,
    maxlength: 300,
    required: true,
  },
  diagnosis: {
    type: String,
    maxlength: 300,
    required: true,
  },
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;