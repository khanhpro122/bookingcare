import React, { Component } from 'react';
import { connect } from "react-redux";
import * as actions from '../../../store/actions'
import { languages } from '../../../utils';
import './DetailsHandBook.scss'
import _ from 'lodash';
import HomeHeader from '../../HomePage/HomeHeader';
import { getDetailsHandBook } from '../../../services/userService';


class DetailsHandBook extends Component {
    constructor(props) {
        super(props)
        this.state = {
            allHandBook : [],
            image : ""
        }
    }

    async componentDidMount() {
        if(this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id
            let res = await getDetailsHandBook(id)
            if(res && res.errCode === 0) {
                this.setState({
                    allHandBook : res.data,
                })
            }
        }
    }
    componentDidUpdate(prevProps, prevState) {
       
    }
    
    render() {
        let {allHandBook} = this.state
        let image
        if(allHandBook.image) {
            image = Buffer(allHandBook.image, 'base64').toString('binary');
        }
        return (
            <div className="details-handbook-container">
                <HomeHeader isBanner={false}
                isMenu={false}
                />
                <div className="details-handbook-body">
                    <h1 className="details-handbook-title">{allHandBook?.name}</h1>
                    <div className="details-handbook-infor">
                        <div>
                            <span>Sản phẩm của </span><span className="infor-active">BookingCare</span>
                        </div>
                        <div>
                            <span>Nhóm tác giả </span><span className="infor-active">{allHandBook?.author}</span>
                        </div>
                        <div>
                            <span>Người kiểm duyệt </span><span className="infor-active">{allHandBook?.censor}</span>
                        </div>
                    </div>
                    <div className="introduce">
                        <span>BookingCare là Nền tảng Y tế Chăm sóc sức khỏe toàn diện kết nối người dùng với dịch vụ y tế - 
                            chăm sóc sức khỏe hiệu quả, tin cậy với trên 100 bệnh viện, 
                            phòng khám uy tín, hơn 600 bác sĩ chuyên khoa giỏi và hàng nghìn dịch vụ y tế chất lượng cao.
                        </span>
                    </div>
                    <div className="image-details-handbook">
                        <img src={image} alt="anh-hanbook" className="image"/>
                    </div>
                    <div className="details-handbook-description">
                        <div dangerouslySetInnerHTML={{
                            __html: allHandBook?.descriptionHTML
                            }}>
                        </div>
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
        fetchAllTimes: () => dispatch(actions.getAllCodeTime()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailsHandBook);
