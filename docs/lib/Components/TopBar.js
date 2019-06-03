import React from 'react';
import Helmet from 'react-helmet';
import { browserHistory } from 'react-router';
import emitter from '../../wisdomPark/lib/components/events';
import { Layout, Menu,Icon, Dropdown, Button,Modal,Form ,Input,Alert,message} from 'antd';
const FormItem = Form.Item;
const { Header, Content, Footer } = Layout;
import { PrismCode } from 'react-prism';
let LoginUtil = require('../../login2/LoginUtil');
var Reflux = require('reflux');
let Utils = require('../../public/script/utils');
let Common = require('../../public/script/common');

import SelectPark from '../../wisdomPark/lib/components/SelectPark';

import LogActions from '../../login2/action/LogActions';
import LogStores from '../../login2/data/LogStores';
let loginData = Common.getLoginData();
const propTypes = {
  children: React.PropTypes.node,
  navItems: React.PropTypes.array,
  activeNode: React.PropTypes.string,
  offsetLeft: React.PropTypes.string,
  home: React.PropTypes.string,
};

let TopBar = React.createClass({
  getInitialState: function () {
    return {
      activeNode: null,
      menuFile: null,
      accountVisible:false,
      changePsw:false,
      form:{
        oldPsw:'',
        newPsw:'',
        confirmPsw:''
      },
      errorMsg:'',
      hints: {},
      validRules: [],
      selectPark:{
        uuid:'',
        parkName:''
      }
    };
  },
  mixins: [Reflux.listenTo(LogStores, 'onServiceComplete'),],
  onServiceComplete:function (data) {
    if(data.operation === 'updatePwd'){
      if(data.errMsg){
        this.setState({errorMsg:data.errMsg});
        return ;
      }else{
        message.success('密码修改成功！');
        // Common.succMsg('密码修改成功！');
        this.hideModalPsw();
        this.formClear();
        window.sessionStorage.removeItem('loginData');
        Utils.showPage('/index.html');
      }
    }else if(data.operation === 'logout'){
      if(data.errMsg){
        this.setState({errorMsg:data.errMsg});
        return ;
      }else{
        window.sessionStorage.removeItem('loginData');
        window.sessionStorage.removeItem('selectedParkUuid');
        window.sessionStorage.removeItem('selectParkData');
        Utils.showPage('/index.html');
      }
    }
  },
  componentDidMount(){
    this.initSelectPark();
    this.eventEmitter = emitter.addListener('TopBarCallMe', (msg)=>{
      this.initSelectPark();
    });
  },
  initSelectPark:function(){
    if(this.selectPark){
      let userType = Common.getLoginData().userInfo && Common.getLoginData().userInfo.parkUuid ? Common.getLoginData().userInfo.parkUuid : '';
      let uuid = '',
        parkList = Common.getParkList(),
        selectedParkUuid = Common.getSelectedParkUuid();
      let selectPark = parkList ? parkList.selectParkData.find(item => item.parkName === 'O-Park') : null;
      if (userType) {
        uuid = selectedParkUuid ? selectedParkUuid : '';
      } else if (!userType && selectPark) {
        uuid = selectPark.uuid;
        this.setState({
          selectPark
        });
      }
      this.selectPark.onSelect(uuid);
    }
  },
  componentWillUnmount:function(){
    // emitter.removeListener('TopBarCallMe', (msg)=>{

    // });
  },
  goHome: function (e) {
    // let url = this.props.home;
    // if (url === null || typeof (url) === 'undefined') {
    //   url = '/main/DeskPage/';
    // }

    //     // 不检查主页面的菜单
    // Utils.setActiveMenuName('');

    // if (url.charAt(0) === '@') {
    //   url = url.substr(1);
    //   Utils.showPage(url);
    // } else {
    //   browserHistory.push({
    //     pathname: url
    //   });
    // }
    let url ='/wisdomPark/desk/';
    if(window.location.href !== url){
      browserHistory.push({
        pathname: url
      });
    }
  },
  handleMenuClick: function (e) {
    Common.activePage = null;

    if (e.key === '1') {
            // 改密
      browserHistory.push({
        pathname: '/main/passwd/'
      });
    } else if (e.key === '2') {
            // 签退
      //调用后台接口
      LogActions.logout('');
      window.sessionStorage.removeItem('loginData');
      Utils.showPage('/index.html');
    } else if (e.key === '103') {
            // 菜单文件
      let str = JSON.stringify(this.props.navItems, null, 4);
      this.setState({ menuFile: str });
    } else if(e.key === '3') {//园区管理员（角色）
      // let accountVisible = true;
      // this.setState({accountVisible});
    } else if(e.key === '4') {
      let key='/wisdomPark/systemSetManage/OpenParkManagePage/', obj={key};
      this.handleClick(obj);
    } else{
      console.log('handleMenuClick', e);
    }
  },
  handleClick: function (e) {
    this.setState({ menuFile: null, activeNode: e.key });

    let len = this.props.navItems.length;
    for (let i = 0; i < len; i++) {
      let item = this.props.navItems[i];
      if (item.to === e.key) {
        if (item.onClick) {
          item.onClick();
          return;
        }
      }
    }

    let url = e.key;
    let param = '';
    let pos = url.indexOf('?');
    if (pos > 0) {
      param = url.substring(1 + pos);
      url = url.substring(0, pos);
    }

    let pr = { fromDashboard: true };
    if (param !== '') {
      let values = param.split('&');
      values.map((str, i) => {
        pos = str.indexOf('=');
        if (pos > 0) {
          let name = str.substring(0, pos);
          let value = str.substring(1 + pos);
          pr[name] = value;
        }
      });
    }
    browserHistory.push({
      pathname: url,
      query: pr
    });
  },

    // 查找菜单节点
  findMenuNode: function (menus, href) {
    let len = menus.length;
    for (let i = 0; i < len; i++) {
      let node = menus[i];
      let path = node.to;
      if (path && path.startsWith(href)) {
        return node;
      }

            // 子节点
      let childNodes = node.nextMenus;
      if (!childNodes) {
        childNodes = node.childItems;
      }

      if (childNodes && childNodes.length > 0) {
        node = this.findMenuNode(childNodes, href);
        if (node) {
          return node;
        }
      }
    }
  },
  hideModal:function () {
    this.setState({accountVisible:false});
  },
  hideModalPsw:function () {
    this.setState({changePsw:false,hints:{}});
  },
  handleChangePsw:function () {
    this.setState({accountVisible:false,changePsw:true,});
    this.formClear();
  },
  formClear:function () {
    let form = Object.assign({},this.state.form,{oldPsw:'', newPsw:'', confirmPsw:''});
    this.setState({form});
  },
  handleOnChange:function (e) {
    let id = e.target.id, form = this.state.form,
        val = e.target.value.replace(/\s+/g, "");
        form[id] = val;
        Common.validator(this,form, e.target.id);
    this.setState({form,errorMsg:''});
  },
  errorMsg:function () {
    this.setState({errorMsg:''});
  },
  changePswOk:function () {
    this.setState({errorMsg:''});
    if(Common.validator(this,this.state.form)){
      let obj = this.state.form;
      if(obj.confirmPsw!==obj.newPsw){
        this.setState({errorMsg:'两次输入密码不一样'});
        return;
      }
      if(obj.newPsw === obj.oldPsw){
            Common.infoMsg('建议新旧密码不一样！');
            return;
      }
      let sendObj = {
          type:"2",
          pwd:Common.calcMD5(obj.oldPsw),
          newPwd:Common.calcMD5(obj.newPsw),
          phone:loginData.staffInfo.phone
      };
      LogActions.forgetPsw(sendObj)
    }
  },
  getUserRole: function(){
    let userType = this.getUserType(), userRole='';
    if(!userType){
      userRole='系统管理员';
    }else {
      userRole='园区管理员';
    }
    return userRole;
  },
  getUserType:function(){
    let userType = window.loginData.userInfo && window.loginData.userInfo.parkUuid ? window.loginData.userInfo.parkUuid :'';
    return userType;
  },
  publishParkUuid: function(msg){
    emitter.emit('callMe',msg);
  },
  onSelectPark:function(data){
    let selectPark = {
      uuid:'',
      parkName:'',
      parkLocation:''
    };
    if(data && data.parkName){
     selectPark = Utils.deepCopyValue(data);
    }
    this.setState({
      loading:false,
      selectPark
    }, ()=>{
      let selectedParkUuid=selectPark.uuid;
      window.selectedParkUuid = selectedParkUuid;
      window.sessionStorage.setItem('selectedParkUuid', selectedParkUuid);
      this.publishParkUuid(selectedParkUuid);
    });
  },
  render: function () {
    let hints=this.state.hints;
    if (window.loginData === null || typeof (window.loginData) === 'undefined') {
      if (!LoginUtil.loadContext()) {
        browserHistory.push({
          pathname: '/index.html'
        });

        return null;
      }
    }

    if (!Common.isShowMenu) {
      let href = window.location.href;
      let pos = href.indexOf('?');
      if (pos > 0) {
        href = href.substr(0, pos);
      }

      pos = href.indexOf('/', 10);
      if (pos > 0) {
        href = href.substr(pos);
      }

            // 会自动添加 /safe
      if (href.startsWith('/safe')) {
        href = href.substr(5);
      }

      let node = this.findMenuNode(this.props.navItems, href);
            // console.log('this.props.navItems', this.props.navItems, window.location.href, node)
      if (node) {
        return (<div style={{ width: '100%', height: '100%', padding: '36px 0 0' }}>
          <Helmet
            titleTemplate="智慧门禁管理系统 - %s"
            title="智慧门禁管理系统"
            defaultTitle="智慧门禁管理系统"
            meta={[{ name: '智慧门禁管理系统' }]}
          />
          <Header style={{ margin: '-36px 0 0', height: '36px', lineHeight: '36px', paddingLeft: '36px' }}>
            <div style={{ float: 'left', color: '#EFEFEF' }}>{node.name}</div>
          </Header>
          <Content style={{ width: '100%', height: '100%', padding: '0 0px' }}>
            {this.props.children}
          </Content>
        </div>);
      }

      return (<div style={{ width: '100%', height: '100%', padding: '0 0' }}>
        {/* <img src={Logo} /> */}
        <Helmet
          // titleTemplate="智慧门禁管理系统 - %s"
          title="智慧门禁管理系统"
          defaultTitle="智慧门禁管理系统"
          meta={[{ name: '智慧门禁管理系统' }]}
        />
        <Content style={{ width: '100%', height: '100%', padding: '0 0px' }}>
          {this.props.children}
        </Content>
      </div>);
    }

    let menuStyle = { height: '36px', fontSize: '14px',textAlign:'left' };
    const menu = (
            Common.resMode ?
              (<Menu onClick={this.handleMenuClick}>
                <Menu.Item key="1" style={menuStyle}><Icon type="unlock" style={{ marginLeft: '8px' }} /><span>修改密码</span></Menu.Item>
                <Menu.Item key="2" style={menuStyle}><Icon type="home" /><span style={{ marginLeft: '8px' }}>用户签退</span></Menu.Item>
              </Menu>) :
                (<Menu onClick={this.handleMenuClick}>
                  {/*<Menu.Item key="1" style={menuStyle}><Icon type="unlock" /><span style={{ marginLeft: '8px' }}>修改密码</span></Menu.Item>*/}
                  <Menu.Item key="3" style={menuStyle} disabled><Icon type="user" /><span style={{ marginLeft: '8px' }}>{this.getUserRole()}</span></Menu.Item>
                  {this.getUserType() ? null: <Menu.Item key="4" style={menuStyle}><Icon type="setting" /><span style={{ marginLeft: '8px' }}>系统设置</span></Menu.Item>}
                  {/*<Menu.Item key="103" style={menuStyle}><Icon type="bars" /><span style={{ marginLeft: '8px' }}>菜单文件</span></Menu.Item>*/}
                  <Menu.Item key="2" style={menuStyle}><Icon type="logout" /><span style={{ marginLeft: '8px' }}>退出登录</span></Menu.Item>
                </Menu>)
        );
    let offsetLeft = this.props.offsetLeft;
    if (offsetLeft === null || typeof (offsetLeft) === 'undefined') {
      offsetLeft = '160px';
    }

    let body = null;
    if (this.state.menuFile) {
      let menuFile = this.state.menuFile;
      let blob = new Blob([menuFile]);

      body = (<div style={{ width: '70%', height: '100%', margin: '0 auto', padding: '40px 0', overflow: 'hidden' }}>
        <div style={{ fontSize: '12pt', padding: '0 0 12px 0' }}>菜单文件，生成的文件保存到[build/auth]目录下，用于菜单项的授权</div>
        <div style={{ height: '80%', overflowY: 'auto' }}>
          <pre style={{ backgroundColor: '#3f3f3f' }}>
            <PrismCode className="language-jsx">
              {this.state.menuFile}
            </PrismCode>
          </pre>
        </div>
        <div style={{ padding: '20px 0 0 0' }}><a className="load-field" download={Utils.selModName + '.json'} href={window.URL.createObjectURL(blob)}>下载菜单文件</a></div>
      </div>);
    } else {
      body = this.props.children;
    }
    //解决浏览器回退头部组件不回退的问题
    this.state.activeNode = this.props.activeNode;
    let aNode = [this.state.activeNode];
    let parkUserName = window.loginData.userInfo && window.loginData.userInfo.accountName ? window.loginData.userInfo.accountName :'未获取到';
    return (<div style={{ width: '100%', height: '100%', padding: '40px 0 0' }}>
      <Helmet
        // titleTemplate="智慧门禁管理系统 - %s"
        title="智慧门禁管理系统"
        defaultTitle="智慧门禁管理系统"
        meta={[{ name: '智慧门禁管理系统' }]}
      />
      <Header className="lz-header"  style={{ margin: '-40px 0 0', height: '40px', lineHeight: '40px', paddingLeft: '16px', paddingRight: '24px',minWidth:'1200px' }}>
        <div style={{ float: 'left', color: '#EFEFEF',fontSize:'16px' }}>
        {/* <img src={Logo} style={{width:50,marginRight:4,verticalAlign:'sub'}}/> */}
        <span  style={{cursor:'pointer'}} onClick={this.goHome}>智慧门禁管理系统</span>
        </div>
        <Menu
          theme="dark" mode="horizontal" selectedKeys={aNode} onClick={this.handleClick}
          style={{ lineHeight: '40px', float: 'left', paddingLeft: offsetLeft }}
        >
          {
                        this.props.navItems.map((item) => {
                            // 检查权限
                          let itemColor = 'hsla(0, 0%, 100%, .67)';
                          let itemPriv = Utils.checkMenuPriv(item.to);
                          if (itemPriv === 2) {
                                // return null ;
                            itemColor = 'red';
                          } else if (itemPriv === 0) {
                            return null;
                          }

                          let iconType = 'file';
                          if (typeof (item.icon) !== 'undefined') {
                            iconType = item.icon;
                          }

                          return (<Menu.Item key={item.to}>
                            <span>
                              {/* <Icon type={iconType} />*/}
                              <span className={itemColor === 'red' ? 'errorHint' : 'nav-text'}>{item.name}</span>
                            </span>
                          </Menu.Item>);
                        })
                    }
        </Menu>
        <div style={{ float: 'right', color: '#EFEFEF' }}>
      
          {/*<Icon type="home" onClick={this.goHome} title="返回主页" style={{ padding: '0 8px 0 0', cursor: 'pointer', fontSize: '16px' }} />*/}
          <Dropdown overlay={menu}>
            {/*<Icon type="setting" style={{ cursor: 'pointer', fontSize: '16px' }} />*/}
            <div style={{width:130,cursor:'pointer',lineHeight:'38px',textOverflow:'ellipsis', whiteSpace:'nowrap',overflow:'hidden'}}>
              <Icon type="user" style={{ cursor: 'pointer', fontSize: '20px',color:'#08dbfb',verticalAlign:'sub' }}/>
              <span style={{fontSize:15,marginLeft:6}}>{parkUserName}</span>
            </div>
          </Dropdown>
        </div> 
        {/*<div style={{ float: 'right', color: '#EFEFEF',marginRight:20}}>*/}
          {/*<SelectPark style={{width:'100px'}} size='small' onSelect={this.onSelectPark} value={this.state.selectPark.uuid} ref={ref=>this.selectPark = ref} disabled={this.getUserType() ? true : false} />*/}
        {/*</div>*/}
       
      </Header>
      <Content style={{ width: '100%', height: '100%', padding: '0 0px' }}>
        {body}
      </Content>
    </div>);
  }
});

TopBar.propTypes = propTypes;
module.exports = TopBar;
