// team_seven Code Translator
//
// app.js - Server application
// This application will act as a server to host the code translator.

// Require .env file for environmental variables
require("dotenv").config({ path: "./.env" });

// require modules for use
const express = require('express')
const path = require('path');
const indexRouter = require('./routes/routes');
const authRouter = require('./routes/auth');
const logger = require('morgan');
const passport = require('passport');
const flash = require('express-flash')
const session = require('express-session');

// Connect SQLite
const SQLiteStore = require('connect-sqlite3')(session);

// Initialize app and port variables
const app = express()
const port = 3000

// Set ejs views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

// Use statements
app.use(express.json());
app.use(express.static(__dirname));
app.use(flash());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new SQLiteStore({ db: 'sessions.db', dir: './var/db' })
}));
app.use(passport.authenticate('session')); // authenticate using passport
app.use('/', indexRouter);
app.use('/', authRouter);


// Server running
app.listen(port, () => {
  console.log(`Example app listening on port ${port} at http://127.0.0.1:3000/`)
})