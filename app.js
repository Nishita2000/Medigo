const express = require('express');
const mysql = require('mysql');
const app = express();
const path = require("path");
const homeRoutes = require('./routes/home-routes')
const pateintLoginRoutes = require('./routes/patientlogin-routes')
const session = require('express-session')
const flush = require('connect-flash')
const passport = require('passport')
//const {allDetials}=require('./location.js');
app.use(express.json());
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
//app.use(express.urlencoded({ extended: false }))
//config session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 86400000 1 day
    }
}));
//enable flash
app.use(flush());

//config passport middleware
app.use(passport.initialize())
app.use(passport.session())




const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'medigo'
});


db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySql connected....');

});

//let {city}=allDetails;

// app.post('/find', async (req, res) => {
//     console.log(JSON.stringify(req.body));
//     var arr = [];
//     if (req.body.Criteria == 'Doctor') {
//         if (req.body.Precise == 'Yes') {
//             let sql = `select doctor_info.name as doctor_name,doctor_info.specialty,doctor_info.email,hospital_info.name as hospital_name,Suburb,District from doctor_info,hospital_info where doctor_info.name like'%${req.body.preciseSearch}%' and doctor_info.hospital_id=hospital_info.hospital_id`;
//             let query = db.query(sql, (err, results) => {
//                 if (err) throw err;
//                 res.render("searchedDoctors", {
//                     title: "Doctor",
//                     data: results,
//                 })
//             })
//         }
//         else {
//             if (req.body.Location == 'Yes') {
//                 //console.log("YES");
//                 //let sql = `select doctor_info.name as doctor_name,hospital_info.name as hospital_name from doctor_info,hospital_info where specialty='${req.body.specialized}' and (Suburb='${req.body.hideLoc[0]}' or (District='${req.body.hideLoc[1]}' and Suburb!='${req.body.hideLoc[0]}') or (Division='${req.body.hideLoc[2]}' and Suburb!='${req.body.hideLoc[0]}' and District!='${req.body.hideLoc[1]}')) and doctor_info.hospital_id=hospital_info.hospital_id`;
//                 let sql = `select doctor_info.name as doctor_name,specialty,email,hospital_info.name as hospital_name,Suburb,District from doctor_info,hospital_info where specialty='${req.body.specialized}' and Suburb='${req.body.hideLoc[0]}' and doctor_info.hospital_id=hospital_info.hospital_id`;
//                 let sql1 = `select doctor_info.name as doctor_name,specialty,email,hospital_info.name as hospital_name,Suburb,District from doctor_info,hospital_info where specialty='${req.body.specialized}' and (District='${req.body.hideLoc[1]}' and Suburb!='${req.body.hideLoc[0]}') and doctor_info.hospital_id=hospital_info.hospital_id`;
//                 let sql2 = `select doctor_info.name as doctor_name,specialty,email,hospital_info.name as hospital_name,Suburb,District from doctor_info,hospital_info where specialty='${req.body.specialized}' and (Division='${req.body.hideLoc[2]}' and Suburb!='${req.body.hideLoc[0]}' and District!='${req.body.hideLoc[1]}') and doctor_info.hospital_id=hospital_info.hospital_id`;
//                 // let sql = `select * from hospital_info where District='${req.body.hideLoc[1]}'`;
//                 let final_arr = [];
//                 final_arr = final_arr.concat(await getResult(sql));
//                 final_arr = final_arr.concat(await getResult(sql1));
//                 final_arr = final_arr.concat(await getResult(sql2));
//                 //console.log(results);
//                 console.log(final_arr);
//                 res.render("searchedDoctors", {
//                     title: "Doctor",
//                     data: final_arr,
//                 })
//             }
//             else {
//                 let sql = `select doctor_info.name as doctor_name,specialty,email,hospital_info.name as hospital_name,Suburb,District from doctor_info,hospital_info where specialty='${req.body.specialized}' and doctor_info.hospital_id=hospital_info.hospital_id`;
//                 let query = db.query(sql, (err, results) => {
//                     if (err) throw err;
//                     console.log(results);
//                     //res.send(results);
//                     res.render("searchedDoctors", {
//                         title: "Doctor",
//                         data: results,
//                     })

//                 });
//             }
//         }

