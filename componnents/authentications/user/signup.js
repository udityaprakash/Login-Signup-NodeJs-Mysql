const express=require("express");
const bcrypt = require("bcrypt");
const sqlcon=require("../../databasevariables/sqlcon");
const path=require("../../../path");
const mysql = require("mysql2");
var Emailvalidator = require("email-validator");
const crypto= require("crypto");
require('dotenv').config()
const nodemailer=require("nodemailer");
const otpGenerator = require('otp-generator');
 

var transporter = nodemailer.createTransport({
  service: 'gmail',
  // host: 'smtp.gmail.com',
  //  port: 465,
  //  secure: true,
  auth: {
    user: 'udityap.davegroup@gmail.com',
    pass: process.env.EMAILPASSWORD
  }
});




const result={
post: async (req,res)=>{ 
    console.log(req.body);
    let {fname , lname ,password , email}= req.body;
    var hashedpassword;
    if(fname && lname && password && email){
  
        bcrypt.hash(password,process.env.SALT,(err,hash)=>{
          hashedpassword=hash;
        });
        var verify= false;
        email=email.toLowerCase();
        const id= crypto.randomBytes(3*4).toString('base64');
        var query = "INSERT INTO user (id , fname , lname , password , email , verify) VALUES ('"+id+"','"+fname+"','"+lname+"','"+
        password
        // hashedpassword
        +"','"+email+"',"+verify+");";
  
        try {

          if(Emailvalidator.validate(email)){
          var query2="SELECT * FROM user WHERE email = '"+email+"';";
  
          sqlcon.query(query2, function (err, resu) {
            if (!err){
              if(resu.length!=0){
                res.json({status:"user found",
                msg:"user already exists"});
              }else{
                sqlcon.query(query, function (err, result) {
                  if (!err){
                    console.log("created");
  
                    // res.status(201).json({success:true,
                    // msg:"successfully added to database"});
                    
                    res.redirect("signup/verifyotp/"+email);
          
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
  
        }else{
          res.json({success:false,
              msg:"Invalid Email Format"});

        }
          
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
  },

  verifyotp : async (req,res)=>{
    let email=req.params['email'];
    console.log(process.env.EMAILPASSWORD,email);
    let otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false ,lowerCaseAlphabets:false});
    var query="UPDATE user SET otp = "+ otp + " WHERE email = '" + email + "';" ;
    var query2="SELECT * FROM user WHERE email = '"+email+"';";

      sqlcon.query(query2, function (err, resu) {
        if(resu[0].verify==true){
          res.json({
            success:false,
            msg:"user already verified"
          })
        }else{


          sqlcon.query(query, function (err, result) {
            if (err) throw err;
            console.log(result.affectedRows + " record(s) updated");
          });
      
      
          var mailOptions = {
            from: 'udityap.davegroup@gmail.com',
            to: email,
            subject: 'Verify Email from DAWAY',
            text: 'Your OTP is '+otp+'.'
          };
      
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log("not send :"+error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
      
          res.sendFile(path+"/public/signupotpverification.html");




        }
      });


  },
  checkotp:async (req,res)=>{
    const {otp}=req.body;
    const email= req.params['email'];

    if(Emailvalidator.validate(email)){
      var query="SELECT * FROM user WHERE email = '"+email+"';";

      sqlcon.query(query, function (err, resu) {
        if (!err && resu[0].verify==false){
          if(resu.length!=0){
            if(resu[0].otp==otp){
              var query2="UPDATE user SET verify = "+ true + " AND otp = "+ null +" WHERE email = '" + email + "';" ;

              sqlcon.query(query2, function (err, result) {
                if (err) throw err;
                console.log(result.affectedRows + " record(s) updated and user verified");
              });



              res.json({success:true,
              msg:"user verified successfully"});

            }else{
              res.json({success:false,
              msg:"Invalid OTP"});
              
            }



          }else{
            res.json({success:false,
              msg:"user doesn't exist"});

          }
        }else{
          res.json({success:false,
          msg:"user is already verified"});
        }
      });


  }
}
};

module.exports = result;