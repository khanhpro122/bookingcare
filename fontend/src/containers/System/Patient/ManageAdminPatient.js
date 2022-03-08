import React, { Component } from 'react';
import { connect } from "react-redux";
import * as actions from '../../../store/actions'
import { languages, dateFormat} from '../../../utils/constant';
import './ManageAdminPatient.scss'
import _ from 'lodash'
import { FormattedMessage } from 'react-intl'
import { toast } from 'react-toastify';
import LoadingOverlay from 'react-loading-overlay';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import Select from 'react-select';
import moment from 'moment'


class ManageAdminPatient extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isActive: false,
            listDoctors : [],
            dataPatient: [],
            search: ''
        }
    }
    

    async componentDidMount() {
       this.props.fetchAllDoctor()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.listDoctors !== this.props.listDoctors) {
           let optionDoctors = this.buildDataInputSelect(this.props.listDoctors)
            this.setState({
                listDoctors : optionDoctors
            })
        }
        if(prevProps.allDataPatients !== this.props.allDataPatients) {
            this.setState({
                dataPatient: this.props.allDataPatients
            })
        }
    }

    buildDataInputSelect = (inputData) => {
        let language = this.props.language
        let result = []
        inputData && inputData.length > 0 && inputData?.map((item, index) => {
            let object = {}
            let labelVi = `${item.lastName} ${item.firstName}`
            let labelEn = `${item.firstName} ${item.lastName}`
            object.value = item.id
            object.label = languages.VI === language  ? labelVi : labelEn
            result.push(object)
        })
        return result;
    }
    handleChangeSelectDoctor = async (selectedOption) => {
        this.setState({ selectedOption});
        await this.props.getAllPatientsByDoctor(selectedOption.value)
    }
    handleSearch = (e) => {
        this.setState({ 
            search: e.target.value
        })
    }
    
    
    render() {
        let { language } = this.props
        let { listDoctors, dataPatient, search } = this.state
        dataPatient.sort(function (a, b) {
	    var dateA = a.date, dateB = b.date
	    return dateB - dateA
        });
        return (
            <LoadingOverlay
                // active={isActive}
                spinner
                text='Loading...'
                >
                <>
                    <div className="manage-admin-patient-container">
                        <div className="manage-admin-patient-title">
                            <FormattedMessage id="menu.admin.manage-doctor-patient"/>
                        </div>
                        <div className="search-container">
                            <span className="search-icon"><i className="fas fa-search"></i></span>
                            <input type="text" placeholder="Tìm kiếm..." className="admin-patient-search"
                            value={this.state.search}
                            onChange={this.handleSearch}
                            />
                        </div>
                        <div className="manage-admin-patient-body row">
                            <div className="col-3 choose-doctor">
                                <label><FormattedMessage id="manage-schedule.choose-doctor"/></label>
                                <Select
                                value={this.state.selectedDoctor}
                                onChange={this.handleChangeSelectDoctor}
                                options={listDoctors}
                                placeholder={<FormattedMessage id="manage-schedule.choose-doctor"/>}
                                />
                            </div>
                            <div className="table-doctor-patient col-12">
                                <ReactHTMLTableToExcel
                                    id="table-admin-patient"
                                    className="btn-export-excel"
                                    table="table-admin-patient-excel"
                                    filename="tablexls"
                                    sheet="patient"
                                    buttonText="Export excel"
                                />
                                <table className="table-admin-patient" id="table-admin-patient-excel">
                                    <tbody>
                                        <tr> 
                                            <th>
                                                <FormattedMessage id="admin.manage-patient.STT"/>
                                            </th>
                                            <th>
                                                <FormattedMessage id="admin.manage-patient.date-clinic"/>
                                            </th>
                                            <th>
                                                <FormattedMessage id="admin.manage-patient.time"/>
                                            </th>
                                            <th>
                                                <FormattedMessage id="admin.manage-patient.first-name"/>
                                            </th>
                                            <th>
                                                <FormattedMessage id="admin.manage-patient.last-name"/>
                                            </th>
                                            <th>
                                                <FormattedMessage id="admin.manage-patient.gender"/>
                                            </th>
                                            <th>
                                                <FormattedMessage id="admin.manage-patient.phone-number"/>
                                            </th>
                                            <th>
                                                <FormattedMessage id="admin.manage-patient.reason"/>
                                            </th>
                                            <th>
                                                <FormattedMessage id="admin.manage-patient.address"/>
                                            </th>
                                            <th>
                                                <FormattedMessage id="admin.manage-patient.status"/>

                                            </th>
                                        </tr>
                                        {dataPatient && dataPatient.length > 0 && dataPatient.filter((patient) => {
                                            if(search === "") {
                                                return patient
                                            } else if(patient?.patientData?.firstName?.toLowerCase().includes(search?.toLowerCase())) {
                                                return patient
                                            }
                                            else if(patient?.patientData?.lastName?.toLowerCase().includes(search?.toLowerCase())) {
                                                return patient
                                            }
                                            else if(patient?.patientData?.address?.toLowerCase().includes(search?.toLowerCase())) {
                                                return patient
                                            }
                                            else if(patient?.patientData?.reason?.toLowerCase().includes(search?.toLowerCase())) {
                                                return patient
                                            }
                                            else if(patient?.patientData?.phoneNumber?.toLowerCase().includes(search?.toLowerCase())) {
                                                return patient
                                            }
                                        })?.map((item, index) => {
                                            let status = item.statusId === 'S1' ? 'Chưa xác nhận' : (item.statusId === 'S2' ? 'Đã xác nhận' : 'Đã khám xong' )
                                            let dateSort = [...item.date].sort((a,b) => {
                                                return a >= b
                                            })
                                            let date = language === languages.VI 
                                            ?
                                            moment.unix(+item?.date / 1000).format('DD/MM/YYYY')
                                            : 
                                            moment.unix(+item?.date / 1000).locale('en').format('MM/DD/YYYY')
                                            return(
                                            <tr key={item.id}>
                                                <td>{index+1}</td>
                                                <td>{date}</td>
                                                <td>
                                                    {
                                                        language === languages.EN
                                                        ?
                                                        item?.timeTypeDataPatient?.valueVi
                                                        :
                                                        item?.timeTypeDataPatient?.valueEn
                                                    }
                                                </td>
                                                <td>{item?.patientData?.firstName}</td>
                                                <td>{item?.patientData?.lastName}</td>
                                                <td>
                                                    {
                                                        language === languages.VI 
                                                        ?
                                                        item?.patientData?.genderData?.valueVi
                                                        :
                                                        item?.patientData?.genderData?.valueEn

                                                    }
                                                </td>
                                                <td>{item?.patientData?.phoneNumber}</td>
                                                <td>{item?.patientData?.reason}</td>
                                                <td>{item?.patientData?.address}</td>
                                                <td>
                                                    <button 
                                                    className={item.statusId === 'S1' ? 'no-confirm' : (item.statusId === 'S2' ? 'confirmed' : 'finished') }
                                                    >
                                                        {status}
                                                    </button>
                                                </td>
                                            </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </>
            </LoadingOverlay>
        );
    }
}

const mapStateToProps = state => {
    return {
        systemMenuPath: state.app.systemMenuPath,
        language: state.app.language,
        allDataPatients: state.admin.allDataPatients,
        listDoctors: state.admin.dataDoctors,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctor: () => dispatch(actions.fetchAllDoctor()),
        getAllPatientsByDoctor: (doctorId) => dispatch(actions.getAllPatientsByDoctor(doctorId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageAdminPatient);
