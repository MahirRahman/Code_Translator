const express = require('express')
const app = express()
require("dotenv").config({ path: "./.env" });
const path = require('path');
const port = 3000

app.use(express.json());
app.use(require("./routes/routes.js"));
app.set('views', path.join(__dirname, '/views'));
console.log(path.join(__dirname, '/views'));
app.set('view engine', 'ejs');



app.listen(port, () => {
  console.log(`Example app listening on port ${port} at http://127.0.0.1:3000/`)
})