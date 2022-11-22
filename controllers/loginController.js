const bcrypt = require('bcrypt')
const mysql = require('mysql');
const bodyParser = require('body-parser');

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
    console.log('MySql connected in loginController....');

});

const receptionistLogin = (req, res) => {
    res.render('receptionist_login', {
        errors: req.flash("errors"),
        message : null
    })
}

const receptionistRegister = (req, res) => {
    let sql1 = 'SELECT * FROM hospital_info';
    let query = db.query(sql1, (err, rows) => {
        res.render('receptionist_register', {
            message: null,
            rows
        })
    })
}

const receptionistRegisterPost = async (req, res) => { 
        const { name, mobile, email,hospital_id } = req.body;
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        let sql2 = 'SELECT EXISTS(SELECT * from receptionist_info WHERE mobile = ? or email = ?)'
        let query = db.query(sql2, [ mobile, email], (err, rows) => {
            if (err) throw err;
            var string = JSON.stringify(rows);
            console.log(string);
            //doesn't exist
            if (string.includes(':0')) {
                let sql = 'INSERT INTO receptionist_info SET receptionist_name = ?, mobile = ?, email = ?, password = ?, hospital_id = ?'
                let query = db.query(sql, [name, mobile, email, hashedPassword, hospital_id], (err, rows) => {
                    if (err) throw err;
                    let message = encodeURIComponent('Entry added successfully');
                    res.redirect('/receptionist/login/?added=' + message)
                });
            }
            else {
                res.render('receptionist_register', {
                    message: 'This entry already exists'
                })   
            }
        });   
}

const receptionistLoginPost = async (req, res) => {
    const { password, email } = req.body;
    //const hashedPassword = await bcrypt.hash(req.body.password, 10)
    let sql2 = 'SELECT EXISTS(SELECT * from receptionist_info WHERE email = ?)'
    let query = db.query(sql2, [email], (err, rows) => {
        if (err) throw err;
        var string = JSON.stringify(rows);
        console.log(string);
        if (string.includes(':1')) {
            console.log('login successful')
            let sql = 'SELECT * from receptionist_info WHERE email = ?'
            let query = db.query(sql, [email], (err, rows) => {
                if (err) throw err;
                //console.log(rows);
                var info = rows
                var dbpassword = rows[0].password;
                //console.log(rows[0].password)
                bcrypt.compare(password, dbpassword, function (err, result) {
                    //console.log(result)
                    if (result) {
                        //console.log(info)
                        req.session.recep = rows[0]
                        //console.log(info)
                        console.log('coco')
                        console.log(req.session.recep)
                        res.redirect('/receptionist/dashboard')
                    }
                    else {
                        res.render('receptionist_login', {
                            message: 'invalid credentials'
                        })
                    }
                });
            });
        }
        else {
            res.render('receptionist_login', {
                message: "user doesn't exist"
            })
            //console.log("user doesn't exist")
        }
    });
}

const adminLogin = (req, res) => {
    res.render('admin_login', {
        message: null
    })
}

const adminLoginPost = async (req, res) => {
    const { password, email } = req.body;
    //const hashedPassword = await bcrypt.hash(req.body.password, 10)
    let sql2 = 'SELECT EXISTS(SELECT * from admin_info WHERE email = ?)'
    let query = db.query(sql2, [email], (err, rows) => {
        if (err) throw err;
        var string = JSON.stringify(rows);
        console.log(string);
        if (string.includes(':1')) {
            console.log('login successful')
            let sql = 'SELECT * from admin_info WHERE email = ?'
            let query = db.query(sql, [email], (err, rows) => {
                if (err) throw err;
                //console.log(rows);
                var info = rows
                var dbpassword = rows[0].password;
                //console.log(rows[0].password)
                bcrypt.compare(password, dbpassword, function (err, result) {
                    //console.log(result)
                    if (result) {
                        req.session.admin = rows[0]
                        //console.log(info)
                        //console.log('hehe')
                        console.log(req.session.admin)
                        res.redirect('/admin')
                        // res.render('receptionist_dashboard', {
                        //     info
                        // })
                    }
                    else {
                        res.render('admin_login', {
                            message: 'invalid credentials'
                        })
                    }
                });
            });
        }
        else {
            res.render('admin_login', {
                message: "user doesn't exist"
            })
            //console.log("user doesn't exist")
        }
    });
}

let checkLoggedInAdmin = (req, res, next) => {
    if (!req.session.admin) {
        return res.redirect("/admin/login");
    }
    next();
};

let checkLoggedOutAdmin = (req, res, next) => {
    if (req.session.admin) {
        return res.redirect("/admin");
    }
    next();
};

let postLogOutAdmin = (req, res) => {
    req.session.admin = null;
    console.log(req.session)
    res.redirect("/");
};

let checkLoggedInRecep = (req, res, next) => {
    if (!req.session.recep) {
        return res.redirect("/receptionist/login");
    }
    // if (!req.isAuthenticated()) {
    //     return res.redirect("/receptionist/login");
    // }
    next();
};

let checkLoggedOutRecep = (req, res, next) => {
    if (req.session.recep) {
        return res.redirect("/receptionist/dashboard");
    }
    next();
};

