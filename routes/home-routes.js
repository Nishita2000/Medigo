const express = require('express');
//const { adminDoctorAdd,adminDoctorAddView,adminDoctorViewList,adminDoctorView,adminView,adminHospitalView,adminHospitalViewList,adminHospitalAddView,adminHospitalAdd}  = require('../controllers/homeController');
const router = express.Router();
const homeController = require('../controllers/homeController');
const loginController = require('../controllers/loginController');
const homePageController = require('../controllers/homePageController');
//import passport from "passport";
const passport = require('passport')
const initPassportLocal = require("../controllers/passportLocalController");




// Init all passport


//initPassportLocal();

router.get('/admin', loginController.checkLoggedInAdmin, homeController.adminView);
router.get('/admin/hospital', homeController.adminHospitalView);
router.get('/admin/hospital/view', homeController.adminHospitalViewList);
router.get('/admin/hospital/add', homeController.adminHospitalAddView);
router.post('/admin/hospital/add', homeController.adminHospitalAdd);
router.get('/admin/doctor', homeController.adminDoctorView);
router.get('/admin/doctor/view', homeController.adminDoctorViewList);
router.get('/admin/doctor/add', homeController.adminDoctorAddView);
router.post('/admin/doctor/add', homeController.adminDoctorAdd);
//router.get('/admin/schedule', homeController.adminScheduleView);
//router.get('/admin/schedule/add', homeController.adminScheduleAddView);
router.get('/admin/hospital/view/delete/:id',homeController.adminHospitalDelete)
router.get('/admin/hospital/view/edit/:id', homeController.adminHospitalEdit)
router.post('/admin/hospital/view/edit/:id', homeController.adminHospitalUpdate)
router.get('/admin/doctor/view/delete/:id', homeController.adminDoctorDelete)
router.get('/admin/doctor/view/edit/:id', homeController.adminDoctorEdit)
router.post('/admin/doctor/view/edit/:id', homeController.adminDoctorUpdate)
router.get('/admin/doctor/assign', homeController.adminDoctorAssignView)
router.post('/admin/doctor/assign', homeController.adminDoctorAssign)
router.get('/admin/doctor/view_assigned', homeController.adminDoctorViewAssigned)
router.get('/admin/doctor/view_assigned/delete/:doctor_id/:hospital_id', homeController.adminDoctorDeleteAssigned)

router.get('/receptionist/dashboard', loginController.checkLoggedInRecep, homePageController.getHomePage)
router.get('/receptionist/login', loginController.checkLoggedOutRecep,  loginController.receptionistLogin)
router.post('/receptionist/login', loginController.receptionistLoginPost)
// router.post('/receptionist/login', passport.authenticate("local", {
//     successRedirect: "/receptionist/dashboard",
//     failureRedirect: '/receptionist/login',
//     successFlash: true,
//     failureFlash: true
// }));
router.get('/receptionist/register', loginController.receptionistRegister)
router.post('/receptionist/register', loginController.receptionistRegisterPost)
router.post('/receptionist/logout', loginController.postLogOutRecep);
//router.get('/receptionist/view', homeController.reciptionistView)
router.get('/receptionist/change_pass', loginController.checkLoggedInRecep, loginController.changePassRecep)
router.post('/receptionist/change_pass', loginController.changePassRecepPost)
router.get('/admin/change_pass', loginController.checkLoggedInAdmin, loginController.changePassAdmin)
router.post('/admin/change_pass', loginController.changePassAdminPost)

router.get('/admin/login', loginController.checkLoggedOutAdmin, loginController.adminLogin)
router.post('/admin/login', loginController.adminLoginPost)
router.post('/admin/logout', loginController.postLogOutAdmin);



router.get('/admin/doctor/view_assigned/assign_recep/:doctor_id/:hospital_id', homeController.adminDoctorAssignReceptionistView)
router.post('/admin/doctor/view_assigned/assign_recep/:doctor_id/:hospital_id', homeController.adminDoctorAssignReceptionist)


module.exports = {
    routes: router
}