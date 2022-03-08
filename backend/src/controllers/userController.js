import userService from '../services/userService'

let loginUser = async (req, res) => {
    let email = req.body.email
    let password = req.body.password
    if(!email || !password){
        return res.status(500).json({
            errCode : 1,
            message : ' Missing input parameter'
        })
    }
    let userData = await userService.loginUser(email, password)
    return res.status(200).json({
        errCode : userData.errCode,
        message : userData.errMsg,
        user: userData.user ? userData.user : {},
    })
}

let handlegetAllUsers = async (req, res) => {
    let id = req.query.id
    if(!id) {
        return res.status(400).json({
            errCode : 0,
            message : 'Missing parameter ',
            users : []
        })
    }
    let users = await userService.getAllUsers(id)
    return res.status(200).json({
        errCode : 0,
        message : 'Ok',
        users
    })
}
let handleCreateUser = async (req, res) => {
    let data = await userService.createUser(req.body)
    return res.status(200).json({
        errCode: 0,
        message: 'OK',
        data
    })
}

let handleEditUser = async (req, res) => {
    let message = await userService.updateUser(req.body)
    return res.status(200).json({
        message
    })
}

let handleDeleteUser = async (req, res) => {
    if(req.body){
        let message = await userService.deleteUser(req.body.id)
        return res.status(200).json(message)
    }
    return res.status(200).json({
        message: 'This is not parameter'
    })
}

let getAllCode = async (req, res) => {
    
    try {
        let data = await userService.getAllCodeService(req.query.type)
        res.status(200).json(data)
    }catch (e) {
        res.status(404).json({
            errCode: -1,
            errMsg: "Can't connect server"
        })
    }
}


module.exports = {
    loginUser, 
    handlegetAllUsers,
    handleCreateUser,
    handleEditUser,
    handleDeleteUser,
    getAllCode
}