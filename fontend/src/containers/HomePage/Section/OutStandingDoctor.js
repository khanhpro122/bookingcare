import React, { Component } from "react";
import { connect } from "react-redux";
import "./Specialty.scss";
import Slider from "react-slick";
import * as actions from "../../../store/actions";
import { languages } from "../../../utils";
import { FormattedMessage } from "react-intl";
import { withRouter } from "react-router";

class OutStandingDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrDoctors: [],
    };
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.dataDoctors !== this.props.dataDoctors) {
      this.setState({
        arrDoctors: this.props.dataDoctors,
      });
    }
  }

  componentDidMount() {
    this.props.getTopDoctor();
  }
  handlerDetailsDoctor = (doctor) => {
    this.props.history.push(`/details-doctor/${doctor.id}`);
  };

  handleAllDoctor = () => {
    if (this.props.history) {
      this.props.history.push("/all-doctor");
    }
  };
  render() {
    let language = this.props.language;
    let arrDoctors = this.state.arrDoctors;
    const settings = this.props.settings;
    return (
      <div className="section-share section-outstading-doctor">
        <div className="section-container">
          <div className="section-header">
            <span className="section-title">
              <FormattedMessage id="homePage.out-standing-doctor" />
            </span>
            <button className="section-btn-more" onClick={this.handleAllDoctor}>
              <FormattedMessage id="homePage.see-more" />
            </button>
          </div>
          <div className="section-body">
            <Slider {...settings}>
              {arrDoctors &&
                arrDoctors.length > 0 &&
                arrDoctors?.map((item, index) => {
                  let nameVi = `${item.positionData.valueVi}, ${item.firstName} ${item.lastName}`;
                  let nameEn = `${item.positionData.valueEn}, ${item.lastName} ${item.firstName}`;
                  let imageBase64 = "";
                  if (item.image) {
                    imageBase64 = Buffer(item.image, "base64").toString(
                      "binary"
                    );
                  }
                  return (
                    <div
                      className="img-customize"
                      key={item.id}
                      onClick={() => this.handlerDetailsDoctor(item)}
                    >
                      <div className="border-customize">
                        <div className="out-img">
                          <div
                            className="section-img section-outstading-doctor"
                            style={{ backgroundImage: `url(${imageBase64})` }}
                          ></div>
                        </div>
                        <div className="position text-center">
                          <span className="name-img">
                            {languages.VI === language ? nameVi : nameEn}
                          </span>
                          <div className="tyle-doctor name-img">
                            {item?.Doctor_Infor?.specialtyData?.name}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </Slider>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    language: state.app.language,
    dataDoctors: state.admin.adminDoctor,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeLanguage: (language) => dispatch(actions.changeLanguageApp(language)),
    getTopDoctor: () => dispatch(actions.fetchTopDoctor()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(OutStandingDoctor)
);
