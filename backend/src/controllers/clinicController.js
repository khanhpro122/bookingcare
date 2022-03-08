import clinicService from '../services/ClinicService'

let createClinic = async (req, res) => {
    try {
        let data = await clinicService.createClinicService(req.body)
        res.status(200).json(data)
    }catch (e){
        console.log(e)
        res.status(404).json({
            errCode: -1,
            errMsg: 'Error from server...'
        })
    }
}

let getAllClinic = async (req, res) => {
    try {
        let data = await clinicService.getAllClinicService()
        res.status(200).json(data)
    }catch (e) {
        console.log(e)
        res.status(404).json({
            errCode: -1,
            errMsg: 'Error from server...'
        })
    }
}

let getDetailClinicById = async (req, res) => {
    try {
        let data = await clinicService.getDetailClinicById(req.query.id)
        res.status(200).json(data)
    }catch (e) {
        console.log(e)
        res.status(404).json({
            errCode: -1,
            errMsg: 'Error from server...'
        })
    }
}

let deleteClinic = async (req, res) => {
    try {
        let data =  await clinicService.deleteClinicService(req.query.id)
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
    createClinic,
    getAllClinic,
    getDetailClinicById,
    deleteClinic
}