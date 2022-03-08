import specialtyService from '../services/specialtyService'

let createSpecialty = async (req, res) => {
    try {
        let info = await specialtyService.createSpecialtyService(req.body)
        res.status(200).json(info)
    }catch (e) {
        console.log(e)
        res.status(404).json({
            errCode: -1,
            errMsg: 'Error from server...'
        })
    }
}

let getAllSpecialty = async (req, res) => {
    try {
        let data = await specialtyService.getAllSpecialtyService()
        res.status(200).json(data)
    }catch (e){
        console.log(e)
        res.status(404).json({
            errCode: -1,
            errMsg: 'Error from server...'
        })
    }
}

let getDetailSpecialtyById = async (req, res) => {
    try {
        let data = await specialtyService.getDetailSpecialtyByIdService(req.query.id, req.query.location)
        res.status(200).json(data)
    }catch (e) {
        console.log(e)
        res.status(404).json({
            errCode: -1,
            errMsg: 'Error from server...'
        })
    }
}

let getDetailSpecialty = async (req, res) => {
    try {
        let data = await specialtyService.getDetailSpecialtyService(req.query.id)
        res.status(200).json(data)
    }catch (e) {
        console.log(e)
        res.status(404).json({
            errCode: -1,
            errMsg: 'Error from server...'
        })
    }
}

let deleteSpecialty =async (req, res) => {
    try{
        let data = await specialtyService.deleteSpecialtyService(req.query.id)
        res.json(data)
    }catch (e) {
        console.log(e)
        res.status(404).json({
            errCode: -1,
            errMsg: 'Error from server...'
        })
    }
}

module.exports = {
    createSpecialty,
    getAllSpecialty,
    getDetailSpecialtyById,
    getDetailSpecialty,
    deleteSpecialty
}