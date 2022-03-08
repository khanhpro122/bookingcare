import axios from '../axios'

const handleLoginApi = (email, password) => {
    return axios.post('/api/login',{email, password})
}

const getAllUsers = (inputId) => {
    return axios.get(`/api/get-all-users?id=${inputId}`)
}

const createUserService = (data) => {
    return axios.post('/api/create-new-user', data)
}

const deleteUserService = (userId) => {
    return axios.delete('/api/delete-user', {
        data: {
          id: userId
        }
    })
}

const updateUserService = (inputData) => {
    return axios.put('/api/edit-user', inputData)
}
const getAllCode = (inputData) => {
    return axios.get(`/api/getAllCode?type=${inputData}`)
}

const getTopDoctor = (limit) => {
    return axios.get(`/api/top-doctor?limit=${limit}`)
}

const getAllDoctor = (limt) => {
    return axios.get('/api/get-all-doctor')
}

const saveDetailsDoctor = (data) => {
    return axios.post('/api/save-data-doctor', data)
}

const getDetailsDoctor = (id) => {
    return axios.get(`/api/get-details-doctor-by-id?id=${id}`)
}

const getBulkCreateSchedule = (data) => {
    return axios.post('/api/bulk-create-schedule', data)
}

const getSheduleByDate = (doctorId, date) => {
    return axios.get(`api/get-schedule-by-date?doctorId=${doctorId}&date=${date}`)
}

const getExtraDoctorInfor = (doctorId) => {
    return axios.get(`/api/get-doctor-extra-infor?doctorId=${doctorId}`)
}

const getProfileDoctorById = (doctorId) => {
    return axios.get(`/api/get-profile-doctor-by-id?doctorId=${doctorId}`)
}

const postBookingPatient = (data) => {
    return axios.post(`/api/post-booking-patient`, data)
}

const deletePatient = (id) => {
    return axios.delete(`/api/delete-patient?id=${id}`)
}

const verifyBookingPatient = (data) => {
    return axios.post(`/api/verify-booking-patient`, data)
}

// const checkVerifyEmail = (data) => {
//     return axios.get(`/api/check-verifyEmail?token=${data.token}&doctorId=${data.doctorId}`)
// }

const createSpecialty = (data) => {
    return axios.post(`/api/create-specialty`, data)
}

const getAllSpecialty = () => {
    return axios.get('/api/get-all-specialty')
}
const getDetailSpecialty = (data) => {
    return axios.get(`/api/get-details-specialty-by-id?id=${data.id}&location=${data.location}`)
}
const getDetailSpecialtybyId = (id) => {
    return axios.get(`/api/get-details-specialty?id=${id}`)
}

const deleteSpecialty = (specialtyId) => {
    return axios.delete(`/api/delete-specialty?id=${specialtyId}`)
}

const createClinic = (data) => {
    return axios.post('/api/create-clinic', data)
}

const getAllClinic = () => {
    return axios.get('/api/get-all-clinic')
}

const getDetailClinic = (data) => {
    return axios.get(`/api/get-details-clinic-by-id?id=${data.clinicId}`)
}

const deleteClinic = (clinicId) => {
    return axios.delete(`/api/delete-clinic-by-id?id=${clinicId}`)
}

const getPatientInfor = (data) => {
    return axios.get(`/api/get-patient-infor?doctorId=${data.doctorId}&date=${data.date}`)
}

const getPatientFinsished = (data) => {
    return axios.get(`/api/get-patient-finished?doctorId=${data.doctorId}&date=${data.date}`)
}

const getPatientNoConfirm = (data) => {
    return axios.get(`/api/get-patient-no-confirm?doctorId=${data.doctorId}&date=${data.date}`)
}

const cancelPatient = (data) => {
    return axios.post('/api/cancel-patient', data)
}

const postSendRemedy = (data) => {
    return axios.post('/api/send-remedy', data)
}

const createHandBook = (data) => {
    return axios.post('/api/create-handbook', data)
}

const getAllHandBook = (data) => {
    return axios.get('/api/get-all-handbook')
}

const getDetailsHandBook = (id) => {
    return axios.get(`/api/get-details-handbook-by-id?id=${id}`)
}

const deleteHandBook = (id) => {
    return axios.delete(`/api/delete-handbook-by-id?id=${id}`)
}

const getAllPatients = (doctorId) => {
    return axios.get(`/api/get-all-patient-by-doctor?doctorId=${doctorId}`)
}

export { 
    handleLoginApi,
    getAllUsers, 
    createUserService, 
    deleteUserService,
    updateUserService, 
    getAllCode,
    getTopDoctor,
    getAllDoctor,
    saveDetailsDoctor,
    getDetailsDoctor,
    getBulkCreateSchedule,
    getSheduleByDate,
    getExtraDoctorInfor,
    getProfileDoctorById,
    postBookingPatient,
    verifyBookingPatient,
    deletePatient,
    // checkVerifyEmail,
    createSpecialty,
    getAllSpecialty,
    getDetailSpecialty,
    createClinic,
    getAllClinic,
    getDetailClinic,
    getPatientInfor,
    postSendRemedy,
    deleteClinic,
    getDetailSpecialtybyId,
    deleteSpecialty,
    createHandBook,
    getAllHandBook,
    getDetailsHandBook,
    deleteHandBook,
    getPatientNoConfirm,
    cancelPatient,
    getPatientFinsished,
    getAllPatients
 }