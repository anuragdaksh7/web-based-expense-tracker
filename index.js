const express = require("express");
const {addUser, authUser} = require("./database.js");
const fs = require('fs');
const { createHash } = require('crypto');

function hash(string) {
  return createHash('sha256').update(string).digest('hex');
}
var USER = null;

const app = express();
app.use(express.urlencoded());
app.use(express.static('assets'));
app.use(express.static('dist'));

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

app.post("/login", async (req, res) => {
    var a = await authUser( req.body.email, hash(req.body.password));
    if (a != "Incorrect Creds.") 
        USER = req.body.email;
    res.send(a)
});

app.post("/signup", async (req, res)  => {
    var a = await addUser(req.body.email, req.body.username, hash(req.body.password));
    console.log(a);
    if (a == "USER CREATED")
        USER = req.body.email;
    res.send(req.body);
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
