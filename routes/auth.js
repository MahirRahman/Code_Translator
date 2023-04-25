// team_seven Code Translator
// 
// auth.js - Authentication routes
// Routes handling user authentication such as login, 
// register, signup, and logout.

// require modules for use
var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var crypto = require('crypto');
var db = require('../db1');

// Define a LocalStrategy to authenticate using username and password
passport.use(new LocalStrategy(function verify(username, password, cb) {
    // Query for the user from the database to make sure it exists
    db.get('SELECT * FROM users WHERE username = ?', [ username ], function(err, row) {
      if (err) { return cb(err); }
      // Return error message if username does not exist
      if (!row) { return cb(null, false, { message: 'Incorrect username or password.' }); }
      
      // User exists, check hashed password to see if it matches the hashed password
      // in the database
      crypto.pbkdf2(password, row.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
        if (err) { return cb(err); }
        if (!crypto.timingSafeEqual(row.hashed_password, hashedPassword)) {
          // Return error message if passwords do not match
          return cb(null, false, { message: 'Incorrect username or password.' });
        }
        return cb(null, row);
      });
    });
}));

// Function for user serialization into ID format
passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    cb(null, { id: user.id, username: user.username });
  });
});

// Function for user deserialization from ID format
passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});

// initialize express router
var router = express.Router();

// Route to access login page, if authenticated, redirect to homepage
router.get('/login', checkNotAuthenticated, function(req, res, next) {
  res.render('login');
});

// Route for user authentication submission, if successful, redirect
// to homepage, if unsuccessful, redirect back to login
router.post('/login/password', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}));

// Route for user logout submission
router.post('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
});

// Route to access register page, if authenticated, redirect to homepage
router.get('/register', checkNotAuthenticated, function(req, res, next) {
    res.render('register');
});

// Route for user signup submission, if successful, redirect to homepage and log
// user in. Hashes user password and submits into database.
router.post('/signup', function(req, res, next) {
    var salt = crypto.randomBytes(16); //set password salt
    crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', function(err, hashedPassword) {
        if (err) { return next(err); }
        // Insert user values into database
        db.run('INSERT INTO users (username, hashed_password, salt) VALUES (?, ?, ?)', [
            req.body.username,
            hashedPassword,
            salt
        ], function(err) {
            if (err) { return next(err); }
            var user = {
                id: this.lastID,
                username: req.body.username
            };
            // redirect to home page
            req.login(user, function(err) {
                if (err) { return next(err); }
                res.redirect('/');
            });
        });
    });
});

// Function to check if user is authenticated or not.
// Implemented on routes authenticted users should not access (login, register)
function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}

module.exports = router;