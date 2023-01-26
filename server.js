const express = require("express");
const bodyparser = require("body-parser");

var mysql = require('mysql2');
const app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));


var sqlcon = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Akgec@9838",
  database:"hell"
});



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
            res.json({status:200,
            msg:"successfully added to database"});
  
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
    res.json({
      status:200,
      msg:"ready to signup"
    })
});

app.get("/login",(req,res)=>{
  res.json({
    status:200,
    msg:"ready to login"
  })
}).post("/login",(req,res)=>{
  console.log(req.body);
  if(typeof( req.body.password)!='undefined' && typeof( req.body.email)!='undefined'){
    var query= "SELECT * FROM user WHERE email = '"+req.body.email+"' AND password = '"+req.body.password+"';";
    console.log(query);
    sqlcon.query(query, function (err, result) {
      if (!err){
        console.log(result);
        if(result.length!=0){
          res.json({
            status:"Authenticated",
            msg:"user found"
          });
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


app.listen(3000 ,()=>{
  console.log("server started");
});