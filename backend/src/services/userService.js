import bcrypt from 'bcrypt'
import db from '../models/index'
require('dotenv').config();
import jwt from 'jsonwebtoken'

const loginUser = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {}
            let isExist = await checkEmail(email)
            if(isExist) {
                let user = await db.User.findOne({ 
                    attributes: ['id','email', 'password','roleId', 'firstName', 'lastName'],
                    where: { email: email},
                    raw: true
                })
                if(user) {
                    let check = await bcrypt.compareSync(password, user.password)
                       
                    if(check) {
                        
                        userData.errCode = 0,
                        userData.errMsg = 'OK',
                        delete user.password
                        userData.user = user
                    }else {
                        userData.errCode = 3,
                        userData.errMsg = 'Password is incorrect'
                    }
                }else {
                    userData.errCode = 2,
                    userData.errMsg = 'User is not found'
                }
            }else{
                userData.errCode = 1,
                userData.errMsg = `Your's email is not exist, please try again with other email`
            }
            resolve(userData)
        }catch(err) {
            reject(err)
        }
    })
}

const checkEmail = (emailUser) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({ 
                where: { email: emailUser}
            })
            if(user){
                resolve(true)
            }else {
                resolve(false)
            }
        }catch (err) {
            reject(err)
        }
    })
}

const getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        let users = ''
        try {
            if(userId === 'All') {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    },
                    raw: true
                })
            }
            if(userId && userId !== 'All') {
                users = await db.User.findOne({
                    attributes: {
                        exclude: ['password']
                    },
                    raw: true,
                    where: {id : userId}
                })
            }
            resolve(users)
        }catch(e) {
            reject(e)
        }
    })
}

const salt = bcrypt.genSaltSync(10);
let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            var hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword)
        }catch(e) {
            reject(e)
        }
    })
}

const createUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let check = await checkEmail(data.email)
            if(check) {
                resolve({
                    errCode: 1,
                    errMsg: 'User is already registered'
                })
            }else {
                let hashPasswordFromBcrypt = await hashUserPassword(data.password)
                await db.User.create({
                    email: data.email,
                    password: hashPasswordFromBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phoneNumber: data.phoneNumber,
                    gender: data.gender,
                    roleId: data.roleId,
                    positionId: data.positionId,
                    image: data.avatar
                })
                resolve({
                    errCode : 0,
                    errMsg: 'OK'
                })
            }
        }catch(e) {
            reject(e)
        }
    })
}

const deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {id: userId}
            })
            if(!user) {
                resolve({
                    errCode: 1,
                    errMsg: 'User is not found'
                })
            }
            await db.User.destroy({
                where: {id: userId}
            })
            resolve({
                errCode: 0,
                errMsg: 'Delete successfully'
            })
        }catch (e) {
            reject(e)
        }
    })
}

const updateUser = (data) => {
    return new Promise( async (resolve, reject) => {
        try {
            if(!data.id){
                resolve({
                    errCode: 2,
                    errMsg: 'This is not parameters'
                })
            }
            let user = await db.User.findOne({
                where: {id : data.id},
                raw : false
            })
            if(user) {
                user.address = data.address,
                user.firstName = data.firstName,
                user.lastName = data.lastName,
                user.roleId = data.roleId,
                user.gender = data.gender,
                user.positionId = data.positionId,
                user.phoneNumber = data.phoneNumber;
                if(user.image) {
                    user.image = data.avatar
                }
                await user.save()
                resolve({
                    errCode: 0,
                    errMsg: 'Update sucesss'
                })
            }else {
                resolve({
                    errCode: 1,
                    errMsg: 'User is not define'
                })
            }

        }catch(e) {
            reject(e)
        }
    })
}

const getAllCodeService = (inputType) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!inputType) {
                resolve({
                    errCode: 1,
                    errMsg: 'Missing required parameter !'
                })
            }else {
                let res = {}
                let allCodes = await db.Allcode.findAll({
                    where: {type: inputType}
                })
                res.errCode = 0;
                res.data = allCodes
                resolve(res)
            }
        }catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    checkEmail, loginUser, getAllUsers,createUser,deleteUser,updateUser,getAllCodeService
}