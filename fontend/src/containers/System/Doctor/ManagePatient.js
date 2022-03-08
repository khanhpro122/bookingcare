import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../../store/actions";
import { languages, dateFormat } from "../../../utils/constant";
import DatePicker from "../../../components/Input/DatePicker";
import "./ManagePatient.scss";
import _ from "lodash";
import { FormattedMessage } from "react-intl";
import { toast } from "react-toastify";
import moment from "moment";
import { cancelPatient, deletePatient } from "../../../services/userService";
import ConfirmPatient from "./ConfirmPatient";
import { postSendRemedy } from "../../../services/userService";
import LoadingOverlay from "react-loading-overlay";
import ReactHTMLTableToExcel from "react-html-table-to-excel";

class ManagePatient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      patientData: [],
      currentDate: moment(new Date()).startOf("day").valueOf(),
      isOpen: false,
      dataModal: [],
      isActive: false,
      isShowHide: true,
      patientDataNo: [],
      isShowHideNo: true,
      isShowHideFinish: true,
      patientDataFinished: [],
    };
  }

  async componentDidMount() {
    this.getPatientInfo();
    this.getPatientNoConfirm();
    this.getPatientFinsished();
    this.setState({
      isActive: true,
    });
  }
  getPatientInfo = async () => {
    let userId = this.props.userInfo.id;
    let { currentDate } = this.state;
    let formatedDate = new Date(currentDate).getTime();
    await this.props.getPatientInforRedux({
      doctorId: userId,
      date: formatedDate,
    });
  };
  getPatientNoConfirm = async () => {
    let userId = this.props.userInfo.id;
    let { currentDate } = this.state;
    let formatedDate = new Date(currentDate).getTime();
    await this.props.getPatientNoConfirmRedux({
      doctorId: userId,
      date: formatedDate,
    });
  };
  getPatientFinsished = async () => {
    let userId = this.props.userInfo.id;
    let { currentDate } = this.state;
    let formatedDate = new Date(currentDate).getTime();
    await this.props.getPatientFinsishedRedux({
      doctorId: userId,
      date: formatedDate,
    });
  };
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.dataPaitentInfor !== this.props.dataPaitentInfor) {
      if (
        this.props.dataPaitentInfor &&
        this.props.dataPaitentInfor.errCode === 0
      ) {
        this.setState({
          isActive: false,
          patientData: this.props.dataPaitentInfor.data,
        });
      }
    }
    if (prevProps.dataPaitentNoConfirm !== this.props.dataPaitentNoConfirm) {
      if (
        this.props.dataPaitentNoConfirm &&
        this.props.dataPaitentNoConfirm.errCode === 0
      ) {
        this.setState({
          isActive: false,
          patientDataNo: this.props.dataPaitentNoConfirm.data,
        });
      }
    }
    if (prevProps.dataPaitentFinished !== this.props.dataPaitentFinished) {
      if (
        this.props.dataPaitentFinished &&
        this.props.dataPaitentFinished.errCode === 0
      ) {
        this.setState({
          isActive: false,
          patientDataFinished: this.props.dataPaitentFinished.data,
        });
      }
    }
    if (prevProps.language !== this.props.language) {
    }
  }

  handleChangeDate = (date) => {
    this.setState(
      {
        currentDate: date[0],
      },
      async () => {
        await this.getPatientInfo();
        await this.getPatientNoConfirm();
        await this.getPatientFinsished();
      }
    );
  };

  handleShowHide = () => {
    this.setState({
      isShowHide: !this.state.isShowHide,
    });
  };
  handleShowHideNo = () => {
    this.setState({
      isShowHideNo: !this.state.isShowHideNo,
    });
  };
  handleShowHideNoFinish = () => {
    this.setState({
      isShowHideFinish: !this.state.isShowHideFinish,
    });
  };

  confirmPatient = (data) => {
    let dataPatient = {
      email: data?.patientData?.email,
      firstName: data?.patientData?.firstName,
      lastName: data?.patientData?.lastName,
      timeType: data?.timeType,
      patientId: data?.patientId,
      doctorId: data?.doctorId,
    };
    this.setState({
      isOpen: true,
      dataModal: dataPatient,
    });
  };

  sendConfirm = async (data) => {
    this.setState({
      isActive: true,
    });
    let { dataModal } = this.state;
    let { language } = this.props;
    let res = await postSendRemedy({
      email: dataModal?.email,
      timeType: dataModal?.timeType,
      patientId: dataModal?.patientId,
      doctorId: dataModal?.doctorId,
      imgBase64: data.fileBase64,
      language: language,
      firstName: dataModal?.firstName,
      lastName: dataModal?.lastName,
    });
    if (res && res.errCode === 0) {
      toast.success(res.errMsg);
      await this.getPatientInfo();
      await this.getPatientFinsished();
      this.setState({
        isOpen: false,
        isActive: false,
      });
    } else {
      toast.error(res.errMsg);
      this.setState({
        isOpen: false,
      });
    }
  };
  cancelPatient = async (item) => {
    let res = await cancelPatient({
      doctorId: item.doctorId,
      date: item.date,
    });
    if (res && res.errCode === 0) {
      await this.getPatientInfo();
      await this.getPatientNoConfirm();
      await this.getPatientFinsished();
      toast.success(res.errMsg);
    } else {
      toast.error(res.errMsg);
    }
  };
  closeModal = () => {
    this.setState({
      isOpen: false,
    });
  };
  deletePatient = async (item) => {
    let res = await deletePatient(item.id);
    if (res && res.errCode === 0) {
      await this.getPatientInfo();
      await this.getPatientNoConfirm();
      await this.getPatientFinsished();
      toast.success(res.errMsg);
    } else {
      toast.error(res.errMsg);
    }
  };

  render() {
    let { language } = this.props;
    let {
      currentDate,
      patientData,
      isOpen,
      isActive,
      patientDataNo,
      patientDataFinished,
    } = this.state;
    return (
      <LoadingOverlay active={isActive} spinner text="Loading...">
        <>
          <div className="manage-patient-container">
            <div className="manage-patient-title">
              <FormattedMessage id="admin.manage-patient.manage-patient-schedule" />
            </div>
            <div className="manage-patient-body">
              <div className="form-group">
                <label>
                  <FormattedMessage id="admin.manage-patient.choose-day" />
                </label>
                <DatePicker
                  onChange={(e) => this.handleChangeDate(e)}
                  className="form-control col-4"
                  value={currentDate}
                />
              </div>
              <div className="manage-patient-no-confirm">
                <div className="patient-title">
                  <FormattedMessage id="admin.manage-patient.list-patient-no" />
                  <button
                    className="btn-show-hide"
                    onClick={this.handleShowHideNo}
                  >
                    {this.state.isShowHideNo ? (
                      <span>
                        <FormattedMessage id="admin.manage-patient.hide" />
                      </span>
                    ) : (
                      <span>
                        <FormattedMessage id="admin.manage-patient.show" />
                      </span>
                    )}
                  </button>
                </div>
                {this.state.isShowHideNo && (
                  <>
                    {patientDataNo && patientDataNo.length > 0 ? (
                      <>
                        <table
                          className="table-manage-patient"
                          id="table-manage-patient"
                        >
                          <tbody>
                            <tr>
                              <th>
                                <FormattedMessage id="admin.manage-patient.STT" />
                              </th>
                              <th>
                                <FormattedMessage id="admin.manage-patient.time" />
                              </th>
                              <th>
                                <FormattedMessage id="admin.manage-patient.first-name" />
                              </th>
                              <th>
                                <FormattedMessage id="admin.manage-patient.last-name" />
                              </th>
                              <th>
                                <FormattedMessage id="admin.manage-patient.gender" />
                              </th>
                              <th>
                                <FormattedMessage id="admin.manage-patient.birthDate" />
                              </th>
                              <th>
                                <FormattedMessage id="admin.manage-patient.phone-number" />
                              </th>
                              <th>
                                <FormattedMessage id="admin.manage-patient.reason" />
                              </th>
                              <th>
                                <FormattedMessage id="admin.manage-patient.address" />
                              </th>
                              <th>
                                <FormattedMessage id="admin.manage-patient.actions" />
                              </th>
                            </tr>
                            {patientDataNo &&
                              patientDataNo.length > 0 &&
                              patientDataNo?.map((item, index) => {
                                let date =
                                  language === languages.VI
                                    ? moment
                                        .unix(
                                          +item?.patientData?.birthDate / 1000
                                        )
                                        .format("DD/MM/YYYY")
                                    : moment
                                        .unix(
                                          +item?.patientData?.birthDate / 1000
                                        )
                                        .locale("en")
                                        .format("MM/DD/YYYY");
                                return (
                                  <tr key={item.id}>
                                    <td>{index + 1}</td>
                                    <td>
                                      {language === languages.EN
                                        ? item?.timeTypeDataPatient?.valueVi
                                        : item?.timeTypeDataPatient?.valueEn}
                                    </td>
                                    <td>{item?.patientData?.firstName}</td>
                                    <td>{item?.patientData?.lastName}</td>
                                    <td>
                                      {language === languages.VI
                                        ? item?.patientData?.genderData?.valueVi
                                        : item?.patientData?.genderData
                                            ?.valueEn}
                                    </td>
                                    <td>{date}</td>
                                    <td>{item?.patientData?.phoneNumber}</td>
                                    <td>{item?.patientData?.reason}</td>
                                    <td>{item?.patientData?.address}</td>
                                    <td>
                                      <button
                                        className="btn-cancle-no"
                                        onClick={() => this.deletePatient(item)}
                                      >
                                        <FormattedMessage id="admin.manage-patient.delete" />
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                        <ReactHTMLTableToExcel
                          id="table-manage-patient"
                          className="btn-export-excel"
                          table="table-manage-patient"
                          filename="tablexls"
                          sheet="patinet"
                          buttonText="Export excel"
                        />
                      </>
                    ) : (
                      <div className="col-12 err-data">
                        <FormattedMessage id="admin.manage-patient.no-data" />
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className="manage-patient-table">
                <div className="patient-title">
                  <FormattedMessage id="admin.manage-patient.list-patient" />
                  <button
                    className="btn-show-hide"
                    onClick={this.handleShowHide}
                  >
                    {this.state.isShowHide ? (
                      <span>
                        <FormattedMessage id="admin.manage-patient.hide" />
                      </span>
                    ) : (
                      <span>
                        <FormattedMessage id="admin.manage-patient.show" />
                      </span>
                    )}
                  </button>
                </div>
                {this.state.isShowHide && (
                  <>
                    {patientData && patientData.length > 0 ? (
                      <>
                        <table
                          className="table-manage-patient"
                          id="table-manage-patient-no"
                        >
                          <tbody>
                            <tr>
                              <th>
                                <FormattedMessage id="admin.manage-patient.STT" />
                              </th>
                              <th>
                                <FormattedMessage id="admin.manage-patient.time" />
                              </th>
                              <th>
                                <FormattedMessage id="admin.manage-patient.first-name" />
                              </th>
                              <th>
                                <FormattedMessage id="admin.manage-patient.last-name" />
                              </th>
                              <th>
                                <FormattedMessage id="admin.manage-patient.gender" />
                              </th>
                              <th>
                                <FormattedMessage id="admin.manage-patient.birthDate" />
                              </th>
                              <th>
                                <FormattedMessage id="admin.manage-patient.phone-number" />
                              </th>
                              <th>
                                <FormattedMessage id="admin.manage-patient.reason" />
                              </th>
                              <th>
                                <FormattedMessage id="admin.manage-patient.address" />
                              </th>
                              <th>
                                <FormattedMessage id="admin.manage-patient.actions" />
                              </th>
                            </tr>
                            {patientData &&
                              patientData.length > 0 &&
                              patientData?.map((item, index) => {
                                let date =
                                  language === languages.VI
                                    ? moment
                                        .unix(
                                          +item?.patientData?.birthDate / 1000
                                        )
                                        .format("DD/MM/YYYY")
                                    : moment
                                        .unix(
                                          +item?.patientData?.birthDate / 1000
                                        )
                                        .locale("en")
                                        .format("MM/DD/YYYY");
                                return (
                                  <tr key={item.id}>
                                    <td>{index + 1}</td>
                                    <td>
                                      {language === languages.EN
                                        ? item?.timeTypeDataPatient?.valueVi
                                        : item?.timeTypeDataPatient?.valueEn}
                                    </td>
                                    <td>{item?.patientData?.firstName}</td>
                                    <td>{item?.patientData?.lastName}</td>
                                    <td>
                                      {language === languages.VI
                                        ? item?.patientData?.genderData?.valueVi
                                        : item?.patientData?.genderData
                                            ?.valueEn}
                                    </td>
                                    <td>{date}</td>
                                    <td>{item?.patientData?.phoneNumber}</td>
                                    <td>{item?.patientData?.reason}</td>
                                    <td>{item?.patientData?.address}</td>
                                    <td>
                                      <button
                                        className="btn-confirm"
                                        onClick={() =>
                                          this.confirmPatient(item)
                                        }
                                      >
                                        <FormattedMessage id="admin.manage-patient.confirm" />
                                      </button>
                                      <button
                                        className="btn-cancle"
                                        onClick={() => this.cancelPatient(item)}
                                      >
                                        <FormattedMessage id="admin.manage-patient.cancel" />
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                        <ReactHTMLTableToExcel
                          id="table-manage-patient-no"
                          className="btn-export-excel"
                          table="table-manage-patient-no"
                          filename="tablexls"
                          sheet="patinet"
                          buttonText="Export excel"
                        />
                      </>
                    ) : (
                      <div className="col-12 err-data">
                        <FormattedMessage id="admin.manage-patient.no-data" />
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className="manage-patient-finished">
                <div className="patient-title">
                  <FormattedMessage id="admin.manage-patient.list-patient-finished" />
                  <button
                    className="btn-show-hide"
                    onClick={this.handleShowHideNoFinish}
                  >
                    {this.state.isShowHideFinish ? (
                      <span>
                        <FormattedMessage id="admin.manage-patient.hide" />
                      </span>
                    ) : (
                      <span>
                        <FormattedMessage id="admin.manage-patient.show" />
                      </span>
                    )}
                  </button>
                </div>
                {this.state.isShowHideFinish && (
                  <>
                    {patientDataFinished && patientDataFinished.length > 0 ? (
                      <>
                        <table
                          className="table-manage-patient"
                          id="table-manage-patient-finished"
                        >
                          <tbody>
                            <tr>
                              <th>
                                <FormattedMessage id="admin.manage-patient.STT" />
                              </th>
                              <th>
                                <FormattedMessage id="admin.manage-patient.time" />
                              </th>
                              <th>
                                <FormattedMessage id="admin.manage-patient.first-name" />
                              </th>
                              <th>
                                <FormattedMessage id="admin.manage-patient.last-name" />
                              </th>
                              <th>
                                <FormattedMessage id="admin.manage-patient.gender" />
                              </th>
                              <th>
                                <FormattedMessage id="admin.manage-patient.birthDate" />
                              </th>
                              <th>
                                <FormattedMessage id="admin.manage-patient.phone-number" />
                              </th>
                              <th>
                                <FormattedMessage id="admin.manage-patient.reason" />
                              </th>
                              <th>
                                <FormattedMessage id="admin.manage-patient.address" />
                              </th>
                              <th>
                                <FormattedMessage id="admin.manage-patient.actions" />
                              </th>
                            </tr>
                            {patientDataFinished &&
                              patientDataFinished.length > 0 &&
                              patientDataFinished?.map((item, index) => {
                                let date =
                                  language === languages.VI
                                    ? moment
                                        .unix(
                                          +item?.patientData?.birthDate / 1000
                                        )
                                        .format("DD/MM/YYYY")
                                    : moment
                                        .unix(
                                          +item?.patientData?.birthDate / 1000
                                        )
                                        .locale("en")
                                        .format("MM/DD/YYYY");
                                return (
                                  <tr key={item.id}>
                                    <td>{index + 1}</td>
                                    <td>
                                      {language === languages.EN
                                        ? item?.timeTypeDataPatient?.valueVi
                                        : item?.timeTypeDataPatient?.valueEn}
                                    </td>
                                    <td>{item?.patientData?.firstName}</td>
                                    <td>{item?.patientData?.lastName}</td>
                                    <td>
                                      {language === languages.VI
                                        ? item?.patientData?.genderData?.valueVi
                                        : item?.patientData?.genderData
                                            ?.valueEn}
                                    </td>
                                    <td>{date}</td>
                                    <td>{item?.patientData?.phoneNumber}</td>
                                    <td>{item?.patientData?.reason}</td>
                                    <td>{item?.patientData?.address}</td>
                                    <td>
                                      <button
                                        className="btn-cancle-no"
                                        onClick={() => this.deletePatient(item)}
                                      >
                                        <FormattedMessage id="admin.manage-patient.delete" />
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                        <ReactHTMLTableToExcel
                          id="table-manage-patient-finished"
                          className="btn-export-excel"
                          table="table-manage-patient-finished"
                          filename="tablexls"
                          sheet="patinet"
                          buttonText="Export excel"
                        />
                      </>
                    ) : (
                      <div className="col-12 err-data">
                        <FormattedMessage id="admin.manage-patient.no-data" />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
          <ConfirmPatient
            isOpen={isOpen}
            closeModal={this.closeModal}
            confirmPatient={this.confirmPatient}
            sendConfirm={this.sendConfirm}
            dataModal={this.state.dataModal}
            patientData={this.state.patientData}
          />
        </>
      </LoadingOverlay>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    systemMenuPath: state.app.systemMenuPath,
    language: state.app.language,
    userInfo: state.user.userInfo,
    dataPaitentInfor: state.admin.dataPaitentInfor,
    dataPaitentNoConfirm: state.admin.dataPaitentNoConfirm,
    dataPaitentFinished: state.admin.dataPaitentFinished,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getPatientInforRedux: (doctorId, date) => {
      dispatch(actions.getPatientInforRedux(doctorId, date));
    },
    getPatientNoConfirmRedux: (doctorId, date) => {
      dispatch(actions.getPatientNoConfirmRedux(doctorId, date));
    },
    getPatientFinsishedRedux: (doctorId, date) => {
      dispatch(actions.getPatientFinishedRedux(doctorId, date));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagePatient);
