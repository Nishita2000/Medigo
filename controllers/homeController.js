const { render } = require('ejs');
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
    console.log('MySql connected in homeController....');

});

const adminView = (req, res) => {
    res.render('admin');
}

const adminHospitalView = (req, res) => {
    res.render('hospital');
}

const adminHospitalViewList = (req, res) => {
    let sql = `select * from hospital_info`;
    let query = db.query(sql, (err, rows) => {
        if (err) throw err;
        console.log(rows);

        res.render('hospital_list', {
            rows
        })

    });
}

const adminHospitalAddView = (req, res) => {
    res.render('hospital_add', {
        message: null
    });
}

const adminHospitalAdd = (req, res) => {
    const { name, suburb, district, division, hospital_id, type, specialization, description } = req.body;
    let sql2 = 'SELECT EXISTS(SELECT * from hospital_info WHERE name = ? and suburb = ? and district = ? and division = ?)'
    let query = db.query(sql2, [name, suburb, district, division], (err, rows) => {
        if (err) throw err;
        var string = JSON.stringify(rows);
        if (string.includes(':1')) {
            res.render('hospital_add', {
                message: 'duplicate entry'
            })
        }
        else {
            //console.log('doesntexist')
            let sql = 'INSERT INTO hospital_info SET name = ? , suburb = ?, district = ?, division = ? ,hospital_id = ? ,type = ? ,specialization = ? ,description = ?'
            let query = db.query(sql, [name, suburb, district, division, hospital_id, type, specialization, description], (err, rows) => {
                if (err) throw err;
                //console.log(rows);
                res.render('hospital_add', {
                    message: 'hospital added succesfully'
                })
            });
        }

    });

}

const adminHospitalEdit = (req, res) => {
    let sql = 'SELECT * FROM hospital_info WHERE hospital_id = ?';
    let query = db.query(sql, [req.params.id], (err, rows) => {
        if (err) throw err;
        res.render('hospital_edit', {
            row: rows[0]
        });
    })
}

const adminHospitalUpdate = (req, res) => {
    const { name, suburb, district, division, type, specialization, description } = req.body;
    let sql = 'UPDATE hospital_info SET name = ? , suburb = ?, district = ?, division = ? , type = ? ,specialization = ? , description = ? WHERE hospital_id = ?';
    let query = db.query(sql, [name, suburb, district, division, type, specialization, description, req.params.id], (err, rows) => {
        if (err) {
            console.log('I am in this')
            throw err;
        }
        res.redirect('/admin/hospital/view');

    })
}

const adminHospitalDelete = (req, res) => {
    var id = req.params.id;
    let sql = 'DELETE FROM hospital_info WHERE hospital_id = ?';
    let query = db.query(sql, [id], (err, rows) => {
        if (err) throw err;
        let removed = encodeURIComponent('Hospital Successfully removed');
        res.redirect('/admin/hospital/view/?removed=' + removed);
        // let sql2 = 'DELETE FROM doctor_info WHERE hospital_id = ?';
        // let query = db.query(sql2, [id], (err, rows) => {
        //     if (err) throw err;
        //     let removed = encodeURIComponent('Hospital Successfully removed');
        //     res.redirect('/admin/hospital/view/?removed=' + removed);
        // })
    })
}

const adminDoctorView = (req, res) => {
    res.render('admin_doctor');
}

const adminDoctorViewList = (req, res) => {
    let sql = `select * from doctor_info`;
    let query = db.query(sql, (err, rows) => {
        if (err) throw err;
        console.log(rows);

        res.render('admin_doctor_list', {
            title: "Doctor",
            rows
        })

    });
}

const adminDoctorAddView = (req, res) => {
    let sql = 'select * from hospital_info'
    // let query = db.query(sql, (err, rows) => {
    //     if (err) throw err;
    //     //console.log(rows);
    //     res.render('admin_doctor_add', {
    //         message: null,
    //         rows
    //     })
    // });
    res.render('admin_doctor_add', {
        message: null
    })
}

