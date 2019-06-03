'use strict';

import React from 'react';
import {Button, Modal,Form} from 'antd';
let Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';


let Common = require('../../../../public/script/common');
let Utils = require('../../../../public/script/utils');
let FormDef = require('./OpenDoorRemotelyForm');

let OpenDoorRemotelyStore = require('../store/OpenDoorRemotelyStore.js');
let OpenDoorRemotelyActions = require('../action/OpenDoorRemotelyActions');

let openDoorLoginModal = React.createClass({
    getInitialState: function () {
        return {
          loading: false,
          modal: false,
          openDoorLogin: {
              password:'',
              parkUuid:'',
          },
          hints: {},
          validRules: [],
        };
      },

      mixins: [Reflux.listenTo(OpenDoorRemotelyStore, 'onServiceComplete'), ModalForm('openDoorLogin')],
      onServiceComplete: function (data) {
          this.setState({loading:false});
          if(data.errMsg===''){
            if(data.recordSet){
              if (this.state.modal) {
                    this.setState({
                        modal: false,
                    });
                    this.props.controllVisible('flex');
              }
            }else{
              if(typeof(this.refs.mxgBox) != 'undefined' ){
                this.refs.mxgBox.showError('开门验证失败');
              }
            }
          }
      },
      componentDidMount: function () {
        this.state.validRules = FormDef.getOpenDoorRemotelyFormRule(this);
        this.clear();
      },
      beforeClose:function () {
        this.clear();
      },
      showModal:function () {
        this.setState({modal:true});
      },
      clear: function () {
        FormDef.initOpenDoorRemotelyForm(this.state.openDoorLogin);
        this.state.hints = {};
        this.setState({loading:false});
          if (!this.state.modal && typeof (this.refs.mxgBox) !== 'undefined') {
          this.refs.mxgBox.clear();
        }
      },

      onClickSave: function () {
              if(Common.formValidator(this, this.state.openDoorLogin)) {
                  this.setState({loading:true});
                  let sendData = Utils.deepCopyValue(this.state.openDoorLogin);
                  OpenDoorRemotelyActions.openDoorLogin(sendData);
          }
      },

      onClose:function(){
        this.toggle();
        this.props.goBack();
      },
      initParkUuid:function(parkUuid){
        let openDoorLogin = Utils.deepCopyValue(this.state.openDoorLogin);
        openDoorLogin.parkUuid = parkUuid;
        this.setState({openDoorLogin});
      },
  render: function () {

        let items = FormDef.getOpenDoorRemotelyForm(this, this.state.openDoorLogin, null, Common.modalForm);
        let title ='远程开门验证';
        return (
          <Modal
            visible={this.state.modal} width={Common.modalWidth} title={title} maskClosable={false} onOk={this.onClickSave} onCancel={this.onClose}
            footer={[
              <div key="footerDiv" style={{ display: 'block', textAlign: 'right' }}>
                <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>确定</Button>{' '}
                <Button key="btnClose" size="large" onClick={this.onClose}>取消</Button>
              </div>
            ]}
          >
          <Form layout='horizontal' >
          { items }
          </Form>
          <ServiceMsg ref="mxgBox" svcList={['park/checkRemotevVerificationCode']} />
    </Modal>
    );
  }
});

module.exports = openDoorLoginModal;
