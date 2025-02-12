const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

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

//Home Route
app.get("/", (req, res) => {
    let q = `SELECT count(*) FROM user`;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            let count = result[0]["count(*)"];
            res.render("home.ejs", { count });
        });
    } catch (err) {
        console.log(err);
        res.send("some error in DB");
    }
});

//Show Route
app.get("/user", (req, res) => {
    let q = `SELECT * FROM user`;
    try {
        connection.query(q, (err, users) => {
            if (err) throw err;
            res.render("showusers.ejs", { users });
        });
    } catch (err) {
        console.log(err);
        res.send("some error in DB");
    }
});

//Edit Route
app.get("/user/:id/edit", (req, res) => {
    let { id } = req.params;
    let q = `SELECT * FROM user WHERE id='${id}'`;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            let user = result[0];
            res.render("edit.ejs", { user });
        });
    } catch (err) {
        console.log(err);
        res.send("some error in DB");
    }
});

//Update (DB) Route
app.patch("/user/:id", (req, res) => {
    let { id } = req.params;
    let { password: formPass, username: newusername } = req.body;
    let q = `SELECT * FROM user WHERE id='${id}'`;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            let user = result[0];
            if (formPass != user.password) {
                res.send("WRONG password");
            } else {
                let q2 = `UPDATE user SET username='${newusername}' WHERE id='${id}'`;
                connection.query(q2, (err, result) => {
                    if (err) throw err;
                    res.redirect('/user');
                });
            }
        });
    } catch (err) {
        console.log(err);
        res.send("some error in DB");
    }
});

//delete Route
app.get("/user/:id/delete", (req, res) => {
    let { id } = req.params;
    let q = `SELECT * FROM user WHERE id='${id}'`;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            let user = result[0];
            res.render("delete.ejs", { user });
        });
    } catch (err) {
        console.log(err);
        res.send("some error in DB");
    }
});

//Remove Route
app.delete("/user/:id", (req, res) => {
    let {id} = req.params;
    let { email, password } = req.body;
    let q = `SELECT * FROM user WHERE id='${id}'`;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            let user = result[0];
            if (password != user.password) {
                res.send("WRONG password");
            } 
            if (email != user.email) {
                res.send("WRONG email");
            } 
            else {
                let q2 = `DELETE FROM user WHERE id='${id}'`;
                connection.query(q2, (err, result) => {
                    if (err) throw err;
                    res.redirect('/user');
                });
            }
        });
    } catch (err) {
        console.log(err);
        res.send("some error in DB");
    }
});

// Add User Route
app.post("/user", (req, res) => { 
    let q = "INSERT INTO user (id, username, email, password) VALUES (?,?,?,?)";

    let getRandomUser = () => {
        return [
            faker.string.uuid(), // You can still use UUID if you like.
            faker.internet.username(),
            faker.internet.email(),
            faker.internet.password(),
        ];
    }

    let data = getRandomUser();

    try {
        connection.query(q, data, (err, result) => { 
            if (err) {
                console.log(err);
                throw err;
            }
            res.redirect("/user");
        });
    } catch (err) {
        console.log(err);
        res.send("Some error in DB");
    }
});