const adminDoctorAdd = (req, res) => {
    const { name, specialty, mobile_no, email } = req.body;
    let sql2 = 'SELECT EXISTS(SELECT * from doctor_info WHERE name = ? and specialty = ? and mobile_no = ? and email = ?)'
    let query = db.query(sql2, [name, specialty, mobile_no, email], (err, rows) => {
        if (err) throw err;
        var string = JSON.stringify(rows);
        console.log(string);
        if (string.includes(':1')) {
            res.render('admin_doctor_add', {
                message: 'duplicate entry'
            })
        }
        else {
            //console.log('doesntexist')
            let sql = 'INSERT INTO doctor_info SET name = ? , specialty = ?, mobile_no = ? ,email = ?'
            let query = db.query(sql, [name, specialty, mobile_no, email], (err, rows) => {
                if (err) throw err;
                //console.log(rows);
                res.render('admin_doctor_add', {
                    message: 'Doctor added succesfully'
                })
            });
        }
        // sql = 'SELECT * FROM hospital_info'
        // let query = db.query(sql, (err, rows) => {
        //     console.log(rows);
        //     res.render('admin_doctor_add', {
        //         message: null,
        //         rows
        //     })
        // });

    });
}

const adminDoctorDelete = (req, res) => {
    var id = req.params.id;
    let sql = 'DELETE FROM doctor_info WHERE doctor_id = ?';
    let query = db.query(sql, [id], (err, rows) => {
        if (err) throw err;
        let removed = encodeURIComponent('Doctor Successfully removed');
        res.redirect('/admin/doctor/view/?removed=' + removed);
        // let sql2 = 'DELETE FROM doctor_info WHERE hospital_id = ?';
        // let query = db.query(sql2, [id], (err, rows) => {
        //     if (err) throw err;
        //     let removed = encodeURIComponent('Hospital Successfully removed');
        //     res.redirect('/admin/hospital/view/?removed=' + removed);
        // })
    })
}

const adminDoctorEdit = (req, res) => {
    let sql = 'SELECT * FROM doctor_info WHERE doctor_id = ?';
    let query = db.query(sql, [req.params.id], (err, rows) => {
        if (err) throw err;
        res.render('admin_doctor_edit', {
            row: rows[0]
        });
    })
}

const adminDoctorUpdate = (req, res) => {
    const { name, specialty, mobile_no, email } = req.body;
    let sql = 'UPDATE doctor_info SET name = ? , specialty = ?, mobile_no = ? ,email = ? WHERE doctor_id = ?'
    let query = db.query(sql, [name, specialty, mobile_no, email, req.params.id], (err, rows) => {
        if (err) {
            //console.log('I am in this')
            throw err;
        }
        res.redirect('/admin/doctor/view');

    })
}

const adminDoctorAssignView = (req, res) => {
    //const { doctor_id, hospital_id } = req.body;
    let sql1 = 'SELECT * FROM doctor_info';
    let query = db.query(sql1, (err, doctor_row) => {
        let sql2 = 'SELECT * FROM hospital_info';
        let query = db.query(sql2, (err, hospital_row) => {
            res.render('admin_doctor_assign', {
                message: null,
                doctor_row,
                hospital_row
            })
        })
    })
}

const adminDoctorAssign = (req, res) => {
    const { doctor_id, hospital_id } = req.body;
    let sql2 = 'SELECT * FROM doctor_info';
    let query = db.query(sql2, (err, doctor_row) => {
        let sql3 = 'SELECT * FROM hospital_info';
        let query = db.query(sql3, (err, hospital_row) => {
            let sql1 = 'SELECT EXISTS(SELECT * from doctor_hospital WHERE doctor_id = ? and hospital_id = ?)'
            let query = db.query(sql1, [doctor_id, hospital_id], (err, rows) => {
                if (err) throw err;
                var string = JSON.stringify(rows);
                if (string.includes(':1')) {
                    res.render('admin_doctor_assign', {
                        message: 'duplicate entry',
                        doctor_row,
                        hospital_row
                    })
                }
                else {
                    let sql4 = 'INSERT INTO doctor_hospital SET doctor_id = ?, hospital_id = ?'
                    let query = db.query(sql4, [doctor_id, hospital_id], (err, rows) => {
                        if (err) throw err;
                        //console.log(rows);
                        res.render('admin_doctor_assign', {
                            message: 'Doctor assigned succesfully',
                            doctor_row,
                            hospital_row
                        })
                    });
                    //console.log('doesntexist')     
                }
            });
        })
    })
}

