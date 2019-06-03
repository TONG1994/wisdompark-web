/**
 *   Create by Malson on 2018/7/26
 */
'use strict';

import React from 'react';
let Reflux = require('reflux');
import emitter from '../../lib/components/events';
import {Button, Icon, Modal, Divider, Breadcrumb} from 'antd';
import ParkMenuTree from '../../lib/components/ParkMenuTree';

import DictTable from '../../../lib/Components/DictTable';
import { throwError } from 'rxjs';
let Common = require('../../../public/script/common');
let Utils = require('../../../public/script/utils');
const tableName = 'ControlledCodeTable';
let FormDef = require('./components/ControlledCodeForm');
let ControlledCodeStore = require('./store/ControlledCodeStore.js');
let ControlledCodeActions = require('./action/ControlledCodeActions');
var fetch = require('isomorphic-fetch');
let ControlledCodePage = React.createClass({
  getInitialState: function () {
    let parkUuid = Common.getSelectedParkUuid() ? Common.getSelectedParkUuid():'' ;
    return {
      controlledCodeSet: {
        recordSet:[],
        errMsg: '',
      },
      errMsg: '',
      loading: false,
      parkUuid,
      selectedRows:[],
      selNode:{},
      selectedRowKeys:[],
    }
  },
  mixins: [Reflux.listenTo(ControlledCodeStore, 'onServiceComplete')],
  onServiceComplete: function (data) {
    if (!data.errMsg) {
      if(data.operation==='getDoorList'){
        this.setState({controlledCodeSet:data});
      }
    }
    this.setState({ loading: false });
  },
  componentDidMount: function () {
    this.initParkTree();
    this.eventEmitter = emitter.addListener('callMe', (msg)=>{
      this.setState({
        parkUuid:msg
      }, ()=>{
       this.initParkTree();
      });
    });
  },
  initParkTree:function(){
    if(this.parkMenuTree){
      this.parkMenuTree.initTree(this.state.parkUuid);
      this.handleQueryClick();
    }
  },
  componentWillUnmount:function(){
    emitter.removeListener('callMe', (msg)=>{

    });
  },
  tableSelect:function (record, selected, selectedRows, nativeEvent) {
    this.setState({selectedRows});
  },
  tableSelectAll:function (selected, selectedRows, changeRows) {
    this.setState({selectedRows});
  },
  // download:function (record) {
  //   if(record.qrCodeId){
  //     let action = 'http://gridfs-cs.icerno.com/gridfs/download';
  //     this.form.action = action ;
  //     // this.fileIds.value = '128U13ON4SO0800F';//测试
  //     this.fileIds.value = record.qrCodeId;
  //     let $img = document.querySelector('#img');
  //     $img.innerHTML = '';
  //     let errorFlag = false;
  //     let $imgSpace = document.createElement('img');
  //     $imgSpace.src = 'http://gridfs-cs.icerno.com/gridfs/find?fileId='+record.qrCodeId;
  //     $img.appendChild($imgSpace);
  //     $imgSpace.onerror = function () {
  //       if(!errorFlag){
  //         errorFlag = true;
  //         Common.errMsg('['+ record.doorName+']下载错误！');
  //       }
  //     }
  //     document.querySelector('#form').submit();
  //   }else {
  //     Common.warnMsg('该受控门没有对应的二维码文件');
  //   }
  // },
  downLoadPicture: function(fileIds, doorName){
    let errorFileIds = '', $this = this;
    if(fileIds){
      // let url = 'http://gridfs-cs.icerno.com/gridfs/download?fileIds='+ fileIds;
      let url = Utils.fileAddress +'gridfs/download?fileIds=' +fileIds;
      fetch(url, {
        method: 'GET',
        mode:'cors',
      }).then(response => {
        if (response.ok) {
          let errorfd = response.headers.get('errorFileIds');
          if(errorfd){
            errorFileIds = response.headers.get('errorFileIds');
          }
        } else {
          if(response.status === 404){
            if(doorName){
              Common.warnMsg('['+ doorName +']二维码图片不存在！');
            }else{
              Common.warnMsg('待下载的文件不存在！');
            }
          }else if(response.status === 400){
            Common.warnMsg('请选择要下载的文件！');
          }else if(response.status === 500){
            Common.warnMsg('服务器未知错误！');
          }else {
            throw `服务通信异常status:${response.status}`;
          }
        }
    }).then(resolve => {
       // 批量下载 需要判断是否有文件丢失
       if(errorFileIds ){
        $this.successDownload(fileIds);
           let errfileIds = errorFileIds.split(',');
           let fileName = [],  recordSet = $this.state.controlledCodeSet.recordSet;
           errfileIds.map(fileId=>{
            let fileid = recordSet.find(item => item.qrCodeId === fileId);
            if(fileid && fileid.doorName){
              fileName.push(fileid.doorName);
            }
           });
         if(fileName.length){
           let fileNameStr = fileName.join(' , ');
           Common.warnMsg('['+ fileNameStr +']二维码图片文件缺失！');
         }
       }else{
        $this.successDownload(fileIds);
       }
      
    }).catch(err => {
      Common.warnMsg(err);
    });
    }else {
      Common.warnMsg('无效的文件ID，无法正常下载！');
    }
  },
  successDownload:function(fileIds){
    // let action = 'http://gridfs-cs.icerno.com/gridfs/download';
    let action = Utils.fileAddress + 'gridfs/download';
    this.form.action = action ;
    // this.fileIds.value = '128U13ON4SO0800F';//测试
    this.fileIds.value = fileIds;
    document.querySelector('#form').submit();
  },
  download:function (record) {
     this.downLoadPicture(record.qrCodeId, record.doorName);
  },
  downLoadPatch:function(){
      let fileIds=[], selectedRows = Utils.deepCopyValue(this.state.selectedRows);
      this.state.selectedRowKeys = [];
      this.state.selectedRows = [];
      this.setState({ loading: false });
      for(let i=0;i<selectedRows.length;i++){
        if(selectedRows[i].qrCodeId){
          fileIds.push(selectedRows[i].qrCodeId);
        }
      }
      let filter= fileIds.length ? (fileIds.length === 1 ? fileIds[0] : fileIds.join(",")) : '';
      this.downLoadPicture(filter);
  },
  handleQueryClick: function () {
    this.setState({ loading: true });
    let filter = {
      attributionCategory:'0',
      parkUuid:this.state.parkUuid,
    };
    ControlledCodeActions.retrieve(filter);
  },
  onSelectController:function(selNode){
    this.setState({selNode});
    this.setState({ loading: true });
    //console.log(selNode);
    let filter = {
      attributionCategory:selNode.level,
      parkUuid:selNode.rootId,
    };
    // 归属类别（0.园区，1.楼宇，2.楼层，3.单元，4.房间）
    let level = selNode.level;
    if(level==='0'){
      filter.parkUuid=selNode.itemUuid;
    }else if(level === '1'){
      filter.buildingUuid = selNode.itemUuid;
    }else if(level == '2'){
      delete filter.attributionCategory;
      filter.floorUuid = selNode.itemUuid;
      filter.buildingUuid=selNode.parentId;
    }else if(level === '3'){
      delete filter.attributionCategory;
      filter.cellUuid = selNode.itemUuid;
    }
    ControlledCodeActions.retrieve(filter);
  },
  onChange:function(selectedRowKeys, selectedRows){
    this.setState({selectedRowKeys,selectedRows});
  },
  render: function () {
    let operCol = {
      title: '操作',
      key: 'action',
      width: 120,
      render: (text, record) => {
        return (
            <span>
            <a href="#" title='下载' onClick={this.download.bind(this, record)}>下载</a>
          </span>
        )
      }
    };
    let data = this.state.controlledCodeSet.recordSet;
    let btnIsVisible = data && data.length ? '' :'none';
    const hasSelected =this.state.selectedRows!=false?false:true;
    let leftButtons = [
     <Button onClick={this.downLoadPatch} key='下载选中' type='primary'  style={{ display: btnIsVisible}} disabled={hasSelected}>下载选中</Button>
    ];
    let attrProps = {
      self: this,
      tableName: tableName,
      primaryKey: 'uuid',
      fixedTool: false,    // 固定按钮，不滚动
      buttons: leftButtons,
      btnPosition: 'top',
      rightButtons:null,
      operCol: operCol,
      tableForm: FormDef,
      editCol: false,
      editTable: false,
      defView: 'ControlledCodeTable',
    };
    let tableProps = {
      rowSelection:{
        selectedRowKeys:this.state.selectedRowKeys,
        onChange:this.onChange,
        onSelect:this.tableSelect,
        onSelectAll:this.tableSelectAll
      },
      style:{
        marginTop:20
      },
    };
    return (
        <div className="grid-page code-wrap" style={{height:'100%'}}>
            <div className='code-left'>
              <ParkMenuTree ref = {ref=>this.parkMenuTree = ref}  onSelect={this.onSelectController} />
            </div>
            <div className='code-right'>
              <DictTable dataSource={data} loading={this.state.loading} attrs={ attrProps } {...tableProps} />
              {/* <Button onClick={this.downLoadPatch} key='下载选中'  style={{marginLeft:20,marginTop:10, display: btnIsVisible}}>下载选中</Button> */}
            </div>
            <iframe
              id="iframe_display"
              name="iframe_display"
              style={{display: 'none'}}>
            </iframe>
          <form
              name= "form"
              action = ''
              target = "iframe_display"
              id='form'
              ref={ref=>this.form=ref}
          >
            <input type="hidden" name="fileIds" value="" ref={ref=>this.fileIds=ref}/>
          </form>
          <div id='img'  style={{display:'none'}} />
        </div>
    );
  }
});

module.exports = ControlledCodePage;
