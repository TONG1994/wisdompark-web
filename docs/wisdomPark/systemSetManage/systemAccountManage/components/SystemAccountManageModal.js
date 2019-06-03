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

let SystemAccountManageStore = require('../store/SystemAccountManageStore');
let SystemAccountManageAction = require('../action/SystemAccountManageAction');

let FormDef = require('./SystemAccountManageForm');

//person component
import ParkSelect from './ParkSelect';

var Validator = require('../../../../public/script/common');

let SettledCompanyModal = React.createClass({
  getInitialState: function () {
    return {
      loading: false,
      modal: false,
      systemAccount: {},
      hints: {},
      validRules: [],
      edit:'',
      selectParkMessage:{}
    };
  },

  mixins: [Reflux.listenTo(SystemAccountManageStore, 'onServiceComplete'), ModalForm('systemAccount')],
  onServiceComplete: function (data) {
      this.setState({loading:false});
      if(data.errMsg){
          this.setState({errMsg:data.errMsg});
          return;
      }
  },

  componentDidMount: function () {
    let attrList=[{
      name: 'accountName',
      validator: this.checkAccountName,
    }];
    this.state.validRules = FormDef.getSystemAccountManageFormRule(this,attrList);
  },

  RewriteHandleOnChange: function (e) {
      var val = e.target.value;
      let systemAccount=Object.assign({},this.state.systemAccount,{accountName:val});
      let rc = Validator.validator(this, systemAccount, e.target.id);
      this.setState({
          systemAccount,
          loading: this.state.loading
      });
  },

  checkAccountName: function(value){
    let test=/^[A-Za-z]{6,20}$/;
    let testValue=test.test(value);
    if (!testValue) {
      let validRules1=Object.assign({},this.state.validRules[1],{ whitespace: true});
      this.state.validRules[1]=validRules1;
      return '请输入6到20位纯英文字母!';
    }
  },

  // 做新增和修改操作
  initEditData:function (systemAccounts) {
    this.state.hints = {};
    if(systemAccounts){
        Utils.copyValue(systemAccounts, this.state.systemAccount);
        //处理数据
        let systemAccount = Object.assign({},this.state.systemAccount);
        this.setState({systemAccount:systemAccount,edit:'update',userName:systemAccounts.userName},
          ()=>{this.searchPhone.initData(systemAccounts.phone)}
        )
    }else{
        this.clear();
        this.setState({
          edit:'create'
        })
    }
    if(this.parkSelect){
      this.parkSelect.initData();
    }
    if(this.searchPhone){
      this.searchPhone.initData();
    }
  },

  //初始化
  clear: function () {
    // 初始化form
    FormDef.initSystemAccountManageForm(this.state.systemAccount);
    
    // 初始化组件
    this.state.hints = {};
    this.setState({loading:false});
    if (typeof (this.searchPhone) !== 'undefined') {
      this.searchPhone.clear();
    }
    if (!this.state.modal && typeof (this.refs.mxgBox) !== 'undefined') {
      this.refs.mxgBox.clear();
    }
  },

  
  beforeClose:function () {
    this.setState({
      edit:'',
    });
    this.clear();
  },

  showModal:function () {
    this.setState({modal:true});
  },

  // 提交
  onClickSave: function () {
    let systemAccount=Object.assign({},this.state.systemAccount);
    let selectParkMessage=Object.assign({},this.state.selectParkMessage);
    let obj={};
    obj.userName = systemAccount.userName;
    obj.parkUuid = systemAccount.parkName;
    obj.accountName = systemAccount.accountName;
    obj.phone = systemAccount.phone;
    obj.uuid = selectParkMessage.uuid;
    obj.userType = selectParkMessage.userType;
    obj.userCode = selectParkMessage.userCode;
    if(Validator.validator(this,Utils.deepCopyValue(systemAccount))){
      if (this.state.edit === 'update') {
        SystemAccountManageAction.updateSystemAccount(obj,this);
      } else  if (this.state.edit === 'create')  {
        SystemAccountManageAction.saveSystemAccount(obj,this);
      }
      this.toggle();
    }
  },

  handleOwnPark:function(val,e){
    let systemAccount = Object.assign({},this.state.systemAccount);
    systemAccount.parkName = val;
    Validator.validator(this, {'parkName':val}, 'parkName');
    this.setState({systemAccount});
  },

  handleSelectPhone:function(obj){
    let systemAccount = Object.assign({},this.state.systemAccount);
    let selectParkMessage = Object.assign({},this.state.selectParkMessage);
    systemAccount.phone = obj[0].phone;
    systemAccount.userName = obj[0].userName;
    selectParkMessage.uuid = obj[0].uuid;
    selectParkMessage.userType = obj[0].userType;
    selectParkMessage.userCode = obj[0].userCode;
    this.setState({systemAccount,selectParkMessage})
  },

  render: function () {
      let  attrList = [
          {
              name:'parkName',
              id:'parkName',
              object:<ParkSelect
                  name="parkName"
                  id="parkName"
                  value={this.state.systemAccount['parkName']}
                  ref = {ref=>this.parkSelect = ref}
                  onChange={this.handleOwnPark}
              />
          },
      ];
    let items = FormDef.getSystemAccountManageForm(this, this.state.systemAccount, attrList,Common.modalForm);
    let title = this.props.actionType === 'add'?'添加管理人员': this.props.actionType ==='edit'?'编辑管理人员':'模态框';
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
        <div className='attention' style={{marginLeft:'100px'}}>注：管理后台登陆密码与该用户在APP端登陆的密码相同！</div>
      </Modal>
    );
  }
});

export default SettledCompanyModal;

