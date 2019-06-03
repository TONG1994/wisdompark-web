/**
 *   Create by Malson on 2018/4/19
 */
'use strict';

import React from 'react';
import {Button, Card, Icon, Modal, Divider, Breadcrumb,message,Spin } from 'antd';

import AddDoorModal from './components/AddDoorModal';
import CodeModal from './components/CodeModal';
import AddBuildingModal from './components/AddBuildingModal';

import ControlledDoorActions from './action/ControlledDoorActions';
import ControlledDoorStore from  './store/ControlledDoorStore';

let Reflux  = require('reflux');
let Common = require('../../../public/script/common');
let Utils = require('../../../public/script/utils');
//获取缓存
function getCorpUuid() {
  return window.sessionStorage.corpUuid || '';
}
let ControlledDoorPage = React.createClass({
  getInitialState: function () {
    return {
      controlledDoorSet: {
        recordSet: {},
        errMsg: ''
      },
      loading: false,
      actionType:'',
      uuidArr: [getCorpUuid()],
      breadArr: [],
      curType:'park',
      typeDesc:['park','building','floor','cell','room'],//不能变动！
      childType:'building'
    }
  },
  mixins: [Reflux.listenTo(ControlledDoorStore, 'onServiceComplete')],
  onServiceComplete: function (data) {
    this.setState({loading:false});
    if (data.errMsg) {
      this.setState({errMsg:data.errMsg});
      return;
    }
    let actionType = this.state.actionType;
    switch (data.operation){
      case 'retrieve':
        this.setState({controlledDoorSet:data});
        break;
      case 'delete':
        this.doService();
        break;
      case 'create':
        if(actionType==='addBuilding'){//展示弹框 modal
          this.addBuildingModal.toggle();
        }else if(actionType==='addDoor'){
          this.addDoorModal.toggle();
        }
        this.doService();
        break;
      case 'update':
        if(actionType==='editBuilding'){//展示弹框 modal
          this.addBuildingModal.toggle();
        }else if(actionType==='editDoor'){
          this.addDoorModal.toggle();
        }
        this.doService();
        break;
      default:
        break
    }
  },
  componentDidMount: function () {
    let uuid = getCorpUuid();
    this.doService('park',uuid);
  },
  doService:function (type,uuid) {
    this.setState({loading:true});
    if(!type){
      type = this.state.curType;
      uuid = this.state.uuidArr[this.state.uuidArr.length-1];
    }
    ControlledDoorActions.retrieve({type,uuid});
  },
  //判断并显示当前类型  type:1||-1 判断前进还是后退
  judgeNext:function (record,type) {
    let {curType,typeDesc,breadArr,uuidArr} = this.state;
    let index = typeDesc.indexOf(curType);
    let nextType,childType;
    if(record.type==='door'){
      //已经是最后一个
      message.destroy();
      message.warning('没有下级！');
      return;
    }
    if(type){//前进
      if(index!==typeDesc.length-1){
        //清空当前数据
        // showUuid = [];
        nextType = typeDesc[index+1];
        childType = typeDesc[index+2];
        //处理页面UI
        uuidArr.push(record.uuid);
        breadArr.push(record.title);
        this.setState({loading:true,childType,curType:nextType,breadArr,uuidArr,controlledDoorSet:{recordSet:{}}});
        //发前进请求
        this.doService(record.type,record.uuid);
      }else{
        //已经是最后一个
        message.destroy();
        message.warning('没有下级！');
      }
    }else{//上级
      if(index!==0){
        //清空当前数据
        // showUuid = [];
        nextType = typeDesc[index-1];
        childType = typeDesc[index];
        let curUuid = uuidArr[uuidArr.length-2];
        breadArr.pop();
        uuidArr.pop();
        this.setState({loading:true,childType,curType:nextType,breadArr,uuidArr,controlledDoorSet:{recordSet:{}}});

        //发后退请求
        this.doService(nextType,curUuid);
      }
    }
  },
  cardDblClick: function (record) {
    this.judgeNext(record,true);
  },
  rollback:function () {
    this.judgeNext('',false);
  },
  //查看二维码
  checkCode:function (item) {
    let breadcrumb = this.state.breadArr;
    this.codeModal.showModal({
      name:item.title,
      doorNo:item.doorNo,
      breadcrumb
    });
  },
  //获取card模板
  getCradItems:function (data) {
    let type = data.type;
    if(!type) return '';
    let cardRoom = '',cardDoor = '';
    let getHtml =  (Arr)=> {
      if(Arr && Arr.length){
        cardRoom = Arr.map(item=>this.getCardHtml(item));
      }
      cardDoor = data.doorList.length?data.doorList.map(item=>this.getCardHtml(item)):'';
    };
    switch (type){
      case 'park':
        getHtml(data.buildingList);
        break;
      case 'building':
        getHtml(data.floorList);
        break;
      case 'floor':
        getHtml(data.cellList);
        break;
      case 'cell':
        getHtml(data.roomList);
        break;
      case 'room':
        getHtml();
        break;
      default:
        break
    }
    let html = [...cardRoom,...cardDoor];
    if(!html.length){
      html = <div style={{marginTop:40,textAlign:'center',color:'#999'}}>暂无数据</div>
    }
    return html;
  },
  getCardHtml:function (item) {
    //根据type来区分模板呢内容
    let type = item.type;
    let content='';
    switch (type){
      case 'building':
        item.title = item.buildingName;
        let longitude = Utils.ChangeToDFM(item.longitude)+ 'E';
        let latitude = Utils.ChangeToDFM(item.latitude)+ 'N';
        content = (
              <div>
                <p>楼宇定位：<Icon type="environment-o" style={{color:'#575eff',marginRight:2}}/>{longitude+','+latitude}</p>
                <p>门禁范围：{item.authRadius}米</p>
              </div>
            );
        break;
      case 'floor':
        item.title = item.floorName;
        content =(
            <div>
              <p>受控门数：{item.doorNum}</p>
            </div>
        );
        break;
      case 'cell':
        item.title = item.cellName;
        content =(
            <div>
              <p>受控门数：{item.doorNum}</p>
            </div>
        );
        break;
      case 'room':
        item.title = item.roomName;
        content =(
            <div>
              <p>受控门数：{item.doorNum}</p>
            </div>
        );
        break;
      case 'door':
        item.title = item.doorName;
        content =(
            <div>
              <p>属性：{item.property==0?'公共门':'私有门'}</p>
              {/*<p>二维码：<a onClick={this.checkCode.bind(this,item)}>点击查看</a></p>*/}
            </div>
        );
        break;
      default:
        break;
    }
    return (
        <Card
            key={item.uuid}
            title={item.title}
            className='card-p'
            hoverable
            style={{height: 190, width: 300, float: 'left', margin: '0 16px 15px 0'}}
            extra={
              <span>
                <a href="#" onClick={this.editCard.bind(this,item)}>修改</a>
                <Divider type="vertical" style={{backgroundColor:'#666'}} />
                <a href="#" onClick={this.deleteCard.bind(this,item)}>删除</a>
                {
                  item.type!=='door'?<span><Divider type="vertical" style={{backgroundColor:'#666'}} /><a href="#" onClick={this.cardDblClick.bind(this, item)}>查看</a></span>:''
                }
              </span>
            }
        >
          { content }
        </Card>
    )
  },
  editCard:function (item) {
    //判断是楼宇还是大门  弹出不同的框
    if(item.type!=='door'){//楼宇
      this.setState({actionType:'editBuilding'});
      this.addBuildingModal.showModal(item)
    }else{//大门
      this.setState({actionType:'editDoor'});
      this.addDoorModal.showModal(item);
    }
  },
  deleteCard:function (item) {
    let $this = this;
    let type = item.type;
    Modal.confirm({
      title: '删除确认',
      content: '是否确定删除 【'+item.title+'】？',
      okText: '确定',
      cancelText: '取消',
      onOk: function () {
        $this.setState({ loading: true });
        ControlledDoorActions.delete({
          type,
          uuid:item.uuid
        });
      }
    });
  },
  addDoor:function () {
    this.setState({actionType:'addDoor'});
    this.addDoorModal.showModal();
  },
  //面包屑跳转
  breadChange(index=0){
    let { typeDesc, breadArr, uuidArr } = this.state;
    let curType = typeDesc[index],
        childType = typeDesc[index+1];
    breadArr = breadArr.slice(0,index);
    uuidArr = uuidArr.slice(0,index+1);
    let curUuid = uuidArr[uuidArr.length-1];
    //重置状态
    this.setState({loading:true,childType,curType,breadArr,uuidArr,controlledDoorSet:{recordSet:{}}});
    
    //发后退请求
    this.doService(curType,curUuid);
  },
  //获取面包屑
  getBreadcrumb:function () {
    let breadArr = this.state.breadArr;
    return (
            <Breadcrumb separator='>'>
              {/*暂时写死*/}
              <Breadcrumb.Item>无锡</Breadcrumb.Item>
              <Breadcrumb.Item>惠山区</Breadcrumb.Item>
              <Breadcrumb.Item onClick={()=>this.breadChange(0)}><a>O-Park</a></Breadcrumb.Item>
              {
                breadArr.length?
                    breadArr.map((item,i)=>{
                      return (
                          <Breadcrumb.Item key={i} onClick={()=>this.breadChange(i+1)}><a>{item}</a></Breadcrumb.Item>
                      )
                    }):''
              }
            </Breadcrumb>
        )
  },
  //回到主页
  reset:function () {
    let type = this.state.curType;
    let uuidArr = this.state.uuidArr;
    this.doService(type,uuidArr[uuidArr.length-1])
  },
  addBuilding:function () {
    this.setState({actionType:'addBuilding'});
    this.addBuildingModal.showModal();
  },
  //获取当前新增的名称
  getAddBtnName:function () {
    let {curType} = this.state;
    let name = '';
    switch (curType){
      case 'park':name = '楼宇';break;
      case 'building':name = '楼层';break;
      case 'floor':name = '单元';break;
      case 'cell':name = '房间';break;
      case 'room':name = '';break;
      default:break;
    }
    name = name?'添加'+name:'';
    return name;
  },
  render: function () {
    // let data = showUuid;
    let {breadArr,curType,controlledDoorSet,actionType,childType,uuidArr,typeDesc} = this.state;
    let data = controlledDoorSet.recordSet;
    let items =  this.getCradItems(data);
    let getBreadcrumb = this.getBreadcrumb();
    let addDoorModalProps = {
      actionType,
      curType,
      childType,
      uuidArr,
      typeDesc
    };
    let addBuildingModalProps = {
      actionType,
      curType,
      childType,
      uuidArr,
      typeDesc
    };
    let addBtnName = this.getAddBtnName();
    return (
        <div className="grid-page content-wrap">
          <div style={{paddingLeft: 20}}>
            <div style={{display: 'inline-block',marginRight:10}}>
              { getBreadcrumb }
            </div>
            {
              addBtnName?<Button className='btn-margin' icon={Common.iconAdd} type='primary' onClick={this.addBuilding} title={addBtnName}>{addBtnName}</Button>:''
            }
            <Button className='btn-margin' icon={Common.iconAdd} onClick={this.addDoor} title='添加受控门'>添加受控门</Button>
            <Button className='btn-margin' onClick={this.reset} title='重置'><Icon type={Common.iconReset}/></Button>
            {
              breadArr.length?
                  <Button className='btn-margin' onClick={this.rollback} title='返回上级'><Icon type="rollback"/></Button>
                  :''
            }
            <Spin spinning={this.state.loading}>
              <div style={{marginTop: 20}}>
                { items }
              </div>
            </Spin>
          </div>
          <AddDoorModal ref={ref=>this.addDoorModal=ref} {...addDoorModalProps} />
          <AddBuildingModal ref={ref=>this.addBuildingModal=ref} {...addBuildingModalProps} />
          <CodeModal ref={ref=>this.codeModal=ref}/>
        </div>
    );
  }
});

module.exports = ControlledDoorPage;