import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import _ from 'lodash';

class ModalEditUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            address: '',
        }
    }
    handleOnchange = (e, id) => {
        let copyState = { ...this.state }
        copyState[id] = e.target.value
        this.setState({
            ...copyState
        })
    }
    checkValidate = () => {
        let isValid = true
        let arrInput = ['email', 'password', 'firstName', 'lastName', 'address']
        for(var i = 0; i < arrInput.length; i++) {
            if(!this.state[arrInput[i]]) {
                alert('Missing parameter ' + arrInput[i])
                isValid = false
                break;
            }
        }
        return isValid
    }

    handleSaveUser = () => {
        let isValid = this.checkValidate()
        if(isValid) {
            this.props.editUser(this.state)
        }
    }
    
    componentDidMount() {
        let user = this.props.userEdit
        if(user && !_.isEmpty(user)){
            this.setState({
                id: user.id,
                email: user.email,
                password: 'password',
                lastName: user.lastName,
                firstName: user.firstName,
                address: user.address
            })
        }
    }
    componentDidUpdate() {
    }
    toggle = () => {
        this.props.handleSetEditModal()
    }
    render() {
        return (
             <Modal isOpen={this.props.isOpenEditModal}
             size="lg" 
             toggle={this.toggle} 
             className={'khanh'}>
                <ModalHeader toggle={this.toggle}>Edit User</ModalHeader>
                <ModalBody>
                    <div className="modal-user-container">
                        <div className="input-container">
                            <label>Email</label>
                            <input type="email"
                            disabled
                            value={this.state.email}
                            onChange={(e) => this.handleOnchange(e, 'email')}
                            />
                        </div>
                        <div className="input-container">
                            <label>Password</label>
                            <input type="password"
                                disabled
                                value={this.state.password}
                                onChange={(e) => this.handleOnchange(e, 'password')}
                            />
                        </div>
                        <div className="input-container">
                            <label>First Name</label>
                            <input type="text"
                                value={this.state.firstName}
                                onChange={(e) => this.handleOnchange(e, 'firstName')}
                            />
                        </div>
                        <div className="input-container">
                            <label>Last Name</label>
                            <input type="text"
                                value={this.state.lastName}
                                onChange={(e) => this.handleOnchange(e, 'lastName')}
                            />
                        </div>
                        <div className="input-container max-width-input">
                            <label>Address</label>
                            <input type="text"
                                value={this.state.address}
                                onChange={(e) => this.handleOnchange(e, 'address')}
                            />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" className="px-2" onClick={this.handleSaveUser}>Update</Button>
                    <Button color="secondary" className="px-2" onClick={this.toggle}>Close</Button>
                </ModalFooter>
            </Modal>
        )
    }

}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalEditUser);


