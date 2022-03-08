import React, { Component } from 'react';
import { connect } from 'react-redux';


class About extends Component {
    
    render() {
        return (
            <div className="section-share section-about">
                <div className="section-about-header">
                    Hướng dẫn đặt lịch Bookingcare
                </div>
                <div className="section-about-content">
                    <div className="section-about-left">
                        <iframe width="500px" height="400px" 
                        src="https://www.youtube.com/embed/nOh7h67IxJs" 
                        title="YouTube video player" frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; 
                        gyroscope; picture-in-picture" ></iframe>
                    </div>
                    <div className="section-about-right">
                        <p>
                            <i>
                            BookingCare là Nền tảng Y tế Chăm sóc sức khỏe toàn diện kết nối người dùng với dịch vụ y tế 
                            - chăm sóc sức khỏe hiệu quả, tin cậy với trên 100 bệnh viện, 
                            phòng khám uy tín, hơn 600 bác sĩ chuyên khoa giỏi và hàng nghìn dịch vụ y tế chất lượng cao.
                            </i>
                        </p>
                    </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(About);
