import React, { Component } from 'react';
import { connect } from "react-redux";
// import * as actions from '../../../store/actions'
// import { languages } from '../../../utils';
import './VerifyEmail.scss'
import {verifyBookingPatient } from '../../services/userService'
import { emitter } from '../../utils/emitter';
import * as actions from '../../store/actions'

class VerifyEmail extends Component {
    constructor(props) {
        super(props)
        this.state = {
           token : '',
           doctorId: '',
           isConfirm: false,
           isLoader: false,
           isCheck : false
        }
    }

    async componentDidMount() {
            let urlParam = new URLSearchParams(this.props.location.search);
            let token = urlParam.get('token')
            let doctorId = urlParam.get('doctorId')
            this.setState({
                token : token,
                doctorId : doctorId
            })

            let res = await verifyBookingPatient({
                token : token,
                doctorId : doctorId
            })

        if(res && res.errCode === 0) {
            this.setState({
                isConfirm : true,
                isLoader: true
            })
        }if(res && res.errCode === 10) {
            this.setState({
                isConfirm : true,
                isLoader: true,
                isCheck : true
            })
        }
        else {
            this.setState({
                isConfirm: false,
                isLoader: true
            })
        }

    }
    componentDidUpdate(prevProps, prevState) {
       
    }
    render() {
        return (
            <> 
            {
                this.state.isLoader 
                ?
                (<>
                    {this.state.isConfirm &&
                    this.state.isCheck 
                    ?
                    (
                        <div className="button-confirm">
                            <div className="title-success">Bạn đã xác nhận rồi</div>
                            <div className="title-success">Hẹn gặp quý khách ở phòng khám</div>
                            <div className="thanks-success">Xin chân thành cảm ơn quý khách!!!</div>
                        </div>
                        
                    ) : (
                        <div className="button-confirm">
                            <div className="title-success">Bạn đã xác nhận thành công</div>
                            <div className="title-success">Hẹn gặp quý khách ở phòng khám</div>
                            <div className="thanks-success">Xin chân thành cảm ơn quý khách!!!</div>
                        </div>
                    )
                    }
                </>)

                : (<div className="is-loader"></div>)
            }
            </>
            
        );
    }
}

const mapStateToProps = state => {
    return {
        dataScheduleByDate : state.admin.dataScheduleByDate,
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(VerifyEmail);
