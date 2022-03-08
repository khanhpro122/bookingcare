import actionTypes from './actionTypes';
import { 
    getAllCode, 
    createUserService, 
    getAllUsers, 
    deleteUserService,
    updateUserService,
    getTopDoctor, 
    getAllDoctor,
    saveDetailsDoctor,
    getDetailsDoctor,
    getAllSpecialty,
    getAllClinic,
    getAllHandBook,
    getSheduleByDate,
    getPatientFinsished,
    getPatientNoConfirm,
    getPatientInfor,
    getAllPatients
    
} from '../../services/userService';
import { toast } from 'react-toastify';

// export const fetchGenderUser = () => ({
//     type: actionTypes.FETCH_GENDER_USER
// });
export const fetchGenderUser = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({
                type: actionTypes.FETCH_GENDER_USER
            })
            let res = await getAllCode("gender")
            if(res && res.errCode === 0) {
                dispatch(fetchGenderSuccess(res.data))
            }else {
                dispatch(fetchGenderFailed())
            }
        }catch(e) {
            dispatch(fetchGenderFailed())
        }
    }
}

export const fetchGenderSuccess = (genderData) => ({
    type: actionTypes.FETCH_GENDER_SUCCESS,
    data : genderData
});
export const fetchGenderFailed = () => ({
    type: actionTypes.FETCH_GENDER_FAILED
});


export const fetchPositionUser = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllCode("POSITION")
            if(res && res.errCode === 0) {
                dispatch(fetchPositionSuccess(res.data))
            }else {
                dispatch(fetchPositionFailed())
            }
        }catch(e) {
            dispatch(fetchPositionFailed())
        }
    }
}
export const fetchPositionSuccess = (positionData) => ({
    type: actionTypes.FETCH_POSITION_SUCCESS,
    data : positionData
});
export const fetchPositionFailed = () => ({
    type: actionTypes.FETCH_POSITION_FAILED
});


export const fetchRoleUser = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllCode("role")
            if(res && res.errCode === 0) {
                dispatch(fetchRoleSuccess(res.data))
            }else {
                dispatch(fetchRoleFailed())
            }
        }catch(e) {
            dispatch(fetchRoleFailed())
        }
    }
}

export const fetchRoleSuccess = (roleData) => ({
    type: actionTypes.FETCH_ROLE_SUCCESS,
    data : roleData
});
export const fetchRoleFailed = () => ({
    type: actionTypes.FETCH_ROLE_FAILED
});

export const createUserRedux = (data) => {
    return async (dispatch, getState) => {
        try {
            console.log(data)
            let res = await createUserService(data)
            
            if(res && res.data.errCode === 0) {
                dispatch(createUserSuccess())
                dispatch(fetchGetAllUsers())
                toast.success('Thêm thành công!!!')
            }else {
                dispatch(createUserFailed())
                toast.error('Thêm thất bại!!!')
            }
        }catch(e) {
            dispatch(createUserFailed())
            toast.error('Thêm thất bại!!!')
        }
    }
}

export const createUserSuccess = () => ({
    type: actionTypes.CREATE_USER_SUCCESS
})

export const createUserFailed = () => ({
    type: actionTypes.CREATE_USER_FAILED
})

export const fetchGetAllUsers = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllUsers('All')
            if(res && res.errCode === 0) {
                dispatch(getAllUserSuccess(res.users.reverse()))
            }else {
                dispatch(createUserFailed())
            }
        }catch(e) {
            dispatch(createUserFailed())    
        }
    }
}
export const getAllUserSuccess = (data) =>({
    type: actionTypes.FETCH_GET_ALL_SUCCESS,
    users : data
})
export const getAllUserFailed = () => ({
    type: actionTypes.FETCH_GET_ALL_FAILED,
})


export const fetchDeleteUser = (userId) => {
    return async (dispatch, getState) => {
        try {
            let res = await deleteUserService(userId)
            if(res && res.errCode === 0) {
                dispatch(deleteUserSuccess())
                dispatch(fetchGetAllUsers())
                toast.success('Xóa thành công!!!')
            }else {
                dispatch(createUserFailed())
                toast.error('Xóa thất bại!!!')
            }
        }catch(e) {
            dispatch(createUserFailed())    
        }
    }
}
export const deleteUserSuccess = (data) =>({
    type: actionTypes.DELETE_USER_SUCCESS,
    users : data
})
export const deleteUserFailed = () => ({
    type: actionTypes.DELETE_USER_FAILED,
})


