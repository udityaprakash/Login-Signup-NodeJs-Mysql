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
      +"';";
      sqlcon.query(query, function (err, result) {
        if (!err){
          if(result.length!=0){
            if(result[0].password==password){
              // res.status(200).json({
              //   status:true,
              //   msg:"User Exist"
              // });
              res.redirect("dashboard/"+
              email
              );

            }else{
              res.status(401).json({
                success:false,
                msg:"Password don't match"
              });

            }


          }else{
            res.status(404).json({
              success:false,
              msg:"Email ID don't exist"
            });
          }
        }else{
          res.status(500).json({success:false,
              msg:"Internal Server Database error",
              err:err});
  
        }
      });
  
  
    }else{
      res.status(400).json({success:false,
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