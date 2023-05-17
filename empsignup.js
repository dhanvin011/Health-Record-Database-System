const mongoose = require("mongoose");
//Employee Sign Up Schema
const employeeSchema = new mongoose.Schema(
  {
    empno: {
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
    },

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
  },
  { collection: "employeeregisters" }
);

const empregister = new mongoose.model("employeeregister", employeeSchema);

module.exports = empregister;
