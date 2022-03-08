import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
import * as actions from "../../store/actions";
import './Login.scss';
import { handleLoginApi }  from '../../services/userService';
import { withRouter } from 'react-router';


class Login extends Component {
    constructor(props) {
        super(props);
        this.btnLogin = React.createRef();
        this.state = {
            username: '',
            password: '',
            isHide : false,
            isError : ''
        }
    }
    changeName = (e) => {
        this.setState({
            username: e.target.value
        })
    }

    changePassword = (e) => {
        this.setState({
            password: e.target.value
        })
    }
    handleKeyDown = (e) => {
        if(e.key === 'Enter') {
            this.handleLogin()
        }
    }

    handleLogin = async () => {
        this.setState({isError : ''})
        try {
            let data = await handleLoginApi(this.state.username, this.state.password)
            if(data && data.errCode !== 0) {
                this.setState({isError : data.message})
            }
            if(data && data.errCode === 0) {
                this.props.userLoginSuccess(data.user)
                // if(data && data.roleId === 'R2') {
                //     console.log('ok')
                //     if(this.props.history) {
                //         this.props.history.push('/doctor/manage-schedule')
                //     }
                // }
            }
        }catch(error) {
            console.log(error.response)
            if(error.response){
                if(error.response.data) {
                    this.setState({
                        isError: error.response.data.message
                    })
                }
            }
        }
    }
    render() {
        
        return (
            <div className="login-background">
                <div className="login-container">
                    <div className="login-content row">
                        <div className="col-12 text-center text-login">Login</div>
                        <div className="col-12 form-group">
                            <label>Username</label>
                            <input type="text" className="form-control form-input" placeholder="Enter your name"
                            value={this.state.username}
                            onChange={this.changeName}
                            onKeyDown={this.handleKeyDown}
                            />
                        </div>
                        <div className="col-12 form-group">
                            <label>Password:</label>
                            <i className="fas fa-eye icon-eye" 
                            onClick={() => this.setState({isHide: !this.state.isHide})}
                            ></i>
                            <input type={this.state.isHide ? 'text' : 'password'} className="form-control form-input" placeholder="Enter your password"
                            value={this.state.password}
                            onChange={this.changePassword}
                            onKeyDown={this.handleKeyDown}
                            />
                        </div>
                        <div className="col-12">
                            <div style={{color: 'red'}}>{this.state.isError}</div>
                        </div>
                        <div className="col-12">
                            <button className="btn-login"
                            onClick={this.handleLogin}
                            >Login</button>
                        </div>
                        <div className="col-12">
                            <span className="forget-password">Forget your password</span>
                        </div>
                        <div className="col-12 text-center">
                            <span className="text-other-login">Or login with:</span>
                        </div>
                        <div className="col-12 social-login">
                            <i className="fab fa-google-plus google"></i>
                            <i className="fab fa-facebook-square facebook"></i>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        navigate: (path) => dispatch(push(path)),
        // adminLoginSuccess: (adminInfo) => dispatch(actions.adminLoginSuccess(adminInfo)),
        // adminLoginFail: () => dispatch(actions.adminLoginFail()),
        userLoginSuccess: (userInfo) => dispatch(actions.userLoginSuccess(userInfo))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
