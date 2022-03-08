import React, { Component } from "react";
import { connect } from "react-redux";
import Select from "react-select";
import * as actions from "../../../store/actions";
import { languages, dateFormat } from "../../../utils/constant";
import DatePicker from "../../../components/Input/DatePicker";
import "./ManageSchedule.scss";
import _ from "lodash";
import { getBulkCreateSchedule } from "../../../services/userService";
import moment from "moment";

import { FormattedMessage } from "react-intl";
import { toast } from "react-toastify";

class ManageSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataDoctors: [],
      selectedOption: null,
      currentDate: moment(new Date()).startOf("day").valueOf(),
      allTimes: [],
    };
  }

  componentDidMount() {
    this.props.fetchAllDoctor();
    this.props.fetchAllTimes();
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.listDoctors !== this.props.listDoctors) {
      let optionDoctors = this.buildDataInputSelect(this.props.listDoctors);
      this.setState({
        dataDoctors: optionDoctors,
      });
    }
    if (prevProps.language !== this.props.language) {
      let optionDoctors = this.buildDataInputSelect(this.props.listDoctors);
      this.setState({
        dataDoctors: optionDoctors,
      });
    }
    if (prevProps.allTimes !== this.props.allTimes) {
      let data = this.props.allTimes;
      if (data && data.length > 0) {
        data = data?.map((item) => ({ ...item, isSelected: false }));
      }
      this.setState({
        allTimes: data,
      });
    }
  }

  handleChangeSelect = async (selectedOption) => {
    this.setState({ selectedOption });
  };

  handleChangeDate = (date) => {
    this.setState({
      currentDate: date[0],
    });
  };

  buildDataInputSelect = (inputData) => {
    let language = this.props.language;
    let result = [];
    inputData &&
      inputData.length > 0 &&
      inputData?.map((item, index) => {
        let object = {};

        let labelVi = `${item.lastName} ${item.firstName}`;
        let labelEn = `${item.firstName} ${item.lastName}`;
        object.value = item.id;
        object.label = languages.VI === language ? labelVi : labelEn;
        result.push(object);
      });
    return result;
  };

  handleChooseTime = (time) => {
    let { allTimes } = this.state;
    if (allTimes && allTimes.length > 0) {
      allTimes = allTimes?.map((item) => {
        if (time.id === item.id) {
          item.isSelected = !item.isSelected;
        }
        return item;
      });
      this.setState({
        allTimes: allTimes,
      });
    }
  };

  handleSaveSchedule = async () => {
    let { selectedOption, currentDate, allTimes } = this.state;
    let result = [];
    if (!selectedOption && _.isEmpty(selectedOption)) {
      toast.error("Invalid doctor");
      return;
    }
    if (!currentDate) {
      toast.error("Invalid Date");
      return;
    }
    let formatedDate = new Date(currentDate).getTime();

    if (allTimes && allTimes.length > 0) {
      let selectedTime = allTimes.filter((item) => item.isSelected === true);
      if (selectedTime && selectedTime.length > 0) {
        selectedTime?.map((time) => {
          let object = {};
          object.doctorId = selectedOption.value;
          object.date = formatedDate;
          object.timeType = time.keyMap;
          object.statusId = "S1";
          result.push(object);
        });
      } else {
        toast.error("Invalid timed");
      }
      let res = await getBulkCreateSchedule({
        arrSchedules: result,
        doctorId: selectedOption.value,
        date: formatedDate,
        statusId: "S1",
      });
      if (res && res.errCode === 0) {
        toast.success("Lưu thông tin thành công");
      } else {
        toast.error("Lưu thông tin thất bại");
      }
    }
  };

  render() {
    let { language } = this.props;
    let rangeTimes = this.state.allTimes;
    let yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
    return (
      <div className="manage-schedule-container">
        <div className="manage-schedule-title">
          <FormattedMessage id="manage-schedule.title" />
        </div>
        <div className="container">
          <div className="row">
            <div className="col-6 form-group">
              <label>
                <FormattedMessage id="manage-schedule.choose-doctor" />
              </label>
              <Select
                value={this.state.selectedOption}
                onChange={this.handleChangeSelect}
                options={this.state.dataDoctors}
                placeholder={
                  <FormattedMessage id="manage-schedule.choose-doctor" />
                }
              />
            </div>
            <div className="col-6 form-group">
              <label>
                <FormattedMessage id="manage-schedule.choose-day" />
              </label>
              <DatePicker
                onChange={(e) => this.handleChangeDate(e)}
                className="form-control"
                value={this.state.currentDate}
                minDate={yesterday}
              />
            </div>
            <div className="col-12 pick-hour-container">
              {rangeTimes &&
                rangeTimes.length > 0 &&
                rangeTimes?.map((item, index) => {
                  return (
                    <button
                      className={
                        item.isSelected
                          ? "btn-choose-schedule active"
                          : "btn-choose-schedule"
                      }
                      onClick={() => this.handleChooseTime(item)}
                      key={index}
                    >
                      {languages.VI === language ? item.valueVi : item.valueEn}
                    </button>
                  );
                })}
            </div>
            <div className="col-12">
              <button
                className="btn btn-primary add"
                onClick={this.handleSaveSchedule}
              >
                <FormattedMessage id="manage-schedule.save-infor" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    systemMenuPath: state.app.systemMenuPath,
    isLoggedIn: state.user.isLoggedIn,
    listDoctors: state.admin.dataDoctors,
    language: state.app.language,
    allTimes: state.admin.allTimes,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAllDoctor: () => dispatch(actions.fetchAllDoctor()),
    fetchAllTimes: () => dispatch(actions.getAllCodeTime()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);
