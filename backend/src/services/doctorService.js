import db from '../models/index'
require('dotenv').config()
const MAX_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE
import _ from 'lodash'
import { sendSimpleEmailRemedy } from './emailService'

let getTopDoctorHome= (limitInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({ 
                limit: limitInput,
                where: {
                    roleId: 'R2'
                },
                order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
                    { 
                        model: db.Doctor_Infor,  
                        attributes: {
                            exclude: ['id', 'doctorId']
                        },include: [
                            { model: db.Specialty, as: 'specialtyData', attributes: ['name'] },
                        ],
                        
                    },
                ],
                raw: false,
                nest: true,
            },)
            resolve({
                errCode: 0,
                data: users
            })
        }catch (e) {
            reject(e);
        }
    })
}
let getAllDoctorServices = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: {roleId: 'R2'},
                attributes: {
                    exclude: ['password']
                },include: [
                    { 
                        model: db.Doctor_Infor,  
                        attributes: {
                            exclude: ['id', 'doctorId']
                        },include: [
                            { model: db.Specialty, as: 'specialtyData', attributes: ['name'] },
                        ],
                        
                    },
                ],
                raw: false,
                nest: true,
            })
            resolve({
                errCode : 0,
                data: doctors
            })
        }catch (e) {
            reject(e);
        }
    })
}

let saveDataDoctorServices = (inputData) => {
    return new Promise(async (resolve, reject) => {
       
        try {
            if(!inputData.contentHTML 
                || !inputData.contentMarkdown 
                || !inputData.doctorId 
                || !inputData.action
                || !inputData.selectedPrice
                || !inputData.selectedPayment
                || !inputData.selectedProvince
                || !inputData.addressClinic
                || !inputData.selectedSpecialty
                || !inputData.selectedClinic
                ) {
                resolve({
                    errCode: 1,
                    errMsg: 'Mising parameter!!!'
                })
            }else {
                if(inputData.action === 'CREATE') {
                    await db.Markdown.create({
                        contentHTML : inputData.contentHTML,
                        contentMarkdown : inputData.contentMarkdown,
                        doctorId : inputData.doctorId,
                        description : inputData.description,
                    })
                }else if(inputData.action === 'EDIT') {
                    let dataMarkdown = await db.Markdown.findOne({
                        where: {
                            doctorId: inputData.doctorId,
                        },
                        raw: false
                    })
                    dataMarkdown.contentHTML = inputData.contentHTML
                    dataMarkdown.contentMarkdown = inputData.contentMarkdown
                    dataMarkdown.description = inputData.description
                    await dataMarkdown.save();
                }

                let inforDoctor = await db.Doctor_Infor.findOne({
                    where: {
                        doctorId: inputData.doctorId
                    },
                    raw: false,
                })
                if(inforDoctor) {
                    inforDoctor.priceId = inputData.selectedPrice
                    inforDoctor.provinceId = inputData.selectedProvince
                    inforDoctor.paymentId = inputData.paymentId
                    inforDoctor.specialtyId = inputData.selectedSpecialty
                    inforDoctor.addressClinic = inputData.addressClinic
                    inforDoctor.nameClinic = inputData.nameClinic
                    inforDoctor.note = inputData.note
                    inforDoctor.clinicId = inputData.selectedClinic
                    await inforDoctor.save();
                }else {
                    await db.Doctor_Infor.create({
                        doctorId: inputData.doctorId,
                        priceId : inputData.selectedPrice,
                        provinceId : inputData.selectedProvince,
                        specialtyId : inputData.selectedSpecialty,
                        paymentId : inputData.selectedPayment,
                        addressClinic : inputData.addressClinic,
                        nameClinic : inputData.nameClinic,
                        clinicId : inputData.selectedClinic,
                        note : inputData.note,
                    })
                }
                resolve({
                    errCode : 0,
                    errMsg: 'OK!'
                })
            }
        }
        catch(e) {
            reject(e);
        }
    })
}


let getDetailsDoctorById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!inputId) {
                resolve({
                    errCode: -1,
                    errMsg: 'Missing required parameter!!!'
                })
            }else {
                let data = await db.User.findOne({
                    where: {id: inputId},
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        { model: db.Markdown, attributes: ['contentHTML', 'contentMarkdown', 'description']},
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                        { 
                            model: db.Doctor_Infor,  
                            attributes: {
                                exclude: ['id', 'doctorId']
                            },include: [
                                { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Specialty, as: 'specialtyData', attributes: ['name'] },
                            ],
                            
                        },
                        
                    ],
                    raw: false,
                    nest: true,
                })
                if(data && data.image) {
                    data.image = Buffer(data.image, 'base64').toString('binary');
                }
                if(!data) data = {};
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        }catch(e) {
            reject(e);
        }
    })
}

