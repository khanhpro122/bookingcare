import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { languages } from "../../utils/constant";
import { changeLanguageApp } from "../../store/actions/appActions";
import { withRouter } from "react-router";
import * as actions from "../../store/actions";
import { getAllClinic, getAllSpecialty } from "../../services/userService";

class HomeHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allDataSpecialty: [],
      allDataClinic: [],
      isShowMenu: false,
      result: "",
    };
  }

  componentDidMount = async () => {
    this.interval = setInterval(this.handleRenderPlaceHolder, 2000);
    let allSpecialty = await getAllSpecialty();
    if (allSpecialty && allSpecialty.errCode === 0) {
      this.setState({
        allDataSpecialty: allSpecialty.data,
      });
    }
    let res = await getAllClinic();
    if (res && res.errCode === 0) {
      this.setState({
        allDataClinic: res.data,
      });
    }
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  changeLanguage = (language) => {
    this.props.changeLanguage(language);
  };
  returnHome = () => {
    if (this.props.history) {
      this.props.history.push("/home");
    }
  };

  handleSpecialty = () => {
    if (this.props.history) {
      this.props.history.push("/specialty");
    }
  };
  handleClinic = () => {
    if (this.props.history) {
      this.props.history.push("/all-clinic");
    }
  };
  handleDoctor = () => {
    if (this.props.history) {
      this.props.history.push("/all-doctor");
    }
  };
  handleShowMenuMobile = () => {
    this.props.openHandleMenu();
  };

  handleHandbook = () => {
    if (this.props.history) {
      this.props.history.push("/all-hand-book");
    }
  };

  handleShowSearch = () => {
    this.setState({
      isShowMenu: !this.state.isShowMenu,
    });
  };
  handleCloseMenu = () => {
    this.setState({
      isShowMenu: false,
    });
  };
  handleClinicDetails = (clinic) => {
    if (this.props.history) {
      this.props.history.push(`/details-clinic/${clinic.id}`);
    }
    this.setState({
      isShowMenu: false,
    });
  };
  handleSpecialtyDetails = (handbook) => {
    if (this.props.history) {
      this.props.history.push(`/details-specialty/${handbook.id}`);
    }
    this.setState({
      isShowMenu: false,
    });
  };

  handleRenderPlaceHolder = () => {
    let language = this.props.language;
    let result;
    if (language === languages.VI) {
      let random = Math.floor(Math.random() * 3);
      console.log(random);
      if (random === 1) {
        result = "Tìm bệnh viện";
      } else if (random === 2) {
        result = "Tìm chuyên khoa";
      } else {
        result = "Tìm bác sĩ";
      }
    } else {
      let random = Math.floor(Math.random() * 3);
      if (random === 1) {
        result = "Search hospital";
      } else if (random === 2) {
        result = "Search specialty";
      } else {
        result = "Search doctor";
      }
    }
    this.setState({
      result: result,
    });
  };
  render() {
    let language = this.props.language;
    let { isMenu } = this.props;
    let { allDataSpecialty, allDataClinic } = this.state;
    return (
      <>
        {this.state.isShowMenu && (
          <div className="overlay" onClick={this.handleCloseMenu}></div>
        )}
        <div className="home-header-container">
          <div className="home-header-content">
            <div className="left-content">
              {isMenu === true ? (
                <span
                  className="menu-header"
                  onClick={this.handleShowMenuMobile}
                >
                  <i className="fas fa-bars"></i>
                </span>
              ) : (
                ""
              )}
              <div className="header-logo" onClick={this.returnHome}></div>
            </div>
            <div className="center-content">
              <div className="children-content" onClick={this.handleSpecialty}>
                <div>
                  <b>
                    <FormattedMessage id="homeheader.speciality" />
                  </b>
                </div>
                <div className="sub-title">
                  <FormattedMessage id="homeheader.searchdoctor" />
                </div>
              </div>
              <div className="children-content" onClick={this.handleClinic}>
                <div>
                  <b>
                    <FormattedMessage id="homeheader.health-facility" />
                  </b>
                </div>
                <div className="sub-title">
                  <FormattedMessage id="homeheader.select-room" />
                </div>
              </div>
              <div className="children-content" onClick={this.handleDoctor}>
                <div>
                  <b>
                    <FormattedMessage id="homeheader.doctor" />
                  </b>
                </div>
                <div className="sub-title">
                  <FormattedMessage id="homeheader.select-doctor" />
                </div>
              </div>
              <div className="children-content" onClick={this.handleHandbook}>
                <div>
                  <b>
                    <FormattedMessage id="homeheader.fee" />
                  </b>
                </div>
                <div className="sub-title">
                  <FormattedMessage id="homeheader.check-headlth" />
                </div>
              </div>
            </div>
            <div className="right-content">
              <div className="support">
                <i className="fas fa-question-circle"></i>
                <span>
                  <FormattedMessage id="homeheader.support" />
                </span>
              </div>
              <div className="language">
                <div
                  className={
                    language === languages.VI
                      ? "language-vi active"
                      : "language-vi"
                  }
                >
                  <span onClick={() => this.changeLanguage(languages.VI)}>
                    VN
                  </span>
                </div>
                <div
                  className={
                    language === languages.EN
                      ? "language-en active"
                      : "language-en"
                  }
                >
                  <span onClick={() => this.changeLanguage(languages.EN)}>
                    EN
                  </span>
                </div>
              </div>
            </div>
          </div>
          {this.props.isBanner && (
            <div className="home-header-banner">
              <div className="content-up">
                <div className="title-one">
                  <FormattedMessage id="banner.title1" />
                </div>
                <div className="title-two">
                  <FormattedMessage id="banner.title2" />
                </div>
                <div className="header-search-container">
                  <div className="header-search">
                    <i className="fas fa-search"></i>
                    <input
                      type="text"
                      placeholder={this.state.result}
                      onClick={this.handleShowSearch}
                    />
                  </div>
                  <div className="menu-search">
                    {this.state.isShowMenu && (
                      <ul className="menu-item">
                        {allDataSpecialty &&
                          allDataSpecialty.length > 0 &&
                          allDataSpecialty?.map((item, index) => {
                            return (
                              <li
                                key={index}
                                onClick={() =>
                                  this.handleSpecialtyDetails(item)
                                }
                              >
                                {item.name}
                              </li>
                            );
                          })}
                        {allDataClinic &&
                          allDataClinic.length > 0 &&
                          allDataClinic?.map((item, index) => {
                            return (
                              <li
                                key={index}
                                onClick={() => this.handleClinicDetails(item)}
                              >
                                {item.name}
                              </li>
                            );
                          })}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
              <div className="content-down">
                <div className="options-list">
                  <div className="options-icon">
                    <i className="fas fa-hospital-alt"></i>
                  </div>
                  <div className="options-des">
                    <FormattedMessage id="banner.child1" />
                  </div>
                </div>
                <div className="options-list">
                  <div className="options-icon">
                    <i className="fas fa-mobile-alt"></i>
                  </div>
                  <div className="options-des">
                    <FormattedMessage id="banner.child2" />
                  </div>
                </div>
                <div className="options-list">
                  <div className="options-icon">
                    <i className="fas fa-address-book"></i>
                  </div>
                  <div className="options-des">
                    <FormattedMessage id="banner.child3" />
                  </div>
                </div>
                <div className="options-list">
                  <div className="options-icon">
                    <i className="fas fa-vials"></i>
                  </div>
                  <div className="options-des">
                    <FormattedMessage id="banner.child4" />
                  </div>
                </div>
                <div className="options-list">
                  <div className="options-icon">
                    <i className="fas fa-heartbeat"></i>
                  </div>
                  <div className="options-des">
                    <FormattedMessage id="banner.child5" />
                  </div>
                </div>
                <div className="options-list">
                  <div className="options-icon">
                    <i className="fab fa-affiliatetheme"></i>
                  </div>
                  <div className="options-des">
                    <FormattedMessage id="banner.child6" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </>
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
    changeLanguage: (language) => dispatch(changeLanguageApp(language)),
    openMenu: (isMenu) => dispatch(actions.changeMenu(isMenu)),
    getTopDoctor: () => dispatch(actions.fetchTopDoctor()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(HomeHeader)
);
