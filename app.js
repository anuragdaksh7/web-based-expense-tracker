require('dotenv').config();
const express = require("express");
const app = express();
const { createHash } = require('crypto');
const fs = require('fs');
const PORT = 3000;
const Register = require("./register.js");
const cookieParser = require("cookie-parser");
const auth = require("./auth.js");


app.use(cookieParser());
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

        const token = await register.generateAuthToken();
        res.cookie(
            "jwt",
            token, 
            {
                expires: new Date(Date.now()+30000),
                httpOnly: true
            }
        );

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
        const token = await userEmail.generateAuthToken();
        console.log("token: "+ token);

        res.cookie(
            "jwt",
            token, 
            {
                // expires: new Date(Date.now()+30000),
                httpOnly: true,
                // secure: true
            }
        );
        // console.log(`cookie: ${req.cookies.jwt}`);
        if (userEmail.password === password){
            res.status(201).redirect("/home");
        } else {
            res.send("invalid creds");
        }

    } catch (error) {
        res.status(400).send(error);
    }
});

app.get("/secret", auth , (req, res)=>{
    res.send("saasda");
});

app.get("/home", auth ,(req,res) => {
    fs.readFile('home.html', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        res.send(data);
    });
});

app.get("/logout", auth, async (req, res) => {
    try {
        res.clearCookie("jwt");
        console.log("logged Out");
        await req.user.save();
        res.redirect("/login");
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get("/health-check-001", (req, res) => {
    res.status(200);
});