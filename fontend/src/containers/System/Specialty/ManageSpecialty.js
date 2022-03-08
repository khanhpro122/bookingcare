import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { emitter } from '../../../utils/emitter'
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import './ManageSpecialty.scss'
import { CommonUtils, CRUD_ACTIONS } from '../../../utils';
import Lightbox from 'react-image-lightbox';
import {createSpecialty, getDetailSpecialtybyId, deleteSpecialty} from '../../../services/userService'
import { toast } from 'react-toastify';
import TableSpecialty from './TableSpecialty';
import * as actions from '../../../store/actions'

const mdParser = new MarkdownIt();
class ManageSpecialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
           name : '',
           descriptionMarkdown: '',
           descriptionHTML : '',
           imgUrl : '',
           imgBase64: '',
           isOpen: false,
           specialtyId : '',
           isHasData: false,
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
    }
    reviewImage = () => {
        if(!this.state.imgUrl) return
        this.setState({
            isOpen: true
        })
    }

    handleOnchangeName = async (e) => {
        this.setState({
            name: e.target.value
        })
    }

    handleSubmit = async () => {
        let {isHasData} = this.state
        let res = await createSpecialty({
            name : this.state.name,
            descriptionMarkdown: this.state.descriptionMarkdown,
            descriptionHTML : this.state.descriptionHTML,
            imgBase64: this.state.imgBase64,
            action : isHasData ? CRUD_ACTIONS.EDIT : CRUD_ACTIONS.CREATE,
            specialtyId : this.state.specialtyId,
            imgUrl: this.state.imgUrl
        })
        if(res && res.errCode === 0) {
            toast.success(res.errMsg)
            this.props.getAllSpecialty()
            this.setState({
                name : '',
                descriptionMarkdown: '',
                descriptionHTML : '',
                imgUrl : '',
                imgBase64: '',
                isHasData : false,
            })
        }else {
            toast.error('create specialty failed!!')
        }
    }

    handleDeleteSpecialty = async (id) => {
        if(id) {
            let res = await deleteSpecialty(id)
            if(res && res.errCode === 0) {
                toast.success(res.errMsg)
                this.props.getAllSpecialty()
            }else {
                toast.error(res.errMsg)
                this.props.getAllSpecialty()
            }
        }
    }

    handleEditSpecialty = async(id) => {
        if(id) {
            let res = await getDetailSpecialtybyId(id)
            if(res && res.errCode === 0) {
                let imageBase64= ''
                if(res?.data?.image) {
                    imageBase64 = Buffer(res?.data?.image, 'base64').toString('binary');
                }
                this.setState({
                    name : res?.data?.name,
                    descriptionMarkdown: res?.data?.descriptionMarkdown,
                    descriptionHTML : res?.data?.descriptionHTML,
                    imgUrl: imageBase64,
                    imgBase64: imageBase64,
                    specialtyId : id
                })
                if(this.state.name || this.state.descriptionMarkdown){ 
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
    }
    
    componentDidMount() {

    }
   
    render() {
        let {isHasData} = this.state
        return (
            <>
                <div className="manage-specialty">
                    <h2 className="title">
                        <FormattedMessage id="admin.manage-specialty.manage-specialty" />
                    </h2>
                    <div className="add-new-specialty row">
                        <div className="col-6 form-group">
                            <label>
                                <FormattedMessage id="admin.manage-specialty.name-specialty" />
                            </label>
                            <input type="text" className="form-control"
                            onChange={(e) => this.handleOnchangeName(e)}
                            value={this.state.name}
                            />
                        </div>
                        <div className="col-3 form-group">
                            <label>
                                <FormattedMessage id="admin.manage-specialty.choose-specialty" />
                            </label>
                            <div className="img-preview-container">
                                <input type="file" className="form-control" id="image" hidden
                                onChange={(e) => this.handleonChangeImg(e)}
                                />
                                <label htmlFor="image" className="label-upload">
                                    <FormattedMessage id="admin.manage-specialty.push" /> 
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
                            <MdEditor 
                            value={this.state.descriptionMarkdown}
                            style={{ height: '400px' }} 
                            renderHTML={text => mdParser.render(text)}
                            onChange={this.handleEditorChange} 
                            />
                        </div>
                    </div>
                    <button className={!isHasData ? 'btn-add-specialty' : 'add-save-specialty'}
                    onClick={this.handleSubmit}
                    >
                        {isHasData ? 
                            <span>
                                <FormattedMessage id="admin.manage-specialty.edit" /> 
                            </span> 
                        :   <span>
                                <FormattedMessage id="admin.manage-specialty.add" /> 
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
                <TableSpecialty 
                    handleEditSpecialty={this.handleEditSpecialty}
                    handleDeleteSpecialty={this.handleDeleteSpecialty}
                />
            </>
        )
    }

}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getAllSpecialty: () => dispatch(actions.getAllSpecialtyData())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSpecialty);


