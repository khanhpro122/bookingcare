import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import Slider from "react-slick";
import * as actions from "../../../store/actions";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { withRouter } from "react-router";

class HandBook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataHandBook: [],
    };
  }
  async componentDidMount() {
    await this.props.getAllDataHandBook();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.allDataHandBook !== this.props.allDataHandBook) {
      this.setState({
        dataHandBook: this.props.allDataHandBook,
      });
    }
  }

  detailsHandBook = (handbook) => {
    if (this.props.history) {
      this.props.history.push(`/details-handbook/${handbook.id}`);
    }
  };
  handleAllHandBook = () => {
    if (this.props.history) {
      this.props.history.push("/all-hand-book");
    }
  };

  render() {
    let { dataHandBook } = this.state;
    let settings = {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 2,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 1025,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            infinite: true,
            dots: false,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: true,
            dots: false,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: true,
            dots: false,
          },
        },
      ],
    };

    return (
      <div className="section-share section-hand-book">
        <div className="section-container">
          <div className="section-header">
            <span className="section-title">Cẩm nang</span>
            <button
              className="section-btn-more"
              onClick={this.handleAllHandBook}
            >
              <FormattedMessage id="homePage.see-more" />
            </button>
          </div>
          <div className="section-body section-hand-book">
            <Slider {...settings}>
              {dataHandBook &&
                dataHandBook.length > 0 &&
                dataHandBook?.map((item, index) => {
                  return (
                    <div
                      className="img-customize section-hand-book"
                      key={index}
                      onClick={() => this.detailsHandBook(item)}
                    >
                      <div className="border-customize">
                        <div className="out-img">
                          <div
                            className="section-img section-hand-book"
                            style={{ backgroundImage: `url(${item.image})` }}
                          ></div>
                        </div>
                        <div className="position text-center">
                          <span>{item.name}</span>
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
    allDataHandBook: state.admin.allDataHandBook,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllDataHandBook: () => dispatch(actions.getAllHandBookData()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(HandBook)
);
