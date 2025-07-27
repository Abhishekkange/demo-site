const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  full_name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  contact_number: { type: String },
  linkedin: { type: String },
  resumeUrl: { type: String }, // Ensure this field is required
  github: { type: String },
  portfolio: { type: String },
  qualification: { type: String },
  university: { type: String },
  grad_year: { type: String },
  skills: { type: String },
  project_desc: { type: String },
  project_link: { type: String },
  start_date: { type: String },
  duration: { type: String },
  work_mode: { type: String },
  reason: { type: String },
  fit_reason: { type: String },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Application', applicationSchema);