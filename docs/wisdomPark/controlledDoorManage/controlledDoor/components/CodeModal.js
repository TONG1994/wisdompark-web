/**
 *   Create by Malson on 2018/7/25
 */
import React from 'react';
import { Modal, Button } from 'antd';
import ModalForm from '../../../../lib/Components/ModalForm';
let Common = require('../../../../public/script/common');
let Utils = require('../../../../public/script/utils');


let CodeModal = React.createClass({
  getInitialState: function () {
    return {
      loading: false,
      modal: false,
      controlledDoor: {},
      name:'',
      doorNo:'',
      breadcrumb:[]
    };
  },
  mixins: [ModalForm('controlledDoor')],
  onServiceComplete: function (data) {
    if(!data.errMsg ){
      this.setState({errMsg:data.errMsg});
      return;
    }
    if (this.state.modal && data.operation === 'create') {
    }
  },
  componentDidMount: function () {
  },
  beforeClose:function () {
    this.clear();
  },
  showModal:function (obj) {
    if(obj){
      this.setState({
        name:obj.name,
        breadcrumb:obj.breadcrumb,
        doorNo:obj.doorNo
      });
    }
    this.setState({modal:true});
  },
  clear: function () {
    // console.log('清除图片');
  },
  onClickSave: function () {
    // console.log('图片下载');
  },
  render: function () {
    let {name,doorNo} = this.state;
    let title = name?name +'编号':'受控门编号';
    let breadcrumbArr = Utils.deepCopyValue(this.state.breadcrumb);
    // breadcrumbArr.push(doorNo);
    return (
        <Modal
            visible={this.state.modal} width={300} title={title} maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
            footer={null}
        >
          {/*<div style={{width:200,height:200,backgroundColor:'#8e77ff',margin:"20px auto"}}>*/}
          
          {/*</div>*/}
          <div style={{textAlign:'center',fontWeight:'bold',margin:'40px auto',fontSize:30}}>{doorNo}</div>
        </Modal>
    );
  }
});

export default CodeModal;
