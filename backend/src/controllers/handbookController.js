import handbookService from '../services/handbookService'

let createHandbook = async (req, res) => {
    try {
        let data = await handbookService.createHandbookService(req.body)
        res.status(200).json(data)
    }catch (e) {
        console.log(e)
        res.status(404).json({
            errCode: -1,
            errMsg: 'Error from server...'
        })
    }
}

let getAllHandBook = async (req, res) => {
    try {
        let data = await handbookService.getAllHandBookService()
        res.status(200).json(data)
    }catch (e) {
        console.log(e)
        res.status(404).json({
            errCode: -1,
            errMsg: 'Error from server...'
        })
    }
}

let getDetailsHandbookById = async (req, res) => {
    try {
        let data = await handbookService.getDetailsHandbookByIdService(req.query.id)
        res.status(200).json(data)
    }catch (e) {
        console.log(e)
        res.status(404).json({
            errCode: -1,
            errMsg: 'Error from server...'
        })
    }
}

let deleteHandbookById = async (req, res) => {
    try {
        let data = await handbookService.deleteHandbookByIdService(req.query.id)
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
    createHandbook,
    getAllHandBook,
    getDetailsHandbookById,
    deleteHandbookById
}