//     }
//     else {
//         if (req.body.Precise == 'Yes') {
//             let sql = `select name,suburb,district,specialization from hospital_info where name like'%${req.body.preciseSearch}%' and type='${req.body.Criteria}'`;
//             let query = db.query(sql, (err, results) => {
//                 if (err) throw err;
//                 console.log(results);
//                 // res.send(results);
//                 res.render("searchedDoctors", {
//                     title: "Hospital",
//                     data: results,
//                 })
//             })
//         }
//         else {
//             if (req.body.Location == 'Yes') {
//                 //console.log("YES");
//                 //let sql = `select doctor_info.name as doctor_name,hospital_info.name as hospital_name from doctor_info,hospital_info where specialty='${req.body.specialized}' and (Suburb='${req.body.hideLoc[0]}' or (District='${req.body.hideLoc[1]}' and Suburb!='${req.body.hideLoc[0]}') or (Division='${req.body.hideLoc[2]}' and Suburb!='${req.body.hideLoc[0]}' and District!='${req.body.hideLoc[1]}')) and doctor_info.hospital_id=hospital_info.hospital_id`;
//                 let sql = `select name,Suburb,District,Specialization from hospital_info where Specialization='${req.body.specialized}' and type='${req.body.Criteria}' and Suburb='${req.body.hideLoc[0]}'`;
//                 let sql1 = `select name,Suburb,District,Specialization from hospital_info where Specialization='${req.body.specialized}' and type='${req.body.Criteria}' and (District='${req.body.hideLoc[1]}' and Suburb!='${req.body.hideLoc[0]}')`;
//                 let sql2 = `select name,Suburb,District,Specialization from hospital_info where Specialization='${req.body.specialized}' and type='${req.body.Criteria}' and (Division='${req.body.hideLoc[2]}' and Suburb!='${req.body.hideLoc[0]}' and District!='${req.body.hideLoc[1]}')`;
//                 // let sql = `select * from hospital_info where District='${req.body.hideLoc[1]}'`;
//                 let final_arr = [];
//                 final_arr = final_arr.concat(await getResult(sql));
//                 final_arr = final_arr.concat(await getResult(sql1));
//                 final_arr = final_arr.concat(await getResult(sql2));
//                 //console.log(results);
//                 console.log(final_arr);
//                 res.render("searchedDoctors", {
//                     title: "Hospital",
//                     data: final_arr,
//                 })

//             }
//             else {
//                 let sql = `select name,Suburb,District,Specialization from hospital_info where Specialization='${req.body.specialized}' and type='${req.body.Criteria}'`;
//                 let query = db.query(sql, (err, results) => {
//                     if (err) throw err;
//                     console.log(results);
//                     // res.send(results);
//                     res.render("searchedDoctors", {
//                         title: "Hospital",
//                         data: results,
//                     })
//                 })

//             }

//         }

//     }
// })

//19-11-2022 1:28 pm
app.post('/viewProfile',async (req,res) => {
    console.log(JSON.stringify(req.query));
    let sql = `select doctor_info.name as doctor_name,specialty,mobile_no,email,designation,degree,visit_fee,first_day,last_day,time_slot,hospital_info.name as hospital_name,Suburb,District,Division from doctor_info,hospital_info,doctor_hospital where doctor_info.doctor_id='${req.query.doc_id}' and hospital_info.hospital_id='${req.query.hos_id}' and doctor_hospital.hospital_id=hospital_info.hospital_id and doctor_hospital.doctor_id=doctor_info.doctor_id`; 
    let query = db.query(sql, (err, results) => {
        if (err) throw err;
        console.log(results);
        res.render("doctor_profile", {
            data: results[0],
        })
    })
})

