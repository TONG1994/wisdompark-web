let $ = require('jquery');
import React from 'react';
import {withRouter,browserHistory} from 'react-router';
import {Form, Button, Input, Icon, Checkbox, Col, Row, message} from 'antd';
const FormItem = Form.Item;
import './style/login.scss';

let Common = require('../public/script/common');
let Utils = require('../public/script/utils');
import ErrorMsg from '../lib/Components/ErrorMsg';
import Logo from './style/wisdomPark-logo.png';
import SlideBlockPage from './Components/SlideBlockPage';

let LoginUtil = require('./LoginUtil');
let slideState = 'start';
let FormDef = require('./Components/LoginForm');
//星空
// import CanvasDotePage from './Components/CanvasDotePage';
import ResetPwdPage from './Components/ResetPasswdPage';
import LogActions from './action/LogActions';
import LogStores from './data/LogStores';

class LoginPage2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        userName: '',
        passwd: ''
      },
      loading: false,
      errMsg: '',
      hints: {},
      action: 'login',
      validRules: [],
      slideEnd: false,
    };
    let loginData = window.sessionStorage.getItem('loginData');
    if (loginData !== null && typeof (loginData) !== 'undefined') {
      let skip = false;
      let loc = this.props.location;
      if (loc !== null && typeof (loc) !== 'undefined') {
        let path = loc.pathname;
        if (path !== '') {
          if (loc.search !== '') {
            skip = true;
          } else if (path !== '/' && path !== '/index.html' && path !== '/test.html' && path !== '/electron.html') {
            skip = true;
          }
        }
      }
      
      if (skip && LoginUtil.loadContext()) {
        let menus = Common.getMenuList() || [];
        if (!menus.length) {
          message.error('您没有权限登录！');
          window.sessionStorage.removeItem('loginData');
          return;
        }
        let search = this.props.location.search.substring(1);
        if (search.indexOf('href') > -1) {
          search = '/' + search.split('=')[1];//对应404页面的href
        }
        search = search.substring(0, search.lastIndexOf('/') + 1);
        this.props.router.push({
          pathname: search,
          state: {from: 'login'}
        });
      } else {
        let href = window.location.href;
        if (href.indexOf('linkid=') < 0) {
          window.sessionStorage.removeItem('loginData');
        }
      }
    }
  }
  
  
  componentDidMount() {
    let self = this;
    LoginUtil.downConfig(this).then((result) => {
    
    }, (value) => {
      Common.errMsg('加载配置文件错误');
    });
    this.state.validRules = FormDef.getFormRule(this);
    this.clear();
    this.unsubscribe = LogStores.listen(this.onServiceChange);
    $(document).on('keydown', (e) => {
      let theEvent = e || window.event;
      let code = theEvent.keyCode || theEvent.which || theEvent.charCode;
      if (code == 13) {
        this.clickLogin();
      }
    });
  }
  clear=()=>{
    FormDef.initForm(this.state.user);
    this.state.hints = {};
    this.setState({loading:false});
  }
  onServiceChange = (data) => {
    this.setState({loading: false});
    if (!data.errMsg) {
      if (data.operation === 'login') {
        this.loginSuccess(data.recordSet);
      }
    } else if (data.errMsg && data.operation === 'login') {
      this.showError(data.errMsg);
      this.onFailCheck();
    }
  }
  
  componentWillUnmount() {
    //临时加
    this.unsubscribe();
    $(document).off('keydown');
  }
  
  showError = (msg) => {
    this.setState({
      slideEnd: true,
      errMsg: msg
    });
  }
  setSlideState = (state) => {
    slideState = state;
    if (state === 'end' && this.state.slideEnd) {
      this.setState({slideEnd: false, errMsg: ''});
    }else if (state === 'start' && !this.state.slideEnd) {
      this.setState({slideEnd: true});
    }
  }
  onSafetyNavi = (loginData) => {
    LoginUtil.safeNavi(this, loginData);
  }
  onFailCheck=()=>{
    this.slide.onMouseUp();
    this.setSlideState('start');
    this.slide.init();
  }
  
  clickLogin = () => {
    let passwd = this.state.user.passwd;
    this.state.errMsg = '';
    if (!Common.formValidator(this, this.state.user)) {
      return;
    }
    let password = Common.calcMD5(passwd.toLocaleLowerCase());
    let userName = this.state.user.userName;
    let loginData = {
      password,
      accountName:userName
    };
    if (slideState !== 'end') {
      this.showError('请按住滑块，拖动到最右边!');
      return;
    }
    this.setState({loading: true});
    LogActions.login(loginData);
  }
  
  // clickQuickLogin = () => {
  //    let loginData = {accountName:'admin',password:'admin123'};
  //   this.setState({loading: true});
  //   LogActions.login(loginData);
  // }
  
  loginSuccess = (loginData) => {
    let corpUuid = '';
    LoginUtil.saveLoginData(loginData, corpUuid);
    window.location.href = '/index.html?/wisdomPark/desk/';
  }
  
  handleOnChange = (e) => {
    let user = this.state.user;
    let s = e.target.value.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    user[e.target.id]= s;
    if(!Common.validator(this, user, e.target.id)){
      if(s.length > 20){
        user[e.target.id]= s.substr(0, 20);  
      }
    }
    this.setState({
      user: user
    });
    if (this.state.errMsg) {
      this.onDismiss();
    }
  }
  onDismiss = () => {
    this.setState({
      errMsg: ''
    });
  }
  reqPsd = () => {
    this.setState({action: 'resetpwd'});
  }
  onGoBack = () => {
    this.setState({action: 'login'});
  }
  
  render() {
    let errMsg = this.state.errMsg;
    let layout = 'vertical';
    let layoutItem = 'form-item-' + layout + ' ' + 'form-class';
    let items = FormDef.getForm(this, this.state.user, null,Common.modalForm, layout);
    let visible = (this.state.action === 'login') ? '' : 'none';
    let contactTable = '';
    let year = new Date().getFullYear();
    if (this.state.action === 'login') {
      contactTable = (
          <div>
            {/*<CanvasDotePage />*/}
            {/* <div className='login-title'>O-Park智能门禁管理系统</div> */}
            <div className='content-wrap'>
              {/* <div className='banner-wrap'>
                    <img />
                  </div> */}
              <div className='inner-wrap'>
                <div className='input-wrap'>
                  <div className='login-text'><img src={Logo}/></div>
                  <div className='login-title'>
                    <p>
                      <span className='word'>O-Park </span>
                      <span className='text'>智慧门禁管理系统</span>
                      </p>
                  </div>
                  <div style={{marginBottom:'20px'}}>
                  <ErrorMsg message={errMsg} toggle={this.onDismiss} />
                  </div>
                 
                  <div style={{width: '100%', display: visible, position: 'relative'}}>
                    <Form layout={layout}>
                      {items}
                    </Form>
                    <SlideBlockPage ref={ref=>this.slide = ref}  setSlideState={this.setSlideState}/>
                    <div  className='login-btn-wrap'>
                    <Button  key="btnOK" type="primary" size="large" onClick={this.clickLogin}
                                className='btn'
                                loading={this.state.loading}>登录</Button>
                        {/* <a onClick={this.reqPsd} style={{float: 'right', marginTop: '1px', color: '#2f4c79'}}>忘记密码？</a> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="login-foot">
            <span>Copyright <i style={{fontFamily:'arial'}}>&copy; </i>{year} O-Park，All Rights Reserved.</span>
            <p>Powered by 隆正信息科技有限公司 V1.2.091010</p>
            </div>
          </div>
      )
      ;
    } else if (this.state.action === 'resetpwd') {
      contactTable = (<ResetPwdPage onGoBack={this.onGoBack}/>);
    }
    
    return (
        <div style={{width: '100%', height: '100%' ,backgroundColor:'#f1f1f1'}} className='log-wrap'>
          {contactTable}
        </div>
    );
  }
}

export default withRouter(LoginPage2);
