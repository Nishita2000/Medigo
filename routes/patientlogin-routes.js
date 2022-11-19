const express = require('express');
const router = express.Router();

const loginController = require('../controllers/loginController');
const homePageController = require('../controllers/homePageController');
const passport = require('passport')
const initPassportPatientLocal = require("../controllers/patientPassportLocalController");


//Init all passport
initPassportPatientLocal();

router.get('/patient/dashboard', loginController.checkLoggedInPatient,homePageController.getHomePage2)
router.get('/patient/login', loginController.checkLoggedOutPatient,loginController.patientLogin)
router.post('/patient/login', passport.authenticate("local", {
    //successRedirect: '/patient/dashboard',
    successRedirect: '/', // edited by alvee
    failureRedirect: '/patient/login',
    successFlash: true,
    failureFlash: true
}));
router.get('/patient/register', loginController.patientRegister)
router.post('/patient/register', loginController.patientRegisterPost)
router.post('/patient/logout', loginController.postLogOutPatient);


module.exports = {
    routes: router
}