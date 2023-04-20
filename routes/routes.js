const express = require('express');
const routes = express.Router();
const bcrypt = require('bcrypt');
const db = require("../db.js")
const { Configuration, OpenAIApi } = require("openai");
const users = []; //local variable, change this to a JSON database
const configuration = new Configuration({
    apiKey: process.env.API_KEY,
});
const openai = new OpenAIApi(configuration);
const LocalStrategy = require('passport-local').Strategy;
const flash = require('express-flash');
const session = require('express-session');
const passport = require('passport');

routes.use(express.urlencoded({ extended: false }));
routes.use(flash());
routes.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
routes.use(passport.initialize())
routes.use(passport.session())

async function runCompletion (searchText, languageFrom, languageTo) {
    // searchText= "##### Translate this function  from Python into JavaScript\n### Python\n    \n"+searchText+"\n### JavaScript";
    
    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: "##### Translate this function  from " + languageFrom + " into " + languageTo + "\n### " + languageFrom + "\n    \n"    + searchText + "    \n### " + languageTo,
        temperature: 0,
        max_tokens: 150,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
        stop: ["###"],
    });
    wow = await response.data;
    // console.log(wow);
    return wow;
    // db.insertDB(searchText, response.data.choices[0].text, new Date());
}

// Passport authentication
function initializePassport(passport, getUserByName, getUserById)  {
    const authenticateUser = async (name, password, done) => {
        const user = getUserByName(name)
        if (user == null) {
            return done(null, false, { message: 'No user with that name'})
        }
        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user)
            } else {
                return done(null, false, { message: 'Password incorrect' })
            }
        } catch (e) {
            return done(e)
        }
    }
    passport.use(new LocalStrategy({ usernameField: 'name' },
    authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
        return done(null, getUserById(id))
    })
}

initializePassport(
    passport, 
    name => users.find(user => user.name === name),
    id => users.find(user => user.id === id)
);

routes.route("/").get(checkAuthenticated, (req, res) => {
    // runCompletion();
    res.render('index.ejs')
})

routes.get('/api/translate', checkAuthenticated, function(req,res) {
    searchText = req.query.txt;
    let languageFrom = req.query.from;
    let languageTo = req.query.to;
    data = runCompletion(searchText, languageFrom, languageTo);
    data.then(function(x) {
        console.log(x);
        return res.send(x.choices[0].text);
    })
    // console.log(data);
});

routes.route("/history").get(checkAuthenticated, (req, res) => {
        db.display(function(x){
            res.render('history.ejs', {data: x});
         });
    });

routes.get('/wow', function(req,res) {
    res.render('wow.ejs')
});

routes.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
})

routes.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

routes.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs')
})

routes.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            password: hashedPassword
        })
        res.redirect('/login')
    } catch {
        res.redirect('/register')
    }
    console.log(users)
})

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }

    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        res.redirect('/')
    }
    next()
}

module.exports = routes;