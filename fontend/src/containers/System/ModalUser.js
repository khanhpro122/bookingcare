import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { emitter } from '../../utils/emitter'
import './UserManage.scss'

class ModalUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            address: '',
        }
        this.listenToEmitter()
    }

    listenToEmitter() {
        emitter.on('EVENT_CLEAR_MODAL_DATA', () => {
            this.setState({
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                address: '',
            })
        })
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

    handleAddNewUser = () => {
        let isValid = this.checkValidate()
        if(isValid) {
            this.props.createUser(this.state)
        }
    }
    
    componentDidMount() {

    }
    toggle = () => {
        this.props.handleSetModal()
    }
    render() {
        return (
             <Modal isOpen={this.props.isOpenModal}
             size="lg" 
             toggle={this.toggle} 
             className={'khanh'}>
                <ModalHeader toggle={this.toggle}>Create User</ModalHeader>
                <ModalBody>
                    <div className="modal-user-container">
                        <div className="input-container">
                            <label>Email</label>
                            <input type="email"
                            value={this.state.email}
                            onChange={(e) => this.handleOnchange(e, 'email')}
                            />
                        </div>
                        <div className="input-container">
                            <label>Password</label>
                            <input type="password"
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
                    <Button color="primary" className="px-2" onClick={this.handleAddNewUser}>Add new</Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalUser);


