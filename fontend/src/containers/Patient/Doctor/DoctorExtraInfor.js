import React, { Component } from 'react';
import { connect } from "react-redux";
import './DetailsDoctor.scss'
import * as actions from '../../../store/actions'
import { languages } from '../../../utils';
import './DoctorExtraInfor.scss'
import { getExtraDoctorInfor } from '../../../services/userService';
import NumberFormat from 'react-number-format';
import { FormattedMessage } from 'react-intl'


class DoctorExtraInfor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isShowDetails: false,
            extraInfor : []
        }
    }

    handleShowDetails = (status) => {
        this.setState({
            isShowDetails: status
        })
    }
    async componentDidMount() {
        let data = await getExtraDoctorInfor(this.props.doctorIDfromParent)
        if(data && data.errCode === 0) {
            this.setState({
                extraInfor : data.data
            })
        }
    }
    async componentDidUpdate(prevProps, prevState) {
        if(this.props.doctorIDfromParent !== prevProps.doctorIDfromParent) {
            let data = await getExtraDoctorInfor(this.props.doctorIDfromParent)
            if(data && data.errCode === 0) {
                this.setState({
                    extraInfor : data.data
                })
            }
        }
    }
    
    render() {
        let {isShowDetails, extraInfor} = this.state
        let {language } = this.props
        return (
            <div className="doctor-extra-infor-container">
                <div className="content-up">
                    <div className="text-address">
                        <FormattedMessage id="admin.extra-doctor.address-clinic"/>
                    </div>
                    <div className="name-clinic">
                        {extraInfor && extraInfor.nameClinic ? extraInfor.nameClinic : ''}
                    </div>
                    <div className="details-address">
                        {extraInfor && extraInfor.addressClinic ? extraInfor.addressClinic : ''}
                    </div>
                </div>
                <div className="content-down">
                    <div className="price-clinic">
                        <span className="price-title">
                            <FormattedMessage id="admin.extra-doctor.price-clinic"/>
                        </span>
                        {!isShowDetails ? 
                        <span>
                            {extraInfor && extraInfor.priceTypeData &&  extraInfor.priceTypeData.valueVi 
                            && languages.VI === language
                            &&
                            <NumberFormat value={extraInfor.priceTypeData.valueVi} displayType={'text'} thousandSeparator={true} suffix={'vnđ'} />
                            }
                            {
                                extraInfor && extraInfor.priceTypeData &&  extraInfor.priceTypeData.valueEn 
                                && languages.EN === language
                                &&
                                <NumberFormat value={extraInfor.priceTypeData.valueEn} displayType={'text'} thousandSeparator={true} suffix={'$'} />
                            }
                        </span>
                         : ''}
                        {!isShowDetails
                        ? (
                        <>
                            <span className="show-more"
                                onClick={() => this.handleShowDetails(true)}
                            > 
                                <FormattedMessage id="admin.extra-doctor.see-details"/>
                            </span>
                        </>
                        ) : (
                            <>
                                <div className="more-infor">
                                    <div className="clinic-money">
                                        <div className="more-infor-up">
                                            <span className="more-infor-title">
                                                <FormattedMessage id="admin.extra-doctor.price-clinic"/>
                                            </span>
                                            <span className="more-infor-title">
                                                {extraInfor && extraInfor.priceTypeData &&  extraInfor.priceTypeData.valueVi 
                                                && languages.VI === language
                                                &&
                                                <NumberFormat value={extraInfor.priceTypeData.valueVi} displayType={'text'} thousandSeparator={true} suffix={'vnđ'} />
                                                }
                                                {
                                                    extraInfor && extraInfor.priceTypeData &&  extraInfor.priceTypeData.valueEn 
                                                    && languages.EN === language
                                                    &&
                                                    <NumberFormat value={extraInfor.priceTypeData.valueEn} displayType={'text'} thousandSeparator={true} suffix={'$'} />
                                                }
                                            </span>
                                        </div>
                                        <span>
                                            <FormattedMessage id="admin.extra-doctor.content-up"/>
                                        </span>
                                    </div>
                                    <div className="clinic-payment">
                                        <FormattedMessage id="admin.extra-doctor.content-down"/>
                                    </div>
                                    <div>
                                        <span className="show-more"
                                            onClick={() => this.handleShowDetails(false)}
                                        >
                                            <FormattedMessage id="admin.extra-doctor.hide"/>
                                        </span>
                                    </div>
                                </div>
                            </>
                        )
                        }
                    </div>
                    
                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(DoctorExtraInfor);
