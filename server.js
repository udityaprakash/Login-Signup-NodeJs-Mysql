

const express = require("express");
const bodyparser = require("body-parser");
const bcrypt=require("bcrypt");
var mysql = require('mysql2');
const app = express();
const postsignup = require("./componnents/authentications/signup");
const postlogin= require("./componnents/authentications/login");
require('dotenv').config()
const db = require("./componnents/databasevariables/db")
const sqlcn = require("./componnents/databasevariables/sqlcon");
const dashboard = require("./componnents/dashboard/dashboard");






app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));
app.use(express.static("public"));

var sqlcon = sqlcn;

const port= process.env.PORT;
// console.log(process.env.SALT);

function hashing(){
  bcrypt.hash("hellofdrt", 10).then(function(hash) {
    console.log("Samplehash-- "+hash);
});
}

hashing();


db();

app.get("/",(req,res)=>{
    res.json({
      status:200,
      msg:"success"
    });
});

app.post("/signup", postsignup.signup).get("/signup",(req,res)=>{
    // res.json({
    //   status:200,
    //   msg:"ready to signup"
    // });
    res.sendFile(__dirname+"/public/signup.html");
});

app.get("/login",(req,res)=>{
  // res.json({
  //   status:200,
  //   msg:"ready to login"
  // })
  res.sendFile(__dirname+"/public/login.html");
}).post("/login" , postlogin.login );

//dashboard
app.get("/dashboard/:email",dashboard.dashboard);


app.listen(port ,()=>{
  console.log("server started "+port);
});