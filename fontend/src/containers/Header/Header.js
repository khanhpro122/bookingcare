import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import * as actions from "../../store/actions";
import Navigator from '../../components/Navigator';
import { adminMenu, doctorMenu } from './menuApp';
import './Header.scss';
import { languages, ROLE } from '../../utils/constant';
import { changeLanguageApp } from '../../store/actions/appActions';
import { FormattedMessage } from 'react-intl'
import _ from 'lodash';



class Header extends Component {
    constructor(props) {
        super(props);
        this.state= {
            menuApp : []
        }
    }
    handleChangeLanguage = (language) => {
        this.props.changeLanguage(language);
    }

    componentDidMount() {
        let { userInfo } = this.props
        let menu = []
        if(userInfo && !_.isEmpty(userInfo)){
            let role = userInfo.roleId
            if(role === ROLE.ADMIN) {
                menu = adminMenu
            }else if(role === ROLE.DOCTOR) {
                menu = doctorMenu
            }
        }
        this.setState({
            menuApp: menu
        })
    }
    render() {
        const { processLogout, language, userInfo } = this.props;
        return (
            <div className="header-container">
                {/* thanh navigator */}
                <div className="header-tabs-container">
                    <Navigator menus={this.state.menuApp} />
                </div>
                <div className="languages">
                    <span className="welcome"><FormattedMessage id="homeheader.welcome"/> {userInfo && userInfo.firstName}</span>
                    <span className={language === 'vi' ? "language-vi active" : "language-vi"} 
                    onClick={() => this.handleChangeLanguage(languages.VI)}
                    >VI</span>
                    <span className={language === 'en' ? "language-en active" : "language-en"} 
                    onClick={() => this.handleChangeLanguage(languages.EN)}
                    >EN</span>
                    <div className="btn btn-logout" onClick={processLogout} title="Log out">
                        <i className="fas fa-sign-out-alt"></i>
                    </div>
                </div>
                {/* nút logout */}
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
        changeLanguage: (language) =>  dispatch(changeLanguageApp(language))
        
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
