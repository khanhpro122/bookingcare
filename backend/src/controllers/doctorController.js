import doctorService from '../services/doctorService'

let getTopDoctor = async (req, res) => {
    let limit = req.query.limit
    if(!limit) limit =10 
    try {
        let response = await doctorService.getTopDoctorHome(+limit)
        res.status(200).json(response)
    }catch (e) {
        console.log(e)
        res.status(400).json({
            errCode: -1, 
            message: 'Error from server...'
        })
    }
}

let getAllDoctors = async (req, res) => {
    try {
        let doctors = await doctorService.getAllDoctorServices()
        res.status(200).json(doctors)
    }catch (e) {
        res.status(404).json({
            errCode: -1, 
            errMsg: 'Error from server...'
        })
    }
}

let saveDataDoctor = async (req, res) => {
    try {
        let doctor = await doctorService.saveDataDoctorServices(req.body)
        res.status(200).json(doctor)
    }catch (e) {
        console.log(e);
        res.status(404).json({
            errCode: -1, 
            errMsg: 'Error from server...'
        })
    }
}

let getDetailsDoctorById = async (req, res) => {
    try {
        let info = await doctorService.getDetailsDoctorById(req.query.id)
        res.status(200).json(info)
    }catch (e) {
        res.status(404).json({
            errCode: -1, 
            errMsg: 'Error from server...'
        })
    }
}

let bulkCreateSchedule = async (req, res) => {
    try{
        let info = await doctorService.bulkCreateScheduleServive(req.body)
        res.status(200).json(info)
    }catch(e){
        res.status(404).json({
            errCode: -1,
            errMsg: 'Error from server...'
        })
    }
}
let getScheduleByDate = async (req, res) => {
    try {
        let info = await doctorService.getScheduleByDateService(req.query.doctorId, req.query.date)
        res.status(200).json(info)
    }catch(e){
        res.status(404).json({
            errCode: -1,
            errMsg: 'Error from server...'
        })
    }
}

let getDoctorExtraInfor = async (req, res) => {
    try {
        let data = await doctorService.getDoctorExtraInforService(req.query.doctorId)
        res.status(200).json(data)
    }catch(e) {
        console.log(e);
        res.status(404).json({
            errCode: -1,
            errMsg: 'Error from server...'
        })
    }
}

let getProfileDoctorById = async (req, res) => {
    try {   
        let data = await doctorService.getProfileDoctorByIdService(req.query.doctorId)
        res.status(200).json(data)
    }catch(e) {
        console.log(e);
        res.status(404).json({
            errCode: -1,
            errMsg: 'Error from server...'
        })
    }
}

let getPatientInfor = async (req, res) => {
    try {
        let infor = await doctorService.getPatientInforService(req.query.doctorId, req.query.date)
        res.status(200).json(infor)
    }catch (e) {
        console.log(e);
        res.status(404).json({
            errCode: -1,
            errMsg: 'Error from server...'
        })
    }
}

let getPatientNoConfirm = async (req, res) => {
    try {
        let infor = await doctorService.getPatientNoConfirmService(req.query.doctorId, req.query.date)
        res.status(200).json(infor)
    }catch (e) {
        console.log(e);
        res.status(404).json({
            errCode: -1,
            errMsg: 'Error from server...'
        })
    }
}

let getPatientFinsished = async (req, res) => {
    try {
        let infor = await doctorService.getPatientFinsishedService(req.query.doctorId, req.query.date)
        res.status(200).json(infor)
    }catch (e) {
        console.log(e);
        res.status(404).json({
            errCode: -1,
            errMsg: 'Error from server...'
        })
    }
}


let sendRemedy = async (req, res) => {
    try {
        let data  = await doctorService.sendRemedyService(req.body)
        res.status(200).json(data)
    }catch (e) {
        console.log(e);
        res.status(404).json({
            errCode: -1,
            errMsg: 'Error from server...'
        })
    }
}

let cancelPatient = async (req, res) => {
    try {
        let data  = await doctorService.cancelPatientService(req.body)
        res.status(200).json(data)
    }catch (e) {
        console.log(e);
        res.status(404).json({
            errCode: -1,
            errMsg: 'Error from server...'
        })
    }
}

let deletePatient = async (req, res) => {
    try {
        let data  = await doctorService.deletePatientService(req.query.id)
        res.status(200).json(data)
    }catch (e) {
        console.log(e);
        res.status(404).json({
            errCode: -1,
            errMsg: 'Error from server...'
        })
    }
}

module.exports = {
    getTopDoctor,
    getAllDoctors,
    saveDataDoctor,
    getDetailsDoctorById,
    bulkCreateSchedule,
    getScheduleByDate,
    getDoctorExtraInfor,
    getProfileDoctorById,
    getPatientInfor,
    sendRemedy,
    getPatientNoConfirm,
    cancelPatient,
    deletePatient,
    getPatientFinsished
}