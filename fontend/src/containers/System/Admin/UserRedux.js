import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { getAllCode } from "../../../services/userService";
import { languages, CRUD_ACTIONS } from "../../../utils/constant";
import * as actions from "../../../store/actions";
import "./UserRedux.scss";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import TableManageUser from "./TableManageUser";
import { CommonUtils } from "../../../utils";

class UserRedux extends Component {
  constructor(props) {
    super(props);
    this.state = {
      genderArr: [],
      roleArr: [],
      positionArr: [],
      imgUrl: "",
      isOpen: false,
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      address: "",
      gender: "",
      position: "",
      role: "",
      avatar: "",
      action: CRUD_ACTIONS.CREATE,
      id: "",
    };
  }

  async componentDidMount() {
    this.props.getFetchGender();
    this.props.getFetchPosition();
    this.props.getFetchRole();
    // try {
    //     let res = await getAllCode('gender')
    //     if(res && res.errCode === 0) {
    //         this.setState({
    //             genderArr : res.data
    //         })
    //     }
    //     console.log(res);
    // }catch(e) {
    //     console.log(e);
    // }
  }
  componentWillUnmount() {
    URL.revokeObjectURL(this.state.imgUrl);
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.genderRedux !== this.props.genderRedux) {
      let genderArrs = this.props.genderRedux;
      this.setState({
        genderArr: genderArrs,
        gender: genderArrs && genderArrs.length > 0 ? genderArrs[0].keyMap : "",
      });
    }
    if (prevProps.roleRedux !== this.props.roleRedux) {
      let roleArrs = this.props.roleRedux;
      this.setState({
        roleArr: roleArrs,
        role: roleArrs && roleArrs.length > 0 ? roleArrs[0].keyMap : "",
      });
    }
    if (prevProps.positonRedux !== this.props.positonRedux) {
      let positonArrs = this.props.positonRedux;
      this.setState({
        positionArr: positonArrs,
        position:
          positonArrs && positonArrs.length > 0 ? positonArrs[0].keyMap : "",
      });
    }
  }
  reviewImage = () => {
    if (!this.state.imgUrl) return;
    this.setState({
      isOpen: true,
    });
  };
  checkValidate = () => {
    let arrCheck = [
      "email",
      "password",
      "firstName",
      "lastName",
      "phoneNumber",
      "address",
    ];
    let isValid = true;
    for (let i = 0; i < arrCheck.length; i++) {
      if (!this.state[arrCheck[i]]) {
        alert("Missing parameter " + arrCheck[i]);
        isValid = false;
        break;
      }
    }
    return isValid;
  };

  handleEditUser = (user) => {
    let imageBase64 = "";
    if (user.image) {
      imageBase64 = Buffer(user.image, "base64").toString("binary");
    }
    this.setState({
      email: user.email,
      password: "hashcode",
      firstName: user.firstName,
      lastName: user.lastName,
      address: user.address,
      phoneNumber: user.phoneNumber,
      gender: user.gender,
      role: user.roleId,
      position: user.positonId,
      action: CRUD_ACTIONS.EDIT,
      avatar: imageBase64,
      id: user.id,
      imgUrl: imageBase64,
    });
  };

  handleSave = () => {
    let isValid = this.checkValidate();
    let { action } = this.state;
    if (!isValid) return;
    if (action === CRUD_ACTIONS.CREATE) {
      this.props.createUserRedux({
        email: this.state.email,
        password: this.state.password,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        address: this.state.address,
        phoneNumber: this.state.phoneNumber,
        gender: this.state.gender,
        roleId: this.state.role,
        positionId: this.state.position,
        avatar: this.state.avatar,
      });
    }
    if (action === CRUD_ACTIONS.EDIT) {
      this.props.fetchEditUserRedux({
        id: this.state.id,
        email: this.state.email,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        address: this.state.address,
        phoneNumber: this.state.phoneNumber,
        gender: this.state.gender,
        roleId: this.state.role,
        positionId: this.state.position,
        avatar: this.state.avatar,
      });
      this.setState({
        action: CRUD_ACTIONS.CREATE,
      });
    }
    let positonArrs = this.props.positonRedux;
    let genderArrs = this.props.genderRedux;
    let roleArrs = this.props.roleRedux;

    this.setState({
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      address: "",
      phoneNumber: "",
      gender: genderArrs && genderArrs.length > 0 ? genderArrs[0].keyMap : "",
      role: roleArrs && roleArrs.length > 0 ? roleArrs[0].keyMap : "",
      position:
        positonArrs && positonArrs.length > 0 ? positonArrs[0].keyMap : "",
      avatar: null,
      imgUrl: null,
    });
  };
  onChangeInput = (e, id) => {
    let copyState = { ...this.state };
    copyState[id] = e.target.value;
    this.setState({
      ...copyState,
    });
  };
  onChangeImg = async (e) => {
    const file = e.target.files[0];
    const urlImage = URL.createObjectURL(file);
    let base64 = await CommonUtils.toBase64(file);
    this.setState({
      imgUrl: urlImage,
      avatar: base64,
    });
    e.target.value = null;
  };
  handleSearch = (e) => {
    let stateCopy = this.state.dataPatient;
    this.setState({
      search: e.target.value,
    });
    stateCopy = stateCopy.filter((item) => {
      return (
        item?.firstName
          ?.toLowerCase()
          .indexOf(this.state.search.toLocaleLowerCase()) !== -1 &&
        item?.lastName
          ?.toLowerCase()
          .indexOf(this.state.search.toLocaleLowerCase()) !== -1
      );
    });
    console.log(stateCopy);
    this.setState({
      dataPatient: stateCopy,
    });
  };
  render() {
    let genders = this.state.genderArr;
    let positions = this.state.positionArr;
    let roles = this.state.roleArr;

    let language = this.props.language;
    let isLoading = this.props.isLoadingGender;
    let {
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      address,
      gender,
      position,
      role,
      avatar,
    } = this.state;
    return (
      <div className="user-redux-container">
        <div className="title">
          <FormattedMessage id="menu.admin.manage-doctor" />
        </div>
        {isLoading === true ? (
          <div className="col-12 loader"></div>
        ) : (
          <div className="user-redux-body">
            <div className="container">
              <div className="row">
                <div className="col-12 my-3">
                  <FormattedMessage id="manage-user.add" />
                </div>
                <div className="col-md-3">
                  <label className="my-2" htmlFor="email">
                    <FormattedMessage id="manage-user.email" />
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="Username"
                    placeholder="Email"
                    disabled={this.state.action === CRUD_ACTIONS.EDIT}
                    value={email}
                    onChange={(e) => this.onChangeInput(e, "email")}
                  />
                </div>
                <div className="col-md-3">
                  <label className="my-2" htmlFor="password">
                    <FormattedMessage id="manage-user.password" />
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="Username"
                    placeholder="Password"
                    disabled={this.state.action === CRUD_ACTIONS.EDIT}
                    value={password}
                    onChange={(e) => this.onChangeInput(e, "password")}
                  />
                </div>
                <div className="col-md-3">
                  <label className="my-2" htmlFor="firstName">
                    <FormattedMessage id="manage-user.first-name" />
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="firstName"
                    placeholder="firstName"
                    value={firstName}
                    onChange={(e) => this.onChangeInput(e, "firstName")}
                  />
                </div>
                <div className="col-md-3">
                  <label className="my-2" htmlFor="lastName">
                    <FormattedMessage id="manage-user.last-name" />
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="lastName"
                    placeholder="LastName"
                    value={lastName}
                    onChange={(e) => this.onChangeInput(e, "lastName")}
                  />
                </div>
                <div className="col-md-3">
                  <label className="my-2" htmlFor="phone">
                    <FormattedMessage id="manage-user.phone-number" />
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="phone"
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChange={(e) => this.onChangeInput(e, "phoneNumber")}
                  />
                </div>
                <div className="col-md-9">
                  <label className="my-2" htmlFor="Address">
                    <FormattedMessage id="manage-user.address" />
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="Address"
                    placeholder="Address"
                    value={address}
                    onChange={(e) => this.onChangeInput(e, "address")}
                  />
                </div>
                <div className="col-md-3">
                  <label className="my-2" htmlFor="gender">
                    <FormattedMessage id="manage-user.gender" />
                  </label>
                  <select
                    id="gender"
                    className="form-control"
                    value={gender}
                    onChange={(e) => this.onChangeInput(e, "gender")}
                  >
                    {genders &&
                      genders.length > 0 &&
                      genders?.map((item) => {
                        return (
                          <option key={item.id} value={item.keyMap}>
                            {languages.VI === language
                              ? item.valueVi
                              : item.valueEn}
                          </option>
                        );
                      })}
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="my-2" htmlFor="position">
                    <FormattedMessage id="manage-user.position" />
                  </label>
                  <select
                    id="position"
                    className="form-control"
                    value={position}
                    onChange={(e) => this.onChangeInput(e, "position")}
                  >
                    {positions &&
                      positions.length > 0 &&
                      positions?.map((item) => {
                        return (
                          <option key={item.id} value={item.keyMap}>
                            {languages.VI === language
                              ? item.valueVi
                              : item.valueEn}
                          </option>
                        );
                      })}
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="my-2" htmlFor="roleId">
                    <FormattedMessage id="manage-user.role" />
                  </label>
                  <select
                    id="roleId"
                    className="form-control"
                    value={role}
                    onChange={(e) => this.onChangeInput(e, "role")}
                  >
                    {roles &&
                      roles.length > 0 &&
                      roles?.map((item) => {
                        return (
                          <option key={item.id} value={item.keyMap}>
                            {languages.VI === language
                              ? item.valueVi
                              : item.valueEn}
                          </option>
                        );
                      })}
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="my-2">
                    <FormattedMessage id="manage-user.image" />
                  </label>
                  <div className="img-preview-container">
                    <input
                      type="file"
                      className="form-control"
                      id="image"
                      hidden
                      onChange={(e) => this.onChangeImg(e)}
                    />
                    <label htmlFor="image" className="label-upload">
                      <FormattedMessage id="menu.doctor.push-image" />
                      <i className="fas fa-upload"></i>
                    </label>
                    <div style={{ border: "1px solid " }}>
                      <div
                        className="img-preview"
                        style={{ backgroundImage: `url(${this.state.imgUrl})` }}
                        onClick={this.reviewImage}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <button
                    className={
                      this.state.action === CRUD_ACTIONS.EDIT
                        ? "btn btn-warning my-3"
                        : "btn btn-primary add"
                    }
                    onClick={this.handleSave}
                  >
                    {this.state.action === CRUD_ACTIONS.EDIT ? (
                      <FormattedMessage id="manage-user.edit" />
                    ) : (
                      <FormattedMessage id="manage-user.save" />
                    )}
                  </button>
                </div>
                <div className="col-12">
                  <TableManageUser
                    handleEditUser={this.handleEditUser}
                    action={this.state.action}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        {this.state.isOpen && (
          <Lightbox
            mainSrc={this.state.imgUrl}
            onCloseRequest={() => this.setState({ isOpen: false })}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    isLoadingGender: state.admin.isLoadingGender,
    genderRedux: state.admin.genders,
    roleRedux: state.admin.roleIds,
    positonRedux: state.admin.positions,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getFetchGender: () => dispatch(actions.fetchGenderUser()),
    getFetchPosition: () => dispatch(actions.fetchPositionUser()),
    getFetchRole: () => dispatch(actions.fetchRoleUser()),
    createUserRedux: (data) => dispatch(actions.createUserRedux(data)),
    fetchAllUser: () => dispatch(actions.fetchGetAllUsers()),
    fetchEditUserRedux: (data) => dispatch(actions.fetchEditUser(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);
