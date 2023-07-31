const express = require("express");
const app = express();
const { createHash } = require('crypto');
const fs = require('fs');
const PORT = process.env.PORT || 3000;
const db = require("./db.js");
const Register = require("./register.js");


app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static('assets'));
app.use(express.static('dist'));

function hash(string) {
    return createHash('sha256').update(string).digest('hex');
}

app.listen(PORT, () => {
    console.log(`server is running at port no ${PORT}... http://localhost:${PORT}`);
})


app.get("/", (req, res) => {
    fs.readFile('index.html', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        res.send(data);
    });
});


app.get("/login", (req,res) => {
    fs.readFile('login.html', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        res.send(data);
    });
});

app.get("/signup", (req,res) => {
    fs.readFile('signup.html', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        res.send(data);
    });
});


app.post("/signup", async (req, res) =>{
    try {
        
        
        const register = new Register({
            userName: req.body.username,
            email: req.body.email,
            password: hash(req.body.password),
        });

        const registered = await register.save();
        res.status(201).redirect("/home");

    } catch (error) {
        res.status(400).send(error);
    }
});


app.post("/login", async(req, res) => {
    // console.log(req.body);
    // console.log(req.body.email);
    try {
        
        const email = req.body.email;
        const password = hash(req.body.password);

        const userEmail = await Register.findOne({email: email});
        if (userEmail.password === password){
            res.status(201).redirect("/home");
        } else {
            res.send("invalid creds");
        }

    } catch (error) {
        res.status(400).send(error);
    }
});


app.get("/home", (req,res) => {
    fs.readFile('home.html', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        res.send(data);
    });
});