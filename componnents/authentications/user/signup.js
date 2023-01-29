const express=require("express");
const bcrypt = require("bcrypt");
const sqlcon=require("../../databasevariables/sqlcon");
const path=require("../../../path");
const mysql = require("mysql2");
// import '../../server.js';



const result={
post: async (req,res)=>{ 
    console.log(req.body);
    let {fname , lname ,password , email}= req.body;
    var hashedpassword;
    if(fname && lname && password && email){
  
        bcrypt.hash(password,process.env.SALT,(err,hash)=>{
          hashedpassword=hash;
        });
  
        var query = "INSERT INTO user VALUES ('"+fname+"','"+lname+"','"+
        password
        // hashedpassword
        +"','"+email+"');";
  
        try {
          var query2="SELECT * FROM user WHERE email = '"+email+"';";
  
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
                    
                    res.redirect("dashboard/"+email);
          
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
  
  },
  get:(req,res)=>{
    // res.json({
      //     //   status:200,
      //     //   msg:"ready to signup"
      //     // });

    res.sendFile(path+"/public/signup.html");
  }
};

module.exports = result;