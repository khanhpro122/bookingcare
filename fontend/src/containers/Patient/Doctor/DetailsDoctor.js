import React, { Component } from 'react';
import { connect } from "react-redux";
import HomeHeader from '../../HomePage/HomeHeader';
import * as actions from '../../../store/actions'
import { languages } from '../../../utils';
import DoctorSchedule from './DoctorSchedule';
import DoctorExtraInfor from './DoctorExtraInfor';
import './DetailsDoctor.scss'
import ShareLikeButton from '../../Patient/LikeSharePlugin/ShareLikeButton';
import Comment from '../LikeSharePlugin/Comment';
require('dotenv').config();

class DetailsDoctor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            detailsDoctor: [],
            currentDoctorId: -1,
        }
    }

    componentDidMount() {
        if(this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id
            this.setState({
                currentDoctorId: id
            })
            this.props.getDetailsDoctor(id)
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if(prevProps.detailsDoctor !== this.props.detailsDoctor) {
            this.setState({
                detailsDoctor: this.props.detailsDoctor
            })
        }
    }
    
    render() {
        let { language } = this.props
        let { detailsDoctor } = this.state
        let nameVi ='', nameEn =''
        if(detailsDoctor && detailsDoctor.positionData) {
            nameVi = `${detailsDoctor.positionData.valueVi}, ${detailsDoctor.firstName} ${detailsDoctor.lastName}`;
            nameEn = `${detailsDoctor.positionData.valueEn}, ${detailsDoctor.lastName} ${detailsDoctor.firstName}`;
        }
        let currentHref = +process.env.REACT_APP_IS_LOCALHOST === 1 ? 'https://developers.facebook.com/docs/plugins/comments#configurator' : window.location.href;
        return (
            <>
                <HomeHeader isBanner={false}
                isMenu={false}
                />
                <div className="contain-details-doctor">
                    <div className="intro-doctor">
                        <div className="content-left"
                        style={{backgroundImage: `url(${detailsDoctor.image})`}}
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
                                    {detailsDoctor && detailsDoctor.Markdown && detailsDoctor.Markdown.description}
                                </span>
                                <span className="like-share-fb">
                                    <ShareLikeButton 
                                    dataHref={currentHref}
                                    />
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="schedule-doctor">
                        <div className="content-left">
                            <DoctorSchedule 
                                doctorIDfromParent={this.state.currentDoctorId}
                            />
                        </div>
                        <div className="content-right">
                            <DoctorExtraInfor doctorIDfromParent={this.state.currentDoctorId}/>
                        </div>
                    </div>
                    <div className="details-infor-doctor">
                        <div dangerouslySetInnerHTML={{
                            __html: detailsDoctor?.Markdown?.contentHTML
                            }}>
                        </div>
                    </div>
                    <div className="comment-doctor">
                        <Comment
                        dataHref = {currentHref}
                        width="100%"
                        />
                    </div>
                </div>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        detailsDoctor: state.admin.detailsDoctor,
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getDetailsDoctor: (id) => dispatch(actions.fetchDetailsDoctor(id))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailsDoctor);
