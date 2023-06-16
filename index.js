const express = require("express");
const fs = require('fs');

USER = null

const app = express();

app.use(express.static('assets'));

app.listen(3000, () => {
  console.log("Application started and Listening on port 3000");
});



app.get("/", (req, res) => {
    fs.readFile('index.html', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        res.send(data);
    });
});


app.get("/login", (req, res) => {
    fs.readFile('login.html', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        res.send(data);
    });
});


app.get("/signup", (req, res) => {
    fs.readFile('signup.html', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        res.send(data);
    });
});