let postLogOutRecep = (req, res) => {
    // req.session.destroy(function (err) {
    //     return res.redirect("/receptionist/login");
    // });
    // req.session.admin = 0
    //console.log(req.session)
    req.session.recep = null;
    console.log(req.session)
    res.redirect("/");
};

const patientLogin = (req, res) => {
    res.render('patient_login', {
        errors: req.flash("errors"),
        message: null
    })
}

const patientRegister = (req, res) => {
    res.render('patient_register', {
        message: null
    })
}

const patientRegisterPost = async (req, res) => {
    const { name, mobile, email } = req.body;
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    let sql2 = 'SELECT EXISTS(SELECT * from patient_info WHERE mobile = ? or email = ?)'
    let query = db.query(sql2, [mobile, email], (err, rows) => {
        if (err) throw err;
        var string = JSON.stringify(rows);
        console.log(string);
        //doesn't exist
        if (string.includes(':0')) {
            let sql = 'INSERT INTO patient_info SET name = ?, mobile = ?, email = ?, password = ?'
            let query = db.query(sql, [name, mobile, email, hashedPassword], (err, rows) => {
                if (err) throw err;
                let message = encodeURIComponent('Entry added successfully');
                res.redirect('/patient/login/?added=' + message)
            });
        }
        else {
            res.render('patient_register', {
                message: 'This entry already exists'
            })
        }
    });
}

let checkLoggedInPatient = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect("/patient/login");
    }
    next();
};

let checkLoggedOutPatient = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect("/patient/dashboard");
    }
    next();
};

let postLogOutPatient = (req, res) => {
    req.session.destroy(function (err) {
        return res.redirect("/");
    });
};

const changePassPatient = async (req, res) => {
    res.render('change_password', {
        message : null
    })
}

const changePassPatientPost = async (req, res) => {
    const { oldpassword, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10)
    var id = req.user.patient_id
    let sql = 'SELECT * from patient_info WHERE patient_id = ?'
    let query = db.query(sql, [id], (err, rows) => {
        if (err) throw err;
        var dbpassword = rows[0].password;
        //console.log(rows[0].password)
        bcrypt.compare(oldpassword, dbpassword, function (err, result) {
            //console.log(result)
            if (result) {
                let sql = 'UPDATE patient_info SET password = ? where patient_id = ?'
                let query = db.query(sql, [hashedPassword,id], (err, rows) => {
                    let message = encodeURIComponent('Password changed successfully');
                    res.redirect('/patient/login/?added=' + message)
                });
               // req.session.admin = rows[0] 
            }
            else {
                res.render('change_password', {
                    message: "Password doesn't match"
                })
            }
        });
    });    
}

const changePassRecep = async (req, res) => {
    res.render('change_password_recep', {
        message: null
    })
}

const changePassRecepPost = async (req, res) => {
    const { oldpassword, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10)
    var id = req.session.recep.receptionist_id
    let sql = 'SELECT * from receptionist_info WHERE receptionist_id = ?'
    let query = db.query(sql, [id], (err, rows) => {
        if (err) throw err;
        var dbpassword = rows[0].password;
        //console.log(rows[0].password)
        bcrypt.compare(oldpassword, dbpassword, function (err, result) {
            //console.log(result)
            if (result) {
                let sql = 'UPDATE receptionist_info SET password = ? where receptionist_id = ?'
                let query = db.query(sql, [hashedPassword, id], (err, rows) => {
                    req.session.recep = null
                    let message = encodeURIComponent('Password changed successfully');
                    res.redirect('/receptionist/login/?added=' + message)
                });
                // req.session.admin = rows[0] 
            }
            else {
                res.render('change_password_recep', {
                    message: "Password doesn't match"
                })
            }
        });
    });
}

const changePassAdmin = async (req, res) => {
    res.render('change_password_admin', {
        message: null
    })
}

const changePassAdminPost = async (req, res) => {
    const { oldpassword, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10)
    var id = req.session.admin.admin_id
    let sql = 'SELECT * from admin_info WHERE admin_id = ?'
    let query = db.query(sql, [id], (err, rows) => {
        if (err) throw err;
        var dbpassword = rows[0].password;
        //console.log(rows[0].password)
        bcrypt.compare(oldpassword, dbpassword, function (err, result) {
            //console.log(result)
            if (result) {
                let sql = 'UPDATE admin_info SET password = ? where admin_id = ?'
                let query = db.query(sql, [hashedPassword, id], (err, rows) => {
                    req.session.admin = null
                    let message = encodeURIComponent('Password changed successfully');
                    res.redirect('/admin/login/?added=' + message)
                });
                // req.session.admin = rows[0] 
            }
            else {
                res.render('change_password_admin', {
                    message: "Password doesn't match"
                })
            }
        });
    });
}

module.exports = {
    receptionistLogin,
    receptionistLoginPost,
    receptionistRegister,
    receptionistRegisterPost,
    adminLogin,
    adminLoginPost,
    checkLoggedInRecep,
    checkLoggedOutRecep,
    postLogOutRecep,
    patientLogin,
    patientRegister,
    patientRegisterPost,
    checkLoggedInPatient,
    checkLoggedOutPatient,
    postLogOutPatient,
    postLogOutAdmin,
    checkLoggedInAdmin,
    checkLoggedOutAdmin,
    changePassPatient,
    changePassPatientPost,
    changePassRecep,
    changePassRecepPost,
    changePassAdmin,
    changePassAdminPost
}