const express = require('express');
const router = express.Router();
const Form = require('../models/form');
const isAuthenticated = require('../middlewares/auth');



router.get('/admin', isAuthenticated, async (req, res) => {
    try {
      const forms = await Form.find({});
      res.render('admin', { forms });
    } catch (error) {
      console.error('Error fetching forms:', error);
      res.status(500).send('Internal server error');
    }
  });

  router.get('/login', (req, res) => {
    res.render('login'); // render your login.ejs page
  });
  
  router.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    // Replace with real user auth check
    if (username === 'admin' && password === 'cirqube2003ST') {
      req.session.user = { username };
      const redirectTo = req.session.redirectTo || '/admin';
      delete req.session.redirectTo;
      return res.redirect(redirectTo);
    }
  
    res.render('login', { error: 'Invalid credentials' });
  });

  router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
  });





module.exports = router;