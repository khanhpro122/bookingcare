import React, { Component } from "react";
import { connect } from "react-redux";
import "./DetailsDoctor.scss";
import * as actions from "../../../store/actions";
import "./DoctorSchedule.scss";
import moment from "moment";
import { languages } from "../../../utils";
import { getSheduleByDate } from "../../../services/userService";
import { FormattedMessage } from "react-intl";
import ModalBooking from "./Modal/ModalBooking";
import localization from "moment/locale/vi";

class DetailsDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrDays: [],
      allAvaliDays: [],
      loading: false,
      dateTime: [],
    };
  }

  async componentDidMount() {
    let { language } = this.props;
    let allDays = this.getArrday(language);
    if (this.props.doctorIDfromParent) {
      await this.props.getScheduleByDate(
        this.props.doctorIDfromParent,
        allDays[0].value
      );
      this.setState({
        allAvaliDays: this.props.dataScheduleByDate,
        loading: true,
      });
    }
    this.setState({
      arrDays: allDays,
    });
  }
  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  getArrday = (language) => {
    let arrDays = [];
    for (let i = 0; i < 7; i++) {
      let obj = {};
      if (languages.VI === language) {
        if (i === 0) {
          let dayVi = moment(new Date()).format("DD/MM");
          let today = `Hôm nay - ${dayVi}`;
          obj.label = today;
        } else {
          let labelVi = moment(new Date())
            .add(i, "days")
            .format("dddd - DD/MM");
          obj.label = this.capitalizeFirstLetter(labelVi);
        }
      } else {
        if (i === 0) {
          let dayEn = moment(new Date()).locale("en").format("DD/MM");
          let today = `Today - ${dayEn}`;
          obj.label = today;
        } else {
          obj.label = moment(new Date())
            .add(i, "days")
            .locale("en")
            .format("ddd - DD/MM");
        }
      }
      obj.value = moment(new Date()).add(i, "days").startOf("day").valueOf();
      arrDays.push(obj);
    }
    return arrDays;
  };
  async componentDidUpdate(prevProps, prevState) {
    let { language } = this.props;
    let allDays = this.getArrday(language);
    let date = allDays[0].value;
    if (prevProps.language !== this.props.language) {
      this.setState({
        arrDays: allDays,
      });
    }
    if (prevProps.doctorIDfromParent !== this.props.doctorIDfromParent) {
      await this.props.getScheduleByDate(this.props.doctorIDfromParent, date);
      this.setState({
        allAvaliDays: this.props.dataScheduleByDate,
        loading: true,
      });
    }
    if (prevProps.dataScheduleByDate !== this.props.dataScheduleByDate) {
      this.setState({
        allAvaliDays: this.props.dataScheduleByDate,
        loading: true,
      });
    }
  }

  handleOnchangeSelect = async (e) => {
    if (this.props.doctorIDfromParent && this.props.doctorIDfromParent !== -1) {
      let date = e.target.value;
      let doctorId = this.props.doctorIDfromParent;
      let res = await getSheduleByDate(doctorId, date);
      this.setState({
        allAvaliDays: res.data,
        loading: true,
        isModalBooking: false,
      });
    }
  };
  handleChangeTime = (time) => {
    this.setState({
      isModalBooking: true,
      dateTime: time,
    });
  };
  handleCloseModal = () => {
    this.setState({
      isModalBooking: false,
    });
  };

  render() {
    let { arrDays, allAvaliDays, loading } = this.state;
    let { language } = this.props;
    return (
      <>
        <div className="doctor-schedule-container">
          <div className="all-schedule">
            <select onChange={(e) => this.handleOnchangeSelect(e)}>
              {arrDays &&
                arrDays.length > 0 &&
                arrDays?.map((item, index) => {
                  return (
                    <option value={item.value} key={index}>
                      {item.label}
                    </option>
                  );
                })}
            </select>
          </div>
          <div className="all-available-time">
            <div className="text-calendar">
              <span>
                <i className="far fa-calendar-alt"></i>
                <FormattedMessage id="patient.details-doctor.schedule" />
              </span>
            </div>
            <div className="schedule-content">
              {!loading ? (
                <div className="loader-schedule"></div>
              ) : allAvaliDays && allAvaliDays.length > 0 ? (
                <>
                  <div className="time-content">
                    {allAvaliDays?.map((item, index) => {
                      let timeDisplay =
                        language === languages.VI
                          ? item.timeTypeData.valueVi
                          : item.timeTypeData.valueEn;
                      return (
                        <button
                          key={index}
                          className={
                            language === languages.VI ? "btn-vi" : "btn-en"
                          }
                          onClick={() => this.handleChangeTime(item)}
                        >
                          {timeDisplay}
                        </button>
                      );
                    })}
                  </div>
                  <div className="booking-free">
                    <FormattedMessage id="patient.details-doctor.choose" />
                    <i className="far fa-hand-point-up"></i>
                    <FormattedMessage id="patient.details-doctor.book-free" />
                  </div>
                </>
              ) : (
                <div className="no-schedule">
                  <FormattedMessage id="patient.details-doctor.no-schedule" />
                </div>
              )}
            </div>
          </div>
        </div>
        <ModalBooking
          isModalBooking={this.state.isModalBooking}
          handleCloseModal={this.handleCloseModal}
          dateTime={this.state.dateTime}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    dataScheduleByDate: state.admin.dataScheduleByDate,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getDetailsDoctor: (id) => dispatch(actions.fetchDetailsDoctor(id)),
    getScheduleByDate: (doctorId, date) =>
      dispatch(actions.getScheduleByDate(doctorId, date)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailsDoctor);
