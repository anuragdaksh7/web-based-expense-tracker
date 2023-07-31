const express = require("express");
const { addUser, authUser } = require("./database.js");
const fs = require('fs');
const jwt = require("jsonwebtoken");
const CookieParser = require("cookie-parser")
const { createHash } = require('crypto');
const cookieParser = require("cookie-parser");

secretKey = 'RANDOM_TOKEN_SECRET';

const auth = async (req, res, next) =>{
    try {
        const token = req.cookie.jwt;
        const verifyUser = jwt.verify(token, secretKey);
        console.log(verifyUser,1);
        next();
    } catch (error) {
        res.status(401).send(error);
    }
}

function hash(string) {
    return createHash('sha256').update(string).digest('hex');
}
var USER = Array();

const app = express();
app.use(express.urlencoded());
app.use(cookieParser());
app.use(express.static('assets'));
app.use(express.static('dist'));

app.listen(3000, () => {
    console.log("Application started and Listening on port 3000, http://localhost:3000");
});


app.get("/debug/activeUserCount", (req, res) => {
    console.log(req);
    res.send(USER);
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


app.get("/home", auth, (req, res) => {
    fs.readFile('home.html', 'utf8', (err, data) => {
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
    var user = await authUser(req.body.email, hash(req.body.password));
    if (user != "Incorrect Creds.") {
        USER.push(req.body.email);
        const token = jwt.sign(
            { userId: user._id },
            secretKey,
            { expiresIn: '24h' }
        );
        res.cookie("jwt", token, {
            expires:new Date(Date.now()+50000),
            httpOnly:true,
        });
        // console.log(token);
        console.log(req.cookies.jwt);
        res.redirect("/home",)
    }
});

app.post("/signup", async (req, res) => {
    var a = await addUser(req.body.email, req.body.username, hash(req.body.password));
    console.log(a);
    if (a == "USER CREATED")
        USER.push(req.body.email);
    res.send(req.body);
    res.redirect("/home");
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
