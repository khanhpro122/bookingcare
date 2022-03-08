import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "./TableManageUser.scss";
import * as actions from "../../../store/actions";
import "react-markdown-editor-lite/lib/index.css";

class TableManageUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userReduxs: [],
      search: "",
    };
  }

  componentDidMount() {
    this.props.fetchAllUser();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.listUsers !== this.props.listUsers) {
      this.setState({
        userReduxs: this.props.listUsers,
      });
    }
  }
  deleteUser = (id) => {
    this.props.fetchDeleteUser(id);
  };

  editUser = (user) => {
    this.props.handleEditUser(user);
  };
  handleEditorChange({ html, text }) {
    console.log("handleEditorChange", html, text);
  }

  handleSearch = (e) => {
    this.setState({
      search: e.target.value,
    });
  };
  render() {
    let users = this.state.userReduxs;
    let search = this.state.search;
    return (
      <>
        <div className="search-container">
          <span className="search-icon">
            <i className="fas fa-search"></i>
          </span>
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="admin-patient-search"
            value={this.state.search}
            onChange={this.handleSearch.bind(this)}
          />
        </div>
        <table id="tableManage-user">
          <tbody>
            <tr>
              <th>Email</th>
              <th>First name</th>
              <th>Last name</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
            {users
              .filter((user) => {
                if (search === "") {
                  return user;
                } else if (
                  user?.firstName?.toLowerCase().includes(search?.toLowerCase())
                ) {
                  return user;
                } else if (
                  user?.lastName?.toLowerCase().includes(search?.toLowerCase())
                ) {
                  return user;
                } else if (
                  user?.address?.toLowerCase().includes(search?.toLowerCase())
                ) {
                  return user;
                } else if (
                  user?.email?.toLowerCase().includes(search?.toLowerCase())
                ) {
                  return user;
                }
              })
              ?.map((item, index) => {
                return (
                  <tr key={item.id}>
                    <td>{item.email}</td>
                    <td>{item.firstName}</td>
                    <td>{item.lastName}</td>
                    <td>{item.lastName}</td>
                    <td>
                      <button>
                        <i
                          className="fas fa-edit btn-edit"
                          onClick={() => this.editUser(item)}
                        ></i>
                      </button>
                      <button onClick={() => this.deleteUser(item.id)}>
                        <i className="fas fa-trash-alt btn-delete"></i>
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    listUsers: state.admin.users,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAllUser: () => dispatch(actions.fetchGetAllUsers()),
    fetchDeleteUser: (id) => dispatch(actions.fetchDeleteUser(id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableManageUser);
