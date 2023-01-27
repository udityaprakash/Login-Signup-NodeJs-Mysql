const express = require("express");
var mysql = require('mysql2');
const app = express();

const result = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "Akgec@9838",
            database:"hell"
    });

module.exports = result;