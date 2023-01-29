const express=require("express");
const bcrypt = require("bcrypt");
const sqlcon=require("../../databasevariables/sqlcon");
const mysql = require("mysql2");
const path=require("../../../path");



const result={
post: async (req,res)=>{
    console.log(req.body);
    let {email , password} = req.body;
    var hashedpassword;
    if(email && password){
      bcrypt.hash(password,process.env.SALT,(err,hash)=>{
        hashedpassword=hash;
      });
      var query= "SELECT * FROM user WHERE email = '"+
      email
      +"' AND password = '"+
      password
      // hashedpassword
      +"';";
      sqlcon.query(query, function (err, result) {
        if (!err){
          if(result.length!=0){
            // res.json({
            //   status:"Authenticated",
            //   msg:"user found"
            // });
            res.redirect("dashboard/"+
            email
            );
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
  },
  get:(req,res)=>{
    // res.json({
    //   status:200,
    //   msg:"ready to login"
    // })
    res.sendFile(path+"/public/login.html");
  }
}

module.exports = result;