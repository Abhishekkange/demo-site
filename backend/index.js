const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const connectDB = require('./db/db');
const Form = require('./models/form');
const session = require('express-session');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

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

// ==== 4. Multer Memory Storage ====
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// ==== 5. Routes ====
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/submit', upload.single('resume'), async (req, res) => {
  const formData = req.body;
  const resumeFile = req.file;

  try {
    // Upload buffer directly to Cloudinary
    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream(
          { resource_type: "auto", folder: "resumes" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(buffer).pipe(stream);
      });
    };

    const result = await streamUpload(resumeFile.buffer);

    // Save to MongoDB
    const newForm = new Form({
      ...formData,
      resumeUrl: result.secure_url,
      resumeFileName: resumeFile.originalname,
    });

    await newForm.save();

    // Email notification
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
      text: `A new application was received:\n\nName: ${formData.full_name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\n\nResume: ${result.secure_url}\n\nView all applications at: https://careers.cirqubesystems.com/admin`,
    };

    transporter.sendMail(mailOptions);

    // Send Thank You Page
    res.status(200).sendFile(path.join(__dirname, 'public', 'submitted.html'));

  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).send('Submission failed.');
  }
});

// ==== 6. Start Server ====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));