export const fetchEditUser = (user) => {
    return async (dispatch, getState) => {
        try {
            let res = await updateUserService(user)
            if(res && res.message.errCode === 0) {
                dispatch(editUserSuccess())
                dispatch(fetchGetAllUsers())
                toast.success('Sửa thành công!!!')
            }else {
                dispatch(editUserFailed())
                toast.error('Sửa thất bại!!!')
            }
        }catch(e) {
            dispatch(editUserFailed())    
        }
    }
}

export const editUserSuccess = () =>({
    type: actionTypes.EDIT_USER_SUCCESS,
})
export const editUserFailed = () => ({
    type: actionTypes.EDIT_USER_FAILED,
})

export const fetchTopDoctor = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getTopDoctor('')
            if(res && res.errCode === 0) {
                dispatch({
                    type : actionTypes.FETCH_TOP_DOCTOR_SUCCESS,
                    dataDoctor : res.data
                })    
            }
            }catch(e) {
            dispatch({
                type: actionTypes.FETCH_TOP_DOCTOR_FAILED,
            })    
        }
    }
}

export const fetchAllDoctor = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllDoctor()
            if(res && res.errCode === 0) {
                dispatch({
                    type : actionTypes.FETCH_ALL_DOCTOR_SUCCESS,
                    listDoctor : res.data
                })    
            }
            }catch(e) {
            dispatch({
                type: actionTypes.FETCH_ALL_DOCTOR_FAILED,
            })    
        }
    }
}

export const saveDoctors = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await saveDetailsDoctor(data)
            if(res && res.errCode === 0) {
                toast.success('Lưu thành công')
                dispatch({
                    type : actionTypes.SAVE_DETAILS_DOCTOR_SUCCESS,
                })    
            }else {
                toast.error('Lưu thất bại')
                dispatch({
                    type: actionTypes.SAVE_DETAILS_DOCTOR_FAILED,
                }) 
            }
            }catch(e) {
            toast.error('Lưu thất bại')
            dispatch({
                type: actionTypes.SAVE_DETAILS_DOCTOR_FAILED,
            })    
        }
    }
}

export const fetchDetailsDoctor = (inputId) => {
    return async (dispatch, getState) => {
        try {
            let res = await getDetailsDoctor(inputId);
            if(res && res.errCode === 0) {
                dispatch({
                    type : actionTypes.GET_DETAILS_DOCTOR_SUCCESS,
                    data: res.data
                })    
            }else {
                dispatch({
                    type: actionTypes.GET_DETAILS_DOCTOR_FAILED,
                }) 
            }
            }catch(e) {
            dispatch({
                type: actionTypes.GET_DETAILS_DOCTOR_FAILED,
            })    
        }
    }
}

export const getAllCodeTime = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllCode('TIME');
            if(res && res.errCode === 0) {
                dispatch({
                    type : actionTypes.GET_ALL_CODE_TIME_SUCCESS,
                    data: res.data
                })    
            }else {
                dispatch({
                    type: actionTypes.GET_ALL_CODE_TIME_FAILED,
                }) 
            }
            }catch(e) {
            dispatch({
                type: actionTypes.GET_ALL_CODE_TIME_FAILED,
            })    
        }
    }
}

export const fetchAllRequiredDoctorInfor = () => {
    return async (dispatch, getState) => {
        try {
            let resPrice = await getAllCode('PRICE');
            let resPayment = await getAllCode('PAYMENT');
            let resProvince = await getAllCode('PROVINCE');
            let resSpecialty = await getAllSpecialty()
            let resClinic = await getAllClinic()

            if(resPrice && resPrice.errCode === 0
                && resPayment && resPayment.errCode === 0
                && resProvince && resProvince.errCode === 0
                && resSpecialty && resSpecialty.errCode === 0
                && resClinic && resClinic.errCode === 0
                ) 
            {
                let data = {
                    resPrice : resPrice.data,
                    resPayment : resPayment.data,
                    resProvince : resProvince.data,
                    resSpecialty: resSpecialty.data,
                    resClinic : resClinic.data
                }
                dispatch({
                    type : actionTypes.FETCH_ALL_REQUIRED_DOCTOR_INFOR_SUCCESS,
                    data: data
                })    
            }else {
                dispatch({
                    type: actionTypes.FETCH_ALL_REQUIRED_DOCTOR_INFOR_FAILED,
                }) 
            }
            }catch(e) {
            dispatch({
                type: actionTypes.FETCH_ALL_REQUIRED_DOCTOR_INFOR_FAILED,
            })    
        }
    }
}

