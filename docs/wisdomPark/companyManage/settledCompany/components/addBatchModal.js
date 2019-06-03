/**
 *   Create by Malson on 2018/4/25
 */
import React from 'react';
let Reflux = require('reflux');
import { Form, Modal, Button, Input, Select, Row, Col,Upload,Icon } from 'antd';
import ModalForm from '../../../../lib/Components/ModalForm';
let Common = require('../../../../public/script/common');
let Utils = require('../../../../public/script/utils');
const FormItem = Form.Item;
let SettledCompanyStore = require('../store/SettledCompanyStore.js');
let SettledCompanyActions = require('../action/SettledCompanyActions');


let addBatchModal = React.createClass({
  getInitialState: function () {
    return {
      loading: false,
      modal: false,
      addBatch: {
        dataList:[],
      },
      hints: {},
      validRules: []
    };
  },

  mixins: [Reflux.listenTo(SettledCompanyStore, 'onServiceComplete'), ModalForm('addBatch')],
  onServiceComplete: function (data) {
      this.setState({loading:false});
      if(data.errMsg){
          this.setState({errMsg:data.errMsg});
          return;
      }
    if (this.state.modal && data.operation === 'createss') {
    }
  },
  componentDidMount: function () {
  },
  beforeClose:function () {
    this.clear();
  },
  showModal:function () {
    this.setState({modal:true});
  },
  clear: function () {
    // FIXME 输入参数，对象初始化
    this.state.hints = {};
    this.setState({loading:false});
    if (!this.state.modal && typeof (this.refs.mxgBox) !== 'undefined') {
      this.refs.mxgBox.clear();
    }
  },
  onClickSave: function () {
    if (Common.formValidator(this, this.state.addBatch)) {
      this.setState({ loading: true });
      // SettledCompanyActions.createSettledCompany(this.state.addBatch);
    }
  },
  render: function () {
    let title = '批量导入数据';
    let {hints,addBatch} = this.state;
    return (
      <Modal
        visible={this.state.modal} width={400} title={title} maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
        footer={[
          <div key="footerDiv" style={{ display: 'block', textAlign: 'right' }}>
            <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
            <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
          </div>
        ]}
      >
        <Form layout='horizontal' >
          <FormItem labelCol={{span: 5}} wrapperCol={{span: 19}} key='upload' label='选择文件'  colon={true} help={hints.dataHint} validateStatus={hints.dataStatus} style={{marginBottom:0}}  >
            <Upload style={{width:'100%'}}>
              <Button>
                <Icon type="upload" /> 选择文件
              </Button>
            </Upload>
          </FormItem >
          <div style={{marginTop:10,marginLeft:3,color:'#999'}}>
            请使用系统提供的数据模板编辑和完善数据信息<a style={{color:'#5ca4ff'}}>【数据模板】</a>
            然后再上传数据。
          </div>
        </Form>
      </Modal>
    );
  }
});

export default addBatchModal;
