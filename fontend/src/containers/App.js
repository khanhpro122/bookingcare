import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter as Router } from 'connected-react-router';
import { history } from '../redux'
import { ToastContainer } from 'react-toastify';



import { userIsAuthenticated, userIsNotAuthenticated } from '../hoc/authentication';

import { path } from '../utils'

import Home from '../routes/Home';
// import Login from '../routes/Login';
import Login from './Auth/Login';
import System from '../routes/System';

import { CustomToastCloseButton } from '../components/CustomToast';
import CustomScrollbars from '../components/CustomScrollbars';
import HomePage from './HomePage/HomePage';
import DetailsDoctor from './Patient/Doctor/DetailsDoctor';
import Doctor from '../routes/Doctor';
import VerifyEmail from './Patient/VerifyEmail';
import DetailsSpecialty from './Patient/Specialty/DetailsSpecialty';
import DetailsClinic from './Patient/Clinnic/DetailsClinic';
import DetailsHandBook from './Patient/HandBook/DetaislHandBook'
import AllSpecialty from './Patient/Specialty/AllSpecialty';
import AllDoctor from './Patient/Doctor/AllDoctor';
import AllClinic from './Patient/Clinnic/AllClinic';
import AllHandBook from './Patient/HandBook/AllHandBook';

class App extends Component {

    handlePersistorState = () => {
        const { persistor } = this.props;
        let { bootstrapped } = persistor.getState();
        if (bootstrapped) {
            if (this.props.onBeforeLift) {
                Promise.resolve(this.props.onBeforeLift())
                    .then(() => this.setState({ bootstrapped: true }))
                    .catch(() => this.setState({ bootstrapped: true }));
            } else {
                this.setState({ bootstrapped: true });
            }
        }
    };

    componentDidMount() {
        this.handlePersistorState();
    }

    render() {
        return (
            <Fragment>
                <Router history={history}>
                    <div className="main-container">
                        <div className="content-container">
                            <CustomScrollbars style={{height: '100vh', width: '100%'}}>
                                <Switch>
                                    <Route path={path.HOME} exact component={(Home)} />
                                    <Route path={path.LOGIN} component={userIsNotAuthenticated(Login)} />
                                    <Route path={path.SYSTEM} component={userIsAuthenticated(System)} />
                                    <Route path={path.HOMEPAGE} component={(HomePage)} />
                                    <Route path={path.DETAILSDOCTOR} component={(DetailsDoctor)} />
                                    <Route path={path.DOCTOR} component={userIsAuthenticated(Doctor)} />
                                    <Route path={path.VERIFY_EMAIL} component={VerifyEmail} />
                                    <Route path={path.DETAILSPECIALTY} component={DetailsSpecialty} />
                                    <Route path={path.DETAILSCLINIC} component={DetailsClinic} />
                                    <Route path={path.DETAILSHANDBOOK} component={DetailsHandBook} />
                                    <Route path={path.ALLSPECIALTY} component={AllSpecialty} />
                                    <Route path={path.ALLDOCTOR} component={AllDoctor} />
                                    <Route path={path.ALLCLINIC} component={AllClinic} />
                                    <Route path={path.ALLHANDBOOK} component={AllHandBook} />
                                </Switch>
                            </CustomScrollbars>
                        </div>

                        {/* <ToastContainer
                            className="toast-container" toastClassName="toast-item" bodyClassName="toast-item-body"
                            autoClose={false} hideProgressBar={true} pauseOnHover={false}
                            pauseOnFocusLoss={true} closeOnClick={false} draggable={false}
                            closeButton={<CustomToastCloseButton />}
                        /> */}
                        <ToastContainer
                        position="bottom-right"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        />
                    </div>
                </Router>
            </Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        started: state.app.started,
        isLoggedIn: state.user.isLoggedIn,
        isMenu: state.app.isMenu,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);