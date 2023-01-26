const express = require("express");
const bodyparser = require("body-parser");

var mysql = require('mysql2');
const app = express();
require('dotenv').config()
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));
app.use(express.static("public"));

var sqlcon = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Akgec@9838",
  database:"hell"
});

const port= process.env.PORT;

sqlcon.connect(async function(err) {
    if (err) throw err;
    console.log("Connected!");

    sqlcon.query("CREATE DATABASE IF NOT EXISTS hell", function (err, result) {
      if (err) throw err;
      console.log("Database created");
    });

    const tableschema="CREATE TABLE user (fname VARCHAR(255),lname VARCHAR(255),password VARCHAR(255), email VARCHAR(255),PRIMARY KEY (email))";

    
    sqlcon.query("show tables from hell",(err,result)=>{
        // console.log(typeof(re[0].Tables_in_hell));
        var c=0;
        result.forEach(element => {
          if(element.Tables_in_hell="user")
              c++;
          });
        if(c==0){
          sqlcon.query(tableschema, function (err, result) {
              if (err) throw err;
              console.log("Table created");
            });

        }
    });


  });

app.get("/",(req,res)=>{
    res.json({
      status:200,
      msg:"success"
    });
});

app.post("/signup",async (req,res)=>{ 
  console.log(req.body);
  if(typeof(req.body.fname)!='undefined' 
  && typeof( req.body.password)!='undefined' && typeof( req.body.email)!='undefined' 
  && typeof( req.body.lname)!='undefined'){

      var query = "INSERT INTO user VALUES ('"+req.body.fname+"','"+req.body.lname+"','"+req.body.password+"','"+req.body.email+"');";
      console.log(query);

      try {
        sqlcon.query(query, function (err, result) {
          if (!err){
            console.log("1 record inserted");
            // res.json({status:200,
            // msg:"successfully added to database"});
            res.redirect("/dashboard/"+req.body.email);
  
          }else{
            res.json({status:"Internel server error",
            msg:"something wrong in backend"});
          }
        });
        
      } catch (error) {
        console.log("error:"+error);
      }

  }else{
      res.json({status:"Invalid",
      msg:"One of the field Found Missing"});
  }

}).get("/signup",(req,res)=>{
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
}).post("/login",(req,res)=>{
  console.log(req.body);
  if(typeof( req.body.password)!='undefined' && typeof( req.body.email)!='undefined'){
    var query= "SELECT * FROM user WHERE email = '"+req.body.email+"' AND password = '"+req.body.password+"';";
    // console.log(query);
    sqlcon.query(query, function (err, result) {
      if (!err){
        // console.log(result);
        if(result.length!=0){
          // res.json({
          //   status:"Authenticated",
          //   msg:"user found"
          // });
          res.redirect("/dashboard/"+req.body.email);
        }else{
          res.json({
            status:"Unautherised",
            msg:"no such user found"
          });
        }
      }else{
        res.json({status:"Internel server error",
            msg:"something wrong in backend"});

      }
    });


  }else{
    res.json({status:"Invalid",
    msg:"One of the field Found Missing"});
}
});

//dashboard
app.get("/dashboard/:email",async (req,res)=>{
  const email=req.params['email'];
  console.log(email);
  var query= "SELECT * FROM user WHERE email = '"+email+"';";

  sqlcon.query(query, function (err, result) {
    if (!err){
      // console.log(result);
      if(result.length!=0){
        res.send("<center><h1>Dashboard</h1><p>email  -  "+result[0].email+"</p><p>fname  -  "+result[0].fname+"</p><p>lname  -  "+result[0].lname+"</p><p>password  -  "+result[0].password+"</center>");
      }else{
        res.json({
          status:"Unautherised",
          msg:"no such user found"
        });
      }
    }else{
      res.json({status:"Internel server error",
          msg:"something wrong in backend"});

    }
  });
  

})


app.listen(port ,()=>{
  console.log("server started "+port);
});