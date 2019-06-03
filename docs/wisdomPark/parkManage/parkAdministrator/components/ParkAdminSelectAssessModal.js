import React from 'react';
let Reflux = require('reflux');
let Utils = require('../../../../public/script/utils');
let FormDef = require('./parkAdministratorForm');
import { Form, Modal, Button,Checkbox, Row, Col } from 'antd';
const CheckboxGroup = Checkbox.Group;
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
import MenuList from '../../../lib/Components/menuList';
let Common = require('../../../../public/script/common');
let ParkAdministratorActions = require('../action/ParkAdministratorActions');
let ParkAdministratorStore = require('../store/ParkAdministratorStore');

let ParkAdminSelectAssessModal = React.createClass({
  getInitialState: function () {
    return {
      loading: false,
      modal: false,
      parkAdmin: {},
      hints: {},
      validRules: [],
        recordSet:[],
        isFlag:false
    };
  },
    mixins: [Reflux.listenTo(ParkAdministratorStore, 'onServiceComplete'), ModalForm('parkAdministrator')],
    onServiceComplete: function (data) {
        this.setState({loading:false});
        if(data.errMsg){
            this.setState({errMsg:data.errMsg});
            return;
        }
        if (data.operation === 'getAssessSelf') {
          let dataArray = data.recordSet.list;
          let checkedValues = [];
            dataArray.map(item=>{
                checkedValues.push(item.uuid);
            })
            this.menuList.setState({checkedList:checkedValues});
        }
        if (this.state.modal && data.operation === 'create') {
            this.setState({
                modal: false,
            });
        }
    },
  showModal: function () {
    this.setState({ modal: true });
  },
  initEditData: function (parkAdmin,isFlag) {
    this.state.hints = {};
      if(parkAdmin.uuid){
          this.setState({
              isFlag:isFlag,
              uuid:parkAdmin.uuid,
              parkAdmin
          });
          if(!isFlag){
              this.setState({loading:true},()=>{
                  ParkAdministratorActions.getAssessSelf({uuid: parkAdmin.uuid});
              })

          }

      }

    if (!this.state.modal && typeof (this.refs.mxgBox) != 'undefined') {
      this.refs.mxgBox.clear();
    }

  },
  beforeClose: function () {
     this.clear();
  },
    onClickSave: function () {
        if(this.menuList.state.checkedList.length == 0){
            Common.infoMsg('未选中任何权限！');
            return;
        }
        this.setState({ loading: true });
        let sendData = Object.assign({}, this.state.parkAdmin);
        let dataArray = [];
        this.menuList.state.checkedList.map(item=>{
            dataArray.push({uuid:item})
        });
        sendData.menus= dataArray;
        if(this.state.isFlag){
            ParkAdministratorActions.saveParkAdministrator(sendData);
        }else{
            ParkAdministratorActions.saveParkAdministratorAssess(sendData);
        }

    },

  clear: function () {
    this.setState({ loading: false },()=>{this.menuList.clear()});
    if (!this.state.modal && typeof (this.refs.mxgBox) !== 'undefined') {
      this.refs.mxgBox.clear();
    }
  },

  render: function () {
    let title = this.props.adminAssessType === 'edit' ? '权限管理' : this.props.adminAssessType === 'select' ? '查询权限' : '模态框';
    return (
      <Modal
        visible={this.state.modal} width={Common.modalWidth} title={title} maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
        footer={[
          <div key="footerDiv" style={{ display: 'block', textAlign: 'right' }}>
            <ServiceMsg ref="mxgBox" svcList={['settledCompanyDoor/create']} />
            <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
            <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
          </div>
        ]}
      >
        <Form layout='horizontal' style={{paddingLeft:16,overflow:'auto',height:370}}>
            <MenuList ref={ref=>this.menuList=ref}/>
        </Form>
      </Modal>
    );
  }
});
export default ParkAdminSelectAssessModal;