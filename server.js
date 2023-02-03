const express = require("express");
const bodyparser = require("body-parser");
const bcrypt=require("bcrypt");
const app = express();
require('dotenv').config()
const db = require("./componnents/databasevariables/db")


app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));
app.use(express.static("public"));



//routes
app.use('/user',require('./routers/userrouter'));

const port= process.env.PORT;
// console.log(process.env.SALT);

async function hashing(){
  var ch = await bcrypt.hash("password1", 5);
  console.log(ch);
  return ch;
}

console.log(hashing());


db();

app.get("/",(req,res)=>{
    res.json({
      status:200,
      msg:"success"
    });
});

app.listen(port ,()=>{
  console.log("server started "+port);
});