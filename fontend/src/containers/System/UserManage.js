import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "./UserManage.scss";
import {
  getAllUsers,
  createUserService,
  deleteUserService,
  updateUserService,
} from "../../services/userService";
import ModalUser from "./ModalUser";
import ModalEditUser from "./ModalEditUser";
import { emitter } from "../../utils/emitter";

class UserManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrUsers: [],
      isOpenModal: false,
      isOpenEditModal: false,
      userEdit: {},
    };
  }

  async componentDidMount() {
    await this.getAllUsersFromReact();
  }

  getAllUsersFromReact = async () => {
    let response = await getAllUsers("All");
    if (response && response.errCode === 0) {
      this.setState({ arrUsers: response.users });
    }
  };

  createUser = async (data) => {
    try {
      let response = await createUserService(data);
      if (response && response.message.errCode !== 0) {
        alert(response.message.errMsg);
      } else {
        await this.getAllUsersFromReact();
        this.setState({
          isOpenModal: false,
        });
        emitter.emit("EVENT_CLEAR_MODAL_DATA");
      }
    } catch (err) {
      console.log(err);
    }
  };

  deleteUser = async (user) => {
    let res = await deleteUserService(user.id);
    if (res && res.errCode === 0) {
      await this.getAllUsersFromReact();
    } else {
      alert(res.errMsg);
    }
  };
  handleEditModal = (user) => {
    this.setState({
      isOpenEditModal: true,
      userEdit: user,
    });
  };

  handleSetEditModal = () => {
    this.setState({
      isOpenEditModal: !this.state.isOpenEditModal,
    });
  };

  editUser = async (user) => {
    let res = await updateUserService(user);
    if (res && res.message.errCode === 0) {
      this.setState({
        isOpenEditModal: false,
      });
      await this.getAllUsersFromReact();
    } else {
      alert(res.message.errMsg);
    }
  };

  handleAddUser = () => {
    this.setState({
      isOpenModal: true,
    });
  };

  handleSetModal = () => {
    this.setState({
      isOpenModal: !this.state.isOpenModal,
    });
  };
  render() {
    let { arrUsers } = this.state;
    return (
      <div className="users-container">
        <ModalUser
          isOpenModal={this.state.isOpenModal}
          handleSetModal={this.handleSetModal}
          createUser={this.createUser}
        />
        {this.state.isOpenEditModal && (
          <ModalEditUser
            isOpenEditModal={this.state.isOpenEditModal}
            handleSetEditModal={this.handleSetEditModal}
            userEdit={this.state.userEdit}
            editUser={this.editUser}
          />
        )}
        <div className="title text-center">Manage with user</div>
        <div className="mx-2">
          <button className="btn btn-primary px-3" onClick={this.handleAddUser}>
            Add new User <i className="fas fa-plus"></i>
          </button>
        </div>
        <div className="users-table mt-3 mx-2">
          <table id="customize-user">
            <tbody>
              <tr>
                <th>Email</th>
                <th>First name</th>
                <th>Last name</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>

              {arrUsers &&
                arrUsers?.map((item, index) => {
                  return (
                    <tr key={item.id}>
                      <td>{item.email}</td>
                      <td>{item.firstName}</td>
                      <td>{item.lastName}</td>
                      <td>{item.address}</td>
                      <td>
                        <button>
                          <i
                            className="fas fa-edit btn-edit"
                            onClick={() => this.handleEditModal(item)}
                          ></i>
                        </button>
                        <button onClick={() => this.deleteUser(item)}>
                          <i className="fas fa-trash-alt btn-delete"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
