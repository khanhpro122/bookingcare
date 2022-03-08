import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../../store/actions";
import { languages } from "../../../utils";
import "./AllClinic.scss";
import { withRouter } from "react-router";

class AllClinic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allDataClinic: [],
      search: "",
    };
  }

  async componentDidMount() {
    await this.props.getAllClinic();
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.allDataClinic !== this.props.allDataClinic) {
      this.setState({
        allDataClinic: this.props.allDataClinic,
      });
    }
  }
  returnHome = () => {
    if (this.props.history) {
      this.props.history.push("/home");
    }
  };

  detailsClinic = (clinic) => {
    if (this.props.history) {
      this.props.history.push(`/details-clinic/${clinic.id}`);
    }
  };

  handleChangeSearch = (e) => {
    this.setState({
      search: e.target.value,
    });
  };

  render() {
    let { allDataClinic, search } = this.state;
    let { language } = this.props;
    return (
      <div className="all-clinic-container">
        <div className="header-clinic">
          <div className="all-clinic-header">
            <button onClick={this.returnHome}>
              <i className="fas fa-arrow-left return-home"></i>
            </button>
            <h2 className="name-clinic">Phòng khám</h2>
          </div>
        </div>
        <div className="search-clinic">
          <input
            type="text"
            className="input-search"
            placeholder="Tìm kiếm phòng khám"
            value={this.state.search}
            onChange={this.handleChangeSearch}
          />
        </div>
        <div className="all-clinic-body">
          {allDataClinic &&
            allDataClinic.length > 0 &&
            allDataClinic
              .filter((item) => {
                if (search === "") {
                  return item;
                } else if (
                  item?.name
                    ?.toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .includes(
                      search
                        .toLowerCase()
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                    )
                ) {
                  return item;
                }
              })
              ?.map((item, index) => {
                return (
                  <div
                    className="clinic-item"
                    key={index}
                    onClick={() => this.detailsClinic(item)}
                  >
                    <div
                      className="clinic-image"
                      style={{ backgroundImage: `url(${item.image})` }}
                    ></div>
                    <div className="clinic-name">{item.name}</div>
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
    allDataClinic: state.admin.allDataClinic,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllClinic: () => dispatch(actions.getAllClinicData()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AllClinic)
);
