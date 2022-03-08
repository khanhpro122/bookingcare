import actionTypes from '../actions/actionTypes';


const initialState = {
    genders: [],
    positions: [],
    roleIds: [],
    users: [],
    adminDoctor: [],
    dataDoctors: [],
    detailsDoctor: [],
    allTimes: [],
    allRequiredInfor: [],
    allDataClinic : [],
    allDataSpecialty : [],
    allDataHandBook : [],
    dataScheduleByDate: [],
    dataPaitentInfor: [],
    dataPaitentNoConfirm: [],
    dataPaitentFinished: [],
    allDataPatients : []

}

const adminReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_GENDER_USER: 
        let copyState = {...state}
        copyState.isLoadingGender = true
        return {
            ...copyState, 
        }
        case actionTypes.FETCH_GENDER_SUCCESS: 
        state.genders = action.data
        state.isLoadingGender = false
        return {
            ...state
        }
        case actionTypes.FETCH_GENDER_FAILED:
        state.isLoadingGender = false
        state.genders = []
            return {
                ...state,
            }
        case actionTypes.FETCH_POSITION_SUCCESS: 
        state.positions = action.data
        return {
            ...state
        }
        case actionTypes.FETCH_POSITION_FAILED:
        state.positions = []
            return {
                ...state,
            }
        case actionTypes.FETCH_ROLE_SUCCESS: 
        state.roleIds = action.data
        return {
            ...state
        }
        case actionTypes.FETCH_ROLE_FAILED:
        state.roleIds = []
            return {
                ...state,
            }
        case actionTypes.FETCH_GET_ALL_SUCCESS:
            state.users = action.users
                return {
                    ...state,
                }
        case actionTypes.FETCH_GET_ALL_FAILED:
            state.users = []
                return {
                    ...state,
                }
        case actionTypes.FETCH_TOP_DOCTOR_SUCCESS:
            state.adminDoctor = action.dataDoctor
                return {
                    ...state,
                }
        case actionTypes.FETCH_TOP_DOCTOR_FAILED:
            state.adminDoctor = []
                return {
                    ...state,
                }
        case actionTypes.FETCH_ALL_DOCTOR_SUCCESS:
            state.dataDoctors = action.listDoctor
                return {
                    ...state,
                }
        case actionTypes.FETCH_ALL_DOCTOR_FAILED:
            state.dataDoctors = []
                return {
                    ...state,
                }
        case actionTypes.GET_DETAILS_DOCTOR_SUCCESS:
            state.detailsDoctor = action.data
                return {
                    ...state,
                }
        case actionTypes.GET_DETAILS_DOCTOR_FAILED:
            state.detailsDoctor = []
                return {
                    ...state,
                }
        case actionTypes.GET_ALL_CODE_TIME_SUCCESS:
            state.allTimes = action.data
                return {
                    ...state,
                }
        case actionTypes.GET_ALL_CODE_TIME_FAILED:
            state.allTimes = []
                return {
                    ...state,
                }
        case actionTypes.FETCH_ALL_REQUIRED_DOCTOR_INFOR_SUCCESS:
            state.allRequiredInfor = action.data
                return {
                    ...state,
                }
        case actionTypes.FETCH_ALL_REQUIRED_DOCTOR_INFOR_FAILED:
            state.allRequiredInfor = []
                return {
                    ...state,
                }
        case actionTypes.GET_ALL_CLINIC_SUCCESS:
            state.allDataClinic = action.data
                return {
                    ...state,
            }
        case actionTypes.GET_ALL_CLINIC_FAILED:
            state.allDataClinic = []
                return {
                    ...state,
            }
        case actionTypes.GET_ALL_SPECIALTY_SUCCESS:
            state.allDataSpecialty = action.data
                return {
                    ...state,
            }
        case actionTypes.GET_ALL_SPECIALTY_FAILED:
            state.allDataSpecialty = []
                return {
                    ...state,
            }
        case actionTypes.GET_ALL_HANDBOOK_SUCCESS:
            state.allDataHandBook = action.data
                return {
                    ...state,
            }
        case actionTypes.GET_ALL_HANDBOOK_FAILED:
            state.allDataHandBook = []
                return {
                    ...state,
            }
        case actionTypes.CHANGE_MENU:
            state.isMenu = action.isMenu
                return {
                    ...state,
            }
        case actionTypes.GET_SCHEDULE_BY_DATE_SUCCESS:
            state.dataScheduleByDate = action.data
                return {
                    ...state,
            }
        case actionTypes.GET_SCHEDULE_BY_DATE_FAILED:
            state.dataScheduleByDate = []
                return {
                    ...state,
            }
            case actionTypes.GET_PATIENT_INFOR_SUCCESS:
                state.dataPaitentInfor = action.data
                    return {
                        ...state,
                }
            case actionTypes.GET_PATIENT_INFOR_FAILED:
                state.dataPaitentInfor = []
                    return {
                        ...state,
                }
            case actionTypes.GET_PATIENT_NO_COMFIRM_SUCCESS:
                state.dataPaitentNoConfirm = action.data
                    return {
                        ...state,
                }
            case actionTypes.GET_PATIENT_NO_COMFIRM_FAILED:
                state.dataPaitentNoConfirm = []
                    return {
                        ...state,
                }
            case actionTypes.GET_PATIENT_FINISHED_SUCCESS:
                state.dataPaitentFinished = action.data
                    return {
                        ...state,
                }
            case actionTypes.GET_PATIENT_FINISHED_FAILED:
                state.dataPaitentFinished = []
                    return {
                        ...state,
                }
            case actionTypes.GET_ALL_PATIENTS_BY_DOCTOR_SUCCESS:
                state.allDataPatients = action.data
                    return {
                        ...state,
                }
            case actionTypes.GET_ALL_PATIENTS_BY_DOCTOR_FAILED:
                state.allDataPatients = []
                    return {
                        ...state,
                }
        default:
            return state;
    }
}

export default adminReducer;