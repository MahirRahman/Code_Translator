const express = require('express');
const routes = express.Router();
const db = require("../db.js")
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: process.env.API_KEY,
});
const openai = new OpenAIApi(configuration);

async function runCompletion () {
    searchText= "##### Translate this function  from Python into JavaScript\n### Python\n    \n    def sum():\n        return 1\n    \n### JavaScript"
    
    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: "##### Translate this function  from Python into JavaScript\n### Python\n    \n    def sum():\n        return 1\n    \n### JavaScript",
        temperature: 0,
        max_tokens: 150,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
        stop: ["###"],
    });
    console.log(response.data.choices[0].text);
    db.insertDB(searchText, response.data.choices[0].text, new Date());
}

routes.route("/").get((req, res) => {
    runCompletion();
    res.render('views/index.ejs')
})

module.exports = routes;
