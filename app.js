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

//let {city}=allDetails;

app.post('/find', async (req, res) => {
    console.log(JSON.stringify(req.body));
    var arr = [];
    if (req.body.Criteria == 'Doctor') {
        if (req.body.Precise == 'Yes') {
            let sql = `select doctor_info.name as doctor_name,doctor_info.specialty,doctor_info.email,hospital_info.name as hospital_name,Suburb,District from doctor_info,hospital_info where doctor_info.name like'%${req.body.preciseSearch}%' and doctor_info.hospital_id=hospital_info.hospital_id`;
            let query = db.query(sql, (err, results) => {
                if (err) throw err;
                res.render("searchedDoctors", {
                    title: "Doctor",
                    data: results,
                })
            })
        }
        else {
            if (req.body.Location == 'Yes') {
                //console.log("YES");
                //let sql = `select doctor_info.name as doctor_name,hospital_info.name as hospital_name from doctor_info,hospital_info where specialty='${req.body.specialized}' and (Suburb='${req.body.hideLoc[0]}' or (District='${req.body.hideLoc[1]}' and Suburb!='${req.body.hideLoc[0]}') or (Division='${req.body.hideLoc[2]}' and Suburb!='${req.body.hideLoc[0]}' and District!='${req.body.hideLoc[1]}')) and doctor_info.hospital_id=hospital_info.hospital_id`;
                let sql = `select doctor_info.name as doctor_name,specialty,email,hospital_info.name as hospital_name,Suburb,District from doctor_info,hospital_info where specialty='${req.body.specialized}' and Suburb='${req.body.hideLoc[0]}' and doctor_info.hospital_id=hospital_info.hospital_id`;
                let sql1 = `select doctor_info.name as doctor_name,specialty,email,hospital_info.name as hospital_name,Suburb,District from doctor_info,hospital_info where specialty='${req.body.specialized}' and (District='${req.body.hideLoc[1]}' and Suburb!='${req.body.hideLoc[0]}') and doctor_info.hospital_id=hospital_info.hospital_id`;
                let sql2 = `select doctor_info.name as doctor_name,specialty,email,hospital_info.name as hospital_name,Suburb,District from doctor_info,hospital_info where specialty='${req.body.specialized}' and (Division='${req.body.hideLoc[2]}' and Suburb!='${req.body.hideLoc[0]}' and District!='${req.body.hideLoc[1]}') and doctor_info.hospital_id=hospital_info.hospital_id`;
                // let sql = `select * from hospital_info where District='${req.body.hideLoc[1]}'`;
                let final_arr = [];
                final_arr = final_arr.concat(await getResult(sql));
                final_arr = final_arr.concat(await getResult(sql1));
                final_arr = final_arr.concat(await getResult(sql2));
                //console.log(results);
                console.log(final_arr);
                res.render("searchedDoctors", {
                    title: "Doctor",
                    data: final_arr,
                })
            }
            else {
                let sql = `select doctor_info.name as doctor_name,specialty,email,hospital_info.name as hospital_name,Suburb,District from doctor_info,hospital_info where specialty='${req.body.specialized}' and doctor_info.hospital_id=hospital_info.hospital_id`;
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
    else {
        if (req.body.Precise == 'Yes') {
            let sql = `select name,Suburb,District,Specialization from hospital_info where name like'%${req.body.preciseSearch}%' and type='${req.body.Criteria}'`;
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
            if (req.body.Location == 'Yes') {
                //console.log("YES");
                //let sql = `select doctor_info.name as doctor_name,hospital_info.name as hospital_name from doctor_info,hospital_info where specialty='${req.body.specialized}' and (Suburb='${req.body.hideLoc[0]}' or (District='${req.body.hideLoc[1]}' and Suburb!='${req.body.hideLoc[0]}') or (Division='${req.body.hideLoc[2]}' and Suburb!='${req.body.hideLoc[0]}' and District!='${req.body.hideLoc[1]}')) and doctor_info.hospital_id=hospital_info.hospital_id`;
                let sql = `select name,Suburb,District,Specialization from hospital_info where Specialization='${req.body.specialized}' and type='${req.body.Criteria}' and Suburb='${req.body.hideLoc[0]}'`;
                let sql1 = `select name,Suburb,District,Specialization from hospital_info where Specialization='${req.body.specialized}' and type='${req.body.Criteria}' and (District='${req.body.hideLoc[1]}' and Suburb!='${req.body.hideLoc[0]}')`;
                let sql2 = `select name,Suburb,District,Specialization from hospital_info where Specialization='${req.body.specialized}' and type='${req.body.Criteria}' and (Division='${req.body.hideLoc[2]}' and Suburb!='${req.body.hideLoc[0]}' and District!='${req.body.hideLoc[1]}')`;
                // let sql = `select * from hospital_info where District='${req.body.hideLoc[1]}'`;
                let final_arr = [];
                final_arr = final_arr.concat(await getResult(sql));
                final_arr = final_arr.concat(await getResult(sql1));
                final_arr = final_arr.concat(await getResult(sql2));
                //console.log(results);
                console.log(final_arr);
                res.render("searchedDoctors", {
                    title: "Hospital",
                    data: final_arr,
                })

            }
            else {
                let sql = `select name,Suburb,District,Specialization from hospital_info where Specialization='${req.body.specialized}' and type='${req.body.Criteria}'`;
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

        }

    }
})

app.get('/', (req, res) => {
    res.render("index");
})

app.get('/doctors', (req, res) => {
    let sql = `select doctor_info.name as doctor_name,specialty,email,hospital_info.name as hospital_name,Suburb,District from doctor_info,hospital_info where doctor_info.hospital_id=hospital_info.hospital_id`;
    let query = db.query(sql, (err, results) => {
        if (err) throw err;
        console.log(results);
        //res.send(results);
        res.render("doctors", {
            title: "Doctor",
            data: results,
        })

    });
    //res.render("doctors", {});
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
async function getResult(sql) {
    const promise = new Promise((res, rej) => {
        db.query(sql, (err, results) => {
            if (err) rej(err);
            //console.log(results);
            let arr = [];
            for (let i = 0; i < results.length; i++) {
                arr.push(results[i]);
            }
            res(arr);

        });

    });

    const result = await promise;
    return result;


}



