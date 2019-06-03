'use strict';

import React from 'react';
import {withRouter} from 'react-router';
let Reflux = require('reflux');
import {Button, Icon, Modal} from 'antd';
import '../../lib/style/style.scss';
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import DictTable from '../../../lib/Components/DictTable';
import FormUtil from '../../../lib/Components/FormUtil';
import SelectPark from '../../lib/components/SelectPark';
import ParkMenuTree from '../../lib/components/ParkMenuTree';
import  ControllorInfoModal from  './components/ControllorInfoModal';
import  AssignDoorModal from  './components/AssignDoorModal';
import Filter from './components/Filter';
import emitter from '../../lib/components/events';
let Common = require('../../../public/script/common');
let Utils = require('../../../public/script/utils');
const tableName = 'ControllorInfoTable';
let FormDef = require('./components/ControllorInfoForm');

let ControllorInfoStore = require('./store/ControllorInfoStore.js');
let ControllorInfoActions = require('./action/ControllorInfoActions');
let ControllorInfoPage = React.createClass({
  getInitialState: function () {
    let uuid = Common.getSelectedParkUuid() ? Common.getSelectedParkUuid():'127V0A3L79AVP001';
    return {
      controllorInfoSet: {
        errMsg: '',
        recordSet:[],
      },
      errMsg: '',
      loading: false,
      selectPark:{
        uuid,
        parkName:'',
        parkLocation:''
      },
      filter:{},
      selNode:{}
    }
  },
  mixins: [Reflux.listenTo(ControllorInfoStore, 'onServiceComplete')],
  onServiceComplete: function (data) {
    this.setState({loading:false});
    if(data.errMsg){
        this.setState({errMsg:data.errMsg});
        return;
    }
    if (data.operation === 'retrieve') {
        this.setState({
            controllorInfoSet: Object.assign({}, this.state.controllorInfoSet, data)
        });
    }else if(data.operation === 'create' || data.operation === 'update'){
        this.handleQueryClick();
    }
  },
  componentDidMount: function () {
    var dataSet = this.state.controllorInfoSet;
    var conf = FormUtil.getTableConf(tableName);
    dataSet.pageRow = (conf.page !== true) ? 0 : conf.pageRow;
    dataSet.startPage = (conf.page !== true) ? 0 : 1;
		if(this.selectPark){
      this.selectPark.init();
    }
    this.eventEmitter = emitter.addListener('ReviewTableCallMe', (msg)=>{
      this.initReviewTableWhenTreeChange();
    });
    this.eventEmitter = emitter.addListener('TopBarCallMe', (msg)=>{
      if(this.selectPark){
        this.selectPark.onSelect(this.state.selectPark.uuid);
      }
    });
  },
  componentWillUnmount:function(){
    emitter.removeListener('ReviewTableCallMe', (msg)=>{

    });
    emitter.removeListener('TopBarCallMe', (msg)=>{

    });
  },
  initReviewTableWhenTreeChange:function(){
      if(this.state.selectPark.uuid){
        var filter={};
        filter.itemUuid=this.state.selectPark.uuid;
        filter.type='PARK';
        filter.level='0';
        this.onSelectParkTree(filter);
      }
  },
  handleQueryClick: function () {
    let obj =  this.filter ? this.filter.getFilter() : null, filter = Utils.deepCopyValue(this.state.filter);
    if(obj){
      filter.controllerIp=obj.value;
    }
    this.setState({ filter,loading: true }, ()=>{
      ControllorInfoActions.retrieve(this.state.filter);
    });
  },
  onSelectPark:function(data){
    let selectPark = {
      uuid:'',
      parkName:'',
      parkLocation:''
    };
    if(data && data.parkName){
     selectPark = Utils.deepCopyValue(data);
    }
    this.setState({
      loading:false,
      selectPark
    }, ()=>{
          if(this.parkMenuTree){
            this.parkMenuTree.initTree(this.state.selectPark.uuid);
           // this.handleQueryClick();
           var filter={};
          filter.parkUuid = this.state.selectPark.uuid;
          ControllorInfoActions.retrieve(filter);
        }
    });
  },
  reset:function () {
      let  filterInfo = {
          key:'controllorIP',
          value:''
      };
      this.filter.setState({filterInfo},()=>{this.handleQueryClick()});
  },
  edit:function(record){
    this.setState({actionType:'edit'});
    this.controllorModal.showModal();
    this.controllorModal.initEditData(record);
  },
  add:function(){
    this.setState({actionType:'add'});
    this.controllorModal.showModal();
    this.controllorModal.addInitEditData();
    this.controllorModal.initOPark(this.state.selNode);
  },
  assignDoor:function(record){
       if(this.assignDoorModal){
         this.assignDoorModal.showModal();
         this.assignDoorModal.initEditData(record);
       }
  },
  onSelectParkTree:function(selNode){
    var filter={};
    // filter.attributionCategory=selNode.level;

    if(selNode.type==="PARK"){
        filter.attributionCategory=selNode.level;
        filter.parkUuid=this.state.selectPark.uuid;
    }
    if(selNode.type==='BUILDING'){
      filter.attributionCategory=selNode.level;
      filter.buildingUuid=selNode.itemUuid;
    }if(selNode.type==='FLOOR'){
        filter.floorUuid=selNode.itemUuid;
    }
    let obj = this.filter ? this.filter.getFilter() : null;
    if(obj){
      filter.controllerIp=obj.value;
    }
    this.state.filter = Utils.deepCopyValue(filter);
    this.state.selNode = Utils.deepCopyValue(selNode);
    this.state.loading = true;
    ControllorInfoActions.retrieve(this.state.filter);
  },
  filterSearch:function () {
    this.handleQueryClick();
  },
  render: function () {
    let operCol = {
      title: '操作',
      key: 'action',
      width: 120,
      render: (text, record) => {
        return (
            <span>
            <a href="#" title='分配门禁' onClick={this.assignDoor.bind(this,record)}>分配门禁</a>
            <a href="#" title='编辑' className='btn-icon-margin' onClick={this.edit.bind(this,record)}>编辑</a>
            </span>
        )
      }
    };
    let leftButtons = [
      <Button  icon={Common.iconAdd}  title="添加控制器" type='primary' onClick={this.add}
              key='添加控制器'>添加控制器</Button>,
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
      defView: tableName,
      totalPage: this.state.controllorInfoSet.totalRow,
      currentPage: this.state.controllorInfoSet.startPage,
      onRefresh: this.onTableRefresh,
    };
    let modalProps = {
      actionType:this.state.actionType
    };

    let recordSet = this.state.controllorInfoSet.recordSet;
    return (
        <div className="grid-page code-wrap" style={{height:'100%'}}>
          <ServiceMsg ref="mxgBox" svcList={['park/retrieve']} />
            <div className='code-left'>
             <SelectPark style={{width:'180px'}} ref={ref=>this.selectPark = ref} onSelect={this.onSelectPark}  value={this.state.selectPark.uuid} />
             <ParkMenuTree ref = {ref=>this.parkMenuTree = ref} onSelect={this.onSelectParkTree} />
            </div>
            <div className='code-right'>
            <div className='table-filter'>
                    <Filter key='filter' ref={ref=>this.filter=ref}  filterSearch={this.filterSearch}/>
            </div>
            <DictTable dataSource={recordSet} loading={this.state.loading} attrs={ attrProps } locale={{emptyText:'未检索到相关控制器信息。'}} />
            </div>
          <ControllorInfoModal ref={ref=> this.controllorModal = ref} {...modalProps} parkUuid={this.state.selectPark.uuid} />
          <AssignDoorModal ref={ref=> this.assignDoorModal = ref} doorFilter={this.state.filter}  />

        </div>
    );
  }
});
ControllorInfoPage.contextTypes = {
  router: React.PropTypes.object.isRequired
};
module.exports = withRouter(ControllorInfoPage);
