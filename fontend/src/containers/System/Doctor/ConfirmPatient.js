import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { CommonUtils } from '../../../utils';
import './ConfirmPatient.scss';


class ConfirmPatient extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email : '',
            fileBase64 : ''
        }
    }
    componentDidMount() {
        
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.dataModal !== this.props.dataModal) {
            this.setState({
                email : this.props?.dataModal?.email
            })
        }
       
    }
    toggle = () => {
        this.props.closeModal()
    }
    closeModal = () => {
        this.props.closeModal()
    }
    onChangeFile = async (e) => {
        const file = e.target.files[0]
        let base64 = await CommonUtils.toBase64(file)
        this.setState({
            fileBase64 : base64,
        })
        // e.target.value = null
    }
    handleChangeEmail = (e) => {
        this.setState({
            email : e.target.value
        })
    }

    handleSubmit = () => {
        this.props.sendConfirm(this.state)
    }

    render() {
        let { isOpen, sendConfirm, dataModal } = this.props;
        return (
            <Modal 
            isOpen={isOpen} 
            className='confirm-modal-patient' 
            centered={true}
            toggle={this.toggle} 
            >
                <div className='modal-header'>
                    <div className='modal-header-title'>
                        Gửi hóa đơn xác nhận
                    </div>
                    <button className="modal-btn-close"
                    onClick={this.toggle}
                    >
                        <span>X</span>
                    </button>
                </div>
                <ModalBody>
                    <div className="row">
                        <div className="col-6 form-group">
                            <label>Email bệnh nhân</label>
                            <input type="email" className="form-control"
                            value={this.state.email}
                            onChange={(e) => this.handleChangeEmail(e)}
                            />
                        </div>
                        <div className="col-6 form-group">
                            <label>Chọn file đơn thuốc</label>
                            <div className="file-container">
                                <input type="file" className="form-control" id="file" hidden
                                onChange={(e) => this.onChangeFile(e)}
                                />
                                <label htmlFor="file" className="label-file-patient">Chọn file<i className="fas fa-upload"></i></label>
                            </div>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={this.handleSubmit}>Xác nhận</Button>{' '}
                    <Button color="secondary" onClick={this.closeModal}>Hủy bỏ</Button>
                </ModalFooter>
            </Modal >
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

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmPatient);
