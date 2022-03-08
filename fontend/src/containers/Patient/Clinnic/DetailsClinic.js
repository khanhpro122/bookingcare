import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../../store/actions";
import { languages } from "../../../utils";
import HomeHeader from "../../HomePage/HomeHeader";
import DoctorExtraInfor from "../Doctor/DoctorExtraInfor";
import DoctorSchedule from "../Doctor/DoctorSchedule";
import ProfileDoctor from "../Doctor/ProfileDoctor";
import "./DetailsClinic.scss";
import { getDetailClinic, getAllCode } from "../../../services/userService";
import _ from "lodash";
import { FormattedMessage } from "react-intl";

class DetailsClinic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrDoctorId: [],
      dataClinic: {},
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
      let res = await getDetailClinic({
        clinicId: id,
      });

      if (res && res.errCode === 0) {
        let arrDoctorId = [];
        let data = res.data;
        let arr = data.doctorClinic;
        if (data && !_.isEmpty(data)) {
          arr?.map((item) => {
            arrDoctorId.push(item.doctorId);
          });
        }

        this.setState({
          dataClinic: res.data,
          arrDoctorId: arrDoctorId,
        });
      }
    }
  }
  componentDidUpdate(prevProps, prevState) {}

  handleShowDetail = (status) => {
    this.setState({
      isShowDetails: status,
    });
  };
  render() {
    let { arrDoctorId, dataClinic } = this.state;
    let { language } = this.props;
    return (
      <div className="detail-clinic-container">
        <HomeHeader isBanner={false} isMenu={false} />
        <div className="details-clinic-body">
          <div className="details-clinic-header">
            {!this.state.isShowDetails ? (
              <>
                <div className="details-clinic-description">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: dataClinic.descriptionHTML,
                    }}
                  ></div>
                </div>
                <span
                  className="btn-show-more"
                  onClick={() => this.handleShowDetail(true)}
                >
                  <FormattedMessage id="details-clinic.see-more" />
                </span>
              </>
            ) : (
              <>
                <div className="details-clinic-description show-more">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: dataClinic.descriptionHTML,
                    }}
                  ></div>
                </div>
                <span
                  className="btn-show-more"
                  onClick={() => this.handleShowDetail(false)}
                >
                  <FormattedMessage id="details-clinic.hide" />
                </span>
              </>
            )}
          </div>
          <div className="each-clinic-body">
            {arrDoctorId &&
              arrDoctorId.length > 0 &&
              arrDoctorId?.map((item, index) => {
                return (
                  <div className="each-clinic" key={index}>
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailsClinic);