const adminDoctorViewAssigned = (req, res) => {
    let sql = `select * from doctor_hospital`
    let query = db.query(sql, (err, rows) => {
        if (err) throw err;
        console.log(rows);

        res.render('admin_doctor_view_assigned', {
            rows
        })
    });

}

const adminDoctorDeleteAssigned = (req, res) => {
    var doctor_id = req.params.doctor_id;
    var hospital_id = req.params.hospital_id;
    let sql = 'DELETE FROM doctor_hospital WHERE doctor_id = ? and hospital_id = ?';
    let query = db.query(sql, [doctor_id, hospital_id], (err, rows) => {
        if (err) throw err;
        let removed = encodeURIComponent('Successfully removed');
        res.redirect('/admin/doctor/view_assigned/?removed=' + removed);
    })
}

const reciptionistView = (req, res) => {
    let sql = 'SELECT * FROM receptionist_info WHERE receptionist_id = ?';
    let query = db.query(sql, [req.params.id], (err, rows) => {
        if (err) throw err;
        res.render('receptionist_view', {
            row: rows[0]
        });
    })
}

const adminDoctorAssignReceptionistView = (req, res) => {
    var doctor_id = req.params.doctor_id
    var hospital_id = req.params.hospital_id
    let sql2 = 'SELECT * FROM receptionist_info where hospital_id = ?';
    let query = db.query(sql2, [req.params.hospital_id], (err, receptionist_row) => {
        res.render('admin_assign_recep', {
            message: null,
            doctor_id,
            hospital_id,
            receptionist_row
        })
    })


}

const adminDoctorAssignReceptionist = (req, res) => {
    const { hospital_id, receptionist_id,doctor_id } = req.body;
    let sql2 = 'SELECT * FROM receptionist_info where hospital_id = ?';
    let query = db.query(sql2, [hospital_id], (err, receptionist_row) => {
        let sql1 = 'SELECT EXISTS(SELECT * from receptionist_info WHERE receptionist_id = ? and hospital_id = ? and doctor_id = ?)'
        let query = db.query(sql1, [receptionist_id, hospital_id, doctor_id] , (err, rows) => {
            if (err) throw err;
            var string = JSON.stringify(rows);
            console.log(string)
            if (string.includes(':1')) {
                res.render('admin_assign_recep', {
                    message: 'duplicate entry',
                    receptionist_row,
                    doctor_id,
                    hospital_id
                })
            }
            else {
                let sql4 = 'UPDATE receptionist_info  SET doctor_id = ? where receptionist_id = ?'
                let query = db.query(sql4, [doctor_id, receptionist_id], (err) => {
                    if (err) throw err;
                    //console.log(rows);
                    let message = encodeURIComponent('receptionist added successfully');
                    res.redirect('/admin/doctor/view_assigned/?added=' +message)
                });    //console.log('doesntexist')     
            }
        });
    });
}

// const adminScheduleView = (req, res) => {
//     res.render('admin_schedule');
// }

// const adminScheduleAddView = (req, res) => {
//     res.render('admin_schedule_add', {
//         message: null
//     });
// }


module.exports = {
    adminView,
    adminHospitalView,
    adminHospitalViewList,
    adminHospitalAddView,
    adminHospitalAdd,
    adminDoctorView,
    adminDoctorViewList,
    adminDoctorAddView,
    adminDoctorAdd,
    // adminScheduleView,
    // adminScheduleAddView,
    adminHospitalDelete,
    adminHospitalEdit,
    adminHospitalUpdate,
    adminDoctorDelete,
    adminDoctorEdit,
    adminDoctorUpdate,
    adminDoctorAssignView,
    adminDoctorAssign,
    adminDoctorViewAssigned,
    adminDoctorDeleteAssigned,
    adminDoctorAssignReceptionistView,
    adminDoctorAssignReceptionist,
    reciptionistView

}