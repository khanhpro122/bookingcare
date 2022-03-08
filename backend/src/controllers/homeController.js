import db from '../models/index';
import CRUDService from '../services/CRUDService'

let getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll();
        return res.render('homePage.ejs');
    }catch (err) {
        console.log(err)
    }
}
let getCrudPage = (req, res) => {
    return res.render('crud.ejs')
}
let postCRUD = async (req, res) => {
    let message = await CRUDService.createNewUser(req.body)
    return res.send('Crud successfully')
}
let displayCRUD = async (req, res) => {
    let data = await CRUDService.getAllUser()
    return res.render('getAllUser.ejs', {users: data})
}
let editCRUD = async (req, res) => {
    let userId = req.query.id
    if(userId){
        let userData = await CRUDService.getUserById(userId)
        return res.render('edit.ejs', {userData: userData})
    }
    else {
        return res.send('User not found')
    }
}

let updateData = async (req, res) => {
    let data = req.body
    let allUsers = await CRUDService.postCRUD(data)
    return res.render('getAllUser.ejs', {
        users: allUsers
    })

}
let deleteCRUD = async (req, res) => {
    let id = req.query.id
    await CRUDService.deleteCRUD(id)
    return res.send('delete success')
}

module.exports = {
    getHomePage, getCrudPage,postCRUD,displayCRUD,editCRUD,updateData,deleteCRUD
}