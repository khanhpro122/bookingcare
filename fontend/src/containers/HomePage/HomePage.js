import React, { Component } from 'react';
import { connect } from 'react-redux';
import HomeHeader from './HomeHeader';
import './HomeHeader.scss'
import './HomePage.scss'
import Specialty from './Section/Specialty';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import MedicalFacility from './Section/MedicalFacility';
import OutStandingDoctor from './Section/OutStandingDoctor';
import HandBook from './Section/HandBook';
import About from './Section/About';
import HomeFooter from './HomeFooter';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router';
import * as actions from '../../store/actions'


class HomePage extends Component {
    constructor(props) {
      super(props);
      this.state={
        isShowMenu : false,
      }
    }
    componentDidMount() {
    }
    componentDidUpdate(prevProps, prevState) {
      if(prevProps.isMenu !== this.props.isMenu) {
        
      }
    }
    openHandleMenu = () => {
      this.setState({
        isShowMenu : true
      })
    }
    closeHandleMenu = () => {
      this.setState({
        isShowMenu : false
      })
    }
    returnHome = () => {
      if(this.props.history) {
          this.props.history.push('/home')
      }
    }
  
    handleSpecialty = () => {
        if(this.props.history) {
            this.props.history.push('/specialty')
        }
    }
    handleClinic = () => {
        if(this.props.history) {
            this.props.history.push('/all-clinic')
        }
    }
    handleDoctor = () => {
        if(this.props.history) {
            this.props.history.push('/all-doctor')
        }
    }
    render() {
        const settings = {
            dots: false,
            infinite: false,
            speed: 500,
            slidesToShow: 4,
            slidesToScroll: 1,
            initialSlide: 0,
            responsive: [
                {
                  breakpoint: 1025,
                  settings: {
                    slidesToShow: 3,
                    speed: 500,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false
                  }
                },
                {
                  breakpoint: 600,
                  settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false
                  }
                },
                {
                  breakpoint: 480,
                  settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false
                  }
                }
            ]
        };
        let {isShowMenu} = this.state
        return (
            <div className="container-web">
                {isShowMenu &&
                (
                  <div className="container-overlay"
                  onClick={this.closeHandleMenu}
                  ></div>
                )
                }
                {isShowMenu &&
                (
                  <div className="menu-mobile">
                    <div className="children-content-mobile"
                    onClick={this.closeHandleMenu}
                    >
                        <div>
                          <b>
                            <FormattedMessage id="homeheader.home" />
                          </b>
                        </div>
                    </div>
                    <div className="children-content-mobile"
                    onClick={this.handleSpecialty}
                    >
                        <div><b><FormattedMessage id="homeheader.speciality" /></b></div>
                    </div>
                    <div className="children-content-mobile"
                    onClick={this.handleClinic}
                    >
                        <div><b><FormattedMessage id="homeheader.health-facility" /></b></div>
                    </div>
                    <div className="children-content-mobile"
                    onClick={this.handleDoctor}
                    
                    >
                        <div><b><FormattedMessage id="homeheader.doctor" /></b></div>
                    </div>
                    <div className="children-content-mobile">
                        <div><b><FormattedMessage id="homeheader.fee" /></b></div>
                    </div>
                  </div>
                )
                }
                <HomeHeader isBanner={true}
                openHandleMenu={this.openHandleMenu}
                isMenu={true}
                />
                <Specialty settings={settings}/>
                <MedicalFacility settings={settings}/>
                <OutStandingDoctor settings={settings}/>
                <HandBook/>
                <About />
                <HomeFooter />
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        isMenu: state.admin.isMenu
    };
};

const mapDispatchToProps = dispatch => {
    return {
      changeMenu: (isMenu) =>  dispatch(actions.changeMenu(isMenu))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomePage));
