require('dotenv').config();
const express = require('express')
const app = express()
const port = 3000
const axios = require('axios');

app.get('/', (req, res) => {
    let url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/45056?key=${process.env.API_KEY}`;
    axios.get(url)
    .then(function (response) {
        console.log(response);
    })
    .catch(function (error) {
        // handle error
        console.log(error);
    });
    res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port} at http://127.0.0.1:3000/`)
})