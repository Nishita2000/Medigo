const express = require('express');
const mysql = require('mysql');
const app = express();
const path = require("path");
//const {allDetials}=require('./location.js');
app.use(express.json());
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
//app.set("views", __dirname + "/views");
//app.use(express.urlencoded({ extended: false }))



const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'doctor_appointment'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySql connected....');

});


app.post('/find', (req, res) => {
    console.log(JSON.stringify(req.body));

    if (req.body.Criteria == 'Doctor') {
        if (req.body.Precise == 'Yes') {
            let sql = `select * from doctor_info where name like'%${req.body.preciseSearch}%'`;
            let query = db.query(sql, (err, results) => {
                if (err) throw err;
                console.log(results);
                //res.send(results);
                res.render("searchedDoctors", {
                    title: "Doctor",
                    data: results,
                })
            })
        }
        else {

            if (req.body.Location == 'Yes') {
                console.log("YES");
                let sql = `select doctor_info.name as doctor_name,hospital_info.name as hospital_name from doctor_info,hospital_info where specialty='${req.body.specialized}' and (Suburb='${req.body.hideLoc[0]}' or (District='${req.body.hideLoc[1]}' and Suburb!='${req.body.hideLoc[0]}') or (Division='${req.body.hideLoc[2]}' and Suburb!='${req.body.hideLoc[0]}' and District!='${req.body.hideLoc[1]}')) and doctor_info.hospital_id=hospital_info.hospital_id`;
                // let sql = `select * from hospital_info where District='${req.body.hideLoc[1]}'`;
                let query = db.query(sql, (err, results) => {
                    if (err) throw err;
                    console.log(results);
                    //res.send(results);
                    res.render("searchedDoctors", {
                        title: "Doctor",
                        data: results,
                    })


                });


            }

        }

    }
    else if (req.body.Criteria == 'Hospital') {
        if (req.body.Precise == 'Yes') {
            let sql = `select * from hospital_info where name like'%${req.body.preciseSearch}%'`;
            let query = db.query(sql, (err, results) => {
                if (err) throw err;
                console.log(results);
                // res.send(results);
                res.render("searchedDoctors", {
                    title: "Hospital",
                    data: results,
                })
            })
        }
        else {
            let sql = `select * from hospital_info where type='${req.body.specialized}'`;
            let query = db.query(sql, (err, results) => {
                if (err) throw err;
                console.log(results);
                //res.send(results);
                res.render("searchedDoctors", {
                    title: "Hospital",
                    data: results,
                })

            });
        }

    }
})


app.get('/', (req, res) => {
    res.render("index");
})

app.get('/doctors', (req, res) => {
    res.render("doctors", {});
})
app.get('/about', (req, res) => {
    res.render("about", {});
})
app.get('/entry', (req, res) => {
    res.render("entry", {});
})
app.get('/navigation', (req, res) => {
    res.render("navigation", {});
})

app.listen('3300', () => {
    console.log('Server started on port 3300');

});