let bulkCreateScheduleServive = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!data.arrSchedules | !data.doctorId  | !data.date) {
                resolve({
                    errCode: '-1',
                    errMsg: 'Missing parameter!!!'
                })
            }else {
                let schedule = data.arrSchedules
                if(schedule && schedule.length > 0){
                    schedule = schedule.map(item => {
                        item.maxNumber = MAX_SCHEDULE
                        return item
                    })
                }
                let existing = await db.Schedule.findAll({
                    where: {doctorId : data.doctorId, date: data.date},
                    attributes: ['timeType', 'date', 'maxNumber', 'doctorId'],
                    raw: true,
                })
                
                let toCreate = _.differenceWith(schedule, existing, (a,b) => {
                    return a.timeType === b.timeType && Number(a.date) === Number(b.date)
                })                
                if(toCreate && toCreate.length > 0) {
                   let data =  await db.Schedule.bulkCreate(toCreate)
                }
                resolve({
                    errCode: 0,
                    errMsg: 'Ok',
                    data: data
                });
            }
        }catch(e) {
            reject(e);
        }
    })
}

let getScheduleByDateService = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!doctorId | !date) {
                resolve({
                    errCode: 1,
                    errMsg: 'Missing required parameter !'
                })
            }else {
                let dataSchedule = await db.Schedule.findAll({
                    where: {
                        doctorId: doctorId,
                        date: date,
                        statusId: 'S1'
                    },
                    include: [
                        { model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.User, as: 'doctorData', attributes: ['firstName', 'lastName'] },
                    ],
                    raw: false,
                    nest: true,
                })
                if(!dataSchedule) {
                    dataSchedule = []
                }
                resolve({
                    errCode: 0,
                    data: dataSchedule
                })
                
            }
        }catch (e) {
            reject(e);
        }
    })
}

let getDoctorExtraInforService = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!doctorId) {
                resolve({
                    errCode: -1,
                    errMsg: 'Missing required parameter !'
                })
            }else {
                let data = await db.Doctor_Infor.findOne({
                    where: {
                        doctorId:doctorId
                    },attributes: {
                        exclude: ['id', 'doctorId']
                    },include: [
                        { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },
                    ],
                    raw: false,
                    nest: true,
                })
                if(!data) {
                    data = []
                }
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        }catch (e) {
            reject(e);
        }
       
    })
}

let getProfileDoctorByIdService = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!doctorId) {
                resolve({
                    errCode: 1,
                    errMsg: 'Missing required parameter !'
                })
            }else {
                let data = await db.User.findOne({
                    where: {id: doctorId},
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        { model: db.Markdown, attributes: ['contentHTML', 'contentMarkdown', 'description']},
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                        { 
                            model: db.Doctor_Infor,  
                            attributes: {
                                exclude: ['password']
                            },include: [
                                { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },
                            ],
                            
                        },
                        
                    ],
                    raw: false,
                    nest: true,
                })
                if(data && data.image) {
                    data.image = Buffer(data.image, 'base64').toString('binary');
                }
                if(!data) data = {};
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        }catch (e) {
            reject(e);
        }
    })
}

let getPatientInforService = (doctorId, date ) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!doctorId | !date) {
                resolve({
                    errCode: -1,
                    errMsg: 'Missing required parameter !'
                })
            }else {
                let dataPatient = await db.Booking.findAll({
                    where: {
                        doctorId: doctorId,
                        date: date,
                        statusId: 'S2'
                    },
                    include: [
                        { 
                            model: db.User, as: 'patientData', 
                            attributes: ['firstName', 'lastName','address', 'gender','phoneNumber', 'reason', 'email','birthDate'] 
                            ,include: [
                                { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
                            ],
                        },
                        { 
                            model: db.Allcode, as: 'timeTypeDataPatient', attributes: ['valueEn', 'valueVi'] 
                        },
                        
                    ],
                    raw: false,
                    nest: true,
                })
                if(!dataPatient) {
                    dataPatient = []
                }
                resolve({
                    errCode: 0,
                    data: dataPatient
                })
            }
        }catch (e) {
            reject(e);
        }
    })
} 


