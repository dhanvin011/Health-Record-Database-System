const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const prescriptionSchema = new Schema({
  prescriptionNo: {
    type: Number,
    required: true,
    unique: true,
  },
  date: {
    type: Date,
    required: true,
  },
  notes: {
    type: String,
    required: true,
  },
  appointmentNo: {
    type: Number,
    required: true,
    unique: true,
  },

  medicationList: [
    {
      medicineName: {
        type: String,
        required: true,
      },
      medicineType: {
        type: String,
        required: true,
      },
      expiryDate: {
        type: Date,
        required: true,
      },
    },
  ],
  
});

module.exports = mongoose.model("Prescription", prescriptionSchema);