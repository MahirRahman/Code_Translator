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

routes.use(express.urlencoded({ extended: false }));

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

routes.get("/history", checkAuthenticated, (req, res) => {
        db.display(function(x){
            res.render('history.ejs', {data: x});
         });
});

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }

    res.redirect('/login')
}

module.exports = routes;