import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { CommonUtils, CRUD_ACTIONS } from '../../../utils';
import Lightbox from 'react-image-lightbox';
import { toast } from 'react-toastify';
import * as actions from '../../../store/actions'
import './ManageHandBook.scss'
import { createHandBook, getDetailsHandBook, deleteHandBook } from '../../../services/userService';
import TableHandBook from './TableHandBook';


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
           censor: '',
           isHasData : false,
           author : '',
           handbookId : ''
        }
    }

    fetchDeleteHandBook = async (handbookId) => {
        if(handbookId) {
            let res = await deleteHandBook(handbookId)
            if(res && res.errCode === 0) {
                toast.success(res.errMsg)
                await this.props.getAllHandbook()
            }else {
                toast.error(res.errMsg)
            }
        }
    }

    handleEditHandbook = async (handbookId) => {
        let res = await getDetailsHandBook(handbookId)
        if(res && res.errCode === 0) {
            let imageBase64= ''
            if(res?.data?.image) {
                imageBase64 = Buffer(res?.data?.image, 'base64').toString('binary');
            }
            this.setState({
                name : res?.data.name,
                descriptionMarkdown: res?.data.descriptionMarkdown,
                descriptionHTML : res?.data.descriptionHTML,
                imgUrl : imageBase64,
                imgBase64: res?.data.imgBase64,
                censor: res?.data.censor,
                author : res?.data.author,
                handbookId : handbookId
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

    
    
    handleSubmitHandBook = async () => {
        let {isHasData} = this.state
        let res = await createHandBook({
            name : this.state.name,
            author : this.state.author,
            censor : this.state.censor,
            descriptionMarkdown : this.state.descriptionMarkdown,
            descriptionHTML : this.state.descriptionHTML,
            imgBase64 : this.state.imgBase64,
            action : isHasData ? CRUD_ACTIONS.EDIT :CRUD_ACTIONS.CREATE,
            imgUrl : this.state.imgUrl,
            handbookId: this.state.handbookId
        })
        if(res && res.errCode === 0){
            toast.success(res.errMsg)
            this.setState({
                name : '',
                author :'',
                censor : '',
                descriptionMarkdown : '',
                descriptionHTML : '',
                imgUrl : '',
            })
        }else {
            toast.success(res.errMsg)
        }
    }

    async componentDidMount() {
        await this.props.getAllHandbook()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.allDataClinic !== this.props.allDataClinic) {
            this.setState({
            })
        }
    }
    
    render() {
        let { isHasData } = this.state
        return (
            <>
            <div className="manage-handbook-container" ref={this.myRef}>
                <h2 className="title">
                    <FormattedMessage id="admin.manage-handbook.manage-handbook" />
                </h2>
                <div className="add-new-handbook row">
                    <div className="col-3 form-group">
                        <label>
                            <FormattedMessage id="admin.manage-handbook.name-handbook" />
                        </label>
                        <input type="text" className="form-control"
                        onChange={(e) => this.handleOnchangeInput(e, 'name')}
                        value={this.state.name}
                        />
                    </div>
                    <div className="col-3 form-group">
                        <label>
                            <FormattedMessage id="admin.manage-handbook.name-author" />
                        </label>
                        <input type="text" className="form-control"
                        onChange={(e) => this.handleOnchangeInput(e, 'author')}
                        value={this.state.author}
                        />
                    </div>
                    <div className="col-3 form-group">
                        <label>
                            <FormattedMessage id="admin.manage-handbook.name-censor" />
                        </label>
                        <input type="text" className="form-control"
                        onChange={(e) => this.handleOnchangeInput(e, 'censor')}
                        value={this.state.censor}
                        />
                    </div>
                    <div className="col-2 form-group">
                        <label>
                            <FormattedMessage id="admin.manage-handbook.choose-handbook" />
                        </label>
                        <div className="img-preview-container">
                            <input type="file" className="form-control" id="image" hidden
                            onChange={(e) => this.handleonChangeImg(e)}
                            />
                            <label htmlFor="image" className="label-upload">
                                <FormattedMessage id="admin.manage-handbook.push" />
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
                        style={{ height: '300px' }} 
                        renderHTML={text => mdParser.render(text)}
                        onChange={this.handleEditorChange} 
                        />
                    </div>
                </div>
                <button className={!isHasData ? 'btn-create-handbook' : 'btn-edit-handbook'}
                onClick={this.handleSubmitHandBook}
                >
                    {
                    isHasData ? 
                    <span>
                        <FormattedMessage id="admin.manage-handbook.edit" />
                    </span> 
                    : 
                    <span>
                        <FormattedMessage id="admin.manage-handbook.add" />
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
            <TableHandBook 
            handleEditHandbook={this.handleEditHandbook}
            fetchDeleteHandBook={this.fetchDeleteHandBook}
            />
            
            </>
        )
    }

}

    const mapStateToProps = state => {
    return {
        allDataHandBook : state.admin.allDataHandBook
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getAllHandbook: () => dispatch(actions.getAllHandBookData())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageClinic);


