

const express = require("express");
const bodyparser = require("body-parser");
const bcrypt=require("bcrypt");
var mysql = require('mysql2');
const app = express();
const postsignup = require("./componnents/authentications/user/signup");
const postlogin= require("./componnents/authentications/user/login");
require('dotenv').config()
const db = require("./componnents/databasevariables/db")
const sqlcon = require("./componnents/databasevariables/sqlcon");
const dashboard = require("./componnents/dashboard/user/dashboard");






app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));
app.use(express.static("public"));

// var sqlcon = sqlcn;
app.use('/user',require('./routers/userrouter'));
// app.use('/admin',require('./routers/adminrouter'));
// app.use('/instructor',require('./routers/instructorrouter'));

const port= process.env.PORT;
// console.log(process.env.SALT);

function hashing(){
  bcrypt.hash("hellofdrt", 10).then(function(hash) {
    console.log("Samplehash-- "+hash);
    // return hash;
});
}

console.log(hashing());


db();







app.get("/",(req,res)=>{
    res.json({
      status:200,
      msg:"success"
    });
});

//dashboard
// app.get("/dashboard/:email",dashboard.dashboard);


app.listen(port ,()=>{
  console.log("server started "+port);
});