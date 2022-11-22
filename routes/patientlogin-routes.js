const express = require('express');
const router = express.Router();

const esl = require('connect-ensure-login');
const loginController = require('../controllers/loginController');
const homePageController = require('../controllers/homePageController');
const passport = require('passport')
const initPassportPatientLocal = require("../controllers/patientPassportLocalController");


//Init all passport
initPassportPatientLocal();

router.get('/patient/change_pass', loginController.checkLoggedInPatient, loginController.changePassPatient)
router.post('/patient/change_pass', loginController.changePassPatientPost)
router.get('/patient/dashboard', loginController.checkLoggedInPatient,homePageController.getHomePage2)
router.get('/patient/login', loginController.checkLoggedOutPatient,loginController.patientLogin)
router.post('/patient/login', passport.authenticate("local", {
    //successReturnToOrRedirect: '/',
    //successRedirect: '/', // edited by alvee
    successFlash: true,
    failureFlash: true,
    failureRedirect: "/patient/login", keepSessionInfo: true
}), (req,res) => {
    console.log(req.user); // doesnt have returnTo inside anymore ?
    res.redirect(req.session.returnTo || '/');
    delete req.session.returnTo;
});

router.get('/patient/register', loginController.patientRegister)
router.post('/patient/register', loginController.patientRegisterPost)
router.post('/patient/logout', loginController.postLogOutPatient);


module.exports = {
    routes: router
}