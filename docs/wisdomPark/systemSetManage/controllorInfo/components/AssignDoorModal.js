'use strict';

import React from 'react';
import {Button, Modal,Form} from 'antd';
let Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';


let Common = require('../../../../public/script/common');
let Utils = require('../../../../public/script/utils');
let FormDef = require('./ControllorInfoForm');

let ControllorInfoStore = require('../store/ControllorInfoStore.js');
let ControllorInfoActions = require('../action/ControllorInfoActions');

let AssignDoorModal = React.createClass({
getInitialState: function () {
    return {
      loading: false,
      modal: false,
      controller: {},
      doorlist:[],
      unAssignedDoors:[],
      ports:new Array(4),
      doors:[]
    };
  },

  mixins: [Reflux.listenTo(ControllorInfoStore, 'onServiceComplete'), ModalForm('controller')],
  onServiceComplete: function (data) {
    this.setState({loading:false});
    if(data.errMsg){
      this.setState({errMsg:data.errMsg});
      return;
    } 
     
    if (this.state.modal && data.operation === 'distributionDoor') {
          let controllerDoorList = data.assignDoorSet ? data.assignDoorSet : [];
          this.state.controller.controllerDoorList = Utils.deepCopyValue(controllerDoorList);
          this.setState({
            modal: false,
            controller:this.state.controller
          });
      }
      if(data.operation === 'getFreeDoorList'){
        let unAssignedDoors = [];
        data.doorSet.map(item =>{
          item.isDisabled = false;
          unAssignedDoors.push(item);
        });
        let doorlist = this.state.doorlist;
        let doors = unAssignedDoors.concat(doorlist);
        this.setState({
          unAssignedDoors,
          doors
        }, ()=>{
          FormDef.selectDoor1.showOptions();
          FormDef.selectDoor2.showOptions();
          FormDef.selectDoor3.showOptions();
          FormDef.selectDoor4.showOptions();
        });
        
      }
  },
  componentDidMount: function () {
    
  },
 
  beforeClose: function () {
    this.clear();
  },
  showModal: function () {
    this.state.loading = true;
    ControllorInfoActions.retrieveDoor(this.props.doorFilter);
    this.setState({
      modal: true
    });
  },
  initEditData:function (controllerInfo) {
    let editDoorObjArr =[],doorlist = [],controller={}, ports = new Array(4);
    if(controllerInfo){
      controller = Utils.deepCopyValue(controllerInfo);
        if(controllerInfo.controllerDoorList){
          editDoorObjArr = Utils.deepCopyValue(controllerInfo.controllerDoorList);
          editDoorObjArr.map((item) =>{//端口类型（0.P1 1.P2 2.P3 3.P4）
            item.isDisabled = true;
            doorlist.push(item);
            let portType = parseInt(item.portType);
            ports[portType] = item;
          } );
        }
        let doors = this.state.unAssignedDoors.concat(doorlist);
        this.setState({
          controller,
          doorlist,
          ports,
          doors
        });
        
    }else{
        this.clear();
    }
    this.setState({
      loading: false,
    });
    if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
      this.refs.mxgBox.clear();
    }
  },
  clear: function () {
    let ports = {
      port1: '',
      port2: '',
      port3: '',
      port4: '',
    }
    FormDef.initDoorListForm(ports);
    this.state.hints = {};
    this.setState({
      loading: false
    });
    if (!this.state.modal && typeof (this.refs.mxgBox) !== 'undefined') {
      this.refs.mxgBox.clear();
    }
  },
  onClickSave: function () {
      let controller = Utils.deepCopyValue(this.state.controller);
      let controllerDoorList = this.state.controller.controllerDoorList.filter(item => item.doorUuid != '' && item.doorUuid != null && item.doorUuid != undefined);
      this.state.controller.controllerDoorList = Utils.deepCopyValue(controllerDoorList);
      this.setState({
        controller,
        loading: true
      });
      ControllorInfoActions.assignDoor(this.state.controller);
  },
  onSelect:function(oldOptData, optData,portType,opts){
    let controller = Utils.deepCopyValue(this.state.controller);
    let controllerDoorList = Utils.deepCopyValue(controller.controllerDoorList);
    if(controllerDoorList &&controllerDoorList.length){
      let flag = false;
      for(let i=0; i< controllerDoorList.length; i++){
          if(portType === controllerDoorList[i].portType){
            controllerDoorList[i].doorUuid = optData.doorUuid;
            controllerDoorList[i].doorName = optData.doorName;
            flag = true;
            break;
          }
      }
      if(!flag){
        let item = {
          portType,
          doorUuid:optData.doorUuid,
          doorName:optData.doorName
        };
        controllerDoorList.push(item);
      }
     
    }else {
      controllerDoorList = [];
      let item = {
        portType,
        doorUuid:optData.doorUuid,
        doorName:optData.doorName
      };
      controllerDoorList.push(item);
    }
    this.state.controller = Utils.deepCopyValue(controller);
    this.state.controller.controllerDoorList = Utils.deepCopyValue(controllerDoorList);
    let ports = Utils.deepCopyValue(this.state.ports);
    ports[parseInt(portType)] = optData;
    let doors = Utils.deepCopyValue(opts);
    for(let i=0; i< doors.length; i++){
      if(oldOptData.doorUuid === doors[i].doorUuid){
        doors[i].isDisabled = false;
        break;
      }
    }
    for(let i=0; i< doors.length; i++){
      if(optData.doorUuid === doors[i].doorUuid){
        doors[i].isDisabled = true;
        break;
      }
    }
    this.setState({doors,ports, loading:false}, ()=>{
      FormDef.selectDoor1.setOpts(doors);
      FormDef.selectDoor2.setOpts(doors);
      FormDef.selectDoor3.setOpts(doors);
      FormDef.selectDoor4.setOpts(doors);
    });
  },
  render: function () {
        let doors = this.state.doors;
        let ports = this.state.ports;
        let data = {
          doors,
          ports
        };
        let items = FormDef.getDoorListForm(this,data, null, Common.modalForm);
        let title = '分配端口及受控门';
        return (
          <Modal
            visible={this.state.modal} width={Common.modalWidth} title={title} maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
            footer={[
              <div key="footerDiv" style={{ display: 'block', textAlign: 'right' }}>
                <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
                <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
              </div>
            ]}
          >
          <ServiceMsg ref="mxgBox" svcList={['']} />
      <Form layout='horizontal' >
          { items }
        </Form>
    </Modal>
    );
  }
});

module.exports = AssignDoorModal;
