const express = require('express');
const router = express.Router();
const Form = require('../models/form');


router.get('/admin', async (req, res) => {
    try {
      const forms = await Form.find({});
      res.render('admin', { forms });  // <-- render EJS page
    } catch (error) {
      console.error('Error fetching forms:', error);
      res.status(500).send('Internal server error');
    }
  });






module.exports = router;