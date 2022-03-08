import React, { Component } from 'react';
import { connect } from 'react-redux';
import { languages } from '../../../utils';
require('dotenv').config();


class Comment extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    componentDidMount() {
        this.initFackbookSDK()
    }
    componentDidUpdate(prevProps, prevState) {
        if(prevProps.language !== this.props.language) {
            this.initFackbookSDK()
        }
    }
    initFackbookSDK() {
        if(window.FB) {
            window.FB.XFBML.parse()
        }
        let locale = this.props.language === languages.EN ? 'en_US' : 'vi_VN'
        
        window.fbAsyncInit = function() {
            window.FB.init({
              appId            : process.env.REACT_APP_FACEBOOK_APP_ID,
              cookie           : true,
              xfbml            : true,
              version          : 'v13.0'
            });
          };
        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0]
            if(d.getElementById(id)) return
            js = d.createElement(s); js.id = id; 
            js.src = `//connect.facebook.net/${locale}/sdk.js`
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'))
    }

    render() {
        let { dataHref, numposts, width } = this.props
        return (
            <>
                <div className="fb-comments" 
                data-href={dataHref}
                data-width={width ? width : ''} 
                data-numposts={numposts ? numposts : '5'}
                ></div>
            </>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Comment);
