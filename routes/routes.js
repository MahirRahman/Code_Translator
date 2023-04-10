const express = require('express');
const routes = express.Router();
const db = require("../db.js")
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: process.env.API_KEY,
});
const openai = new OpenAIApi(configuration);

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

routes.route("/").get((req, res) => {
    // runCompletion();
    res.render('index.ejs')
})

routes.get('/api/translate', function(req,res) {
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

routes.get('/wow', function(req,res) {
    res.render('wow.ejs')
});

module.exports = routes;
