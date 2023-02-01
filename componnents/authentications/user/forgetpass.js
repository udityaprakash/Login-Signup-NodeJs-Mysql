const express=require("express");
const bcrypt = require("bcrypt");
const sqlcon=require("../../databasevariables/sqlcon");
const mysql = require("mysql2");
const path=require("../../../path");


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
    post_enteremail:(req , res)=>{
        const { email } = req.body;
        // console.log(email);
        // res.send("success");
        try{
          let otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false ,lowerCaseAlphabets:false});
          let indatabaseotpstored= false;
          let otpsend = false;

          var query="UPDATE user SET otp = "+ otp + " WHERE email = '" + email + "';" ;
          var query1="SELECT * FROM user WHERE email = '"+email+"';";

          sqlcon.query(query1, function (err, resu) {

            if (err) throw err;
            console.log("");

            if(resu.length()!=0){
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
                  otpsend=true;
                  console.log('Email sent: ' + info.response);
            }
          });  
          if(otpsend && indatabaseotpstored){
            res.json({
              success:true,
              msg:"OTP send Successfully."
            });

          }  
        }catch{
          res.json({
            success:false,
            msg:"Internal Server Error."
          });

        }



    },
    post_otp_verification:(req,res)=>{
      let {otp}=req.body;
      console.log(otp);

    },

}









module.exports = result;