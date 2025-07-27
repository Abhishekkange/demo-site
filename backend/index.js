const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const connectDB = require('./db/db');
const Form = require('./models/form'); // Ensure your model supports resumeUrl
const session = require('express-session');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

const app = express();

// ==== 1. MongoDB Connection ====
connectDB();

// ==== 2. Cloudinary Config ====
cloudinary.config({
  cloud_name: "dqfpnw5v4",
  api_key: "858991468122927",
  api_secret: "xGmS8Hc79GWXTLXrtCTZRILjOf4",
});

// ==== 3. Middleware ====
app.use(session({
  secret: 'shahrukhkhan',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false },
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/',require('./routes/form_route'));

// ==== 4. Multer Setup ====
const upload = multer({ dest: 'uploads/' });

// ==== 5. Routes ====
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/submit', upload.single('resume'), async (req, res) => {
  const formData = req.body;
  const resumeFile = req.file;

  try {
    // === 1. Upload resume to Cloudinary ===
    const result = await cloudinary.uploader.upload(resumeFile.path, {
      resource_type: 'auto',
      folder: 'resumes',
      type: 'upload',
    });

    console.log('Resume uploaded to Cloudinary:', result.secure_url);

    // Optional: remove local file
    fs.unlinkSync(resumeFile.path);

    // === 2. Save to MongoDB ===
    const newForm = new Form({
      ...formData,
      resumeUrl: result.secure_url,
      resumeFileName: resumeFile.originalname,
    });

    console.log("resumeUrl:", newForm.resumeUrl);

    await newForm.save();
    console.log('Form data saved to MongoDB');

    // === 3. Send Email ===
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'abhishekkange@gmail.com',
        pass: 'mole iapa xxyu gyfn',
      },
    });

    const mailOptions = {
      from: 'abhishekkange@gmail.com',
      to: ['abhishekkange00@gmail.com', 'sales@cirqubesystems.com'],
      subject: 'New Internship Application',
      text: `A new application was received:\n\nName: ${formData.full_name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nMessage: ${formData.message}\n\nResume: ${result.secure_url}\n\nView all applications at: https://careers.cirqubesystems.com/admin`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Email failed:', error);
        return res.status(500).send('Form saved, but email failed to send.');
      }
      res.status(200).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Thank You</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f7fafc;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
            }
            .thank-you {
              background: white;
              padding: 40px;
              border-radius: 12px;
              box-shadow: 0 5px 20px rgba(0,0,0,0.1);
              text-align: center;
            }
            h1 {
              color: #2d3748;
            }
            p {
              color: #4a5568;
              margin-top: 10px;
              font-size: 18px;
            }
          </style>
        </head>
        <body>
          <div class="thank-you">
            <h1>Thank You for Submitting Your Details!</h1>
            <p>Our team will get back to you shortly.</p>
          </div>
        </body>
        </html>
      `);    });

  } catch (error) {
    console.error('Error processing form:', error);
    res.status(500).send('Something went wrong. Try again later.');
  }
});

// ==== 6. Start Server ====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));