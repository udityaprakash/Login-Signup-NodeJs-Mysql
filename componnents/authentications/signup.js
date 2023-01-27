const express=require("express");
const bcrypt = require("bcrypt");
const sqlcn=require("../databasevariables/sqlcon");
const mysql = require("mysql2");
// import '../../server.js';
const sqlcon = sqlcn;
const result={
signup: async (req,res)=>{ 
    console.log(req.body);
    var hashedpassword;
    if(typeof(req.body.fname)!='undefined' 
    && typeof( req.body.password)!='undefined' && typeof( req.body.email)!='undefined' 
    && typeof( req.body.lname)!='undefined'){
  
  
        bcrypt.hash(req.body.password,process.env.SALT,(err,hash)=>{
          hashedpassword=hash;
        });
  
        var query = "INSERT INTO user VALUES ('"+req.body.fname+"','"+req.body.lname+"','"+
        req.body.password
        // hashedpassword
        +"','"+req.body.email+"');";
        console.log(query);
  
        try {
          var query2="SELECT * FROM user WHERE email = '"+req.body.email+"';";
  
          sqlcon.query(query2, function (err, resu) {
            if (!err){
              if(resu.length!=0){
                res.json({status:"user found",
                msg:"user already exists"});
              }else{
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
  
  
  
              }
    
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
  
  }
}

module.exports = result;