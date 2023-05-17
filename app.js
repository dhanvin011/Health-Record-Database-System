const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const pdfkit = require('pdfkit');
const fs = require('fs');
const session = require("express-session");


require("./db/connect.js");

const static_path = path.join(__dirname, "../../public");
const template_path = path.join(__dirname, "../templates/views");
const partial_path = path.join(__dirname, "../templates/partials");

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(express.static('public'));

app.use((req, res, next) => {
  res.locals.loggedIn = req.session.loggedIn;
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partial_path);

app.get("/", (req, res) => {
  res.render("index", { loggedIn: req.session.loggedIn });
});

//Login Options
app.get("/loginOptions", function (req, res) {
  res.render("loginOptions");
});

//Admin Registration
const adminRegister = require("./models/adminRegistration");
app.get("/adminRegistration", (req, res) => {
  res.render("adminRegistration");
  console.log("Admin Registration rendered");
});

app.post("/adminRegistration", async (req, res) => {
  console.log("empsignup post");
  try {
    const password = req.body.password;
    const cpassword = req.body.cpassword;

    if (password === cpassword) {
      const adminDetails = new adminRegister({
        adminid: req.body.adminid,
        designation: req.body.designation,
        email: req.body.email,
        password: req.body.password,
        cpassword: req.body.cpassword,
      });

      console.log(adminDetails);
      try {
        const signedUp = await adminDetails.save();
        res.status(201).render("adminDashboard");
      } catch (error) {
        console.log(error);
      }
    } else {
      res.send("Password are not matching");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

//Admin Login

app.get("/adminLogin", (req, res) => {
  res.render("adminLogin");
});

app.post("/adminLogin", function (req, res) {
  const email = req.body.email;
  const password = req.body.password;

  adminRegister.findOne({ email: email }, function (err, user) {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    } else if (!user) {
      res.status(404).send("User not found");
    } else {
      if (user.password === password) {
        req.session.user = user; // Set user session
        const { firstname, lastname } = req.session.user; // Get first name and last name from user session
        // Render the dashboard template with user data
        res.render("adminDashboard", { firstname, lastname });
      } else {
        res.status(401).send("Invalid password");
      }
    }
  });
});

// Employee Registration
const empregister = require("./models/empsignup");
app.get("/empsignup", (req, res) => {
  res.render("empsignup");
  console.log("empsignup");
});

app.post("/empsignup", async (req, res) => {
  console.log("empsignup post");
  try {
    const password = req.body.password;
    const cpassword = req.body.confirmpassword;

    if (password === cpassword) {
      const employeeDetails = new empregister({
        empno: req.body.empno,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        age: req.body.age,
        phone: req.body.phone,
        email: req.body.email,
        password: req.body.password,
        confirmpassword: req.body.confirmpassword,
      });

      console.log(employeeDetails);
      try {
        const signedUp = await employeeDetails.save();
        res.status(201).render("adminDashboard");
      } catch (error) {
        console.log(error);
      }
    } else {
      res.send("Password are not matching");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

//Employee Login
app.get("/staffLogin", function (req, res) {
  res.render("staffLogin");
});

app.post("/staffLogin", function (req, res) {
  const email = req.body.email;
  const password = req.body.password;

  empregister.findOne({ email: email }, function (err, user) {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    } else if (!user) {
      res.status(404).send("User not found");
    } else {
      if (user.password === password) {
        req.session.user = user; // Set user session
        const userId = req.session.user.empno;
        console.log(userId)
        const { firstname, lastname } = req.session.user; // Get first name and last name from user session
        // Render the dashboard template with user data
        res.render("staffDashboard");
      } else {
        res.status(401).send("Invalid password");
      }
    }
  });
});

//Sign Up Page
const register = require("./models/signup");
app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/signup", async (req, res) => {
  console.log("signup post");
  try {
    const password = req.body.password;
    const cpassword = req.body.confirmpassword;

    if (password === cpassword) {
      const studentDetails = new register({
        rollno: req.body.rollno,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        age: req.body.age,
        gender: req.body.gender,
        bloodGroup: req.body.bloodGroup,
        phone: req.body.phone,
        email: req.body.email,
        password: req.body.password,
        confirmpassword: req.body.confirmpassword,
      });

      console.log(studentDetails);
      try {
        const signedUp = await studentDetails.save();
        res.status(201).render("adminDashboard");
      } catch (error) {
        console.log(error);
      }
    } else {
      res.send("Password are not matching");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

//Login Page
app.get("/login", function (req, res) {
  res.render("login");
});

app.post("/login", function (req, res) {
  const email = req.body.email;
  const password = req.body.password;

  register.findOne({ email: email }, function (err, user) {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    } else if (!user) {
      res.status(404).send("User not found");
    } else {
      if (user.password === password) {
        req.session.user = user; // Set user session
        const { firstname, lastname } = req.session.user; // Get first name and last name from user session
        // Render the dashboard template with user data
        res.render("dashboard", { firstname, lastname });
      } else {
        res.status(401).send("Invalid password");
      }
    }
  });
});

//Logout
app.get("/logout", function (req, res) {
  req.session.destroy(function () {
    res.redirect("/");
  });
});

//Appointment Upload
const appointment = require("./models/appointmentUpload");
app.get("/appointmentUpload", function (req, res) {
  res.render("appointmentUpload");
});

app.post("/appointmentUpload", async (req, res) => {
  console.log("Check")
  const empno = req.session.empno;
  console.log(empno)
  try {
    const appointmentDetails = new appointment({
      appointmentNo: req.body.appointmentNo,
      rollNo: req.body.rollNo,
      date: req.body.date,
      time: req.body.time,
      symptoms: req.body.symptoms,
      diagnosis: req.body.diagnosis,
    });

    console.log(appointmentDetails);
    try {
      const appointmentUploaded = await appointmentDetails.save();
      res.status(201).render("appointmentUpload");
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get("/staffAppointmentUpload", function (req, res) {
  res.render("staffAppointmentUpload");
});

app.post("/staffAppointmentUpload", async (req, res) => {
  console.log("Check")
  const empno = req.session.empno;
  console.log(empno)
  try {
    const appointmentDetails = new appointment({
      appointmentNo: req.body.appointmentNo,
      rollNo: req.body.rollNo,
      date: req.body.date,
      time: req.body.time,
      symptoms: req.body.symptoms,
      diagnosis: req.body.diagnosis,
    });

    console.log(appointmentDetails);
    try {
      const appointmentUploaded = await appointmentDetails.save();
      res.status(201).render("staffAppointmentUpload");
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

//Prescription Upload
const prescription = require("./models/prescriptionUpload");
app.get("/prescriptionUpload", function (req, res) {
  res.render("prescriptionUpload");
});

app.post("/prescriptionUpload", async (req, res) => {
  console.log("Check");
  const userId = req.session.user;
  try {
    const prescriptionDetails = new prescription({
      prescriptionNo: req.body.prescriptionNo,
      appointmentNo: req.body.appointmentNo,
      date: req.body.date,
      notes: req.body.notes,
      medicationList: req.body.medicationList,
      userId: userId,
    });

    console.log(prescriptionDetails);
    try {
      const prescriptionUploaded = await prescriptionDetails.save();
      res.status(201).render("prescriptionUpload");
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    res.status(400).send(error);
  }
});


app.get("/staffPrescriptionUpload", function (req, res) {
  res.render("staffPrescriptionUpload");
});

app.post("/staffPrescriptionUpload", async (req, res) => {
  console.log("Check");
  const userId = req.session.user;
  try {
    const prescriptionDetails = new prescription({
      prescriptionNo: req.body.prescriptionNo,
      appointmentNo: req.body.appointmentNo,
      date: req.body.date,
      notes: req.body.notes,
      medicationList: req.body.medicationList,
      userId: userId,
    });

    console.log(prescriptionDetails);
    try {
      const prescriptionUploaded = await prescriptionDetails.save();
      res.status(201).render("staffPrescriptionUpload");
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

//Dashboard

app.get("/dashboard", async function (req, res) {
  if (!req.session.user) {
    res.redirect("/loginOptions");
  } else {
    // Render the dashboard template with user data
    const { firstname, lastname, rollno, age, email, phone, gender, bloodGroup} = req.session.user; // Get first name and last name from user session
    console.log(rollno);
    const date = req.query.date;
    var appointments;
    if(date == null){
    appointments = await appointment.find({ rollno: rollno }) ;
    console.log(appointments);
    }

    else{
      appointments = await appointment.find({ rollno: rollno, date: date }) ;
      console.log(appointments);  
    }

    // Render the dashboard template with user data
    res.render("dashboard", {
      firstname,
      lastname,
      loggedIn: req.session.loggedIn,
      appointment: appointments,
        rollno,
        age,
        email,
        phone,
        gender, 
        bloodGroup,
    });
  }
});


//Admin Dashboard
app.get("/adminDashboard", async function (req, res) {
  if (!req.session.user) {
    res.redirect("/login");
  } else {
    let { rollno, date } = req.query;
    let query = {};

    if (rollno && date) {
      query = { rollNo: rollno, date: date };
    } else if (rollno) {
      query = { rollNo: rollno };
    } else if (date) {
      query = { date: date };
    }

    const { designation, adminid } = req.session.user;

    const appointments = await appointment.find(query);
    const prescriptions = await prescription.find({});

    res.render("adminDashboard", {
      designation,
      loggedIn: req.session.loggedIn,
      appointment: appointments,
      prescription: prescriptions,
      query: req.query,
    });
  }
});


//Staff Dashboard
app.get("/staffDashboard", async function (req, res) {
  if (!req.session.user) {
    res.redirect("/loginOptions");
  } else {
    const { firstname, lastname, empno, age, email, phone} = req.session.user;
    const { rollno, date } = req.query;

    // Check if both roll no and date are provided
    if (rollno && date) {
      const appointments = await appointment.find({ rollNo: rollno, date: date });
      const prescriptions = await prescription.find({});
      
      res.render("staffDashboard", {
        firstname,
        lastname,
        loggedIn: req.session.loggedIn,
        appointment: appointments,
        prescription: prescriptions
      });
    }
    // Check if only roll no is provided
    else if (rollno && !date) {
      const appointments = await appointment.find({ rollNo: rollno });
      const prescriptions = await prescription.find({});

      res.render("staffDashboard", {
        firstname,
        lastname,
        loggedIn: req.session.loggedIn,
        appointment: appointments,
        prescription: prescriptions
      });
    }
    // Check if only date is provided
    else if (!rollno && date) {
      const appointments = await appointment.find({ date: date });
      const prescriptions = await prescription.find({});
      
      res.render("staffDashboard", {
        firstname,
        lastname,
        loggedIn: req.session.loggedIn,
        appointment: appointments,
        prescription: prescriptions
      });
    }
    // Otherwise, show all records
    else {
      const appointments = await appointment.find({});
      const prescriptions = await prescription.find({});
      
      res.render("staffDashboard", {
        firstname,
        lastname,
        loggedIn: req.session.loggedIn,
        appointment: appointments,
        prescription: prescriptions
      });
    }
  }
});




app.get('/appointments.pdf', async function(req, res) {
  
  const appointmentNo = req.query.appointmentNo;
  const appointmentDetails = await appointment.findOne({ appointmentNo: appointmentNo });
  const rollno = appointmentDetails.rollNo;
  console.log(rollno);
  const patientDetails = await register.findOne({rollno: rollno});
  console.log(patientDetails);
  const prescriptionDetails = await prescription.findOne({appointmentNo: appointmentNo});

  
  if (appointmentDetails) {
    const doc = new pdfkit();
    // Set up the document
    doc.image("C:/Users/HP/OneDrive/Desktop/EPICS_Project/index/backend/Images/nit-logo-min.png", 50, 50, { width: 50 })
       .fontSize(24)
       .text('Mother Theresa Health Center', { align: 'center' })
       .fontSize(14)
       .text('NIT Andhra Pradesh, Tadepalligudem', { align: 'center' })
       .moveDown();

    // Add patient information
    doc.text(`Patient Name: ${patientDetails.firstname} ${patientDetails.lastname}`, 50, 150)
       .text(`Patient Age: ${patientDetails.age}`, 50, 175)
       .text(`Patient Email: ${patientDetails.email}`, 50, 200)
       .text(`Patient Blood Group: ${patientDetails.bloodGroup}`, 50, 225)
       .text(`Patient Roll No: ${patientDetails.rollno}`, 350, 150)
       .text(`Patient Gender: ${patientDetails.gender}`, 350, 175)
       .text(`Patient Phone: ${patientDetails.phone}`, 350, 225);

    // Add horizontal line
    doc.moveTo(50, 250).lineTo(550, 250).stroke();

    // Add appointment information
    doc.fontSize(20)
       .text('Appointment Details', 50, 300)
       .fontSize(14)
       .text(`Appointment No: ${appointmentDetails.appointmentNo}`, 50, 350)
       .text(`Date: ${appointmentDetails.date}`, 350, 350)
       .rect(50, 395, 500, 50)
       .text(`Symptoms: ${appointmentDetails.symptoms}`, 55, 400, { width: 490, height: 50, align: 'left', valign: 'top' });

    // Add diagnosis information
    doc.rect(50, 460, 500, 50)
       .text(`Diagnosis: ${appointmentDetails.diagnosis}`, 55, 465, { width: 490, height: 50, align: 'left', valign: 'top' });

    // Add horizontal line
    doc.moveTo(50, 520).lineTo(550, 520).stroke();

    // Add prescription information
    doc.fontSize(20)
       .text('Prescription Details', 50, 570)
       .fontSize(14)
       .text(`Appointment No: ${prescriptionDetails.appointmentNo}`, 50, 620)
       .rect(50, 645, 500, 50)
       .text(`Notes: ${prescriptionDetails.notes}`, 55, 650, { width: 490, height: 50, align: 'left', valign: 'top' });

    // Add border
    doc.rect(25, 25, 550, 750).stroke();

    const filename = 'appointment-' + appointmentNo + '.pdf';
    const filePath = path.join(__dirname, filename);
    doc.pipe(fs.createWriteStream(filePath));
    doc.end();
    console.log('PDF file created at:', filePath);
console.log('File exists:', fs.existsSync(filePath));

  
    res.download(filePath, function(err) {
      if (err) {
        console.log('Error while sending file:', err);
      } else {
        fs.unlinkSync(filePath);
      }
    });
  } else {
    res.status(404).send('Appointment not found');
  }
});


app.listen(3000, () => {
  console.log("Server is running");
});