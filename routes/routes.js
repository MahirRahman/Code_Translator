// team_seven Code Translator
// 
// routes.js - Application routes
// History and translation routes for the application server to use

// require modules for use
const express = require('express');
const routes = express.Router();
const bcrypt = require('bcrypt');
const db = require("../db.js")
const authRouter = require('./auth');
const { Configuration, OpenAIApi } = require("openai");
// const users = []; //local variable, change this to a JSON database
const configuration = new Configuration({
    apiKey: process.env.API_KEY,
});
const openai = new OpenAIApi(configuration);

// use statement
routes.use(express.urlencoded({ extended: false }));

// Function to query a code translation to the api
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
    console.log(wow.choices[0].text);

    // Format date before inserting into db
    let objectDate = new Date();
    let day = objectDate.getDate();
    let month = objectDate.getMonth() + 1;
    let year = objectDate.getFullYear();
    let formatDate = month + "/" + day + "/" + year;

    db.insertDB(searchText, wow.choices[0].text, formatDate);
    // console.log(wow);
    return wow;
    // db.insertDB(searchText, response.data.choices[0].text, new Date());
}

// Route to go to homepage, if not authenticated, redirect to
// the login page
routes.route("/").get(checkAuthenticated, (req, res) => {
    // runCompletion();
    res.render('index.ejs')
})

// Route that interacts with the api to query a translation
routes.get('/api/translate', checkAuthenticated, function(req,res) {
    searchText = req.query.txt;
    let languageFrom = req.query.from;
    let languageTo = req.query.to;
    data = runCompletion(searchText, languageFrom, languageTo);
    data.then(function(x) {
        // console.log(x);
        return res.send(x.choices[0].text);
    })
    // console.log(data);
});

// Route that gets and displays the history database in a page
routes.get("/history", checkAuthenticated, (req, res) => {
        db.display(function(x){
            res.render('history.ejs', {data: x});
         });
});

// function that determines whether or not a user is authenticated
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }

    res.redirect('/login')
}

module.exports = routes;