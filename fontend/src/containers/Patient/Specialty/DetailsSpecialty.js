import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../../store/actions";
import { languages } from "../../../utils";
import HomeHeader from "../../HomePage/HomeHeader";
import DoctorExtraInfor from "../Doctor/DoctorExtraInfor";
import DoctorSchedule from "../Doctor/DoctorSchedule";
import ProfileDoctor from "../Doctor/ProfileDoctor";
import "./DetailsSpecialty.scss";
import { getDetailSpecialty, getAllCode } from "../../../services/userService";
import _ from "lodash";
import { FormattedMessage } from "react-intl";

class DetailsSpecialty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrDoctorId: [],
      dataSpecialty: {},
      allDataProvince: [],
      isShowDetails: false,
    };
  }

  async componentDidMount() {
    if (
      this.props.match &&
      this.props.match.params &&
      this.props.match.params.id
    ) {
      let id = this.props.match.params.id;
      let res = await getDetailSpecialty({
        id: id,
        location: "ALL",
      });
      let resProvince = await getAllCode("PROVINCE");

      if (
        res &&
        res.errCode === 0 &&
        resProvince &&
        resProvince.errCode === 0
      ) {
        let arrDoctorId = [];
        let data = res.data;
        let arr = data.doctorSpecialty;
        if (data && !_.isEmpty(data)) {
          arr?.map((item) => {
            arrDoctorId.push(item.doctorId);
          });
        }
        let dataProvince = resProvince.data;
        if (dataProvince && dataProvince.length > 0) {
          dataProvince.unshift({
            keyMap: "ALL",
            type: "PROVINCE",
            updatedAt: null,
            valueEn: "All",
            valueVi: "Toàn quốc",
          });
        }
        this.setState({
          dataSpecialty: res.data,
          arrDoctorId: arrDoctorId,
          allDataProvince: dataProvince ? dataProvince : [],
        });
      }
    }
  }
  componentDidUpdate(prevProps, prevState) {}
  handleChangeProvince = async (e) => {
    if (
      this.props.match &&
      this.props.match.params &&
      this.props.match.params.id
    ) {
      let id = this.props.match.params.id;
      let location = e.target.value;
      let res = await getDetailSpecialty({
        id: id,
        location: location,
      });

      if (res && res.errCode === 0) {
        let arrDoctorId = [];
        let data = res.data;
        let arr = data.doctorSpecialty;
        if (data && !_.isEmpty(data)) {
          arr?.map((item) => {
            arrDoctorId.push(item.doctorId);
          });
        }

        this.setState({
          dataSpecialty: res.data,
          arrDoctorId: arrDoctorId,
        });
      }
    }
  };
  handleShowDetail = (status) => {
    this.setState({
      isShowDetails: status,
    });
  };
  render() {
    let { arrDoctorId, dataSpecialty, allDataProvince } = this.state;
    let { language } = this.props;
    return (
      <div className="detail-specialty-container">
        <HomeHeader isBanner={false} isMenu={false} />
        <div className="details-specialty-body">
          <div className="details-specialty-header">
            {!this.state.isShowDetails ? (
              <>
                <div className="details-specialty-description">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: dataSpecialty.descriptionHTML,
                    }}
                  ></div>
                </div>
                <span
                  className="btn-show-more"
                  onClick={() => this.handleShowDetail(true)}
                >
                  <FormattedMessage id="details-specialty.see-more" />
                </span>
              </>
            ) : (
              <>
                <div className="details-specialty-description show-more">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: dataSpecialty.descriptionHTML,
                    }}
                  ></div>
                </div>
                <span
                  className="btn-show-more"
                  onClick={() => this.handleShowDetail(false)}
                >
                  <FormattedMessage id="details-specialty.hide" />
                </span>
              </>
            )}
          </div>
          <div className="each-specialty-body">
            <div className="search-province-specialty">
              <select
                onChange={(e) => this.handleChangeProvince(e)}
                className="select-province"
              >
                {allDataProvince &&
                  allDataProvince.length > 0 &&
                  allDataProvince?.map((item, index) => {
                    return (
                      <option key={index} value={item.keyMap}>
                        {language === languages.VI
                          ? item.valueVi
                          : item.valueEn}
                      </option>
                    );
                  })}
              </select>
            </div>
            {arrDoctorId &&
              arrDoctorId.length > 0 &&
              arrDoctorId?.map((item, index) => {
                return (
                  <div className="each-specialty" key={index}>
                    <div className="content-left-dts">
                      <ProfileDoctor
                        doctorId={item}
                        isShowDetailsDoctor={true}
                        isShowPrice={true}
                      />
                    </div>
                    <div className="content-right-dts">
                      <div className="doctor-schedule">
                        <DoctorSchedule doctorIDfromParent={item} />
                      </div>
                      <div className="doctor-extra-infor">
                        <DoctorExtraInfor doctorIDfromParent={item} />
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAllTimes: () => dispatch(actions.getAllCodeTime()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailsSpecialty);
