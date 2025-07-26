// server.js
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const connectDB = require('./db/db'); // Adjust the path as necessary
const formRoutes = require('./routes/form_route'); // Adjust the path as necessary
const Form = require('./models/form'); // Adjust the path as necessary

//
const app = express();
connectDB(); // Connect to MongoDB

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
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="text-align: center; color: #4F46E5;">📄 Internship Application</h2>
          <table style="width: 100%; border-collapse: collapse;">
            ${Object.entries(formData).map(([key, value]) => `
              <tr>
                <td style="padding: 8px; font-weight: bold;">${key.replace(/_/g, ' ')}</td>
                <td style="padding: 8px;">${value || 'N/A'}</td>
              </tr>
            `).join('')}
          </table>
          <p style="text-align: center; margin-top: 20px; color: #888;">Cirqube Internship Application System</p>
        </div>
      `
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