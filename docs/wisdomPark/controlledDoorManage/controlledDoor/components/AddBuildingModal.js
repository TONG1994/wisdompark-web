/**
 *   Create by Malson on 2018/7/25
 */
import React from 'react';
let Reflux = require('reflux');
import { Form, Modal, Button, Input, Select, Row, Col } from 'antd';
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';

import ControlledDoorActions from '../action/ControlledDoorActions';
import ControlledDoorStore from '../store/ControlledDoorStore';

let Common = require('../../../../public/script/common');
let Utils = require('../../../../public/script/utils');



let FormDef = require('./ControlledDoorForm');

let AddBuildingModal = React.createClass({
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
  },
  beforeClose:function () {
    this.clear();
  },
  afterChange:function (id) {
    if(id==='buildingAddress'){
      let data = this.state.controlledDoor;
      data.lng = '';
      data.longitude='';
      data.latitude='';
      this.forceUpdate();
    }
  },
  showModal:function (obj) {
    this.state.validRules = FormDef.getBuildingFormRule(this,[],this.props.curType);
    this.setState({modal:true});
    this.clear();
    if(obj){
      this.initEditData(obj)
    }
  },
  initEditData:function (controlledDoor) {
    if(controlledDoor.type==='building'){
      controlledDoor.lng = controlledDoor.longitude + ',' + controlledDoor.latitude;
    }
    Utils.copyValue(controlledDoor, this.state.controlledDoor);
    this.setState({
      loading: false,
    });
  },
  //获取经纬度后
  handlemapok:function (location) {
    let controlledDoor = Object.assign({},this.state.controlledDoor,{longitude:location[0],latitude:location[1],lng:location.toString()});
    this.setState({controlledDoor});
    Common.validator(this,controlledDoor,'lng');
  },
  clear: function () {
    FormDef.initBuildingForm(this.state.controlledDoor);
    // FIXME 输入参数，对象初始化
    this.state.hints = {};
    this.setState({loading:false});
    //去除地理位置报错选择
    this.AMapComponent && this.AMapComponent.cancleError();
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
      let { childType,actionType} = this.props;
      if(actionType==='addBuilding'){
        let needObj = this.getNeedUuid();
        let sendObj ={};
        switch (childType){
          case 'building':
            let {buildingName,buildingAddress,authRadius,longitude,latitude} = this.state.controlledDoor;
            sendObj = {
              buildingName,
              buildingAddress,
              authRadius,
              longitude,
              latitude,
              ...needObj
            };
            break;
          case 'floor':
            let { floorName } = this.state.controlledDoor;
            sendObj = {
              floorName,
              ...needObj
            };
            break;
          case 'cell':
            let { cellName } = this.state.controlledDoor;
            sendObj = {
              cellName,
              ...needObj
            };
            break;
          case 'room':
            let { roomName } = this.state.controlledDoor;
            sendObj = {
              roomName,
              ...needObj
            };
            break;
          default:
            break
        }
        this.setState({ loading: true });
        ControlledDoorActions.create({
          type:childType,
          data:sendObj
        })
      }else if(actionType==='editBuilding'){
        this.setState({ loading: true });
        ControlledDoorActions.update({
          type:childType,
          data:this.state.controlledDoor
        })
      }
    }
  },
  getCurZHName(){
    let childType = this.props.childType;
    let ZHName = '';
    switch (childType){
      case 'building':
        ZHName = '楼宇';
        break;
      case 'floor':
        ZHName = '楼层';
        break;
      case 'cell':
        ZHName = '单元';
        break;
      case 'room':
        ZHName = '房间';
        break;
      default:
        break;
    }
    return ZHName;
  },
  render: function () {
    let ZHName = this.getCurZHName();
    let items = FormDef.getBuildingForm(this, this.state.controlledDoor, null,Common.modalForm,null,this.props.curType);
    let title = this.props.actionType === 'addBuilding'?'添加'+ZHName: this.props.actionType ==='editBuilding'?'修改'+ZHName:'操作';
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

export default AddBuildingModal;
