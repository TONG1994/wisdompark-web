/**
 *   Create by Malson on 2018/4/25
 */
import React from 'react';
let Reflux = require('reflux');
import { Form, Modal, Button, Input, Select, Row, Col } from 'antd';
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
let Common = require('../../../../public/script/common');
let Utils = require('../../../../public/script/utils');

let SettledCompanyStore = require('../store/SettledCompanyStore.js');
let SettledCompanyActions = require('../action/SettledCompanyActions');

let FormDef = require('./SettledCompanyForm');

//person component
import TowerSelect from '../../../lib/components/TowerSelect';
import FloorSelect from '../../../lib/components/FloorSelect';
import UnitnumberSelect from '../../../lib/components/unitnumberSelect';
var Validator = require('../../../../public/script/common');

let SettledCompanyModal = React.createClass({
  getInitialState: function () {
    return {
      loading: false,
      modal: false,
      settledCompany: {
          park:Common.getLoginData().userInfo.parkName == '' ||Common.getLoginData().userInfo.parkName == null ?'O-Park园区':Common.getLoginData().userInfo.parkName,
          tower:'',
      },
      hints: {},
      validRules: [],
        building:'',
        floor:[],
        room:[]
    };
  },

  mixins: [Reflux.listenTo(SettledCompanyStore, 'onServiceComplete'), ModalForm('settledCompany')],
  onServiceComplete: function (data) {
      this.setState({loading:false});
      if(data.errMsg){
          this.setState({errMsg:data.errMsg});
          return;
      }
    if (this.state.modal && data.operation === 'create') {
          this.setState({
              modal: false,
          });
      }
      if (this.state.modal && data.operation === 'update') {
          this.setState({
              modal: false,
          });
      }
  },
  componentDidMount: function () {
    this.state.validRules = FormDef.getSettledCompanyFormRule(this);
  },
  beforeClose:function () {
    this.clear();
  },
  showModal:function () {
    this.setState({modal:true});
  },
  initEditData:function (settledCompanys) {
    this.state.hints = {};
    if(settledCompanys){
        Utils.copyValue(settledCompanys, this.state.settledCompany);
        //处理数据
        let settledCompany = Object.assign({},this.state.settledCompany);
       // console.log(settledCompany);
        settledCompany.tower = settledCompanys.buildingUuid;
        settledCompany.floor =settledCompanys.floorUuid;
        settledCompany.unitnumber = settledCompanys.cellUuid;
        this.setState({settledCompany},()=>{
            this.floorSelect.initDate();
            this.unitnumber.initDate()
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
    if(this.towerSelect){
        this.towerSelect.initDate();
    }
  },

  clear: function () {
    FormDef.initSettledCompanyForm(this.state.settledCompany);
    if(this.floorSelect){
        this.floorSelect.rest();
    }
      if(this.unitnumber){
          this.unitnumber.rest();
      }
    // FIXME 输入参数，对象初始化
    this.state.hints = {};
    this.setState({loading:false});
      if (!this.state.modal && typeof (this.refs.mxgBox) !== 'undefined') {
      this.refs.mxgBox.clear();
    }
  },

  onClickSave: function () {
          let settledCompany = Object.assign({},this.state.settledCompany);
          let floor,unitnumber;
          if(settledCompany.floor == undefined || settledCompany.floor.length==0){
              floor = undefined;
          }else{
              floor = [].slice.call(settledCompany.floor);
          }
          if(settledCompany.unitnumber == undefined || settledCompany.unitnumber.length==0){
              unitnumber = undefined;
          }else{
              unitnumber = [].slice.call(settledCompany.unitnumber);
          }
          settledCompany.floor = floor;
          settledCompany.unitnumber = unitnumber;
          this.setState({settledCompany});
          if(Common.formValidator(this, this.state.settledCompany)) {
              let sendData = Utils.deepCopyValue(this.state.settledCompany);
              this.setState({loading:true});
              sendData.floorUuid =sendData.floor.split(',');
              sendData.parkUuid = Common.getSelectedParkUuid();
              sendData.buildingUuid = sendData.tower;
              sendData.cellUuid = sendData.unitnumber.split(',');
              if(this.props.actionType ==='edit'){
                  SettledCompanyActions.updateSettledCompany(sendData);
              }else{
                  SettledCompanyActions.saveSettledCompany(sendData);
              }

      }
  },
    handleUnitnumber:function(val,e){
        let room = [];
        e.map(item=>{
            if(room.indexOf(item.props.children) == -1){
                room.push(item.props.children);
            }
        })
        let settledCompany = Object.assign({},this.state.settledCompany);
        settledCompany.unitnumber = val;
        Validator.validator(this, {'unitnumber':val}, 'unitnumber');
        this.setState({settledCompany,room});
    },
    handleFloor:function(val,e){
        let floor = [];
        e.map(item=>{
            if(floor.indexOf(item.props.children) == -1){
                floor.push(item.props.children);
            }
        })
        let settledCompany = Object.assign({},this.state.settledCompany);
        settledCompany.floor = val;
        settledCompany.unitnumber = [];
        Validator.validator(this, {'floor':val}, 'floor');
        this.setState({settledCompany,floor},()=>{this.unitnumber.initDate()});

    },
    handleTower:function(val,e){
        let building = e.props.children;
        let settledCompany = Object.assign({},this.state.settledCompany);
        settledCompany.tower = val;
        settledCompany.floor = [];
        settledCompany.unitnumber = [];
        this.unitnumber.rest();
        Validator.validator(this, {'tower':val}, 'tower');
        this.setState({settledCompany,building},()=>{
            this.floorSelect.initDate();
        });
    },
  render: function () {
      let  attrList = [
          {
              name:'tower',
              id:'tower',
              object:<TowerSelect
                  name="tower"
                  id="tower"
                  value={this.state.settledCompany['tower']}
                  ref = {ref=>this.towerSelect = ref}
                  onChange={this.handleTower}
              />

          },
          {
              name:'floor',
              id:'floor',
              object:<FloorSelect
                  name="floor"
                  id="floor"
                  value={this.state.settledCompany['floor']}
                  onChange={this.handleFloor}
                  placeholder="请选择楼层(可多选)"
                  ref = {ref=>this.floorSelect = ref}
                  tower={this.state.settledCompany.tower}
              />

          },
          {
              name:'unitnumber',
              id:'unitnumber',
              object:<UnitnumberSelect
                  name="unitnumber"
                  id="unitnumber"
                  value={this.state.settledCompany['unitnumber']}
                  onChange={this.handleUnitnumber}
                  placeholder="请选择单元号(可多选)"
                  ref = {ref=>this.unitnumber = ref}
                  floor={this.state.settledCompany.floor}
                 />
          }
      ];
    let items = FormDef.getSettledCompanyForm(this, this.state.settledCompany, attrList,Common.modalForm);
    let title = this.props.actionType === 'add'?'添加企业': this.props.actionType ==='edit'?'编辑企业':'模态框';
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

export default SettledCompanyModal;
