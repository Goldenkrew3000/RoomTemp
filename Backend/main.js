/*
// Bedroom Temperature Monitor
// 고은별 2023
*/

'use strict';

const express = require('express');
const mysql = require('mysql2');

// Initialization / Settings
const log = console.log;
const exprapp = express();
const EXPR_Port = 8080;
const SQL_Host = "192.168.5.7";
const SQL_User = "root";
const SQL_Pass = "mgera10.";
const SQL_DB = "room_temp";

// Persistent Storage
var SQL_Obj;

// Serve frontend
exprapp.use(express.static('frontend'));

// Functions
function SQL_Connect() {
    // Function to connect to the SQL Server
    log(`SQL: Connecting to ${SQL_Host}`);

    // Create SQL connection object
    SQL_Obj = mysql.createConnection({
        host: SQL_Host,
        user: SQL_User,
        password: SQL_Pass,
        database: SQL_DB
    });

    // Connect to SQL server
    SQL_Obj.connect((error) => {
        if (error) {
            log(`SQL: Error connecting to ${SQL_Host}`);
            log(error);
            return;
        }
        log(`SQL: Connected to ${SQL_Host}`);
    });
}

function SQL_SendQuery(temp, epoch) {
    // Function to send data to the SQL Server
    log(`SQL: SendQuery has been called. Temp: ${temp}`);

    // Form SQL Query
    const sqlQuery = `INSERT INTO prod (temp, date) VALUES(?, ?);`;
    const sqlValues = [temp, epoch];

    // Send SQL Query
    SQL_Obj.query(sqlQuery, sqlValues, (error, result) => {
        if (error) {
            log("SQL: Error sending query.");
            log(error);
            return;
        }
        log(`SQL: Query has been sent. Affected rows: ${result.affectedRows}`);
    });
}

// Express listen function
exprapp.listen(EXPR_Port, () => {
    log(`Express: Listening on port ${EXPR_Port}`);
})

exprapp.get('/sendToDB', (req, res) => {
    // Function to put data into the SQL server from a HTTP request
    // /sendToDB?temp=XX.XX
    log("Express: /sendToDB has been called.");

    // Fetch temperature, unix epoch, and send SQL query
    const tempRes = req.query.temp;
    const epoch = Date.now();
    SQL_SendQuery(tempRes, epoch);

    // Send response
    res.send('{"OK": "OK"}');
});

exprapp.get('getFromDB', (req, res) => {
    //
});

// Start
SQL_Connect();
