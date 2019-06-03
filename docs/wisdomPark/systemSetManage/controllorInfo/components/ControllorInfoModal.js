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

let ControllorInfoModal = React.createClass({
getInitialState: function () {
    return {
      loading: false,
      modal: false,
      controller: {
        password: '',
      },
      hints: {},
      validRules: [],
      selNode:{}
    };
  },

  mixins: [Reflux.listenTo(ControllorInfoStore, 'onServiceComplete'), ModalForm('controller')],
  onServiceComplete: function (data) {
    this.setState({loading:false});
      if(data.errMsg){
          this.setState({errMsg:data.errMsg});
          return;
      }
    if (this.state.modal && data.operation === 'create') {
       this.beforeClose();
          this.setState({
              modal: false,
          });
      }
      if (this.state.modal && data.operation === 'update') {
          this.setState({
              modal: false,
          });
          this.beforeClose();
      }
  },
  componentDidMount: function () {
    this.state.validRules = FormDef.getControllorInfoFormRule(this);
  },
  beforeClose: function () {
    this.clear();
  },
  showModal: function () {
    this.setState({
      modal: true
    });
  },
  initEditData:function (controllerInfo)
   {
    this.state.hints = {};
    if(controllerInfo){
        Utils.copyValue(controllerInfo, this.state.controller);
        let controller = Object.assign({},this.state.controller);
        let IP=[];
        IP=controller.controllerIp.split(".");
        for(var i=1;i<IP.length+1;i++){
          var controllorIPX="controllorIP"+i;
          controller[controllorIPX]=IP[i-1];
        }
        this.setState({controller});
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
  initOPark(selNode){
    this.setState({selNode});
  },
  addInitEditData:function(controllerInfo){
    controllerInfo={
      controllerName : '',
      controllorIP1:'',
      controllorIP2:'',
      controllorIP3:'',
      controllorIP4:'',
    }
     this.state.controller=controllerInfo;
  },
  clear: function () {
    FormDef.initControllorInfoForm(this.state.controller);
    this.state.hints = {};
    this.setState({
      loading: false
    });
    if (!this.state.modal && typeof (this.refs.mxgBox) !== 'undefined') {
      this.refs.mxgBox.clear();
    }
  },
  onClickSave: function () {
    let controller = Object.assign({}, this.state.controller);
    this.setState({
      controller
    });
    if (Common.formValidator(this, this.state.controller)) {
      let sendData = Utils.deepCopyValue(this.state.controller);
      this.setState({
        loading: true
      });
      if (this.props.actionType === 'edit') {
        sendData.controllerIp=sendData.controllorIP1+'.'+sendData.controllorIP2+'.'+sendData.controllorIP3+'.'+sendData.controllorIP4;
        ControllorInfoActions.updateController(sendData);
      } else {
        sendData.attributionCategory=this.state.selNode.level;
          sendData.parkUuid=this.props.parkUuid;
         if(this.state.selNode.type==='BUILDING'){
          sendData.buildingUuid=this.state.selNode.itemUuid;
        }if(this.state.selNode.type==='FLOOR'){
          sendData.buildingUuid=this.state.selNode.parentId;
          sendData.floorUuid=this.state.selNode.itemUuid;
        }
        sendData.controllerIp=sendData.controllorIP1+'.'+sendData.controllorIP2+'.'+sendData.controllorIP3+'.'+sendData.controllorIP4;
        ControllorInfoActions.saveController(sendData);
      }
    }
  },
  render: function () {
        let items = FormDef.getControllorInfoForm(this, this.state.controller, null, Common.modalForm);
        let title = this.props.actionType === 'add'?'添加控制器': this.props.actionType ==='edit'?'编辑控制器':'模态框';
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
          <ServiceMsg ref="mxgBox" svcList={['controller/create','controller/update']} />
          <Form layout='horizontal' >
              { items }
            </Form>
    </Modal>
    );
  }
});

module.exports = ControllorInfoModal;
