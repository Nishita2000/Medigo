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
const { ensureLoggedIn } = require('connect-ensure-login');
const e = require('connect-flash');
// const nodemailer = require('nodemailer');
app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
//app.use(express.urlencoded({ extended: false }))
//config session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
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

app.post('/patient/logout', (req,res)=>{
    req.session.destroy(function (err) {
        return res.redirect("/");
    });
})


app.get('/viewPatient_doc_id=:did&hos_id=:hid', (req,res) => {
    console.log(req.params);
    let sql=`select patient_name,patient_email,patient_mobile,serial,substr(appointment_date, 1, 10) as app_date,serial from appointment_info where doctor_id= ? and hospital_id = ?`;
    let query = db.query(sql,[req.params.did,req.params.hid],(err, results) => {
        if (err) throw err;
        console.log(results);
        res.render('receptionist_patient_list', {
            // errors: req.flash("errors"),
            data: results
            // user: req.user
        })
    })
})

//19-11-2022 1:28 pm
app.get('/viewProfile_doc_id=:did&hos_id=:hid',async (req,res) => {
    //console.log(JSON.stringify(req.query));
    console.log(req.user);
    req.session.returnTo = req.originalUrl
    let sql = `select doctor_info.name as doctor_name,doctor_info.doctor_id,hospital_info.hospital_id,specialty,mobile_no,email,designation,degree,visit_fee,first_day,last_day,time_slot,hospital_info.name as hospital_name,Suburb,District,Division from doctor_info,hospital_info,doctor_hospital where doctor_info.doctor_id= ? and hospital_info.hospital_id = ? and doctor_hospital.hospital_id=hospital_info.hospital_id and doctor_hospital.doctor_id=doctor_info.doctor_id`; 
    let query = db.query(sql,[req.params.did,req.params.hid],(err, results) => {
        if (err) throw err;
        console.log(results);
        res.render('doctor_profile', {
            errors: req.flash("errors"),
            data: results[0],
            user: req.user
        })
    })
})
app.get('/viewHosProfile_hos_id=:hid', (req,res)=>{
    console.log(JSON.stringify(req.params.hid))
    let sql= `select doctor_info.name as doctor_name,doctor_info.doctor_id,degree,year_of_experience,hospital_info.hospital_id,specialty,email,mobile_no,hospital_email,contact_no,Specialization,hospital_info.description,hospital_info.name as hospital_name,Suburb,District,Division from doctor_info,hospital_info,doctor_hospital where hospital_info.hospital_id = ? and doctor_hospital.hospital_id=hospital_info.hospital_id and doctor_hospital.doctor_id=doctor_info.doctor_id`;
    let query = db.query(sql,[req.params.hid],(err, results) => {
        if (err) throw err;
        console.log(results);
        res.render('hospital_profile', {
            data: results,
            user: req.user
        })
    })
})
app.post('/appointmentBook', (req,res) =>{
    console.log(req.body);
    let sql = 'INSERT INTO appointment_info SET patient_id = ? , patient_name = ?, patient_email = ?, patient_mobile = ? ,appointment_date = ? ,message = ? ,doctor_id = ? ,hospital_id = ?,serial= ?'
            let query = db.query(sql, [req.body.patid, req.body.patName, req.body.patEmail, req.body.patMobile, req.body.date, req.body.patMsg, req.body.docid, req.body.hosid,req.body.serial], (err, rows) => {
                if (err) throw err;
                let sql2=`select doctor_info.name as doctor_name,time_slot,serial,substr(appointment_date, 1, 10) as app_date from doctor_info,doctor_hospital,appointment_info where doctor_hospital.doctor_id='${req.body.docid}' and serial='${req.body.serial}' and doctor_info.doctor_id=doctor_hospital.doctor_id and appointment_info.doctor_id=doctor_hospital.doctor_id`;
                let query2 = db.query(sql2, (err, results) => {
                    if (err) throw err;
                    console.log(results);
                    res.render("booking_success", {
                        data: results[0],
                        user: req.user
                    })
                })
                //console.log(rows)
                // res.render('hospital_add', {
                //     message: 'hospital added succesfully'
                // })

            });
})



