import patientService from '../services/patientService'

let postBookingPatient = async (req, res) => {
    try {
        let info = await patientService.postBookingService(req.body)
        res.status(200).json(info)
    }catch (e) {
        console.log(e)
        res.status(404).json({
            errCode: -1,
            errMsg: 'Error from server...'
        })
    }
}

let verifyBookingPatient = async (req, res) => {
    try {
        let data = await patientService.verifyBookingPatient(req.body)
        res.status(200).json(data)
    }catch(e) {
        console.log(e)
        res.status(404).json({
            errCode: -1,
            errMsg: 'Error from server...'
        })
    }
}

let getAllPatientsByDoctor = async (req, res) => {
    try {
        let data = await patientService.getAllPatientsByDoctorService(req.query.doctorId)
        res.status(200).json(data)
    }catch (e) {
        console.log(e)
        res.status(404).json({
            errCode: -1,
            errMsg: 'Error from server...'
        })
    }
}

module.exports = {
    postBookingPatient,
    verifyBookingPatient,
    getAllPatientsByDoctor
    // checkVerifyMail
}