import db from '../models/index'


let createSpecialtyService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!data.name 
               || !data.imgBase64
               || !data.descriptionMarkdown
               || !data.descriptionHTML
            ) {
                resolve({
                    errCode : -1,
                    errMsg : 'Missing required parameter !'
                })
            }else {
                if(data.action === 'CREATE') {
                    await db.Specialty.create({
                        name : data.name,
                        descriptionMarkdown : data.descriptionMarkdown,
                        descriptionHTML :data.descriptionHTML,
                        image : data.imgBase64
                    })
                }
                if(data.action === 'EDIT') {
                    let specialtyData = await db.Specialty.findOne({
                        where : {
                            id: data.specialtyId
                        },
                        raw: false
                    })
                    if(specialtyData) {
                        specialtyData.name = data.name,
                        specialtyData.descriptionMarkdown = data.descriptionMarkdown,
                        specialtyData.descriptionHTML = data.descriptionHTML,
                        specialtyData.image = data.imgBase64
                        specialtyData.save()
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

let getAllSpecialtyService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Specialty.findAll()
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

let getDetailSpecialtyByIdService = (inputId, location) => {
    return new Promise(async (resolve, reject) => {
        let data = {}
        try {
            if(!inputId || !location) {
                resolve({
                    errCode: '-1',
                    errMsg: 'Invalid missing parameter!!!'
                })
            }else {
                data = await db.Specialty.findOne({
                    where: {id : inputId },
                    attributes: ['descriptionMarkdown', 'descriptionHTML'],
                })
                if(data) {
                    let doctorSpecialty = []
                    if(location === 'ALL') {
                        doctorSpecialty = await db.Doctor_Infor.findAll({
                            where: {
                                specialtyId : inputId
                            },
                            attributes: ['doctorId', 'provinceId'],
                        })
                    }else {
                        doctorSpecialty = await db.Doctor_Infor.findAll({
                            where: {
                                specialtyId : inputId,
                                provinceId : location
                            },
                            attributes: ['doctorId', 'provinceId'],
                        })
                    }
                    data.doctorSpecialty = doctorSpecialty
                }
                else {
                    data = {}
                }
                resolve({
                    data,
                    errCode: 0,
                    errMsg: 'Ok!'
                })
            }
        }catch (e) {
            reject(e);
        }
    })
}

let getDetailSpecialtyService = (id) => {
    return new Promise(async (resolve, reject) => {
        let dataInfo
        try {
            if(!id) {
                resolve({
                    errCode: -1,
                    errMsg: 'Missing required parameter !s'
                })
            }else {
                dataInfo = await db.Specialty.findOne({
                    where: {
                        id: id
                    }
                })
                if(!dataInfo) return dataInfo = []
                if(dataInfo) {
                    dataInfo = dataInfo
                } 
                resolve({
                    data : dataInfo,
                    errCode: 0,
                    errMsg: 'Ok!'
                })
            }
        }catch (e) {
            reject(e);
        }
    })
}

let deleteSpecialtyService = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!id) {
                resolve({
                    errCode: -1,
                    errMsg: 'Missing required parameter !'
                })
            }else {
                let specialty = await db.Specialty.findOne({
                    where: {
                        id: id
                    }
                })
                if(specialty) {
                    await db.Specialty.destroy({
                        where: { id: id}
                    })
                }
                resolve({
                    errCode: 0,
                    errMsg:'OK'
                })
            }
        }catch (e) {
            reject(e);
        }
    })
}
module.exports = {
    createSpecialtyService,
    getAllSpecialtyService,
    getDetailSpecialtyByIdService,
    getDetailSpecialtyService,
    deleteSpecialtyService
}