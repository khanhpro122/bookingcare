import db from '../models/index'
require('dotenv').config()
import emailService from '../services/emailService'
import { v4 as uuidv4 } from 'uuid';

let buildUrlEmail = (doctorId, token) => {
    let result = ''
    result =  `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`
    return result
}

let postBookingService = (data) => {
    let token = uuidv4()
    return new Promise(async (resolve, reject) => {

        try {
            if(!data.email 
                || !data.doctorId 
                || !data.timeType 
                || !data.date
                || !data.address
                || !data.firstName
                || !data.lastName
                || !data.selectedGender.value
                || !data.phoneNumber
                || !data.reason

                ){
                resolve({
                    errCode: 1,
                    errMsg: 'Missing required parameter !'
                })
            }else {
                await emailService.sendSimpleEmail({
                    reciverEmail : data.email,
                    patientName : `${data.lastName} ${data.firstName}`,
                    time : data.timeString,
                    doctorName: data.doctorName,
                    redirectLink : buildUrlEmail(data.doctorId, token),
                    language: data.language
                })
                let user = await db.User.findOrCreate({
                    where: { 
                        email: data.email,
                    },
                    defaults: {
                      email: data.email,
                      roleId: 'R3',
                      firstName: data.firstName,
                      lastName: data.lastName,
                      address: data.address,
                      phoneNumber: data.phoneNumber,
                      gender: data.selectedGender.value,
                      reason: data.reason,
                      birthDate: data.birthDate
                    }
                });
                if(user && user[0]){
                    await db.Booking.findOrCreate({
                        where: {
                            patientId : user[0].id,
                            timeType: data.timeType,
                            date: data.date,
                        },
                        defaults: {
                            statusId: 'S1',
                            doctorId:data.doctorId,
                            patientId: user[0].id,
                            date: data.date,
                            timeType: data.timeType,
                            token : token
                          }
                    })
                    
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

let getAllPatientsByDoctorService = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!doctorId) {
                resolve({
                    errCode: 1,
                    errMsg: 'Missing required parameter !'
                })
            } else {
                let dataPatient = await db.Booking.findAll({
                    where: {
                        doctorId: doctorId,
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

let verifyBookingPatient = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!data.doctorId | !data.token) {
                resolve({
                    errCode: -1,
                    errMsg: 'Missing required parameter !'
                })
            }else {
                let bookingData = await db.Booking.findOne({
                    where :{
                        doctorId: data.doctorId,
                        token: data.token,
                        statusId: 'S1'
                    },
                    raw: false
                })
                if(bookingData) {
                    let schedule = await db.Schedule.findOne({
                        where :{
                            doctorId: bookingData.doctorId,
                            timeType: bookingData.timeType,
                            date: bookingData.date,
                        },
                        raw: false
                    })
                    if(schedule) {
                        schedule.statusId = 'S2'
                        await schedule.save()
                    }

                    bookingData.statusId = 'S2'
                    await bookingData.save()
                    resolve({
                        data: bookingData,
                        errCode: 0,
                        errMsg : 'Update the appointment success',
                    })
                }
                else {
                    resolve({
                        errCode: 10,
                        errMsg : 'Appointment has been actived or not exist'
                    })
                }
            }
        }catch (e) {
            reject(e);
        }
    })
}

// let checkVerifyMailService = (data) => {
//     console.log(data)
//     return new Promise(async (resolve, reject) => {
//         try {
//             if(!data) {
//                 resolve({
//                     errCode: -1,
//                     errMsg: 'Missing required parameter !'
//                 })
//             }else {
//                 let resS1 = await db.Booking.findOne({
//                     where: {
//                         doctorId: data.doctorId,
//                         token: data.token,
//                         statusId: 'S1'
//                     }
//                 })
//                 let resS2 = await db.Booking.findOne({
//                     where: {
//                         doctorId: data.doctorId,
//                         token: data.token,
//                         statusId: 'S2'
//                     }
//                 })
//                 if(resS1) {
//                     resolve({
//                         errCode: 0,
//                         errMsg: 'no confirm',
//                         status: 'noConfirmed'
//                     })
//                 }else if(resS2) {
//                     resolve({
//                         errCode: 0,
//                         errMsg: 'Confirmed',
//                         status: 'isConfirmed'
//                     })
//                 }else {
//                     resolve({
//                         errCode: 0,
//                         errMsg: 'Finished'
//                     })
//                 }
//             }
//         }catch (e) {
//             reject(e);
//         }
//     })
// }
module.exports = {
    postBookingService,
    verifyBookingPatient,
    getAllPatientsByDoctorService
    // checkVerifyMailService
}