let sendRemedyService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!data.doctorId
                |!data.patientId
                |!data.email
                |!data.timeType
            ){
                resolve({
                    errCode: 1,
                    errMsg: 'Missing required parameter !'
                })
            }else {
                let appointment = await db.Booking.findOne({
                    where : {
                        statusId: 'S2',
                        patientId: data.patientId,
                        timeType: data.timeType,
                        doctorId : data.doctorId
                    },
                    raw: false,
                })
                if(appointment) {
                    appointment.statusId = 'S3'
                    await appointment.save()
                    await sendSimpleEmailRemedy(data)
                }
                else {
                    resolve({
                        errCode: 0,
                        errMsg: 'No appointment found'
                    })
                    return
                }
                resolve({
                    errCode: 0,
                    errMsg: 'Ok'
                })
            }
        }catch (e) {
            reject(e);
        }
    })
}

let getPatientNoConfirmService = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!doctorId | !date) {
                resolve({
                    errCode: -1,
                    errMsg: 'Missing required parameter !'
                })
            }else {
                let dataPatient = await db.Booking.findAll({
                    where: {
                        doctorId: doctorId,
                        date: date,
                        statusId: 'S1'
                    },
                    include: [
                        { 
                            model: db.User, as: 'patientData', 
                            attributes: ['firstName', 'lastName','address', 'gender','phoneNumber', 'reason', 'email','birthDate'] 
                            ,include: [
                                { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
                            ],
                        },
                        { 
                            model: db.Allcode, as: 'timeTypeDataPatient', attributes: ['valueEn', 'valueVi'] 
                        },
                        
                    ],
                    raw: false,
                    nest: true,
                })
                if(!dataPatient) {
                    dataPatient = []
                }
                resolve({
                    errCode: 0,
                    data: dataPatient
                })
            }
        }catch (e) {
            reject(e);
        }
    })
}

let getPatientFinsishedService = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!doctorId | !date) {
                resolve({
                    errCode: -1,
                    errMsg: 'Missing required parameter !'
                })
            }else {
                let dataPatient = await db.Booking.findAll({
                    where: {
                        doctorId: doctorId,
                        date: date,
                        statusId: 'S3'
                    },
                    include: [
                        { 
                            model: db.User, as: 'patientData', 
                            attributes: ['firstName', 'lastName','address', 'gender','phoneNumber', 'reason', 'email','birthDate'] 
                            ,include: [
                                { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
                            ],
                        },
                        { 
                            model: db.Allcode, as: 'timeTypeDataPatient', attributes: ['valueEn', 'valueVi'] 
                        },
                        
                    ],
                    raw: false,
                    nest: true,
                })
                if(!dataPatient) {
                    dataPatient = []
                }
                resolve({
                    errCode: 0,
                    data: dataPatient
                })
            }
        }catch (e) {
            reject(e);
        }
    })
}

let cancelPatientService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!data.doctorId | !data.date) {
                resolve({
                    errCode: -1,
                    errMsg: 'Missing required parameter !'
                })
            }else {
                let booking = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        date: data.date,
                        statusId: 'S2'
                    },
                    raw: false
                })
                let schedule = await db.Schedule.findOne({
                    where: {
                        doctorId: data.doctorId,
                        date: data.date,
                        statusId: 'S2'
                    },
                    raw: false
                })
                if(booking) {
                    booking.statusId = 'S1'
                    booking.save()
                }
                if(schedule) {
                    schedule.statusId = 'S1'
                    schedule.save()
                }
                resolve({
                    errCode: 0,
                    errMsg: 'OK'
                })
            }
        }catch (e) {
            reject(e);
        }
    })
}

let deletePatientService = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!id) {
                resolve({
                    errCode: -1,
                    errMsg: 'Missing required parameter !'
                })
            }else {
                let booking = await db.Booking.findOne({
                    where: {
                        id: id
                    }
                })
                if(!booking){
                    resolve({
                        errCode: -1,
                        errMsg: 'Booking not found'
                    })
                }else {
                    await db.Booking.destroy({
                        where: {id: id}
                    })
                    resolve({
                        errCode: 0,
                        errMsg: 'OK!'
                    })
                }
            }
        }catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    getTopDoctorHome, 
    getAllDoctorServices, 
    saveDataDoctorServices, 
    getDetailsDoctorById,
    bulkCreateScheduleServive,
    getScheduleByDateService,
    getDoctorExtraInforService,
    getProfileDoctorByIdService,
    getPatientInforService,
    sendRemedyService,
    getPatientNoConfirmService,
    cancelPatientService,
    deletePatientService,
    getPatientFinsishedService
}