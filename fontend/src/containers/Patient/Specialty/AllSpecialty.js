import React, { Component } from 'react';
import { connect } from "react-redux";
import * as actions from '../../../store/actions'
import { languages } from '../../../utils';
import './AllSpecialty.scss'
import { withRouter } from 'react-router';


class AllSpecialty extends Component {
    constructor(props) {
        super(props)
        this.state = {
            allDataSpecialty: [],
            search: ''
        }
    }

    async componentDidMount() {
        await this.props.getAllSpecialty()
        
        
    }
    componentDidUpdate(prevProps, prevState) {
        
       if(prevProps.allDataSpecialty !== this.props.allDataSpecialty) {
           this.setState({
           allDataSpecialty : this.props.allDataSpecialty
           })
       }
    }
    returnHome = () => {
        if(this.props.history) {
            this.props.history.push('/home')
        }
    }

    handleDetailsSpecialty = (item) => {
        if(this.props.history) {
            this.props.history.push(`/details-specialty/${item.id}`);
        }
    }
    
    handleChangeSearch = (e) => {
        this.setState({
            search: e.target.value
        })
    }
    render() {
        let { allDataSpecialty, search} = this.state
        let {language} = this.props
        return (
            <div className="all-specialty-container">
                <div className="header-specialty">
                    <div className="all-specialty-header">
                        <button 
                        onClick={this.returnHome}
                        >
                            <i className="fas fa-arrow-left return-home"></i>
                        </button>
                        <h2 className="name-specialty">Chuyên khoa</h2>
                    </div>
                </div>
                <div className="search-specialty">
                    <input type="text" className="input-search" placeholder="Tìm kiếm chuyên khoa"
                    value={this.state.search}
                    onChange={this.handleChangeSearch}
                    />
                </div>
                <div className="all-specialty-body">
                    {allDataSpecialty && allDataSpecialty.length > 0 && 
                    allDataSpecialty.filter((item) => {
                        if(search === "") {
                            return item
                        }else if (item?.name?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(search.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''))) {
                            return item
                        }
                    })?.map((item, index) => {
                        return (
                            <div className="specialty-item" key={index}
                            onClick={() => this.handleDetailsSpecialty(item)}
                            >
                                <div className="specialty-image"
                                    style={{backgroundImage: `url(${item.image})`}}
                                
                                ></div>
                                <div className="specialty-name">{item.name}</div>
                            </div>
                        )
                    })}
                </div>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AllSpecialty));
