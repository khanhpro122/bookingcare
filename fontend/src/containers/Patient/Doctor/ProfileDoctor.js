import React, { Component } from 'react';
import { connect } from "react-redux";
import './ProfileDoctor.scss'
import { getProfileDoctorById } from '../../../services/userService'
import { languages } from '../../../utils';
import NumberFormat from 'react-number-format';
import _ from 'lodash';
import moment from 'moment';
import {FormattedMessage} from 'react-intl'
import { withRouter } from 'react-router';
import { Link} from 'react-router-dom'

class ProfileDoctor extends Component {
    constructor(props) {
        super(props)
        this.state = {
           doctorProfile : []
        }
    }
    async componentDidMount() {
        let data = await this.getDoctorProfile(this.props.doctorId)
        this.setState({
            doctorProfile : data 
        })
    }
    
    getDoctorProfile = async (doctorId) => {
        let result = []
        if(doctorId) {
            let res = await getProfileDoctorById(doctorId)
            if(res && res.errCode === 0){
                result = res.data
            }
        }
        return result;
    }
    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    getTimeClinic = (dateTime) => {
        let { language } = this.props
        if(dateTime && !_.isEmpty(dateTime)) {
            let date = language === languages.VI 
            ?
            moment.unix(+dateTime.date / 1000).format('dddd - DD/MM/YYYY')
            : 
            moment.unix(+dateTime.date / 1000).locale('en').format('ddd - MM/DD/YYYY')
            date = this.capitalizeFirstLetter(date)
            let time = language === languages.VI 
            ? dateTime.timeTypeData.valueVi
            : dateTime.timeTypeData.valueEn
           return(
                <>
                    <div>{`${time} - ${date}`}</div>
                    <div><FormattedMessage id="admin.modal-booking.booking-free"/></div>
                </>
           ) 
        }
        return
    }
    async componentDidUpdate(prevProps, prevState) {
        if(prevProps.doctorId !== this.props.doctorId){
            let data = await this.getDoctorProfile(this.props.doctorId)
            this.setState({
                doctorProfile : data 
            })
        }
    }
    
    render() {

        let { doctorProfile } = this.state
        let { language, isShowDetailsDoctor, dateTime,  isShowPrice, doctorId} = this.props
        let nameVi ='', nameEn =''
        if(doctorProfile && doctorProfile.positionData) {
            nameVi = `${doctorProfile.positionData.valueVi}, ${doctorProfile.firstName} ${doctorProfile.lastName}`;
            nameEn = `${doctorProfile.positionData.valueEn}, ${doctorProfile.lastName} ${doctorProfile.firstName}`;
        }
        return (
            <div className="profile-doctor-container">
                <div className="intro-doctor">
                    <div className="content-left"
                    style={{backgroundImage: `url(${doctorProfile.image})`}}
                    >
                    </div>
                    <div className="content-right">
                        <div className="up">
                            <h2>
                                {language === languages.VI ? nameVi : nameEn}
                            </h2>
                        </div>
                        <div className="down">
                            <span>
                                {isShowDetailsDoctor ?
                                <>
                                    {doctorProfile && 
                                    doctorProfile.Markdown && 
                                    doctorProfile.Markdown.description}
                                </>
                                : 
                                <>
                                    {this.getTimeClinic(dateTime)}
                                </>
                                }
                            </span>
                        </div>
                    </div>
                </div>
                {isShowPrice 
                ?(
                <Link className="btn-show-details" to={`/details-doctor/${doctorId}`}
                ><FormattedMessage id="details-clinic.see-more"/></Link>
                ) : (
                    <div className="price-clinic">
                        <span className="price"><FormattedMessage id="admin.modal-booking.price"/>  </span>
                        {doctorProfile && doctorProfile.Doctor_Infor 
                        &&  doctorProfile.Doctor_Infor.priceTypeData 
                        && languages.VI === language
                        &&
                        <NumberFormat value={doctorProfile?.Doctor_Infor?.priceTypeData?.valueVi} displayType={'text'} thousandSeparator={true} suffix={'vnđ'} />
                        }
                        {doctorProfile && doctorProfile.Doctor_Infor 
                        &&  doctorProfile.Doctor_Infor.priceTypeData 
                        && languages.EN === language
                        &&
                        <NumberFormat value={doctorProfile?.Doctor_Infor?.priceTypeData?.valueEn} displayType={'text'} thousandSeparator={true} suffix={'$'} />
                        }
                    </div>
                )
                }
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProfileDoctor));
