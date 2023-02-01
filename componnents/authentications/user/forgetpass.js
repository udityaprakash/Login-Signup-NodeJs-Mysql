const express=require("express");
const bcrypt = require("bcrypt");
const sqlcon=require("../../databasevariables/sqlcon");
const mysql = require("mysql2");
const path=require("../../../path");
const nodemailer=require("nodemailer");
const otpGenerator = require('otp-generator');
require('dotenv').config();
var Emailvalidator = require("email-validator");
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'udityap.davegroup@gmail.com',
      pass: process.env.EMAILPASSWORD
    }
  });

const result={
    get_enteremail:(req,res)=>{
        res.sendFile(path+"/public/forgetenteremail.html");

    },
    post_enteremail:async (req , res)=>{
        const { email } = req.body;
        // console.log(email);
        // res.send("success");
        try{
          let otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false ,lowerCaseAlphabets:false});
          let indatabaseotpstored= false;
          let otpsend = false;

          var query="UPDATE user SET otp = "+ otp + ", verify = "+ false +" WHERE email = '" + email + "';" ;
          var query1="SELECT * FROM user WHERE email = '"+email+"';";

          sqlcon.query(query1, function (err, resu) {

            if (err) throw err;
            console.log("");

            if(resu.length!=0){
              sqlcon.query(query, function (err, result) {
                if (err) throw err;
                console.log(result.affectedRows + " record(s) updated");
                indatabaseotpstored=true;                
              });

            }else{
              res.json({
                success:false,
                msg:"User Not Found"
              });
            }        
          });
          var mailOptions = {
                from: 'udityap.davegroup@gmail.com',
                to: email,
                subject: 'Reset Password for DAWAY',
                html: `<div style="max-width: 90%; margin: auto; padding-top: 20px">
              <p style="margin-bottom: 30px;">Please enter the OTP to get started</p>
              <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${otp}</h1></div>`
          };

          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                  console.log("not send : "+error);
            } else {
                  if(indatabaseotpstored){
                    console.log('Email sent: ' + info.response);
                    console.log("successfull");
                    res.json({
                        success:true,
                        msg:"OTP send Successfully."
                    });

                  }else{
                    res.json({
                      success:false,
                      msg:"OTP not stored in database but OTP send to email."
                    })
                  }
        
                  
            }
          });  
        }catch{
          res.json({
            success:false,
            msg:"Internal Server Error."
          });

        }



    },
    post_otp_verification:
    async (req,res)=>{
      const {otp , email}=req.body;
      // const email= req.params['email'];
  
      if(Emailvalidator.validate(email)){
        var query="SELECT * FROM user WHERE email = '"+email+"';";
  
        sqlcon.query(query, function (err, resu) {
          if (!err){
            if(resu.length!=0){
              if(resu[0].otp==otp){
                var query2="UPDATE user SET verify = "+ true + " , otp = "+ null +" WHERE email = '" + email + "';" ;
  
                sqlcon.query(query2, function (err, result) {
                  if (err) throw err;
                  console.log(result.affectedRows + " record(s) updated and user verified");
                });
  
  
  
                res.json({
                  success:true,
                  token:resu[0].id,
                  msg:"user verified successfully"
                });
  
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
  },
  Set_password: async (req,res)=>{
    let {id, password}= req.body;

    var query="SELECT * FROM user WHERE id = '"+id+"';";
  
        sqlcon.query(query, function (err, resu) {
          if (!err){
            if(resu.length!=0){
              // if(resu[0].otp==otp){
                var query2="UPDATE user SET password = '"+ password + "' WHERE id = '" + id + "';" ;
  
                sqlcon.query(query2, function (err, result) {
                  if (err) throw err;
                  console.log(result.affectedRows + " record password reset.");
                  res.json({
                    success:true,
                    token:resu[0].id,
                    msg:"user password reset successfully"
                  });
                });
  
            }else{
              res.json({success:false,
                msg:"user doesn't exist"});
  
            }
          }else{
            res.json({success:false,
            msg:"Some Internal server error"});
          }
        });

  }

}

module.exports = result;