app.post('/find', async (req, res) => {
    console.log(JSON.stringify(req.body));
    var arr = [];
    if (req.body.Criteria == 'Doctor') {
        if (req.body.Precise == 'Yes') {
            let sql = `select doctor_info.name as doctor_name,doctor_info.doctor_id,hospital_info.hospital_id,year_of_experience,doctor_info.specialty,doctor_info.email,hospital_info.name as hospital_name,Suburb,District,designation,degree,visit_fee from doctor_info,hospital_info,doctor_hospital where doctor_info.name like'%${req.body.preciseSearch}%' and doctor_hospital.hospital_id=hospital_info.hospital_id and doctor_hospital.doctor_id=doctor_info.doctor_id`;
            let query = db.query(sql, (err, results) => {
                if (err) throw err;
                res.render("searchedDoctors", {
                    title: "Doctor",
                    data: results,
                    user: req.user
                })
            })
        }
        else {
            if (req.body.Location == 'Yes') {
                //console.log("YES");
                //let sql = `select doctor_info.name as doctor_name,hospital_info.name as hospital_name from doctor_info,hospital_info where specialty='${req.body.specialized}' and (Suburb='${req.body.hideLoc[0]}' or (District='${req.body.hideLoc[1]}' and Suburb!='${req.body.hideLoc[0]}') or (Division='${req.body.hideLoc[2]}' and Suburb!='${req.body.hideLoc[0]}' and District!='${req.body.hideLoc[1]}')) and doctor_info.hospital_id=hospital_info.hospital_id`;
                let sql = `select doctor_info.name as doctor_name,doctor_info.doctor_id,hospital_info.hospital_id,year_of_experience,specialty,email,hospital_info.name as hospital_name,Suburb,District,designation,degree,visit_fee from doctor_info,hospital_info,doctor_hospital where specialty='${req.body.specialized}' and Suburb='${req.body.hideLoc[0]}' and doctor_hospital.hospital_id=hospital_info.hospital_id and doctor_hospital.doctor_id=doctor_info.doctor_id`;
                let sql1 = `select doctor_info.name as doctor_name,doctor_info.doctor_id,hospital_info.hospital_id,year_of_experience,specialty,email,hospital_info.name as hospital_name,Suburb,District,designation,degree,visit_fee from doctor_info,hospital_info,doctor_hospital where specialty='${req.body.specialized}' and (District='${req.body.hideLoc[1]}' and Suburb!='${req.body.hideLoc[0]}') and doctor_hospital.hospital_id=hospital_info.hospital_id and doctor_hospital.doctor_id=doctor_info.doctor_id`;
                let sql2 = `select doctor_info.name as doctor_name,doctor_info.doctor_id,hospital_info.hospital_id,specialty,year_of_experience,email,hospital_info.name as hospital_name,Suburb,District,designation,degree,visit_fee from doctor_info,hospital_info,doctor_hospital where specialty='${req.body.specialized}' and (Division='${req.body.hideLoc[2]}' and Suburb!='${req.body.hideLoc[0]}' and District!='${req.body.hideLoc[1]}') and doctor_hospital.hospital_id=hospital_info.hospital_id and doctor_hospital.doctor_id=doctor_info.doctor_id`;
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
                    user: req.user
                })
            }
            else {
                let sql = `select doctor_info.name as doctor_name,doctor_info.doctor_id,hospital_info.hospital_id,year_of_experience,specialty,email,hospital_info.name as hospital_name,Suburb,District,designation,degree,visit_fee from doctor_info,hospital_info,doctor_hospital where specialty='${req.body.specialized}' and doctor_hospital.hospital_id=hospital_info.hospital_id and doctor_hospital.doctor_id=doctor_info.doctor_id`;
                let query = db.query(sql, (err, results) => {
                    if (err) throw err;
                    console.log(results);
                    //res.send(results);
                    res.render("searchedDoctors", {
                        title: "Doctor",
                        data: results,
                        user: req.user
                    })

                });
            }
        }

    }
    else {
        if (req.body.Precise == 'Yes') {
            let sql = `select hospital_info.hospital_id,name,Suburb,District,Specialization,description from hospital_info where name like'%${req.body.preciseSearch}%' and type='${req.body.Criteria}'`;
            let query = db.query(sql, (err, results) => {
                if (err) throw err;
                console.log(results);
                // res.send(results);
                res.render("searchedDoctors", {
                    title: "Hospital",
                    data: results,
                    user: req.user
                })
            })
        }
        else {
            if (req.body.Location == 'Yes') {
                //console.log("YES");
                //let sql = `select doctor_info.name as doctor_name,hospital_info.name as hospital_name from doctor_info,hospital_info where specialty='${req.body.specialized}' and (Suburb='${req.body.hideLoc[0]}' or (District='${req.body.hideLoc[1]}' and Suburb!='${req.body.hideLoc[0]}') or (Division='${req.body.hideLoc[2]}' and Suburb!='${req.body.hideLoc[0]}' and District!='${req.body.hideLoc[1]}')) and doctor_info.hospital_id=hospital_info.hospital_id`;
                let sql = `select hospital_info.hospital_id,name,Suburb,District,Specialization,description from hospital_info where Specialization='${req.body.specialized}' and type='${req.body.Criteria}' and Suburb='${req.body.hideLoc[0]}'`;
                let sql1 = `select hospital_info.hospital_id,name,Suburb,District,Specialization,description from hospital_info where Specialization='${req.body.specialized}' and type='${req.body.Criteria}' and (District='${req.body.hideLoc[1]}' and Suburb!='${req.body.hideLoc[0]}')`;
                let sql2 = `select hospital_info.hospital_id,name,Suburb,District,Specialization,description from hospital_info where Specialization='${req.body.specialized}' and type='${req.body.Criteria}' and (Division='${req.body.hideLoc[2]}' and Suburb!='${req.body.hideLoc[0]}' and District!='${req.body.hideLoc[1]}')`;
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
                    user: req.user
                })

            }
            else {
                let sql = `select hospital_info.hospital_id,name,Suburb,District,Specialization,description from hospital_info where Specialization='${req.body.specialized}' and type='${req.body.Criteria}'`;
                let query = db.query(sql, (err, results) => {
                    if (err) throw err;
                    console.log(results);
                    // res.send(results);
                    res.render("searchedDoctors", {
                        title: "Hospital",
                        data: results,
                        user: req.user
                    })
                })

            }

        }

    }
})

