const mongoose = require("mongoose");

//Student Sign Up Schema
const studentSchema = new mongoose.Schema(
  {
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
    gender: {
        type: String,
        required: true,
    },
    bloodGroup:{
      type: String,
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
  { collection: "signups" }
);

const register = new mongoose.model("signup", studentSchema);
module.exports = register;
