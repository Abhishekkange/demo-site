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
    to: ['abhishekkange00@gmail.com', 'sales@cirqubesystems.com'],
    subject: 'New Internship Application',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="text-align: center; color: #4F46E5;">📄 Internship Application</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; font-weight: bold;">Full Name</td>
            <td style="padding: 8px;">${formData.full_name}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Email</td>
            <td style="padding: 8px;">${formData.email}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Phone</td>
            <td style="padding: 8px;">${formData.phone}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">LinkedIn</td>
            <td style="padding: 8px;"><a href="${formData.linkedin}">${formData.linkedin}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">GitHub</td>
            <td style="padding: 8px;"><a href="${formData.github}">${formData.github}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Portfolio</td>
            <td style="padding: 8px;"><a href="${formData.portfolio}">${formData.portfolio}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Qualification</td>
            <td style="padding: 8px;">${formData.qualification}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">University</td>
            <td style="padding: 8px;">${formData.university}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Graduation Year</td>
            <td style="padding: 8px;">${formData.grad_year}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Skills</td>
            <td style="padding: 8px;">${formData.skills}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Project Description</td>
            <td style="padding: 8px;">${formData.project_desc || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Project Link</td>
            <td style="padding: 8px;">${formData.project_link || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Start Date</td>
            <td style="padding: 8px;">${formData.start_date || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Duration</td>
            <td style="padding: 8px;">${formData.duration}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Work Mode</td>
            <td style="padding: 8px;">${formData.work_mode}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Why this Internship</td>
            <td style="padding: 8px;">${formData.reason || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Why you are a fit</td>
            <td style="padding: 8px;">${formData.fit_reason || 'N/A'}</td>
          </tr>
        </table>
        <p style="text-align: center; margin-top: 20px; color: #888;">Cirqube Internship Application System</p>
      </div>
    `
  };
  
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) return res.status(500).send('Email failed');
    return res.status(200).send('Email sent successfully');
  });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));