import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../../store/actions";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import "./ManageDoctor.scss";
import Select from "react-select";
import { CRUD_ACTIONS, languages } from "../../../utils/constant";
import { withRouter } from "react-router";
import { FormattedMessage } from "react-intl";

const mdParser = new MarkdownIt();

class ManageDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contentMarkdown: "",
      contentHTML: "",
      selectedOption: null,
      description: "",
      dataDoctors: [],
      detailsDoctor: [],
      isHasData: false,

      listPrice: [],
      listPayment: [],
      listProvince: [],
      listClinic: [],
      listSpecialty: [],
      selectedPrice: "",
      selectedPayment: "",
      selectedProvince: "",
      selectedClinic: "",
      selectedSpecialty: "",
      nameClinic: "",
      addressClinic: "",
      note: "",
      // clinicId : '',
      // specialtyId: ''
    };
  }

  componentDidMount() {
    this.props.fetchAllDoctor();
    this.props.getAllRequiredDoctorInfor();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.listDoctors !== this.props.listDoctors) {
      let optionDoctors = this.buildDataInputSelect(
        this.props.listDoctors,
        "USERS"
      );
      this.setState({
        dataDoctors: optionDoctors,
      });
    }
    if (prevProps.language !== this.props.language) {
      let optionDoctors = this.buildDataInputSelect(
        this.props.listDoctors,
        "USERS"
      );
      let { resPrice, resPayment, resProvince, resSpecialty, resClinic } =
        this.props.allDoctorRequired;
      let optionPrices = this.buildDataInputSelect(resPrice, "PRICE");
      let optionPayments = this.buildDataInputSelect(resPayment, "PAYMENT");
      let optionProvinces = this.buildDataInputSelect(resProvince, "PROVINCE");
      let optionSpecialties = this.buildDataInputSelect(
        resSpecialty,
        "SPECIALTY"
      );
      let optionClinics = this.buildDataInputSelect(resClinic, "CLINIC");
      this.setState({
        dataDoctors: optionDoctors,
        listPrice: optionPrices,
        listPayment: optionPayments,
        listProvince: optionProvinces,
        listSpecialty: optionSpecialties,
        listClinic: optionClinics,
      });
    }
    if (prevProps.detailsDoctor !== this.props.detailsDoctor) {
      let { detailsDoctor } = this.props;
      let { listPrice, listPayment, listProvince, listSpecialty, listClinic } =
        this.state;
      let selectPrice = listPrice.find((item) => {
        return item && item.value === detailsDoctor?.Doctor_Infor?.priceId;
      });
      let selectPayment = listPayment.find((item) => {
        return item && item.value === detailsDoctor?.Doctor_Infor?.paymentId;
      });
      let selectProvince = listProvince.find((item) => {
        return item && item.value === detailsDoctor?.Doctor_Infor?.provinceId;
      });
      let selectSpecialty = listSpecialty.find((item) => {
        return item && item.value === detailsDoctor?.Doctor_Infor?.specialtyId;
      });
      let selectClinic = listClinic.find((item) => {
        return item && item.value === detailsDoctor?.Doctor_Infor?.clinicId;
      });
      this.setState({
        description:
          detailsDoctor &&
          detailsDoctor.Markdown &&
          detailsDoctor.Markdown.description !== null
            ? detailsDoctor.Markdown.description
            : "",

        contentHTML:
          detailsDoctor &&
          detailsDoctor.Markdown &&
          detailsDoctor.Markdown.contentHTML !== null
            ? detailsDoctor.Markdown.contentHTML
            : "",

        contentMarkdown:
          detailsDoctor &&
          detailsDoctor.Markdown &&
          detailsDoctor.Markdown.contentMarkdown !== null
            ? detailsDoctor.Markdown.contentMarkdown
            : "",

        nameClinic:
          detailsDoctor &&
          detailsDoctor.Doctor_Infor &&
          detailsDoctor.Doctor_Infor.nameClinic !== null
            ? detailsDoctor.Doctor_Infor.nameClinic
            : "",

        addressClinic:
          detailsDoctor &&
          detailsDoctor.Doctor_Infor &&
          detailsDoctor.Doctor_Infor.addressClinic !== null
            ? detailsDoctor.Doctor_Infor.addressClinic
            : "",

        note:
          detailsDoctor &&
          detailsDoctor.Doctor_Infor &&
          detailsDoctor.Doctor_Infor.note !== null
            ? detailsDoctor.Doctor_Infor.note
            : "",
        selectedPrice: selectPrice ? selectPrice : "",
        selectedPayment: selectPayment ? selectPayment : "",
        selectedProvince: selectProvince ? selectProvince : "",
        selectedSpecialty: selectSpecialty ? selectSpecialty : "",
        selectedClinic: selectClinic ? selectClinic : "",
      });
    }
    if (prevProps.allDoctorRequired !== this.props.allDoctorRequired) {
      let { resPrice, resPayment, resProvince, resSpecialty, resClinic } =
        this.props.allDoctorRequired;
      let optionPrices = this.buildDataInputSelect(resPrice, "PRICE");
      let optionPayments = this.buildDataInputSelect(resPayment, "PAYMENT");
      let optionProvinces = this.buildDataInputSelect(resProvince, "PROVINCE");
      let optionSpecialties = this.buildDataInputSelect(
        resSpecialty,
        "SPECIALTY"
      );
      let optionClinics = this.buildDataInputSelect(resClinic, "CLINIC");

      this.setState({
        listPrice: optionPrices,
        listPayment: optionPayments,
        listProvince: optionProvinces,
        listSpecialty: optionSpecialties,
        listClinic: optionClinics,
      });
    }
  }
  handleEditorChange = ({ html, text }) => {
    this.setState({
      contentMarkdown: text,
      contentHTML: html,
    });
  };
  handleChangeDesc = (e) => {
    this.setState({
      description: e.target.value,
    });
  };
  handleSaveContentMarkDown = () => {
    let { isHasData } = this.state;
    this.props.saveDataDoctor({
      contentHTML: this.state.contentHTML,
      contentMarkdown: this.state.contentMarkdown,
      doctorId: this.state.selectedOption && this.state.selectedOption.value,
      description: this.state.description,
      action: isHasData ? CRUD_ACTIONS.EDIT : CRUD_ACTIONS.CREATE,
      selectedPrice: this.state.selectedPrice && this.state.selectedPrice.value,
      selectedPayment:
        this.state.selectedPayment && this.state.selectedPayment.value,
      selectedSpecialty:
        this.state.selectedSpecialty && this.state.selectedSpecialty.value,
      selectedClinic:
        this.state.selectedClinic && this.state.selectedClinic.value
          ? this.state.selectedClinic.value
          : "",
      selectedProvince:
        this.state.selectedProvince && this.state.selectedProvince.value,
      nameClinic: this.state.nameClinic,
      addressClinic: this.state.addressClinic,
      note: this.state.note,
    });

    // this.props.history.push('/home')
  };
  handleChangeSelect = async (selectedOption) => {
    this.setState({ selectedOption });
    await this.props.getDetailsDoctor(selectedOption.value);
    if (!this.state.description && !this.state.contentMarkdown) {
      this.setState({
        isHasData: false,
      });
    } else {
      this.setState({
        isHasData: true,
      });
    }
  };

  handleChangeSelectDoctorInfor = async (selectedOption, name) => {
    let stateName = name.name;
    let stateCopy = { ...this.state };
    stateCopy[stateName] = selectedOption;
    this.setState({
      ...stateCopy,
    });
  };
  buildDataInputSelect = (inputData, type) => {
    let language = this.props.language;
    let result = [];
    if (type === "USERS") {
      inputData &&
        inputData.length > 0 &&
        inputData?.map((item, index) => {
          let object = {};
          let labelVi = `${item.lastName} ${item.firstName}`;
          let labelEn = `${item.firstName} ${item.lastName}`;
          object.value = item.id;
          object.label = languages.VI === language ? labelVi : labelEn;
          result.push(object);
        });
    }
    if (type === "PAYMENT" || type === "PROVINCE") {
      inputData &&
        inputData.length > 0 &&
        inputData?.map((item, index) => {
          let object = {};
          let labelVi = `${item.valueVi}`;
          let labelEn = `${item.valueEn}`;
          object.value = item.keyMap;
          object.label = languages.VI === language ? labelVi : labelEn;
          result.push(object);
        });
    }
    if (type === "PRICE") {
      inputData &&
        inputData.length > 0 &&
        inputData?.map((item, index) => {
          let object = {};
          let labelVi = `${item.valueVi}`;
          let labelEn = `${item.valueEn} USD`;
          object.value = item.keyMap;
          object.label = languages.VI === language ? labelVi : labelEn;
          result.push(object);
        });
    }
    if (type === "SPECIALTY") {
      inputData &&
        inputData.length > 0 &&
        inputData?.map((item, index) => {
          let object = {};
          object.label = item.name;
          object.value = item.id;

          result.push(object);
        });
    }
    if (type === "CLINIC") {
      inputData &&
        inputData.length > 0 &&
        inputData?.map((item, index) => {
          let object = {};
          object.label = item.name;
          object.value = item.id;

          result.push(object);
        });
    }
    return result;
  };
  handleChangeText = (e, id) => {
    let stateCopy = { ...this.state };
    stateCopy[id] = e.target.value;
    this.setState({ ...stateCopy });
  };
  render() {
    return (
      <div className="manage-doctor-contain" container>
        <div className="manage-doctor-title">
          <h2 className="title">
            <FormattedMessage id="admin.manage-doctor.title" />
          </h2>
        </div>
        <div className="more-info">
          <div className="content-left">
            <label>
              <FormattedMessage id="admin.manage-doctor.choose-doctor" />
            </label>
            <Select
              value={this.state.selectedOption}
              onChange={this.handleChangeSelect}
              options={this.state.dataDoctors}
              placeholder={
                <FormattedMessage id="admin.manage-doctor.choose-doctor" />
              }
            />
          </div>
          <div className="content-right">
            <label>
              <FormattedMessage id="admin.manage-doctor.infor" />
            </label>
            <textarea
              className="form-control"
              value={this.state.description}
              onChange={(e) => this.handleChangeDesc(e)}
            ></textarea>
          </div>
        </div>
        <div className="more-infor-extract row">
          <div className="form-group col-4">
            <label>
              <FormattedMessage id="admin.manage-doctor.choose-price" />
            </label>
            <Select
              value={this.state.selectedPrice}
              onChange={this.handleChangeSelectDoctorInfor}
              options={this.state.listPrice}
              placeholder={
                <FormattedMessage id="admin.manage-doctor.choose-price" />
              }
              name="selectedPrice"
            />
          </div>
          <div className="form-group col-4">
            <label>
              <FormattedMessage id="admin.manage-doctor.choose-payment" />
            </label>
            <Select
              value={this.state.selectedPayment}
              onChange={this.handleChangeSelectDoctorInfor}
              options={this.state.listPayment}
              placeholder={
                <FormattedMessage id="admin.manage-doctor.choose-payment" />
              }
              name="selectedPayment"
            />
          </div>
          <div className="form-group col-4">
            <label>
              <FormattedMessage id="admin.manage-doctor.choose-province" />
            </label>
            <Select
              value={this.state.selectedProvince}
              onChange={this.handleChangeSelectDoctorInfor}
              options={this.state.listProvince}
              placeholder={
                <FormattedMessage id="admin.manage-doctor.choose-province" />
              }
              name="selectedProvince"
            />
          </div>
          <div className="col-4 form-group">
            <label>
              <FormattedMessage id="admin.manage-doctor.choose-specialty" />
            </label>
            <Select
              value={this.state.selectedSpecialty}
              onChange={this.handleChangeSelectDoctorInfor}
              options={this.state.listSpecialty}
              placeholder={
                <FormattedMessage id="admin.manage-doctor.choose-specialty" />
              }
              name="selectedSpecialty"
            />
          </div>
          <div className="col-4 form-group">
            <label>
              <FormattedMessage id="admin.manage-doctor.choose-clinic" />
            </label>
            <Select
              value={this.state.selectedClinic}
              onChange={this.handleChangeSelectDoctorInfor}
              options={this.state.listClinic}
              placeholder={
                <FormattedMessage id="admin.manage-doctor.choose-clinic" />
              }
              name="selectedClinic"
            />
          </div>
          <div className="form-group col-4">
            <label>
              <FormattedMessage id="admin.manage-doctor.name-clinic" />
            </label>
            <input
              type="text"
              className="form-control"
              onChange={(e) => this.handleChangeText(e, "nameClinic")}
              value={this.state.nameClinic}
            />
          </div>
          <div className="form-group col-4">
            <label>
              <FormattedMessage id="admin.manage-doctor.address-clinic" />
            </label>
            <input
              type="text"
              className="form-control"
              onChange={(e) => this.handleChangeText(e, "addressClinic")}
              value={this.state.addressClinic}
            />
          </div>
          <div className="form-group col-4">
            <label>
              <FormattedMessage id="admin.manage-doctor.note" />
            </label>
            <input
              type="text"
              className="form-control"
              onChange={(e) => this.handleChangeText(e, "note")}
              value={this.state.note}
            />
          </div>
        </div>
        <div className="manage-doctor-editor">
          <MdEditor
            value={this.state.contentMarkdown}
            style={{ height: "250px" }}
            renderHTML={(text) => mdParser.render(text)}
            onChange={this.handleEditorChange}
          />
        </div>
        <button
          className={
            this.state.isHasData ? "btn-update-doctor" : "btn-create-doctor"
          }
          onClick={() => this.handleSaveContentMarkDown()}
        >
          {this.state.isHasData ? (
            <span>
              <FormattedMessage id="admin.manage-doctor.edit-infor" />
            </span>
          ) : (
            <span>
              <FormattedMessage id="admin.manage-doctor.add-infor" />
            </span>
          )}
        </button>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    listDoctors: state.admin.dataDoctors,
    language: state.app.language,
    detailsDoctor: state.admin.detailsDoctor,
    allDoctorRequired: state.admin.allRequiredInfor,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAllDoctor: () => dispatch(actions.fetchAllDoctor()),
    saveDataDoctor: (data) => dispatch(actions.saveDoctors(data)),
    getDetailsDoctor: (id) => dispatch(actions.fetchDetailsDoctor(id)),
    getAllRequiredDoctorInfor: (id) =>
      dispatch(actions.fetchAllRequiredDoctorInfor()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ManageDoctor)
);
