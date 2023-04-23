require("dotenv").config({ path: "./.env" });

const express = require('express')
const path = require('path');
const indexRouter = require('./routes/routes');
const authRouter = require('./routes/auth');
const logger = require('morgan');
const passport = require('passport');
const session = require('express-session');

const SQLiteStore = require('connect-sqlite3')(session);

const app = express()
const port = 3000

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use(express.json());
app.use(express.static(__dirname));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new SQLiteStore({ db: 'sessions.db', dir: './var/db' })
}));
app.use(passport.authenticate('session'));
app.use('/', indexRouter);
app.use('/', authRouter);



app.listen(port, () => {
  console.log(`Example app listening on port ${port} at http://127.0.0.1:3000/`)
})