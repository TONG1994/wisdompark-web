
import React from 'react';
let Reflux = require('reflux');
import { Form, Modal, Button, Input, Select, Row, Col } from 'antd';
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
let Common = require('../../../../public/script/common');
let Utils = require('../../../../public/script/utils');

let PersonnelStore = require('../store/PersonnelStore.js');
let PersonnelActions = require('../action/PersonnelActions');

let FormDef = require('./PersonnelForm');

//person component
import Component from './Component';

let PersonnelModal = React.createClass({
  getInitialState: function () {
    return {
      loading: false,
      modal: false,
      settledCompany: {
        userName: '',
        phone: '',
        companyName: '',
        companyUuid: '',
        userType: '3',//员工类型：0：注册用户1：企业员工2：企业访客3：公司门禁管理员4：园区门禁管理员5：超级管理员
        picture: ''
      },
      hints: {},
      validRules: [],
      isDisabled1: false,
      isDisabled2: true,
      isDisabled3: true,
      fileList: [],
      previewImage: '',
      previewVisible: false,

    };
  },

  mixins: [Reflux.listenTo(PersonnelStore, 'onServiceComplete'), ModalForm('settledCompany')],
  onServiceComplete: function (data) {
    if (data.errMsg) {
      this.setState({ errMsg: data.errMsg });
      return;
    }
    if (this.state.modal && data.operation === 'retrieve' && data.flag === 'phone') {
      let settledCompany = this.state.settledCompany;
      if (data.phone && data.phone.length) {
        data.phone[0].companyName = settledCompany.companyName;
        data.phone[0].companyUuid = settledCompany.companyUuid;
        data.phone[0].userType = '3';
        Utils.copyValue(data.phone[0], this.state.settledCompany);
      } else {
        settledCompany = {
          userName: '暂无',
          phone: settledCompany.phone,
          companyName: settledCompany.companyName,
          companyUuid: settledCompany.companyUuid,
          userType: '3'
        }
      }
      this.setState({
        nameLoading: false,
        settledCompany
      });
    }
    if (this.state.modal && data.operation === 'update') {
      this.setState({ modal: false });
      this.clear();
    }

  },
  componentDidMount: function () {
    this.state.validRules = FormDef.getPersonnelFormRule(this);
  },
  beforeClose: function () {
    this.clear();
  },
  showModal: function () {
    this.setState({ modal: true });
  },
  //编辑
  initEditData: function (settledCompany) {
    let fileList = [];
    this.state.hints = {};
    Utils.copyValue(settledCompany, this.state.settledCompany);

    if (settledCompany.picture) {
      //fileList=[{ url: 'http://gridfs-cs.icerno.com/gridfs/find?fileId='+settledCompany.picture }];
      let url = Utils.fileAddress + 'gridfs/find?fileId=' + settledCompany.picture;
      fileList.push({ uid: settledCompany.picture, name: '', status: 'done', url});
    }
    this.setState({
      fileList,
      loading: false,
      isDisabled1: true,
      isDisabled2: false,
      isDisabled3: true,
    }, () => { this.company.changeValue(settledCompany.companyName);this.company.changeDisabled(true); });
    if (!this.state.modal && typeof (this.refs.mxgBox) != 'undefined') {
      this.refs.mxgBox.clear();
    }
  },
  //取消按钮
  clear: function () {
    this.setState({ fileList: [] });
    FormDef.initSettledCompanyForm(this.state.settledCompany);
    // FIXME 输入参数，对象初始化
    this.state.hints = {};
    this.setState({ loading: false, isDisabled1: false, isDisabled2: true, isDisabled3: true }, () => { this.company.changeDisabled(false); });
    if (!this.state.modal && typeof (this.refs.mxgBox) !== 'undefined') {
      this.refs.mxgBox.clear();
    }
    if (this.company) {
      this.company.clear();
    }
  },
  getCompany: function (data) {
    let settledCompany = this.state.settledCompany;
    settledCompany.companyName = data.companyName;
    settledCompany.companyUuid = data.companyUuid;
    this.setState({
      settledCompany
    });
  },
  //搜索手机号
  phoneOnChange: function (e) {
    let settledCompany = this.state.settledCompany;
    let s = e.target.value.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    settledCompany[e.target.id] = s;
    let id = e.target.id;
    this.setState({
      nameLoading: true,
      settledCompany
    }, () => {
      if (Common.validator(this, settledCompany, id)) {
        let phone = this.state.settledCompany.phone;
        PersonnelActions.retrieveAddress({ phone }, null, null, 'phone');
      } else {
        this.state.settledCompany.userName = '';
        this.setState({
          settledCompany
        });
      }
    });

  },
  //保存
  onClickSave: function () {
    let settledCompany = this.state.settledCompany;
    if(settledCompany.picture == ''){
      settledCompany.picture=null;
    }
    if (!settledCompany.companyName) {
      Common.infoMsg('公司无效，请重新输入公司名称！');
      return;
    }
    if (settledCompany.userName === '暂无') {
      Common.infoMsg('该手机号码还未注册账户，请用户在APP端注册账户！');
      return;
    }
    if (!settledCompany.userName) {
      Common.infoMsg('姓名无效，请重新输入手机号筛选姓名！');
      return;
    }
    if (Common.formValidator(this, this.state.settledCompany)) {
      if (this.props.actionType === 'edit') {
        PersonnelActions.edit(this.state.settledCompany);
      } else {
        PersonnelActions.addUser(this.state.settledCompany);
      }
    }
  },
  onPreviewImage: function (file) {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  },
  handleCancel: function () {
    this.setState({ previewVisible: false })
  },
  onRemoveImage: function (file) {
    if (length === 5) {
      length = length - 2;
    }
    else {
      length--;
    }
    return true;
  },

  //上传检测
  beforeUpload: function (file) {
    const isImage = (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/gif' || file.type === 'image/png' || file.type === 'image/bmp');
    if (!isImage) {
      Common.warnMsg('请选择图片文件');
      return false;
    }
    if (file.size / 1024 / 1024 > 10) {
      Common.warnMsg('请选择小于10M的图片文件');
      return false;
    }
    length++;
    if (length > 4) {
      length = 4;
      return false;
    }
    else {
      this.setState({ fileName: file.name });
      return true;
    }

  },
  //上传文件
  upload: function (info) {
    let fileId = '';
    for (let i = 0; i < info.fileList.length; i++) {
      info.fileList[i].name = '';
      if (typeof info.fileList[i].response == 'object') {
        let result = info.fileList[i].response;
        if (result) {
          if (result.errDesc) {
            Common.infoMsg(result.errDesc);
            return;
          } else {
            fileId = result.object
          }

        }
      }
    }
    let settledCompany = Object.assign({}, this.state.settledCompany);
    settledCompany.picture = fileId;
    const isImage = (info.file.type === 'image/jpeg' || info.file.type === 'image/jpg' || info.file.type === 'image/gif' || info.file.type === 'image/png' || info.file.type === 'image/bmp');
    if (!isImage && info.file.status != 'removed') {
      return false;
    }
    if (info.file.size / 1024 / 1024 > 10 && info.file.status != 'removed') {
      return false;
    }
    this.setState({ fileList: info.fileList, settledCompany });
  },
  //删除图片
  onRemoveImage:function(){
    let settledCompany = Object.assign({}, this.state.settledCompany);
    settledCompany.picture ='';
    this.setState({ settledCompany });
  },
  render: function () {
    let items = FormDef.getPersonnelForm(this, this.state.settledCompany, null, Common.modalForm);
    let title = this.props.actionType === 'add' ? '添加企业门禁管理员' : this.props.actionType === 'edit' ? '编辑' : '模态框';
    return (
      <Modal
        visible={this.state.modal} width={Common.modalWidth} title={title} maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
        footer={[
          <div key="footerDiv" style={{ display: 'block', textAlign: 'right' }}>
            <ServiceMsg ref="mxgBox" svcList={['user/retrieve', 'user/update']} />
            <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
            <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
          </div>
        ]}
      >
        <Form layout='horizontal' >
          {items}
        </Form>
      </Modal>
    );
  }
});

export default PersonnelModal;
