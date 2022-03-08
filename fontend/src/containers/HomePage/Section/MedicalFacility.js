import React, { Component } from "react";
import { connect } from "react-redux";
import "./MedicalFacility.scss";
import { FormattedMessage } from "react-intl";
import Slider from "react-slick";
import { getAllClinic } from "../../../services/userService";
import { withRouter } from "react-router";

class MedicalFacility extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allDataClinic: [],
    };
  }

  async componentDidMount() {
    let res = await getAllClinic();
    if (res && res.errCode === 0) {
      this.setState({
        allDataClinic: res.data,
      });
    }
  }
  detailsClinic = (clinic) => {
    if (this.props.history) {
      this.props.history.push(`/details-clinic/${clinic.id}`);
    }
  };
  handleAllClinic = () => {
    if (this.props.history) {
      this.props.history.push("/all-clinic");
    }
  };

  render() {
    let { allDataClinic } = this.state;
    return (
      <div className="section-share medial-facility">
        <div className="section-container">
          <div className="section-header">
            <span className="section-title">Cơ sở y tế nổi bật</span>
            <button className="section-btn-more" onClick={this.handleAllClinic}>
              <FormattedMessage id="homePage.see-more" />
            </button>
          </div>
          <div className="section-body">
            <Slider {...this.props.settings}>
              {allDataClinic &&
                allDataClinic.length > 0 &&
                allDataClinic?.map((item, index) => {
                  return (
                    <div
                      className="img-customize"
                      key={index}
                      onClick={() => this.detailsClinic(item)}
                    >
                      <div
                        className="section-img medical-facility"
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(MedicalFacility)
);
