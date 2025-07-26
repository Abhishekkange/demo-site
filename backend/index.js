// server.js
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');
//
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // add this line
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.sendFile('index.html');
});

app.post('/submit', (req, res) => {
  const formData = req.body;
  console.log('Form Data:', formData);

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'abhishekkange@gmail.com',
      pass: 'mole iapa xxyu gyfn'
    }
  });

  const mailOptions = {
    from: 'abhishekkange@gmail.com',
    to: ['abhishekkange00@gmail.com', 'sales@cirqubesystems.com'], // send to both
    subject: 'New Internship Application',
    text: JSON.stringify(formData)
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) return res.status(500).send('Email failed');
    return res.status(200).send('Email sent successfully');
  });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));