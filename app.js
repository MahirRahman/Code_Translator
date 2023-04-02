require('dotenv').config();
const express = require('express')
const app = express()
const port = 3000
const axios = require('axios');
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: process.env.API_KEY,
});
const openai = new OpenAIApi(configuration);

async function runCompletion () {
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
}

app.get('/', (req, res) => {
    // let url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/45056?key=${process.env.API_KEY}`;
    // axios.get(url)
    // .then(function (response) {
    //     console.log(response);
    // })
    // .catch(function (error) {
    //     // handle error
    //     console.log(error);
    // });
    runCompletion();
    res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port} at http://127.0.0.1:3000/`)
})