app.get('/', async (req, res) => {
    //req.flash("errors",`this is a test`)
    //res.redirect("/patient/login")
    // req.session.admin = null
    // console.log(req.user)
    // // req.session.recep = null
    // res.render("index",{
    //     user: req.user
    // });
    let sql = `select name as doctor_name,degree,year_of_experience,email from doctor_info order by visit_count desc LIMIT 5`;
    let sql2 = `select name as hospital_name,Suburb,District,Specialization,description from hospital_info order by count_visit desc LIMIT 5`;
    let final_array= [];
    final_array=final_array.concat(await getResult(sql));
    final_array=final_array.concat(await getResult(sql2));
    //let sql = `select doctor_info.name as doctor_name,specialty,email,hospital_info.name as hospital_name,Suburb,District,designation,degree,visit_fee from doctor_info,hospital_info,doctor_hospital where doctor_name=(Select distinct doctor_info.name as doctor_name from doctor_info,hospital_info,doctor_hospital where doctor_hospital.hospital_id=hospital_info.hospital_id and doctor_hospital.doctor_id=doctor_info.doctor_id)`;
    // let query = db.query(sql, (err, results) => {
    //     if (err) throw err;
        console.log(final_array);
        //res.send(results);
        res.render("index", {
            data: final_array,
            user: req.user
        })

    // });
})

app.get('/doctors', (req, res) => {
    let sql = `select doctor_info.doctor_id,hospital_info.hospital_id,doctor_info.name as doctor_name,year_of_experience,specialty,email,hospital_info.name as hospital_name,Suburb,District,designation,degree,visit_fee from doctor_info,hospital_info,doctor_hospital where doctor_hospital.hospital_id=hospital_info.hospital_id and doctor_hospital.doctor_id=doctor_info.doctor_id order by visit_count desc`;
    //let sql = `select doctor_info.name as doctor_name,specialty,email,hospital_info.name as hospital_name,Suburb,District,designation,degree,visit_fee from doctor_info,hospital_info,doctor_hospital where doctor_name=(Select distinct doctor_info.name as doctor_name from doctor_info,hospital_info,doctor_hospital where doctor_hospital.hospital_id=hospital_info.hospital_id and doctor_hospital.doctor_id=doctor_info.doctor_id)`;
    let query = db.query(sql, (err, results) => {
        if (err) throw err;
        console.log(results);
        //res.send(results);
        res.render("doctors", {
            title: "Doctor",
            data: results,
            user: req.user
        })

    });
    //res.render("doctors", {});
})

app.get('/hospital_navbar', (req, res) => {
    let sql = `select hospital_id,name,Suburb,District,Specialization,description from hospital_info order by count_visit desc`;
                let query = db.query(sql, (err, results) => {
                    if (err) throw err;
                    console.log(results);
                    // res.send(results);
                    res.render("hospital_navbar", {
                        data: results,
                        user: req.user
                    })
                })
    //res.render("doctors", {});
})

app.get('/dateCheck', (req,res)=>{
    console.log(req.query)
    let sql=`select count(*) as cnt,maximum_slot from appointment_info,doctor_hospital where appointment_date='${req.query.date}' and appointment_info.doctor_id='${req.query.docid}' and appointment_info.hospital_id='${req.query.hosid}' and appointment_info.doctor_id=doctor_hospital.doctor_id and appointment_info.hospital_id=doctor_hospital.hospital_id`;
    let query = db.query(sql, (err, results) => {
        if (err) throw err;
        console.log(results)
        console.log(results[0].cnt);
        console.log(results[0].maximum_slot);
        //console.log(results[1]);
        if(results[0].cnt==results[0].maximum_slot)
        {
            console.log("slot no")
            
        //    res.json({message: "no slot available",});
        res.json({message: "no slot available",
        });
           return;
        }
        else
        {
            console.log("slot yes")
            // res.json({message: "slots available"});
            res.json({message: "slots available",
            cnt: results[0].cnt+1
        });
            // req.flash("errors",`slot available`)
            // res.redirect("/viewProfile_doc_id="+docid+"&hos_id="+hosid);
            // res.render("doctor_profile",{
            //     message: 'slots available'
            // })
        }
    })
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
    if (req.user) {
        res.render("about", {
            user: req.user
        }); 
    }
    else {
        req.session.returnTo = req.originalUrl
        res.redirect('/patient/login')
    }
   
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
