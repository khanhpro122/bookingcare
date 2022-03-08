import React, { Component } from 'react';
import { connect } from 'react-redux';
import './HomeFooter.scss'
import imgCerti from '../../assets/images/bo-cong-thuong.svg'
import map from '../../assets/images/map.svg'
import check from '../../assets/images/check.svg'
import { FormattedMessage } from 'react-intl';

class HomeFooter extends Component {
    
    render() {
        return (
            <div className="home-footer">
                <div className="home-footer-left">
                    <div className="footer-logo"></div>
                    <div className="footer-name-company">
                        <FormattedMessage id="footer.name-company" />
                    </div>
                    <div className="footer-address">
                        <img src={map} alt="map" />
                        <FormattedMessage id="footer.address" />
                    </div>
                    <div className="footer-certification">
                        <img src={check} alt="check" />
                        <FormattedMessage id="footer.certification" />
                    </div>
                    <div className="footer-image-cer">
                        <a href="http://online.gov.vn/Home/WebDetails/68563?AspxAutoDetectCookieSupport=1" target="_blank" rel="noreferrer">
                            <img src={imgCerti} alt="bo-cong thuong"/>
                        </a>
                        <a href="http://online.gov.vn/Home/WebDetails/68563?AspxAutoDetectCookieSupport=1" target="_blank" rel="noreferrer">
                            <img src={imgCerti} alt="bo-cong thuong"/>
                        </a>
                    </div>
                </div>
                <div className="home-footer-right">
                    <div className="center-container">
                        <div className="name-center">
                            <FormattedMessage id="footer.center-hanoi" />
                        </div>
                        <div className="name-address">
                            <FormattedMessage id="footer.address-hanoi" />
                        </div>
                    </div>
                    <div className="center-container">
                        <div className="name-center">
                            <FormattedMessage id="footer.center-hcm" />
                        </div>
                        <div className="name-address">
                            <FormattedMessage id="footer.address-hcm" />
                        </div>
                    </div>
                    <div className="center-container">
                        <div className="name-center">
                            <FormattedMessage id="footer.support" />
                        </div>
                        <div className="name-address">
                            <FormattedMessage id="footer.support-address" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeFooter);
