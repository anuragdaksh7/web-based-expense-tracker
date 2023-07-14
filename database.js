const {MongoClient} = require("mongodb");
const URL = require('./key.js');
const url = URL;

const client = new MongoClient(url);
const database = "expensive";

async function getInfo(email) {
    let result = await client.connect();
    let db = result.db(database);
    let collection = db.collection("web-app");
    let response = await collection.find({ email: email }).toArray();
    return response;
}


async function addUser(Email, username, password){
    let result = await client.connect();
    let db = result.db(database);
    let collection = db.collection("web-app");
    let response = await collection.find({email:Email}).toArray();
    if (response.length > 0) return "USER ALREADY EXISTS!";
    else await collection.insertOne({ email: Email, user: username, pass: password  });
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

module.exports = {addUser, authUser, getInfo};