require('dotenv').config();
const mongoose = require("mongoose");const db = require("./db.js");


const userSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        required: true,
        unique: true
    },
    Expenses: [{
        date: {
            type: Date,
            required: true,
        },
        amount: {
            type: Number,
            required: true
        },
        from: {
            type: String,
            required: true
        },
        to: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        note: {
            type: String,
            required: true
        }
    }],
    categories:[{
        category:{
            type: String,
            required: true
        }
    }]
});

const userCache = new mongoose.model("userCache", userSchema);
// const u = new userCache({
//     userEmail: "req.body.email",
//     Expenses: [{
//         date: new Date(),
//         amount: 0,
//         from: "a",
//         to: "a",
//         category: "Bills",
//         note: "a"
//     }],
//     categories: [
//         {category: "Bills"},
//         {category: "Food"},
//         {category: "Groceries"},
//         {category: "Games"},
//         {category: "Entertainment"},
//         {category: "Sport"},
//         {category: "Shopping"},
//         {category: "Education"},
//         {category: "Taxes"},
//         {category: "Travel"},
//         {category: "Subscriptions"}
//     ]
// });u.save()
module.exports = userCache;