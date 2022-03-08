import express from "express";
import homeController from '../controllers/homeController'
import userController from '../controllers/userController'
import doctorController from'../controllers/doctorController'
import patientController from'../controllers/patientController'
import specialtyController from'../controllers/specialtyController'
import clinicController from '../controllers/clinicController'
import hanbookController from '../controllers/handbookController'


let router = express.Router();

let initWebRoutes = (app) => {
    router.get('/', homeController.getHomePage);
    router.get('/crud', homeController.getCrudPage);
    router.post('/post-crud', homeController.postCRUD);
    router.get('/get-crud', homeController.displayCRUD);
    router.get('/edit-crud', homeController.editCRUD);
    router.post('/put-crud', homeController.updateData)
    router.get('/delete-crud', homeController.deleteCRUD)

    router.post('/api/login', userController.loginUser)
    router.get('/api/get-all-users', userController.handlegetAllUsers)
    router.post('/api/create-new-user', userController.handleCreateUser)
    router.put('/api/edit-user', userController.handleEditUser)
    router.delete('/api/delete-user', userController.handleDeleteUser)
    router.get('/api/getAllCode', userController.getAllCode)

    router.get('/api/top-doctor', doctorController.getTopDoctor)
    router.get('/api/get-all-doctor', doctorController.getAllDoctors)
    router.post('/api/save-data-doctor', doctorController.saveDataDoctor)
    router.get('/api/get-details-doctor-by-id', doctorController.getDetailsDoctorById)
    router.post('/api/bulk-create-schedule', doctorController.bulkCreateSchedule)
    router.get('/api/get-schedule-by-date', doctorController.getScheduleByDate)
    router.get('/api/get-doctor-extra-infor', doctorController.getDoctorExtraInfor)
    router.get('/api/get-profile-doctor-by-id', doctorController.getProfileDoctorById)
    router.get('/api/get-patient-infor', doctorController.getPatientInfor)
    router.get('/api/get-patient-no-confirm', doctorController.getPatientNoConfirm)
    router.get('/api/get-patient-finished', doctorController.getPatientFinsished)
    router.post('/api/cancel-patient', doctorController.cancelPatient)
    router.delete('/api/delete-patient', doctorController.deletePatient)
    router.post('/api/send-remedy', doctorController.sendRemedy)
    
    
    router.get('/api/get-all-patient-by-doctor', patientController.getAllPatientsByDoctor)
    router.post('/api/post-booking-patient', patientController.postBookingPatient)
    router.post('/api/verify-booking-patient', patientController.verifyBookingPatient)
    // router.get('/api/check-verifyEmail', patientController.checkVerifyMail)
    
    router.post('/api/create-specialty', specialtyController.createSpecialty)
    router.get('/api/get-all-specialty', specialtyController.getAllSpecialty)
    router.get('/api/get-details-specialty-by-id', specialtyController.getDetailSpecialtyById)
    router.get('/api/get-details-specialty' , specialtyController.getDetailSpecialty)
    router.delete('/api/delete-specialty' , specialtyController.deleteSpecialty)

    router.post('/api/create-clinic', clinicController.createClinic)
    router.get('/api/get-all-clinic', clinicController.getAllClinic)
    router.get('/api/get-details-clinic-by-id', clinicController.getDetailClinicById)
    router.delete('/api/delete-clinic-by-id', clinicController.deleteClinic)

    router.post('/api/create-handbook' , hanbookController.createHandbook)
    router.get('/api/get-all-handbook' , hanbookController.getAllHandBook)
    router.get('/api/get-details-handbook-by-id' , hanbookController.getDetailsHandbookById)
    router.delete('/api/delete-handbook-by-id' , hanbookController.deleteHandbookById)

    return app.use("/", router);
}

module.exports = initWebRoutes