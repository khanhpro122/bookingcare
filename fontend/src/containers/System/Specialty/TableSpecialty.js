import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './TableSpecialty.scss'
import * as actions from '../../../store/actions'
 

class TableSpecialty extends Component {
    constructor(props) {
        super(props)
        this.state = {
            allDataSpecialty: [],
            clinicId: ''
        }
    }

    async componentDidMount() {
        await this.props.getAllSpecialty()
    }

    componentWillUnmount() {
    }

   
    
    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.allDataSpecialty !== this.props.allDataSpecialty) {
            this.setState({
                allDataSpecialty: this.props.allDataSpecialty
            })
        }
    }
    deleteSpecialty = (id) => {
        this.props.handleDeleteSpecialty(id)
    }

    editSpecialty = async (clinic) => {
        await this.props.handleEditSpecialty(clinic.id)
    }
   
    render() {
        let { allDataSpecialty } = this.state
        return (
            <div className="tableManage-specialty">
                <table id="tableManage-specialty">
                    <tbody>
                        <tr>
                            <th>
                                <FormattedMessage id="admin.manage-specialty.STT" /> 
                            </th>
                            <th>
                                <FormattedMessage id="admin.manage-specialty.name-specialty" /> 
                            </th>
                            <th>
                                <FormattedMessage id="admin.manage-specialty.actions" /> 
                            </th>
                        </tr>
                        {allDataSpecialty?.map((item, index) => {
                            return(
                            <tr key={item.id}>
                                <td>{index+1}</td>
                                <td>{item.name}</td>
                                <td>
                                    <button><i className="fas fa-edit btn-edit"
                                    onClick={() => this.editSpecialty(item)}
                                    ></i></button>
                                    <button
                                    onClick={() => this.deleteSpecialty(item.id)}
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
        allDataSpecialty : state.admin.allDataSpecialty
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getAllSpecialty: () => dispatch(actions.getAllSpecialtyData())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableSpecialty);
