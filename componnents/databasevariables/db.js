const express = require("express");
var mysql = require('mysql2');
const sqlcon=require("./sqlcon");
const app = express();

const connectDB = async () => {
    
    


        sqlcon.connect(async function(err) {
            if (err) throw err;
            console.log("Connected!");
        
            sqlcon.query("CREATE DATABASE IF NOT EXISTS hell", function (err, result) {
              if (err) throw err;
              console.log("Database created");
            });
        
            const tableschema="CREATE TABLE user (id VARCHAR(50),fname VARCHAR(255),lname VARCHAR(255),password VARCHAR(255), email VARCHAR(255) ,otp MEDIUMINT(255),verify BOOLEAN, PRIMARY KEY (email));";
        
            
            sqlcon.query("show tables from hell",async (err,result)=>{
                // console.log(typeof(re[0].Tables_in_hell));
                var c=0;
                result.forEach(element => {
                  if(element.Tables_in_hell=="user")
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
    }


module.exports=connectDB;