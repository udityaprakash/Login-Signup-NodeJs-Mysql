// import mysql from 'mysql2';
// import result from '../authentications/signup';
const express = require("express");
var mysql = require('mysql2');
const sqlcn=require("./sqlcon");
const app = express();


// var sqlcon = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "Akgec@9838",
//     database:"hell"
// });
const sqlcon = sqlcn;
const connectDB = async () => {
    
    


        sqlcon.connect(async function(err) {
            if (err) throw err;
            console.log("Connected!");
        
            sqlcon.query("CREATE DATABASE IF NOT EXISTS hell", function (err, result) {
              if (err) throw err;
              console.log("Database created");
            });
        
            const tableschema="CREATE TABLE user (fname VARCHAR(255),lname VARCHAR(255),password VARCHAR(255), email VARCHAR(255),PRIMARY KEY (email))";
        
            
            sqlcon.query("show tables from hell",async (err,result)=>{
                // console.log(typeof(re[0].Tables_in_hell));
                var c=0;
                result.forEach(element => {
                  if(element.Tables_in_hell="user")
                      c++;
                  });
                if(c==0){
                  await sqlcon.query(tableschema, function (err, result) {
                      if (err) throw err;
                      console.log("Table created");
                    });
        
                }
            });
        
        
          });
    }
// }  

module.exports=connectDB;