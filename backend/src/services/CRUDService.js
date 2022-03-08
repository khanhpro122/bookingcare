import bcrypt from 'bcryptjs';
import db from '../models/index'

const salt = bcrypt.genSaltSync(10);

let createNewUser = async (data) => {
    return new Promise( async(resolve, reject) => {
        try {
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
                positionId: data.position,
            })
            resolve('create new user successfully')
        }
        catch (err) {
            reject(err)
        }
    })
}

let getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                raw: true
            })
            resolve(users)
        }catch(e) {
            reject(e)
        }
    })
}

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

let getUserById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = await db.User.findOne({
                where: { id: userId },raw: true
            })
            if(userData) {
                resolve(userData)
            }else {
                resolve([])
            }
        }catch(e) {
            reject(e)
        }
    })
}
let postCRUD = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {id: data.id}
            })
            if(user) {
                user.firstName = data.firstName,
                user.lastName = data.lastName
                user.email = data.email,
                await user.save()
                let allUsers = await db.User.findAll()
                resolve(allUsers)
            }
            else {
                resolve()
            }
        }catch(e) {
            reject(e)
        }
    })
}

let deleteCRUD = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: id}
            })
            if(user) {
                await db.user.destroy({
                    where: { id: id}
                })
                resolve()
            }
        }catch(err) {
           reject(err)
        }
    })
}

module.exports = {
    createNewUser,getAllUser, getUserById,postCRUD,deleteCRUD
}