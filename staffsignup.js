const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  rollno: {
    type: Number,
    required: true,
    unique: true,
  },
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
    // unique: true,
  },
  //   gender: {
  //     type: String,
  //     required: true,
  //   },
  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },
  confirmpassword: {
    type: String,
    required: true,
  },
});

const empregister = new mongoose.model("empSignUp", employeeSchema);

module.exports = empregister;
