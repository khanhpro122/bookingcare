import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import './ManageClinic.scss'
import { CommonUtils, CRUD_ACTIONS } from '../../../utils';
import Lightbox from 'react-image-lightbox';
import { createClinic, deleteClinic, getDetailClinic } from '../../../services/userService'
import { toast } from 'react-toastify';
import TableManageClinic from './TableManageClinic';
import * as actions from '../../../store/actions'


const mdParser = new MarkdownIt();
class ManageClinic extends Component {
    constructor(props) {
        super(props);
        this.myRef = React.createRef()
        this.state = {
           name : '',
           descriptionMarkdown: '',
           descriptionHTML : '',
           imgUrl : '',
           imgBase64: '',
           isOpen: false,
           address: '',
           isHasData : false,
           clinicId : ''
        }
    }

    handleEditorChange = ({ html, text }) => {
        this.setState({ 
            descriptionMarkdown: text,
            descriptionHTML: html,
        })
    }
    handleonChangeImg = async (e) => {
        const file = e.target.files[0]
        const urlImage = URL.createObjectURL(file)
        let base64 = await CommonUtils.toBase64(file)
        this.setState({
            imgUrl : urlImage,
            imgBase64: base64
        })
        e.target.value = null
    }
    reviewImage = () => {
        if(!this.state.imgUrl) return
        this.setState({
            isOpen: true
        })
    }

    handleOnchangeInput =  (e, id) => {
        let stateCopy = { ...this.state}
        stateCopy[id] = e.target.value
        this.setState({
            ...stateCopy,
        })
    }

    handleSubmit = async () => {
        let {isHasData} = this.state
        let res = await createClinic({
            name : this.state.name,
            descriptionMarkdown: this.state.descriptionMarkdown,
            descriptionHTML : this.state.descriptionHTML,
            address : this.state.address,
            image: this.state.imgBase64,
            action : isHasData ? CRUD_ACTIONS.EDIT : CRUD_ACTIONS.CREATE,
            clinicId : this.state.clinicId
        })
        if(res && res.errCode === 0) {
            toast.success('create clinic success!!')
            await this.props.getAllClinic()
            this.setState({
                name : '',
                descriptionMarkdown: '',
                descriptionHTML : '',
                imgUrl : '',
                imgBase64: '',
                address: '',
                isHasData : false,

            })
        }else {
            toast.error('create clinic failed!!')
        }
    }
    
    handleEditClinic = async (clinicId) => {
        let res = await getDetailClinic({clinicId: clinicId})
        if(res && res.errCode === 0) {
            let imageBase64= ''
            if(res?.data?.image) {
                imageBase64 = Buffer(res?.data?.image, 'base64').toString('binary');
            }
            this.setState({
                name: res?.data?.name,
                address: res?.data?.address,
                descriptionMarkdown: res?.data?.descriptionMarkdown,
                descriptionHTML: res?.data?.descriptionHTML,
                imgUrl : imageBase64,
                clinicId : clinicId
            })
            if(this.state.address || this.state.descriptionMarkdown){ 
                this.setState({
                    isHasData : true
                })
            }else {
                this.setState({
                    isHasData : false
                })
            }
        }
    }

    fetchDeleteClinic = async(id) => {
        if(id) {
            let res = await deleteClinic(id)
            if(res && res.errCode === 0) {
                toast.success(res.errMsg)
                await this.props.getAllClinic()
            }else {
                toast.error(res.errMsg)
            }
        }
    }

    

    componentDidMount() {
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.allDataClinic !== this.props.allDataClinic) {
            this.setState({
                allDataClinic: this.props.allDataClinic
            })
        }
    }
    
    render() {
        let { isHasData } = this.state
        return (
            <>
            <div className="manage-clinic" ref={this.myRef}>
                <h2 className="title">
                    <FormattedMessage id="admin.manage-clinic.manage-clinic" />
                </h2>
                <div className="add-new-clinic row">
                    <div className="col-6 form-group">
                        <label>
                            <FormattedMessage id="admin.manage-clinic.name-clinic" />
                        </label>
                        <input type="text" className="form-control"
                        onChange={(e) => this.handleOnchangeInput(e, 'name')}
                        value={this.state.name}
                        />
                    </div>
                    <div className="col-3 form-group">
                        <label>
                            <FormattedMessage id="admin.manage-clinic.choose-image-clinic" />
                        </label>
                        <div className="img-preview-container">
                            <input type="file" className="form-control" id="image" hidden
                            onChange={(e) => this.handleonChangeImg(e)}
                            />
                            <label htmlFor="image" className="label-upload">
                                <FormattedMessage id="admin.manage-clinic.push" /> 
                                <i className="fas fa-upload"></i></label>
                            <div style={{border: '1px solid '}}>
                                <div className="img-preview"
                                style={{backgroundImage: `url(${this.state.imgUrl})`}}
                                onClick={this.reviewImage}
                                ></div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 form-group">
                        <label>
                            <FormattedMessage id="admin.manage-clinic.address-clinic" /> 
                        </label>
                        <input type="text" className="form-control"
                        onChange={(e) => this.handleOnchangeInput(e, 'address')}
                        value={this.state.address}
                        />
                    </div>
                    <div className="col-12 form-group">
                        <MdEditor 
                        value={this.state.descriptionMarkdown}
                        style={{ height: '300px' }} 
                        renderHTML={text => mdParser.render(text)}
                        onChange={this.handleEditorChange} 
                        />
                    </div>
                </div>
                <button className={!isHasData ? 'btn-create-clinic' : 'btn-edit-clinic'}
                onClick={this.handleSubmit}
                >
                    {
                    isHasData 
                    ?   <span>
                            <FormattedMessage id="admin.manage-clinic.update" /> 
                        </span>
                    : <span>
                        <FormattedMessage id="admin.manage-clinic.add" /> 
                    </span>
                }
                </button>
                {this.state.isOpen &&
                <Lightbox
                mainSrc={this.state.imgUrl}
                onCloseRequest={() => this.setState({ isOpen: false })}
                />
                }
            </div>
            <TableManageClinic 
            handleEditClinic={this.handleEditClinic}
            fetchDeleteClinic={this.fetchDeleteClinic}
            />
            
            </>
        )
    }

}

const mapStateToProps = state => {
    return {
        allDataClinic : state.admin.allDataClinic
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getAllClinic: () => dispatch(actions.getAllClinicData())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageClinic);


