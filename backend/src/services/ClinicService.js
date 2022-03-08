import db from '../models/index'

let createClinicService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if( !data.name 
                || !data.address 
                || !data.descriptionHTML
                || !data.descriptionMarkdown
            ) {
                resolve({
                    errCode: 1,
                    errMsg: 'Missing required parameter !'
                })
            } else {
                if(data.action === 'CREATE') {
                    await db.Clinic.create({
                        name : data.name,
                        address	: data.address,
                        descriptionMarkdown	: data.descriptionMarkdown,
                        descriptionHTML	: data.descriptionHTML,
                        image : data.image
                    })
                }if(data.action === 'EDIT') {
                    let dataClinic = await db.Clinic.findOne({
                        where: {
                            id: data.clinicId,
                        },
                        raw: false
                    })
                    dataClinic.name = data.name,
                    dataClinic.address = data.address,
                    dataClinic.descriptionMarkdown = data.descriptionMarkdown,
                    dataClinic.descriptionHTML	= data.descriptionHTML,
                    dataClinic.image = data.image
                    dataClinic.save()
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

let getAllClinicService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Clinic.findAll()
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

let getDetailClinicById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        let data = {}
        try {
            if(!inputId) {
                resolve({
                    errCode: '-1',
                    errMsg: 'Invalid missing parameter!!!'
                })
            }else {
                data = await db.Clinic.findOne({
                    where: {id : inputId },
                    attributes: ['descriptionMarkdown', 'descriptionHTML', 'name', 'address', 'image'],
                })
                if(data) {
                    let doctorClinic = []
                    
                    doctorClinic = await db.Doctor_Infor.findAll({
                        where: {
                            clinicId : inputId
                        },
                        attributes: ['doctorId', 'provinceId'],
                    })
                    data.doctorClinic = doctorClinic
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

let deleteClinicService = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!id) {
                resolve({
                    errCode: 1,
                    errMsg: 'Missing required parameter !'
                })
            }else {
                let dataClinic = await db.Clinic.findOne({
                    where: {
                        id: id
                    },
                    // raw: false
                })
                if(dataClinic) {
                    await db.Clinic.destroy({
                        where: { id: id}
                    })
                    resolve({
                        errCode: 0,
                        errMsg: 'Ok'
                    })
                }
                if(!dataClinic) return
            }
        }catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    createClinicService,
    getAllClinicService,
    getDetailClinicById,
    deleteClinicService
}