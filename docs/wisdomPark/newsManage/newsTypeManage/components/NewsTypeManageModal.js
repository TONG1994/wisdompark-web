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

let NewsTypeManageStore = require('../store/NewsTypeManageStore.js');
let NewsTypeManageActions = require('../action/NewsTypeManageActions');

let FormDef = require('./NewsTypeManageForm');


var Validator = require('../../../../public/script/common');

let NewsTypeManageModal = React.createClass({
  getInitialState: function () {
      let parkUuid = Common.getSelectedParkUuid() ? Common.getSelectedParkUuid():'';
    return {
      parkUuid,
      loading: false,
      modal: false,
      newsTypeManage: {
          optionName:'',
      },
      hints: {},
      validRules: [],
    };
  },

  mixins: [Reflux.listenTo(NewsTypeManageStore, 'onServiceComplete'), ModalForm('newsTypeManage')],
  onServiceComplete: function (data) {
    //console.log(data);
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
    this.state.validRules = FormDef.getNewsTypeManageFormRule(this);
  },
  beforeClose:function () {
    this.clear();
  },
  showModal:function () {
    this.setState({modal:true});
  },
  initEditData:function (newsTypeManages) {
    this.state.hints = {};
    if(newsTypeManages){
        Utils.copyValue(newsTypeManages, this.state.newsTypeManage);
        let newsTypeManage = Object.assign({},this.state.newsTypeManage);
        this.setState({newsTypeManage});
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
    FormDef.initNewsTypeManageForm(this.state.newsTypeManage);
    this.state.hints = {};
    this.setState({loading:false});
      if (!this.state.modal && typeof (this.refs.mxgBox) !== 'undefined') {
      this.refs.mxgBox.clear();
    }
  },

  onClickSave: function () {
     let newsTypeManage = Object.assign({}, this.state.newsTypeManage);
     this.setState({
       newsTypeManage
     });
     if (Common.formValidator(this, this.state.newsTypeManage)) {
       let sendData = Utils.deepCopyValue(this.state.newsTypeManage);
       console.log(sendData);
       this.setState({
         loading: true
       });
       if (this.props.actionType === 'edit') {
         sendData.corpUuid=this.state.parkUuid;
         NewsTypeManageActions.updateNewsTypeManage(sendData);
       } else {
         sendData.corpUuid=this.state.parkUuid;
         NewsTypeManageActions.saveNewsTypeManage(sendData);
       }
     }
  },

  render: function () {

    let items = FormDef.getNewsTypeManageForm(this, this.state.newsTypeManage, null, Common.modalForm);
    let title = this.props.actionType === 'add'?'添加资讯分类': this.props.actionType ==='edit'?'编辑资讯分类':'模态框';
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

export default NewsTypeManageModal;
