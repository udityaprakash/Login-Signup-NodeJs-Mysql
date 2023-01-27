const express=require("express");
const bcrypt = require("bcrypt");
const sqlcn=require("../databasevariables/sqlcon");
const mysql = require("mysql2");
// import '../../server.js';
const sqlcon = sqlcn;
const result={
login: async (req,res)=>{
    console.log(req.body);
    var hashedpassword;
    if(typeof( req.body.password)!='undefined' && typeof( req.body.email)!='undefined'){
      bcrypt.hash(req.body.password,process.env.SALT,(err,hash)=>{
        hashedpassword=hash;
      });
      var query= "SELECT * FROM user WHERE email = '"+req.body.email+"' AND password = '"+
      req.body.password
      // hashedpassword
      +"';";
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
  }
}

module.exports = result;