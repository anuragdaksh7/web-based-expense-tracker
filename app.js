require('dotenv').config();
const express = require("express");
const app = express();
const { createHash } = require('crypto');
const fs = require('fs');
const PORT = process.env.PORT /*maybe put || 3000 or something like that*/;
const db = require("./db.js");
const Register = require("./register.js");
const userCache = require("./expenseDB.js");
const cookieParser = require("cookie-parser");
const auth = require("./auth.js");


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static('assets'));
app.use(express.static("node_modules/flowbite/dist"));
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
            res.status(404)
            return;
        }
        res.send(data).status(200);
    });
});


app.get("/login", (req,res) => {
    fs.readFile('login.html', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(404)
            return;
        }
        res.send(data).status(200);
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
        console.log(userCache);
        const u = new userCache({
            userEmail: req.body.email,
            Expenses: [{
                date: new Date(),
                amount: 0,
                from: "a",
                to: "a",
                category: "Bills",
                note: "a"
            }],
            categories: [
                {category: "Bills"},
                {category: "Food"},
                {category: "Groceries"},
                {category: "Games"},
                {category: "Entertainment"},
                {category: "Sport"},
                {category: "Shopping"},
                {category: "Education"},
                {category: "Taxes"},
                {category: "Travel"},
                {category: "Subscriptions"}
            ]
        });u.save();
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

app.get("/addexp", auth, (req,res) => {
    fs.readFile('addExpense.html', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(404)
            return;
        }
        res.send(data).status(200);
    });
});

app.get("/categoriesUser", auth, async (req, res) => {
    // console.log(req.query);
    const email = req.user.email;
    // const category = req.query.category;
    // const s = await getRes(cty);
    // res.status(200).json(s);
    var category = await userCache.findOne({userEmail: email});
    category = category.categories;
    // console.log(category);
    var ar = Array();
    for (let key in category) {
        ar.push(category[key]["category"]);
    }
    res.json (ar);
});