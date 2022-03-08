import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../../../store/actions";
import { languages } from "../../../../utils";
import "./ModalBooking.scss";
import { Modal } from "reactstrap";
import ProfileDoctor from "../ProfileDoctor";
import _ from "lodash";
import DatePicker from "../../../../components/Input/DatePicker";
import Select from "react-select";
import { postBookingPatient } from "../../../../services/userService";
import { toast } from "react-toastify";
import { FormattedMessage } from "react-intl";
import { emitter } from "../../../../utils/emitter";
import moment from "moment";
import LoadingOverlay from "react-loading-overlay";

class ModalBooking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      address: "",
      reason: "",
      birthDate: "",
      genders: "",
      selectedGender: "",
      date: "",
      timeType: "",
      doctorId: "",
      isActive: false,
    };
    this.listenToEmitter();
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  getTimeClinic = (dateTime) => {
    let { language } = this.props;
    if (dateTime && !_.isEmpty(dateTime)) {
      let date =
        language === languages.VI
          ? moment.unix(+dateTime.date / 1000).format("dddd - DD/MM/YYYY")
          : moment
              .unix(+dateTime.date / 1000)
              .locale("en")
              .format("ddd - MM/DD/YYYY");
      date = this.capitalizeFirstLetter(date);
      let time =
        language === languages.VI
          ? dateTime.timeTypeData.valueVi
          : dateTime.timeTypeData.valueEn;
      return `${time} - ${date}`;
    }
    return;
  };

  buildDoctorName = (dateTime) => {
    let { language } = this.props;
    if (dateTime && !_.isEmpty(dateTime)) {
      let nameDoctor =
        language === languages.VI
          ? `${dateTime?.doctorData?.lastName} - ${dateTime?.doctorData?.firstName}`
          : `${dateTime?.doctorData?.firstName} - ${dateTime?.doctorData?.lastName}`;

      return nameDoctor;
    }
    return;
  };
  componentDidMount() {
    this.props.getGenders();
  }

  listenToEmitter() {
    emitter.on("BOOKING_PATIENT_SCHEDULE", () => {
      this.setState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        address: "",
        reason: "",
        birthDate: "",
        genders: "",
        selectedGender: "",
        date: "",
        timeType: "",
        doctorId: "",
      });
    });
  }
  buildDataGender = (data) => {
    let { language } = this.props;
    let result = [];
    if (data && data.length > 0) {
      data?.map((item) => {
        let object = {};
        if (language === languages.VI) {
          object.label = item.valueVi;
        } else {
          object.label = item.valueEn;
        }
        object.value = item.keyMap;
        return result.push(object);
      });
    }
    return result;
  };
  componentDidUpdate(prevProps, prevState) {
    let { language } = this.props;
    if (this.props.language !== prevProps.language) {
      let timeType;
      if (language === languages.VI) {
        timeType = this.props?.dateTime?.timeTypeData?.valueVi;
      } else {
        timeType = this.props?.dateTime?.timeTypeData?.valueEn;
      }
      this.setState({
        genders: this.buildDataGender(this.props.genders),
        timeType: timeType,
      });
    }
    if (this.props.genders !== prevProps.genders) {
      this.setState({
        genders: this.buildDataGender(this.props.genders),
      });
    }
    if (this.props.dateTime !== prevProps.dateTime) {
      if (this.props.dateTime && !_.isEmpty(this.props.dateTime)) {
        let { doctorId, timeType, date } = this.props.dateTime;
        if (language === languages.VI) {
          timeType = this.props?.dateTime?.timeType;
        } else {
          timeType = this.props?.dateTime?.timeType;
        }
        this.setState({
          doctorId: doctorId,
          timeType: timeType,
          date: date,
        });
      }
    }
  }
  handleCloseModal = () => {
    this.props.handleCloseModal();
  };

  handleChangeDate = (date) => {
    this.setState({
      birthDate: date[0],
    });
  };

  handleOnchangeInput = (e, id) => {
    let copyState = { ...this.state };
    copyState[id] = e.target.value;
    this.setState({
      ...copyState,
    });
  };

  handleChangeGender = (selectedGender) => {
    this.setState({ selectedGender });
  };

  handleSubmit = async () => {
    this.setState({
      isActive: true,
    });
    let timeString = this.getTimeClinic(this.props.dateTime);
    let dataName = this.buildDoctorName(this.props.dateTime);
    let formatBirthday = `${new Date(this.state.birthDate).getTime()}`;
    let res = await postBookingPatient({
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      phoneNumber: this.state.phoneNumber,
      address: this.state.address,
      reason: this.state.reason,
      birthDate: formatBirthday,
      selectedGender: this.state.selectedGender,
      date: this.state.date,
      timeType: this.state.timeType,
      doctorId: this.state.doctorId,
      timeString: timeString,
      language: this.props.language,
      doctorName: dataName,
    });
    if (res && res.errCode === 0) {
      emitter.emit("BOOKING_PATIENT_SCHEDULE");
      toast.success("Booking success");
      this.props.handleCloseModal();
      this.props.getGenders();
      this.setState({
        isActive: false,
      });
    } else {
      toast.error("Booking error");
      this.setState({
        isActive: false,
      });
    }
  };

  render() {
    let { isModalBooking, dateTime } = this.props;
    let doctorId = dateTime && !_.isEmpty(dateTime) ? dateTime.doctorId : "";
    let {
      firstName,
      lastName,
      phoneNumber,
      email,
      address,
      reason,
      birthDate,
      genders,
      selectedGender,
      isActive,
    } = this.state;
    let yesterday = new Date(new Date().setDate(new Date().getDate()));
    return (
      <LoadingOverlay active={isActive} spinner text="Loading...">
        <div>
          <Modal isOpen={isModalBooking} backdrop="static" centered size="lg">
            <div className="modal-booking-container">
              <div className="modal-booking-header">
                <span className="booking-header-title">
                  <FormattedMessage id="admin.modal-booking.infor-modal-booking" />
                </span>
                <span className="header-close" onClick={this.handleCloseModal}>
                  <i className="fas fa-times"></i>
                </span>
              </div>
              <div className="modal-booking-body">
                <div className="doctor-infor">
                  <ProfileDoctor
                    doctorId={doctorId}
                    isShowDetailsDoctor={false}
                    dateTime={dateTime}
                  />
                </div>
                <div className="row">
                  <div className="col-3 form-group">
                    <label>
                      <FormattedMessage id="admin.modal-booking.firstName" />
                    </label>
                    <input
                      className="form-control"
                      onChange={(e) => this.handleOnchangeInput(e, "firstName")}
                      value={firstName}
                    />
                  </div>
                  <div className="col-3 form-group">
                    <label>
                      <FormattedMessage id="admin.modal-booking.lastName" />
                    </label>
                    <input
                      className="form-control"
                      onChange={(e) => this.handleOnchangeInput(e, "lastName")}
                      value={lastName}
                    />
                  </div>
                  <div className="col-6 form-group">
                    <label>
                      <FormattedMessage id="admin.modal-booking.phoneNumber" />
                    </label>
                    <input
                      className="form-control"
                      onChange={(e) =>
                        this.handleOnchangeInput(e, "phoneNumber")
                      }
                      value={phoneNumber}
                    />
                  </div>
                  <div className="col-6 form-group">
                    <label>
                      <FormattedMessage id="admin.modal-booking.email" />
                    </label>
                    <input
                      className="form-control"
                      type="email"
                      onChange={(e) => this.handleOnchangeInput(e, "email")}
                      value={email}
                    />
                  </div>
                  <div className="col-6 form-group">
                    <label>
                      <FormattedMessage id="admin.modal-booking.address" />
                    </label>
                    <input
                      className="form-control"
                      onChange={(e) => this.handleOnchangeInput(e, "address")}
                      value={address}
                    />
                  </div>
                  <div className="col-12 form-group">
                    <label>
                      <FormattedMessage id="admin.modal-booking.reason" />
                    </label>
                    <input
                      className="form-control"
                      onChange={(e) => this.handleOnchangeInput(e, "reason")}
                      value={reason}
                    />
                  </div>
                  <div className="col-6 form-group">
                    <label>
                      <FormattedMessage id="admin.modal-booking.birthDay" />
                    </label>
                    <DatePicker
                      onChange={(e) => this.handleChangeDate(e)}
                      className="form-control"
                      value={birthDate}
                      // maxDate = '+30Y'
                    />
                  </div>
                  <div className="col-6 form-group">
                    <label>
                      <FormattedMessage id="admin.modal-booking.gender" />
                    </label>
                    <Select
                      value={selectedGender}
                      onChange={this.handleChangeGender}
                      options={genders}
                      placeholder={
                        <FormattedMessage id="admin.modal-booking.choose-gender" />
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="modal-booking-footer">
                <button className="btn-agree" onClick={this.handleSubmit}>
                  <FormattedMessage id="admin.modal-booking.agree" />
                </button>
                <button className="btn-close" onClick={this.handleCloseModal}>
                  <FormattedMessage id="admin.modal-booking.cancel" />
                </button>
              </div>
            </div>
          </Modal>
        </div>
      </LoadingOverlay>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    genders: state.admin.genders,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getGenders: () => dispatch(actions.fetchGenderUser()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalBooking);
