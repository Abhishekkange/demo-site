// server.js
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const connectDB = require('./db/db'); // Adjust the path as necessary
const formRoutes = require('./routes/form_route'); // Adjust the path as necessary
const Form = require('./models/form'); // Adjust the path as necessary
const session = require('express-session');



//
const app = express();
connectDB(); // Connect to MongoDB
app.use(session({
  secret: 'shahrukhkhan',  // use a secure, random string
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // set to true only if using HTTPS
}));


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // add this line
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));



app.use('/', formRoutes);
app.get('/', (req, res) => {
  res.sendFile('index.html');
});


app.post('/submit', async (req, res) => {
  const formData = req.body;
  console.log('Form Data:', formData);

  try {
    // 1. Save to MongoDB
    const newForm = new Form(formData);
    await newForm.save();
    console.log('Form data saved to MongoDB');

    // 2. Send Email
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'abhishekkange@gmail.com',
        pass: 'mole iapa xxyu gyfn'
      }
    });

    const mailOptions = {
      from: 'abhishekkange@gmail.com',
      to: ['abhishekkange00@gmail.com', 'sales@cirqubesystems.com'],
      subject: 'New Internship Application',
      text: `New application received: find it at https:careers.cirqubesystems.com/admin`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Email failed:', error);
        return res.status(500).send('Form saved, but email failed to send.');
      }
      res.status(200).send('Form submitted and email sent successfully!');
    });

  } catch (error) {
    console.error('Error processing form:', error);
    res.status(500).send('Something went wrong. Try again later.');
  }
});


app.listen(3000, () => console.log('Server running on http://localhost:3000'));