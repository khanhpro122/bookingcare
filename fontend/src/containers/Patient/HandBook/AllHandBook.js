import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../../store/actions";
import { languages } from "../../../utils";
import "./AllHandBook.scss";
import { withRouter } from "react-router";

class AllHandBook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allDataHandBook: [],
    };
  }

  async componentDidMount() {
    await this.props.getAllHandBook();
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.allDataHandBook !== this.props.allDataHandBook) {
      this.setState({
        allDataHandBook: this.props.allDataHandBook,
      });
    }
  }
  returnHome = () => {
    if (this.props.history) {
      this.props.history.push("/home");
    }
  };

  detailsHandBook = (handbook) => {
    if (this.props.history) {
      this.props.history.push(`/details-handbook/${handbook.id}`);
    }
  };
  render() {
    let { allDataHandBook } = this.state;
    let { language } = this.props;
    return (
      <div className="all-handBook-container">
        <div className="header-handBook">
          <div className="all-handBook-header">
            <button onClick={this.returnHome}>
              <i className="fas fa-arrow-left return-home"></i>
            </button>
            <h2 className="name-handBook">Cẩm nang</h2>
          </div>
        </div>
        <div className="all-handBook-body">
          {allDataHandBook &&
            allDataHandBook.length > 0 &&
            allDataHandBook?.map((item, index) => {
              return (
                <div
                  className="handBook-item"
                  key={index}
                  onClick={() => this.detailsHandBook(item)}
                >
                  <div className="handBook-image">
                    <img
                      src={item.image}
                      alt="anh"
                      className="handBook-img-item"
                    />
                  </div>
                  <div className="handBook-name">{item.name}</div>
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
    allDataHandBook: state.admin.allDataHandBook,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllHandBook: () => dispatch(actions.getAllHandBookData()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AllHandBook)
);
