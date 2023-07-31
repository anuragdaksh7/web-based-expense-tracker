const mongoose = require("mongoose");
const URL = require('./key.js');
console.log(URL)
mongoose.set('strictQuery', false);
mongoose.connect(URL, { 
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(() => {
    console.log("connection succsessfull");
}).catch((e) => {
    console.log(e);
});