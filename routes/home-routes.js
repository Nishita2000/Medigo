const express = require('express');
//const { adminDoctorAdd,adminDoctorAddView,adminDoctorViewList,adminDoctorView,adminView,adminHospitalView,adminHospitalViewList,adminHospitalAddView,adminHospitalAdd}  = require('../controllers/homeController');
const router = express.Router();
const homeController = require('../controllers/homeController');
const loginController = require('../controllers/loginController');



router.get('/admin', homeController.adminView);
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

router.get('/receptionist/login', loginController.receptionistLogin)
router.post('/receptionist/login', loginController.receptionistLoginPost)
router.get('/receptionist/register', loginController.receptionistRegister)
router.post('/receptionist/register', loginController.receptionistRegisterPost)
router.get('/admin/login', loginController.adminLogin)
router.post('/admin/login', loginController.adminLoginPost)


router.get('/receptionist/:id', homeController.reciptionistView)
router.get('/admin/doctor/view_assigned/assign_recep/:doctor_id/:hospital_id', homeController.adminDoctorAssignReceptionistView)
router.post('/admin/doctor/view_assigned/assign_recep/:doctor_id/:hospital_id', homeController.adminDoctorAssignReceptionist)




module.exports = {
    routes: router
}