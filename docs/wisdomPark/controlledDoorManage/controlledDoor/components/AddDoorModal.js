/**
 *   Create by Malson on 2018/7/25
 */

import ControlledDoorActions from '../action/ControlledDoorActions';
import ControlledDoorStore from '../store/ControlledDoorStore';


import React from 'react';
let Reflux = require('reflux');
import { Form, Modal, Button, Input, Select, Row, Col } from 'antd';
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
let Common = require('../../../../public/script/common');
let Utils = require('../../../../public/script/utils');


let FormDef = require('./ControlledDoorForm');

let ControlledDoorModal = React.createClass({
  getInitialState: function () {
    return {
      loading: false,
      modal: false,
      controlledDoor: {},
      hints: {},
      validRules: []
    };
  },
  
  mixins: [ModalForm('controlledDoor'),Reflux.listenTo(ControlledDoorStore, 'onServiceComplete')],
  onServiceComplete(){
    this.setState({loading:false});
  },
  componentDidMount: function () {
    this.state.validRules = FormDef.getControlledDoorFormRule(this);
    this.clear();
  },
  beforeClose:function () {
    this.clear();
  },
  showModal:function (obj) {
    this.setState({modal:true});
    if(obj){
      this.initEditData(obj)
    }
  },
  initEditData:function (controlledDoor) {
    this.state.hints = {};
    Utils.copyValue(controlledDoor, this.state.controlledDoor);
    this.setState({
      loading: false,
    });
    if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
      this.refs.mxgBox.clear();
    }
  },
  
  clear: function () {
    FormDef.initControlledDoorForm(this.state.controlledDoor);
    // FIXME 输入参数，对象初始化
    this.state.hints = {};
    this.setState({loading:false});
  },
  getAttributionCategory(){
    //计算归属类别  归属类别（0.园区，1.楼宇，2.楼层，3.单元，4.房间）
    let { curType,typeDesc} = this.props;
    let index = typeDesc.indexOf(curType);
    return index;
  },
  getNeedUuid(){
    //这个 UUID 是动态生成的需要此类型前面所有父级的uuid 比如新增楼层  需要buildingUuid 和 parkUuid
    let obj = {};
    let { curType,typeDesc ,uuidArr} = this.props;
    let index = typeDesc.indexOf(curType);
    for(let i=0;i<=index;i++){
      obj[typeDesc[i]+"Uuid"] = uuidArr[i]
    }
    return obj;
  },
  onClickSave: function () {
    if (Common.formValidator(this, this.state.controlledDoor)) {
      let { actionType} = this.props;
      if(actionType==='addDoor'){
        let needObj = this.getNeedUuid();
        let attributionCategory = this.getAttributionCategory();
        let { doorName, property } = this.state.controlledDoor;
        let sendObj ={
          doorName,
          property,
          attributionCategory,
          ...needObj
        };
        this.setState({ loading: true });
        ControlledDoorActions.create({
          type:'door',
          data:sendObj
        })
      }else if(actionType==='editDoor'){
        this.setState({ loading: true });
        ControlledDoorActions.update({
          type:'door',
          data:this.state.controlledDoor
        })
      }
      
    }
  },
  
  render: function () {
    let items = FormDef.getControlledDoorForm(this, this.state.controlledDoor, null,Common.modalForm);
    let title = this.props.actionType === 'addDoor'?'添加受控门': this.props.actionType ==='editDoor'?'修改受控门':'操作';
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
          <Form layout='horizontal' >
            { items }
          </Form>
        </Modal>
    );
  }
});

export default ControlledDoorModal;
