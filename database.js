require("dotenv").config();
const {MongoClient} = require("mongodb");
const URL = process.env.API_KEY;
const url = URL;

const client = new MongoClient(url);
const database = "expensive";
// async function getData(){
//     let result = await client.connect();
//     let db = result.db(database);
//     let collection = db.collection("web-app");
//     // let response = await collection.find({"age":"18"}).toArray();
//     await collection.insertOne({ title: 'Jackie Robinson' });
//     let response = await collection.find({title:"Jackie Robinson"}).toArray();
//     console.log(response[0].title, response.length);
// }
async function addUser(Email, username, password){
    let result = await client.connect();
    let db = result.db(database);
    let collection = db.collection("web-app");
    let response = await collection.find({email:Email}).toArray();
    if (response.length > 0) return "USER ALREADY EXISTS!";
    else await collection.insertOne({ email: Email, user: username, pass: password  }); //maybe use bcrypt here like pass: hashedpassword
    return "USER CREATED";
}

async function authUser(Email, password){
    let result = await client.connect();
    let db = result.db(database);
    let collection = db.collection("web-app");
    let response = await collection.find({email:Email, pass:password }).toArray();
    if (response.length == 0) return "Incorrect Creds.";
    else return response[0].email;
}

module.exports = {addUser, authUser};