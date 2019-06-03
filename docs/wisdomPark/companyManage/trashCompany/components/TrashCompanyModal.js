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

let TrashCompanyStore = require('../store/TrashCompanyStore');

let FormDef = require('./TrashCompanyForm');

//person component
import TowerSelect from '../../../lib/components/TowerSelect';
import FloorSelect from '../../../lib/components/FloorSelect';
import UnitnumberSelect from '../../../lib/components/unitnumberSelect';
var Validator = require('../../../../public/script/common');

let TrashCompanyModal = React.createClass({
  getInitialState: function () {
    return {
      loading: false,
      modal: false,
      trashCompany: {
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

  mixins: [Reflux.listenTo(TrashCompanyStore, 'onServiceComplete'), ModalForm('trashCompany')],
  onServiceComplete: function (data) {
      this.setState({loading:false});
      if(data.errMsg){
          this.setState({errMsg:data.errMsg});
          return;
      }
  },
  componentDidMount: function () {
    this.state.validRules = FormDef.getTrashCompanyFormRule(this);
  },
  beforeClose:function () {
    this.clear();
  },
  showModal:function () {
    this.setState({modal:true});
  },
  initEditData:function (trashCompanys) {
    this.state.hints = {};
    if(trashCompanys){
        Utils.copyValue(trashCompanys, this.state.trashCompany);
        //处理数据
        let trashCompany = Object.assign({},this.state.trashCompany);
       trashCompany.tower = trashCompanys.buildingUuid;
       trashCompany.floor =trashCompanys.floorUuid;
       trashCompany.unitnumber = trashCompanys.cellUuid;
        this.setState({trashCompany},()=>{
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
    FormDef.initTrashCompanyForm(this.state.trashCompany);
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

    handleUnitnumber:function(val,e){
        let room = [];
        e.map(item=>{
            if(room.indexOf(item.props.children) == -1){
                room.push(item.props.children);
            }
        })
        let trashCompany = Object.assign({},this.state.trashCompany);
        trashCompany.unitnumber = val;
        Validator.validator(this, {'unitnumber':val}, 'unitnumber');
        this.setState({trashCompany,room});
    },
    handleFloor:function(val,e){
        let floor = [];
        e.map(item=>{
            if(floor.indexOf(item.props.children) == -1){
                floor.push(item.props.children);
            }
        })
        let trashCompany = Object.assign({},this.state.trashCompany);
        trashCompany.floor = val;
        trashCompany.unitnumber = [];
        Validator.validator(this, {'floor':val}, 'floor');
        this.setState({trashCompany,floor},()=>{this.unitnumber.initDate()});

    },
    handleTower:function(val,e){
        let building = e.props.children;
        let trashCompany = Object.assign({},this.state.trashCompany);
        trashCompany.tower = val;
        trashCompany.floor = [];
        trashCompany.unitnumber = [];
        this.unitnumber.rest();
        Validator.validator(this, {'tower':val}, 'tower');
        this.setState({trashCompany,building},()=>{
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
                  value={this.state.trashCompany['tower']}
                  ref = {ref=>this.towerSelect = ref}
                  onChange={this.handleTower}
                  disabled
              />

          },
          {
              name:'floor',
              id:'floor',
              object:<FloorSelect
                  name="floor"
                  id="floor"
                  value={this.state.trashCompany['floor']}
                  onChange={this.handleFloor}
                  placeholder="请选择楼层(可多选)"
                  ref = {ref=>this.floorSelect = ref}
                  tower={this.state.trashCompany.tower}
                  disabled
              />

          },
          {
              name:'unitnumber',
              id:'unitnumber',
              object:<UnitnumberSelect
                  name="unitnumber"
                  id="unitnumber"
                  value={this.state.trashCompany['unitnumber']}
                  onChange={this.handleUnitnumber}
                  placeholder="请选择单元号(可多选)"
                  ref = {ref=>this.unitnumber = ref}
                  floor={this.state.trashCompany.floor}
                  disabled
                 />
          }
      ];
    let items = FormDef.getTrashCompanyForm(this, this.state.trashCompany, attrList,Common.modalForm);
    let title = this.props.actionType ==='select'?'企业信息':'模态框';
    return (
      <Modal
        visible={this.state.modal} width={Common.modalWidth} title={title} maskClosable={false} onCancel={this.toggle}
        footer={null}
      >
        <Form layout='horizontal' >
          { items }
        </Form>
      </Modal>
    );
  }
});

export default TrashCompanyModal;
