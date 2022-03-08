import db from '../models/index'


let createHandbookService = (data) => {
    console.log()
    return new Promise(async (resolve, reject) => {
        try {
            if(
                !data.name 
                | !data.censor 
                | !data.author
                | !data.descriptionMarkdown	
                | !data.descriptionHTML
                | !data.imgBase64
            ){
                resolve({
                    errCode: -1,
                    errMsg: 'Missing required parameter !'
                })
            }else {
                if(data.action === 'CREATE') {
                    await db.HandBook.create({
                        name : data.name,
                        author : data.author,
                        censor : data.censor,
                        descriptionMarkdown : data.descriptionMarkdown,
                        descriptionHTML :data.descriptionHTML,
                        image : data.imgBase64
                    })
                }
                if(data.action === 'EDIT') {
                    let handbookData = await db.HandBook.findOne({
                        where : {
                            id: data.handbookId
                        },
                        raw: false
                    })
                    if(handbookData) {
                        handbookData.name = data.name,
                        handbookData.author = data.name,
                        handbookData.censor = data.name,
                        handbookData.descriptionMarkdown = data.descriptionMarkdown,
                        handbookData.descriptionHTML = data.descriptionHTML,
                        handbookData.image = data.imgBase64
                        handbookData.save()
                    }
                }
                resolve({
                    errCode: 0,
                    errMsg: 'OK!'
                })
            }
        }catch (e) {
            reject(e);
        }
    })
}

let getAllHandBookService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.HandBook.findAll()
            if(data && data.length > 0) {
                data = data.map(item => {
                    item.image = Buffer(item.image, 'base64').toString('binary');
                    return item
                })
            }else {
                data = []
            }
            resolve({
                errCode: 0,
                errMsg: 'OK!',
                data: data
            })
        }catch (e) {
            reject(e);
        }
    })
}

let getDetailsHandbookByIdService = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!id) {
                resolve({
                    errCode: -1,
                    errMsg: 'Missing required parameter !s'
                })
            }else {
                let data = await db.HandBook.findOne({
                    where: {
                        id: id
                    }
                })
                if(!data) data = []
                resolve({
                    errCode: 0,
                    data : data
                })
            }
        }catch (e) {
            reject(e);
        }
    })
}

let deleteHandbookByIdService = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!id) {
                resolve({
                    errCode: -1,
                    errMsg: 'Missing required parameter !s'
                })
            }else {
                let data = await db.HandBook.findOne({
                    where: {
                        id: id
                    }
                })
                if(data) {
                    await db.HandBook.destroy({
                        where: { id: id}
                    })
                    resolve({
                        errCode: 0,
                        errMsg: 'Ok'
                    })
                }
                resolve({
                    errCode: 0,
                    errMsg : 'OK'
                })
            }
        }catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    createHandbookService,
    getAllHandBookService,
    getDetailsHandbookByIdService,
    deleteHandbookByIdService
}