export const getAllClinicData = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllClinic();
            if(res && res.errCode === 0) {
                dispatch({
                    type : actionTypes.GET_ALL_CLINIC_SUCCESS,
                    data: res.data
                })    
            }else {
                dispatch({
                    type: actionTypes.GET_ALL_CLINIC_FAILED,
                }) 
            }
            }catch(e) {
            dispatch({
                type: actionTypes.GET_ALL_CLINIC_FAILED,
            })    
        }
    }
}

export const getAllSpecialtyData = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllSpecialty();
            if(res && res.errCode === 0) {
                dispatch({
                    type : actionTypes.GET_ALL_SPECIALTY_SUCCESS,
                    data: res.data
                })    
            }else {
                dispatch({
                    type: actionTypes.GET_ALL_SPECIALTY_FAILED,
                }) 
            }
            }catch(e) {
            dispatch({
                type: actionTypes.GET_ALL_SPECIALTY_FAILED,
            })    
        }
    }
}


export const getAllHandBookData = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllHandBook();
            if(res && res.errCode === 0) {
                dispatch({
                    type : actionTypes.GET_ALL_HANDBOOK_SUCCESS,
                    data: res.data
                })    
            }else {
                dispatch({
                    type: actionTypes.GET_ALL_HANDBOOK_FAILED,
                }) 
            }
            }catch(e) {
            dispatch({
                type: actionTypes.GET_ALL_HANDBOOK_FAILED,
            })    
        }
    }
}

export const getScheduleByDate = (doctorId, date) => {
    return async (dispatch, getState) => {
        try {
            let res = await getSheduleByDate(doctorId, date);
            if(res && res.errCode === 0) {
                dispatch({
                    type : actionTypes.GET_SCHEDULE_BY_DATE_SUCCESS,
                    data: res.data
                })    
            }else {
                dispatch({
                    type: actionTypes.GET_SCHEDULE_BY_DATE_FAILED,
                }) 
            }
            }catch(e) {
            dispatch({
                type: actionTypes.GET_SCHEDULE_BY_DATE_FAILED,
            })    
        }
    }
}

export const getPatientInforRedux = (doctorId, date) => {
    return async (dispatch, getState) => {
        try {
            let res = await getPatientInfor(doctorId, date);
            if(res && res.errCode === 0) {
                dispatch({
                    type : actionTypes.GET_PATIENT_INFOR_SUCCESS,
                    data: res
                })    
            }else {
                dispatch({
                    type: actionTypes.GET_PATIENT_INFOR_FAILED,
                }) 
            }
            }catch(e) {
            dispatch({
                type: actionTypes.GET_PATIENT_INFOR_FAILED,
            })    
        }
    }
}
export const getPatientNoConfirmRedux = (doctorId, date) => {
    return async (dispatch, getState) => {
        try {
            let res = await getPatientNoConfirm(doctorId, date);
            if(res && res.errCode === 0) {
                dispatch({
                    type : actionTypes.GET_PATIENT_NO_COMFIRM_SUCCESS,
                    data: res
                })    
            }else {
                dispatch({
                    type: actionTypes.GET_PATIENT_NO_COMFIRM_FAILED,
                }) 
            }
            }catch(e) {
            dispatch({
                type: actionTypes.GET_PATIENT_NO_COMFIRM_FAILED,
            })    
        }
    }
}
export const getPatientFinishedRedux = (doctorId, date) => {
    return async (dispatch, getState) => {
        try {
            let res = await getPatientFinsished(doctorId, date);
            if(res && res.errCode === 0) {
                dispatch({
                    type : actionTypes.GET_PATIENT_FINISHED_SUCCESS,
                    data: res
                })    
            }else {
                dispatch({
                    type: actionTypes.GET_PATIENT_INFOR_FAILED,
                }) 
            }
            }catch(e) {
            dispatch({
                type: actionTypes.GET_PATIENT_INFOR_FAILED,
            })    
        }
    }
}

export const getAllPatientsByDoctor = (doctorId) => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllPatients(doctorId);
            if(res && res.errCode === 0) {
                dispatch({
                    type : actionTypes.GET_ALL_PATIENTS_BY_DOCTOR_SUCCESS,
                    data: res.data
                })    
            }else {
                dispatch({
                    type: actionTypes.GET_ALL_PATIENTS_BY_DOCTOR_FAILED,
                }) 
            }
            }catch(e) {
            dispatch({
                type: actionTypes.GET_ALL_PATIENTS_BY_DOCTOR_FAILED,
            })    
        }
    }
}
