/**
 *   Create by Malson on 2018/7/24
 */

import React from 'react';
import { Card ,Col, Row,Button,Icon} from 'antd';
import TopBar from '../../lib/Components/TopBar';
import {withRouter} from 'react-router';
import wisdomParkMenu from './menus';
let Utils = require('../../public/script/utils');
let Common = require('../../public/script/common');
//person

let cardData = [
  {
    title:'受控门管理',
    content:'园区楼宇、楼层、，门禁信息管理与维护',
    path:'/wisdomPark/controlledDoorManage/ControlledDoorPage/'
  },
  {
    title:'企业管理',
    content:'园区入驻企业信息管理与维护',
    path:'/wisdomPark/companyManage/settledCompanyPage/'
  },
  {
    title:'人员管理',
    content:'园区门禁系统账号管理与维护',
    path:'/wisdomPark/personnelManage/personnelPage/'
  },
  {
    title:'门禁日志管理',
    content:'门禁使用日志查询和导出',
    path:'/wisdomPark/doorLog/doorLogPage/'
  },
  {
    title:'资讯信息管理',
    content:'园区各类新闻信息管理与维护',
    path:'/wisdomPark/newsManage/newsManagePage/'
  },
  {
    title:'园区管理',
    content:'园区基本信息维护及系统管理员账号分配',
    path:'/wisdomPark/parkManage/ParkManagePage/'
  },
];

let DeskPage = React.createClass({
  getInitialState: function () {
    return {
      cardData:[],
      parkList:[],
      loading:false,
      showType:'parkList',
      navItems: []
    };
  },
  componentWillMount(){
    //获取省市县数据缓存  供项目内使用
    let url = this.getServiceUrl('provinceCityRegion/getAllProvinceCityRegion');
    let $this = this;
    if(!window.sessionStorage.address){
      Utils.doAjaxService(url).then((result)=>{
        if(!result.errDesc){
          window.sessionStorage.address = JSON.stringify(result.object);
          this.getParkList(result.object);
        }
      })
    }else{
      this.getParkList()
    }
    //过滤显示菜单
    let menus = Common.getMenuList() || [];
    cardData = cardData.filter(item=>{
      let f = false;
      menus.map(jtem=>{
        if(item.path===jtem.path){
          f = true;
        }
      });
      return f;
    });
    this.setState({cardData});
  },
  getParkList(addressList){
    //获取园区信息LIST
    let userInfo = Common.getUserInfo(),
        $this = this;
    if(userInfo.parkUuid){//园区管理员
      this.parkListClick()
    }else{  //系统管理员
      let parkListUrl = this.getServiceUrl('park/retrieve');
      $this.setState({loading:true});
      Utils.doAjaxService(parkListUrl,{object:{}}).then((result)=>{
        let sessionStorageAddress;
        try {
          sessionStorageAddress = JSON.parse(window.sessionStorage.address) || [];
        }catch (err){}
        let address = addressList || sessionStorageAddress;
        let parkList = result.object.list || [];
        parkList = parkList.map(item=>{
          let s = address.filter(jtem=>jtem.value===item.parkLocation.split(',')[0])[0];
          let shi = s.children.filter(ktem=>ktem.value===item.parkLocation.split(',')[1])[0];
          let x = shi.children.filter(ltem=>ltem.value===item.parkLocation.split(',')[2])[0];
          item.addressCH = s.label + shi.label + x.label;
          return item;
        });
        $this.setState({parkList});
      },(result)=>{
        $this.setState({parkList:[]});
        $this.setState({loading:false});
      })
    }
  },
  componentDidMount: function () {
    //缓存一个corpUuid  固定 临时使用
    window.sessionStorage.corpUuid = "127V0A3L79AVP001";
    window.selectedParkUuid = "127V0A3L79AVP001";
    window.sessionStorage.setItem('selectedParkUuid', "127V0A3L79AVP001");
  },
  getServiceUrl: function (action) {
    let actionUrl;
    if(Utils.wisdomparkUrl){
      actionUrl = Utils.wisdomparkUrl
    }else{
      try {
        actionUrl = JSON.parse(window.sessionStorage.utilConf).wisdomparkUrl
      }catch (err){}
    }
    return actionUrl + action;
  },
  cardClick:function (path) {
    if(path){
      this.props.router.push({
        pathname: path,
        state: {from: '/wisdomPark/desk/'}
      });
    }else {
      Modal.error({
        title: '数据路径缺失，请刷新再试！',
      });
    }
  },
  parkListClick(item){
    let navItems = wisdomParkMenu.menus().moduleMenus;
    this.setState({showType:'park',navItems});
    //动态设置 corpUuid
    // window.sessionStorage.corpUuid = item.uuid;
    // 受控二维码下载  远程开门   控制器管理等模块初始化园区列表树需用到 缓存的 selectedParkUuid
    // let  selectedParkUuid = item?item.uuid:Common.getUserInfo().parkUuid;
    // window.selectedParkUuid = selectedParkUuid;
    // window.sessionStorage.setItem('selectedParkUuid', selectedParkUuid);
  },
  rollbackParkList(){
    this.setState({showType:'parkList',navItems:[]});
  },
  render: function () {
    let { cardData,showType,parkList} = this.state;
    let parkUuid = Common.getUserInfo().parkUuid;
    return (
        <TopBar navItems={this.state.navItems}>
          <div style={{width:'80%',margin:'0 auto',overflowY:'auto',paddingTop:40,minWidth:960}}>
            {
              showType === 'park' && !parkUuid?<Button  onClick={this.rollbackParkList} style={{marginLeft:10,marginBottom:10}} title='返回'><Icon type="rollback"/>返回</Button>:''
            }
            <Row>
            {
              showType === 'parkList'?
                  parkList.map((item,i)=>{
                    return (
                        <Col span={6} style={{padding:'0 10px',marginBottom:20}} key={i}>
                          <Card hoverable title={item.parkName}  style={{height:200}} onClick={this.parkListClick.bind(this,item)}>
                            <p>地址：{item.addressCH+item.parkAddress}</p>
                          </Card>
                        </Col>
                    )
                 }):""
            }
            {
              showType === 'park'?
                  cardData.map((item,i)=>{
                    return (
                        <Col span={6} style={{padding:'0 10px',marginBottom:20}} key={i}>
                          <Card title={item.title}  hoverable  style={{height:200}} onClick={this.cardClick.bind(this,item.path)}>
                            <p>{item.content}</p>
                          </Card>
                        </Col>
                    )
                  })
                  :""
            }
            </Row>
          </div>
        </TopBar>
    );
  }
});

module.exports = withRouter(DeskPage);
