import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './TableHandBook.scss'
import * as actions from '../../../store/actions'
 

class TableHandBook extends Component {
    constructor(props) {
        super(props)
        this.state = {
            allDataHandBook: [],
            clinicId: ''
        }
    }

    async componentDidMount() {
        await this.props.getAllHandBook()
        
    }

    componentWillUnmount() {
    }

   
    
    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.allDataHandBook !== this.props.allDataHandBook) {
            this.setState({
                allDataHandBook: this.props.allDataHandBook
            })
        }
    }
    deleteHandBook = (id) => {
        this.props.fetchDeleteHandBook(id)
    }

    editHandBook = async (handbook) => {
        await this.props.handleEditHandbook(handbook.id)
    }
   
    render() {
        let { allDataHandBook } = this.state
        return (
            <div className="tableManage-clinic">
                <table id="tableManage-clinic">
                    <tbody>
                        <tr>
                            <th>
                                <FormattedMessage id="admin.manage-handbook.name-handbook" />
                            </th>
                            <th>
                                <FormattedMessage id="admin.manage-handbook.author" />
                            </th>
                            <th>
                                <FormattedMessage id="admin.manage-handbook.censor" />
                            </th>
                            <th>
                                <FormattedMessage id="admin.manage-handbook.actions" />
                            </th>
                        </tr>
                        {allDataHandBook?.map((item, index) => {
                            return(
                            <tr key={item.id}>
                                <td>{item.name}</td>
                                <td>{item.author}</td>
                                <td>{item.censor}</td>
                                <td>
                                    <button><i className="fas fa-edit btn-edit"
                                    onClick={() => this.editHandBook(item)}
                                    ></i></button>
                                    <button
                                    onClick={() => this.deleteHandBook(item.id)}
                                    ><i className="fas fa-trash-alt btn-delete"></i></button>
                                </td>
                            </tr>
                            )
                        })}
                    </tbody>
                </table>
                {/* <MdEditor style={{ height: '500px' }} renderHTML={text => mdParser.render(text)} onChange={this.handleEditorChange} />               */}
          </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        allDataHandBook : state.admin.allDataHandBook
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getAllHandBook: () => dispatch(actions.getAllHandBookData())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableHandBook);
