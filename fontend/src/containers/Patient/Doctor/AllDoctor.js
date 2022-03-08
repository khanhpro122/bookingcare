import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../../store/actions";
import { languages } from "../../../utils";
import "./AllDoctor.scss";
import _ from "lodash";
import { withRouter } from "react-router";
import { FormattedMessage } from "react-intl";

class AllDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataDoctors: [],
      search: "",
    };
  }

  async componentDidMount() {
    await this.props.getAllDoctor();
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.dataDoctors !== this.props.dataDoctors) {
      this.setState({
        dataDoctors: this.props.dataDoctors,
      });
    }
  }
  returnHome = () => {
    if (this.props.history) {
      this.props.history.push("/home");
    }
  };
  handlerDetailsDoctor = (doctor) => {
    this.props.history.push(`/details-doctor/${doctor.id}`);
  };
  handleChangeSearch = (e) => {
    this.setState({
      search: e.target.value,
    });
  };

  render() {
    let { dataDoctors, search } = this.state;
    let { language } = this.props;
    return (
      <div className="all-doctor-container">
        <div className="header-doctor">
          <div className="all-doctor-header">
            <button onClick={this.returnHome}>
              <i className="fas fa-arrow-left return-home"></i>
            </button>
            <h2 className="name-doctor">Bác sĩ nổi bật tuần qua</h2>
          </div>
        </div>
        <div className="search-doctor">
          <input
            type="text"
            className="input-search"
            placeholder="Tìm kiếm bác sĩ"
            value={search}
            onChange={this.handleChangeSearch}
          />
        </div>
        <div className="all-doctor-body">
          <h5 className="title-body-doctor">Bác sĩ tuần qua</h5>
          {dataDoctors &&
            dataDoctors.length > 0 &&
            dataDoctors
              .filter((doctor) => {
                if (search === "") {
                  return doctor;
                } else if (
                  doctor?.lastName?.toLowerCase().includes(search.toLowerCase())
                ) {
                  return doctor;
                } else if (
                  doctor?.firstName
                    ?.toLowerCase()
                    .includes(search.toLowerCase())
                ) {
                  return doctor;
                } else if (
                  doctor?.Doctor_Infor?.specialtyData?.name
                    .toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .includes(
                      search
                        .toLowerCase()
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                    )
                ) {
                  return doctor;
                }
              })
              ?.map((item, index) => {
                let imageBase64 = "";
                if (item.image) {
                  imageBase64 = Buffer(item.image, "base64").toString("binary");
                }
                return (
                  <div
                    className="doctor-item"
                    key={index}
                    onClick={() => this.handlerDetailsDoctor(item)}
                  >
                    <div
                      className="doctor-image"
                      style={{ backgroundImage: `url(${imageBase64})` }}
                    ></div>
                    <div className="doctor-name">
                      {item.lastName} {item.firstName}
                    </div>
                    <div className="doctor-specialty">
                      {item?.Doctor_Infor?.specialtyData?.name}
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    dataDoctors: state.admin.dataDoctors,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllDoctor: () => dispatch(actions.fetchAllDoctor()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AllDoctor)
);
