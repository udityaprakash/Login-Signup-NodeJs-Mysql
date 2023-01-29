const express=require("express");
const bcrypt = require("bcrypt");
const sqlcn=require("../../databasevariables/sqlcon");
const mysql = require("mysql2");
// import '../../server.js';
const sqlcon = sqlcn;
const result={
get: async (req,res)=>{
    const email=req.params['email'];
    console.log(email);
    var query= "SELECT * FROM user WHERE email = '"+email+"';";
  
    sqlcon.query(query, function (err, result) {
      if (!err){
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
    
  
  }


}

module.exports = result;