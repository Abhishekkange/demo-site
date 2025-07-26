function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
      return next();
    }
    // Save original URL to redirect after login
    req.session.redirectTo = req.originalUrl;
    res.redirect('/login');
  }
  
  module.exports = isAuthenticated;