const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require("express");
const app = express();

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'delta_app2',
    password: 'Sigmaaryan2024'
});

let getRandomUser = () => {
    return [
        faker.string.uuid(),
        faker.internet.username(),
        faker.internet.email(),
        faker.internet.password(),
    ];
}

//Inserting New data 
// let q = "INSERT INTO user (id, username, email, password) VALUES ?";

// let data = [];
// for(let i=1; i<=100; i++){
//     data.push(getRandomUser());
// }

app.listen("8080", (req, res) => {
    console.log("listening to the port 8080");
});

app.get("/", (req, res) => {
    let q = `SELECT count(*) FROM user`;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            console.log(result[0]["count(*)"]);
            res.send("success");
        });
    } catch (err) {
        console.log(err);
        res.send("some error in DB");
    }
});

// try {
//     connection.query(q, [data], (err, result) => {
//         if (err) throw err;
//         console.log(result);
//     });
// } catch (err) {
//     console.log(err);
// }

// connection.end();


