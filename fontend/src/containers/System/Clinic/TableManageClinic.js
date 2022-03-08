import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './TableManageClinic.scss'
import * as actions from '../../../store/actions'
 

class TableManageClinic extends Component {
    constructor(props) {
        super(props)
        this.state = {
            allDataClinic: [],
            clinicId: ''
        }
    }

    async componentDidMount() {
        await this.props.getAllClinic()

    }

    componentWillUnmount() {
    }

   
    
    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.allDataClinic !== this.props.allDataClinic) {
            this.setState({
                allDataClinic: this.props.allDataClinic
            })
        }
    }
    deleteClinic = (id) => {
        this.props.fetchDeleteClinic(id)
    }

    editClinic = async (clinic) => {
        this.props.handleEditClinic(clinic.id)

    }
   
    render() {
        let { allDataClinic } = this.state
        return (
            <div className="tableManage-clinic">
                <table id="tableManage-clinic">
                    <tbody>
                        <tr>
                            <th>
                                <FormattedMessage id="admin.manage-clinic.name-clinic" /> 
                            </th>
                            <th>
                                <FormattedMessage id="admin.manage-clinic.address-clinic" /> 
                            </th>
                            <th>
                                <FormattedMessage id="admin.manage-clinic.actions" /> 
                            </th>
                        </tr>
                        {allDataClinic?.map((item, index) => {
                            return(
                            <tr key={item.id}>
                                <td>{item.name}</td>
                                <td>{item.address}</td>
                                <td>
                                    <button><i className="fas fa-edit btn-edit"
                                    onClick={() => this.editClinic(item)}
                                    ></i></button>
                                    <button
                                    onClick={() => this.deleteClinic(item.id)}
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
        allDataClinic : state.admin.allDataClinic
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getAllClinic: () => dispatch(actions.getAllClinicData())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableManageClinic);
