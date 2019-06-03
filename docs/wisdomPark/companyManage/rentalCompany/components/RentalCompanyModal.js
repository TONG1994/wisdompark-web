/**
 *   Create by Malson on 2018/4/25
 */
import React from 'react';
let Reflux = require('reflux');
import { Form, Modal, Button,  Upload, Icon } from 'antd';
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
let Common = require('../../../../public/script/common');
let Utils = require('../../../../public/script/utils');

let RentalCompanyStore = require('../store/RentalCompanyStore.js');
let RentalCompanyActions = require('../action/RentalCompanyActions');

let FormDef = require('./RentalCompanyForm');

var Validator = require('../../../../public/script/common');
import moment from 'moment';

// import XlsTempFile from '../../lib/Components/XlsTempFile';
// import XlsConfig from '../../lib/XlsConfig';


let RentalCompanyModal = React.createClass({
  getInitialState: function () {
    return {
      loading: false,
      modal: false,
      rentalCompany: {
          park:Common.getLoginData().userInfo.parkName == '' ||Common.getLoginData().userInfo.parkName == null ?'O-Park园区':Common.getLoginData().userInfo.parkName,
          tower:'',
          fromDate:'',
          toDate:''
      },
      hints: {},
      validRules: [],
        building:'',
        floor:[],
        room:[],
        file:'',
        fileId:'',//得到的存在数据库中的id
        fileList:[]
    };
  },

  mixins: [Reflux.listenTo(RentalCompanyStore, 'onServiceComplete'), ModalForm('rentalCompany')],
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
      let attrList = [
          {
              name: 'fromDate',
              validator: this.checkBusinessHours
          }
      ];
    this.state.validRules = FormDef.getRentalCompanyFormRule(this,attrList);
  },
    set:function (id,val,f) {
        let rentalCompany = Object.assign({},this.state.rentalCompany);
        Common.validator(this,rentalCompany,id);
    },
    //租赁时间
    checkBusinessHours: function(value) {
        if (!value) {
            return '请输入【企业租房起止日期】'
        }
    },
  beforeClose:function () {
    this.clear();
  },
  showModal:function () {
    this.setState({modal:true});
  },
  initEditData:function (rentalCompanys) {
      let fileList = [];
      this.setState({
          loading: false,
      },()=>{
          if(rentalCompanys){
              if(rentalCompanys.fileId){
                  fileList.push({uid:rentalCompanys.fileId,name:rentalCompanys.fileName});
              }
              Utils.copyValue(rentalCompanys, this.state.rentalCompany);
              let rentalCompany = Object.assign({},this.state.rentalCompany);
              rentalCompany.fromDate =  rentalCompanys.startTime,
              rentalCompany.toDate =  rentalCompanys.endTime;
              this.search.changeValue( rentalCompanys.companyName);
              this.setState({rentalCompany:rentalCompany,fileList},()=>{
                  this.getCompany({ companyName: rentalCompanys.companyName,
                      companyUuid: rentalCompanys.uuid,
                      buildingUuid: rentalCompanys.buildingUuid,
                      floorUuid: rentalCompanys.floorUuid,
                      cellUuid: rentalCompanys.cellUuid,
                  })
              });
          }else{
              this.clear();
          }
      });
      if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
          this.refs.mxgBox.clear();
      }
  },
  getCompany: function(data){
      let rentalCompany = Object.assign({},this.state.rentalCompany);
      rentalCompany.companyName = data.companyName;
      rentalCompany.companyUuid = data.companyUuid;
      rentalCompany.tower = (data !=''?data.buildingUuid:'');
      rentalCompany.floor = data.floorUuid;
      rentalCompany.unitnumber = data.cellUuid;
      this.setState({rentalCompany},()=>{
          this.floorSelect.initDate();
          this.unitnumber.initDate();
          Validator.validator(this, {'companyName': rentalCompany.companyName}, 'companyName');
          Validator.validator(this, {'tower': rentalCompany.tower }, 'tower');
          Validator.validator(this, {'floor': rentalCompany.floor }, 'floor');
          Validator.validator(this, {'unitnumber': rentalCompany.unitnumber }, 'unitnumber');
      });
    },
  clear: function () {
  this.state.rentalCompany.fromDate = '';
  this.state.rentalCompany.toDate = '';
  this.state.fileId = '';
  this.state.fileList = [];
  this.setState({loading:false});
    FormDef.initRentalCompanyForm(this.state.rentalCompany);
      if(this.floorSelect){
          this.floorSelect.rest();
      }
      if(this.unitnumber){
          this.unitnumber.rest();
      }
      if(this.search){
          this.search.clear();
      }

    // FIXME 输入参数，对象初始化
    this.state.hints = {};

      if (!this.state.modal && typeof (this.refs.mxgBox) !== 'undefined') {
      this.refs.mxgBox.clear();
    }
  },

  onClickSave: function () {
          if(Common.formValidator(this, this.state.rentalCompany)) {
              this.setState({loading:true});
              let sendData = {};
              sendData.startTime = this.state.rentalCompany.fromDate;
              sendData.endTime = this.state.rentalCompany.toDate;
              sendData.companyUuid =this.state.rentalCompany.companyUuid;
              sendData.fileId = this.state.fileId;
              sendData.fileName= this.state.fileList.length == 0 ?"":this.state.fileList[0].name;
              if(this.props.actionType ==='edit'){
                  sendData.uuid=this.state.rentalCompany.uuid;
                  RentalCompanyActions.updateRentalCompany(sendData);
              }else{
                  RentalCompanyActions.saveRentalCompany(sendData);
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
        let rentalCompany = Object.assign({},this.state.rentalCompany);
        rentalCompany.unitnumber = val;
        Validator.validator(this, {'unitnumber':val}, 'unitnumber');
        this.setState({rentalCompany,room});
    },
    handleFloor:function(val,e){
        let floor = [];
        e.map(item=>{
            if(floor.indexOf(item.props.children) == -1){
                floor.push(item.props.children);
            }
        })
        let rentalCompany = Object.assign({},this.state.rentalCompany);
        rentalCompany.floor = val;
        rentalCompany.unitnumber = [];
        Validator.validator(this, {'floor':val}, 'floor');
        this.setState({rentalCompany,floor},()=>{this.unitnumber.initDate()});
    },
    handleTower:function(val,e){
        let building = e.props.children;
        let rentalCompany = Object.assign({},this.state.rentalCompany);
        rentalCompany.tower = val;
        rentalCompany.floor = [];
        rentalCompany.unitnumber = [];
        this.unitnumber.rest();
        Validator.validator(this, {'tower':val}, 'tower');
        this.setState({rentalCompany,building},()=>{
            this.floorSelect.initDate();
        });
    },
    onChange:function(date,dateString){
        this.state.rentalCompany.fromDate=dateString[0];
        this.state.rentalCompany.toDate=dateString[1];
        this.setState({loading:false});
        this.set('fromDate',dateString[0],true);
    },

    disabledDate:function disabledDate(current) {
        return current && current > moment().endOf('day');
    },
    fileOnChage:function(info) {
        const isImage = (info.file.type === 'application/zip' || info.file.type === ''|| info.file.type === 'application/x-zip-compressed');
        if(!isImage && info.file.status!='removed'){
           return;
        }
        if(info.file.size/1024/1024>10 && info.file.status!='removed'){
            return false;
        }
        let fileList = info.fileList;
        fileList.map(item=>{
            item.name = '压缩包文件';
        });
        let fileId = '';
        if(info.file.status == 'done'){
            if(fileList.length == 2){
                // if(fileList[0].response){
                //     RentalCompanyActions.deleteRentalCompanyFile(fileList[0].response.object.fileId);
                // }else{
                //     RentalCompanyActions.deleteRentalCompanyFile(fileList[0].uid);
                // }
                fileId =fileList[1].response.object;
                fileList = fileList.slice(1);
            }else{
                fileId =fileList[0].response.object;
            }
        }
        this.setState({fileId,fileList});

    },
    fileRemove:function(info){
        //TODO 传参需1.一个文件id，2,当前记录id
        if(info.response){
            RentalCompanyActions.deleteRentalCompanyFile(info.response.object);
        }else{
            RentalCompanyActions.deleteRentalCompanyFile(info.uuid);
        }
    },
    beforeUpload:function(file){
        //判断是压缩包
        const isImage = (file.type === 'application/zip' || file.type === '' || file.type === 'application/x-zip-compressed');
        if(!isImage){
            Common.warnMsg('请选择压缩包文件');
            return false;
        }
        if(file.size/1024/1024>10){
            Common.warnMsg('请选择小于10M的文件');
            return false;
        }
    },
  render: function () {
    var fileList=this.state.fileList;
    let items = FormDef.getRentalCompanyForm(this, this.state.rentalCompany, null,null);
    let title = this.props.actionType === 'add'?'添加企业租房合同信息': this.props.actionType ==='edit'?'编辑企业租房合同信息':'模态框';
      let uploadProps = {
          name:'file',
          action:Utils.wisdomparkUrl+'gridfs/uploadFile',
          onChange:this.fileOnChage,
          // onRemove:this.fileRemove,
          beforeUpload:this.beforeUpload,
      };
      const uploadButton = (
          <div>
              <Button >
                  <Icon type="upload" /> upload
              </Button>
          </div>
      );
      let button = (
          <Upload {...uploadProps}  fileList={this.state.fileList}>
              {fileList.length >= 1? null : uploadButton}
          </Upload>);
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
          <div key='divv'>
            上传租房合同及其他资料包（压缩包形式）
              {button}
          </div>
        </Form>
      </Modal>
    );
  }
});

export default RentalCompanyModal;
