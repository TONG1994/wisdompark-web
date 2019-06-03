'use strict';

import React from 'react';
import {withRouter} from 'react-router';
let Reflux = require('reflux');
import emitter from '../../lib/components/events';
import {Button, Icon, Modal} from 'antd';
import '../../lib/style/style.scss';
import FormUtil from '../../../lib/Components/FormUtil'
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import DictTable from '../../../lib/Components/DictTable';
import ParkMenuTree from '../../lib/components/ParkMenuTree';
import  OpenDoorLoginModal from  './components/OpenDoorLoginModal';

let Common = require('../../../public/script/common');
let Utils = require('../../../public/script/utils');
const tableName = 'OpenDoorRemotelyTable';
let FormDef = require('./components/OpenDoorRemotelyForm');

let OpenDoorRemotelyStore = require('./store/OpenDoorRemotelyStore.js');
let OpenDoorRemotelyActions = require('./action/OpenDoorRemotelyActions');
let OpenDoorRemotelyPage = React.createClass({
  getInitialState: function () {
    let parkUuid = Common.getSelectedParkUuid() ? Common.getSelectedParkUuid():'' ;
    return {
      openDoorRemotelySet: {
        recordSet:[],
        errMsg: '',
        startPage: 1,
        pageRow: 10,
        totalRow: 1,
      },
      errMsg: '',
      loading: false,
      parkUuid,
      isVisible:'none',
      selectedRows:[],
      selNode:{},
      selectedRowKeys:[]
    }
  },
  mixins: [Reflux.listenTo(OpenDoorRemotelyStore, 'onServiceComplete')],
  onServiceComplete: function (data) {
    if (!data.errMsg) {
      if(data.operation==='retrievePark'){
        this.setState({openDoorRemotelySet:data});
      }
      if(data.operation==='onOpenBatchDoor'){
        this.setState({selectedRowKeys:[],selectedRows:[]});
        this.handleQueryClick(this.state.selNode);
      }
    }
    this.setState({ loading: false });
  },
  componentDidMount: function () {
    var dataSet = this.state.openDoorRemotelySet;
    var conf = FormUtil.getTableConf(tableName);
    dataSet.pageRow = (conf.page !== true) ? 0 : conf.pageRow;
    dataSet.startPage = (conf.page !== true) ? 0 : 1;
    if(this.parkMenuTree){
      this.parkMenuTree.initTree(this.state.parkUuid);
    }
    if(this.openDoorModal){
      this.openDoorModal.showModal();
      this.openDoorModal.initParkUuid(this.state.parkUuid);
    }
    this.eventEmitter = emitter.addListener('callMe', (msg)=>{
      this.setState({
        parkUuid:msg
      }, ()=>{
        this.parkMenuTree.initTree(this.state.parkUuid);
      });
    });
  },
  componentWillUnmount:function(){
    // emitter.removeListener(this.eventEmitter);
    emitter.removeListener('callMe', (msg)=>{
      this.setState({
        parkUuid:msg
      }, ()=>{
        this.parkMenuTree.initTree(this.state.parkUuid);
      });
    });
  },
  tableSelect:function (record, selected, selectedRows, nativeEvent) {
    this.setState({selectedRows});
  },
  tableSelectAll:function (selected, selectedRows, changeRows) {
    this.setState({selectedRows});
  },
  openDoor:function (record) {
    let $this=this;
    Modal.confirm({
      title: '开锁确认',
      content: '您确定要执行开锁操作吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: function () {
        $this.setState({ loading: true });
        var filter=[];
        filter[0]=record;
        OpenDoorRemotelyActions.openBatchDoor(filter);
      }
    });
  },
  openBatchDoor:function () {
    var $this=this;
      Modal.confirm({
        title: '一键开锁确认',
        content: '您确定要执行一键开锁操作吗？',
        okText: '确定',
        cancelText: '取消',
        onOk: function () {
          $this.setState({ loading: true });
          OpenDoorRemotelyActions.openBatchDoor($this.state.selectedRows);
        }
      });
  },
  handleQueryClick: function (selNode) {
    this.setState({ loading: true });
    OpenDoorRemotelyActions.retrievePark(selNode,
      this.state.openDoorRemotelySet.startPage,this.state.openDoorRemotelySet.pageRow);
  },
  onTableRefresh: function (current, pageRow) {
    this.state.openDoorRemotelySet.startPage = current;
    this.state.openDoorRemotelySet.pageRow = pageRow;
    this.handleQueryClick(this.state.selNode);
  },
  goBack:function(){
    this.props.router.goBack();
  },
  controllVisible:function(isVisible){
    this.onSelectController(this.parkMenuTree.state.selectedKeys2Value);
    this.setState({
      isVisible
    });
  },
  onSelectController:function(selNode){
    this.setState({selNode});
    OpenDoorRemotelyActions.retrievePark(selNode,
     1,10);
  },
  onChange:function(selectedRowKeys, selectedRows){
    this.setState({selectedRowKeys});
  },
  render: function () {
    var recordSet=this.state.openDoorRemotelySet.recordSet;
    let operCol = {
      title: '操作',
      key: 'action',
      width: 120,
      render: (text, record) => {
        return(
          <span>
           <a href="#" title='开锁' onClick={this.openDoor.bind(this,record)}>开锁</a>
          </span>
        )
      }
    };
    let attrProps = {
      self: this,
      tableName: tableName,
      primaryKey: 'uuid',
      fixedTool: false,    // 固定按钮，不滚动
      buttons: null,
      btnPosition: 'top',
      rightButtons:null,
      operCol: operCol,
      tableForm: FormDef,
      editCol: false,
      editTable: false,
      defView: tableName,
      totalPage: this.state.openDoorRemotelySet.totalRow,
      currentPage: this.state.openDoorRemotelySet.startPage,
      onRefresh: this.onTableRefresh,
    };
    let tableProps = {
      rowSelection:{
        selectedRowKeys:this.state.selectedRowKeys,
        onChange:this.onChange,
        onSelect:this.tableSelect,
        onSelectAll:this.tableSelectAll
      },
      style:{
        marginTop:10
      }
    };
    let isVisible = this.state.isVisible;
    const hasSelected =this.state.selectedRows!=false?false:true;
    return (
        <div className="grid-page" style={{height:'100%'}}>
          <div className='code-wrap' style={{height:'100%', display:isVisible}}>
          {/* <ServiceMsg ref="mxgBox" svcList={['park/getParkDetailByParkUuid']} /> */}
            <div className='code-left'>
             <ParkMenuTree ref = {ref=>this.parkMenuTree = ref} onSelect={this.onSelectController}/>
            </div>
            <div className='code-right'>
              <DictTable  dataSource={recordSet} loading={this.state.loading} attrs={ attrProps } {...tableProps} />
              <div style={{marginTop:-56,marginLeft:20}}>
                    <Button onClick={this.openBatchDoor} key='一键开锁' disabled={hasSelected}>一键开锁</Button>
             </div>
            </div>
          </div>
          <OpenDoorLoginModal ref={ref=> this.openDoorModal = ref}  goBack={this.goBack} controllVisible={this.controllVisible} />
        </div>
    );
  }
});
OpenDoorRemotelyPage.contextTypes = {
  router: React.PropTypes.object.isRequired
};
module.exports = withRouter(OpenDoorRemotelyPage);
