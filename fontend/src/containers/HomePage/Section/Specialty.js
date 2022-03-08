import React, { Component } from "react";
import { connect } from "react-redux";
import { changeLanguageApp } from "../../../store/actions/appActions";
import "./Specialty.scss";
import { FormattedMessage } from "react-intl";
import Slider from "react-slick";
import { getAllSpecialty } from "../../../services/userService";
import { withRouter } from "react-router";

class Specialty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allDataSpecialty: [],
    };
  }

  async componentDidMount() {
    let allSpecialty = await getAllSpecialty();
    if (allSpecialty && allSpecialty.errCode === 0) {
      this.setState({
        allDataSpecialty: allSpecialty.data,
      });
    }
  }
  handleDetailsSpecialty = (item) => {
    if (this.props.history) {
      this.props.history.push(`/details-specialty/${item.id}`);
    }
  };
  handleSeeMore = () => {
    if (this.props.history) {
      this.props.history.push("/specialty");
    }
  };

  render() {
    const settings = this.props.settings;
    let { allDataSpecialty } = this.state;
    return (
      <div className="section-share section-specialty">
        <div className="section-container">
          <div className="section-header">
            <span className="section-title">
              <FormattedMessage id="homePage.popular-specialty" />
            </span>
            <button
              className="section-btn-more"
              onClick={() => this.handleSeeMore()}
            >
              <FormattedMessage id="homePage.see-more" />
            </button>
          </div>
          <div className="section-body">
            <Slider {...settings}>
              {allDataSpecialty &&
                allDataSpecialty.length > 0 &&
                allDataSpecialty?.map((item, index) => {
                  return (
                    <div
                      className="img-customize"
                      key={index}
                      onClick={() => this.handleDetailsSpecialty(item)}
                    >
                      <div
                        className="section-img section-specialty"
                        style={{ backgroundImage: `url(${item.image})` }}
                      ></div>
                      <span className="name-img">{item.name}</span>
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeLanguage: (language) => dispatch(changeLanguageApp(language)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Specialty)
);
