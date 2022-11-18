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
        message: null
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
                        console.log(info)
                        res.render('receptionist_dashboard', {
                            info
                        })
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
                        
                        console.log(info)
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

module.exports = {
    receptionistLogin,
    receptionistLoginPost,
    receptionistRegister,
    receptionistRegisterPost,
    adminLogin,
    adminLoginPost
}