app.post('/find', async (req, res) => {
    console.log(JSON.stringify(req.body));
    var arr = [];
    if (req.body.Criteria == 'Doctor') {
        if (req.body.Precise == 'Yes') {
            let sql = `select doctor_info.name as doctor_name,doctor_info.doctor_id,hospital_info.hospital_id,doctor_info.specialty,doctor_info.email,hospital_info.name as hospital_name,Suburb,District,designation,degree,visit_fee from doctor_info,hospital_info,doctor_hospital where doctor_info.name like'%${req.body.preciseSearch}%' and doctor_hospital.hospital_id=hospital_info.hospital_id and doctor_hospital.doctor_id=doctor_info.doctor_id`;
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
                let sql = `select doctor_info.name as doctor_name,doctor_info.doctor_id,hospital_info.hospital_id,specialty,email,hospital_info.name as hospital_name,Suburb,District,designation,degree,visit_fee from doctor_info,hospital_info,doctor_hospital where specialty='${req.body.specialized}' and Suburb='${req.body.hideLoc[0]}' and doctor_hospital.hospital_id=hospital_info.hospital_id and doctor_hospital.doctor_id=doctor_info.doctor_id`;
                let sql1 = `select doctor_info.name as doctor_name,doctor_info.doctor_id,hospital_info.hospital_id,specialty,email,hospital_info.name as hospital_name,Suburb,District,designation,degree,visit_fee from doctor_info,hospital_info,doctor_hospital where specialty='${req.body.specialized}' and (District='${req.body.hideLoc[1]}' and Suburb!='${req.body.hideLoc[0]}') and doctor_hospital.hospital_id=hospital_info.hospital_id and doctor_hospital.doctor_id=doctor_info.doctor_id`;
                let sql2 = `select doctor_info.name as doctor_name,doctor_info.doctor_id,hospital_info.hospital_id,specialty,email,hospital_info.name as hospital_name,Suburb,District,designation,degree,visit_fee from doctor_info,hospital_info,doctor_hospital where specialty='${req.body.specialized}' and (Division='${req.body.hideLoc[2]}' and Suburb!='${req.body.hideLoc[0]}' and District!='${req.body.hideLoc[1]}') and doctor_hospital.hospital_id=hospital_info.hospital_id and doctor_hospital.doctor_id=doctor_info.doctor_id`;
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
                let sql = `select doctor_info.name as doctor_name,doctor_info.doctor_id,hospital_info.hospital_id,specialty,email,hospital_info.name as hospital_name,Suburb,District,designation,degree,visit_fee from doctor_info,hospital_info,doctor_hospital where specialty='${req.body.specialized}' and doctor_hospital.hospital_id=hospital_info.hospital_id and doctor_hospital.doctor_id=doctor_info.doctor_id`;
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
            let sql = `select name,suburb,district,specialization from hospital_info where name like'%${req.body.preciseSearch}%' and type='${req.body.Criteria}'`;
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

// app.get('/doctors', (req, res) => {
//     let sql = `select doctor_info.name as doctor_name,specialty,email,hospital_info.name as hospital_name,Suburb,District from doctor_info,hospital_info where doctor_info.hospital_id=hospital_info.hospital_id`;
//     let query = db.query(sql, (err, results) => {
//         if (err) throw err;
//         console.log(results);
//         //res.send(results);
//         res.render("doctors", {
//             title: "Doctor",
//             data: results,
//         })

//     });
//     //res.render("doctors", {});
// })
app.get('/doctors', (req, res) => {
    let sql = `select doctor_info.name as doctor_name,specialty,email,hospital_info.name as hospital_name,Suburb,District,designation,degree,visit_fee from doctor_info,hospital_info,doctor_hospital where doctor_hospital.hospital_id=hospital_info.hospital_id and doctor_hospital.doctor_id=doctor_info.doctor_id`;
    //let sql = `select doctor_info.name as doctor_name,specialty,email,hospital_info.name as hospital_name,Suburb,District,designation,degree,visit_fee from doctor_info,hospital_info,doctor_hospital where doctor_name=(Select distinct doctor_info.name as doctor_name from doctor_info,hospital_info,doctor_hospital where doctor_hospital.hospital_id=hospital_info.hospital_id and doctor_hospital.doctor_id=doctor_info.doctor_id)`;
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

app.get('/get_data', function(request, response, next){
    var search_query = request.query.search_query;
    // console.log(request.query.search_query);
    //console.log("dummmy", request.query.dummy)

    // var query = `
    // SELECT name FROM doctor_info`;
    let cri=request.query.cri;
    if(cri=='Doctor')
    {
        console.log('doc');
        var query = `
    SELECT name FROM doctor_info`;

    }
    else
    {
        console.log(cri)
        var query = `
    SELECT name FROM hospital_info where type='${cri}'`;

    }
    db.query(query, function(error, data){

        response.json(data);

    });

});


app.get('/about', (req, res) => {
    res.render("about", {});
})
app.get('/entry', (req, res) => {
    res.render("entry", {});
})
app.get('/navigation', (req, res) => {
    res.render("navigation", {});
})

app.use(homeRoutes.routes);
app.use(pateintLoginRoutes.routes);

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
