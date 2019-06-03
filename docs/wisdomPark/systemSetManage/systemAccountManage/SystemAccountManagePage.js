/**
 *   Create by Malson on 2018/4/19
 */
import React from 'react';
let Reflux = require('reflux');
import { Button, Table, Icon, Modal, Input } from 'antd';
const Search = Input.Search;

let Common = require('../../../public/script/common');
let Utils = require('../../../public/script/utils');

let SystemAccountManageStore = require('./store/SystemAccountManageStore');
let SystemAccountManageAction = require('./action/SystemAccountManageAction');

//person
import SystemAccountManageModal from './components/SystemAccountManageModal';

import FormUtil from '../../../lib/Components/FormUtil';
import DictTable from '../../../lib/Components/DictTable';
const tableName = 'SystemAccountManageTable';
var FormDef = require('./components/SystemAccountManageForm.js');

// //数据
// let data = [];
// for(let i=0;i<9;i++){
//   data.push({
//     key:i,
//     username:'名称'+i,
//     name:'大江南北',
//     phone:'1889501910'+i,
//     ownpark:'园区'+i,
//     uuid:'3131'+i
//   })
// }

let SystemAccountManagePage = React.createClass({
  getInitialState: function () {
    return {
      SystemAccountManageSet: {
        recordSet:[],
        errMsg: '',
        // startPage: 1,
        // pageRow: 10,
        // totalRow: data.length,
      },
      settledCompany:{},
      loading: false,
      actionType:'',
    };
  },

  mixins: [Reflux.listenTo(SystemAccountManageStore, 'onServiceComplete')],
  onServiceComplete: function (data) {
      this.setState({loading:false});
      if(data.errMsg){
          this.setState({errMsg:data.errMsg});
          return;
      }
      if (data.operation === 'retrieve') {
          this.setState({
            SystemAccountManageSet: Object.assign({}, this.state.SystemAccountManageSet, data)
          });
      }else if(data.operation === 'create' || data.operation === 'update' || data.operation ==='remove'){
          this.handleQueryClick();
      }
  },

  handleQueryClick: function () {
    let obj={
          userType:'4'
    };
    if(obj){
      this.setState({ loading: true });
     // 根据条件调方法
     SystemAccountManageAction.retrieveSystemAccount(obj,this.state.SystemAccountManageSet.startPage,this.state.SystemAccountManageSet.pageRow);
    }
  },

  componentDidMount: function () {
      var dataSet = this.state.SystemAccountManageSet;
      var conf = FormUtil.getTableConf(tableName);
      dataSet.pageRow = (conf.page !== true) ? 0 : conf.pageRow;
      dataSet.startPage = (conf.page !== true) ? 0 : 1;
      this.handleQueryClick();
  },

  onTableRefresh: function (current, pageRow) {
    this.state.SystemAccountManageSet.startPage = current;
    this.state.SystemAccountManageSet.pageRow = pageRow;
    this.handleQueryClick();
  },

  reset:function () {
    this.handleQueryClick();
  },

  add:function () {
    this.setState({actionType:'add'});
    this.systemAccountManageModal.showModal();
    this.systemAccountManageModal.initEditData();
  },

  edit:function (record) {
    this.setState({actionType:'edit'});
    this.systemAccountManageModal.showModal();
    this.systemAccountManageModal.initEditData(record);
  },

  delete:function (record) {
    let $this = this;
    Modal.confirm({
      title: '删除确认',
      content: '您确定要执行该删除操作吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: function () {
        $this.setState({ loading: true });
        SystemAccountManageAction.deleteAccount(record.uuid);
      }
    });
  },

  render: function () {
    let operCol = {
      title: '操作',
      key: 'action',
      width: 70,
      render: (text, record) => {
        return (
          <span>
            {/* <a href="#" title='编辑' onClick={this.edit.bind(this,record)} ><Icon type="edit" /></a> */}
            <a href="#" title='删除' onClick={this.delete.bind(this,record)} className='btn-icon-margin'><Icon type="delete" /></a>
          </span>
        )
      }
    };
    //TODO display
    let leftButtons = [
      <Button icon={Common.iconAdd} title="添加园区管理员" type='primary' onClick={this.add}
              key='添加园区管理员'>添加园区管理员</Button>,
      <Button icon={Common.iconReset} title="重置" onClick={this.reset} className='btn-margin'
              key="重置"></Button>,
    ];
    let attrProps = {
      self: this,
      tableName: tableName,
      primaryKey: 'uuid',
      fixedTool: false,    // 固定按钮，不滚动
      buttons: leftButtons,
      btnPosition: 'top',
      operCol: operCol,
      tableForm: FormDef,
      editCol: false,
      editTable: false,
      defView: 'SystemAccountManageTable',
      totalPage: this.state.SystemAccountManageSet.totalRow,
      currentPage: this.state.SystemAccountManageSet.startPage,
      onRefresh: this.onTableRefresh,
    };
    let modalProps = {
      actionType:this.state.actionType
    };
    let recordSet = this.state.SystemAccountManageSet.recordSet;
    return (
        <div className="grid-page content-wrap">
          <DictTable dataSource={recordSet} loading={this.state.loading} attrs={ attrProps }/>
          <SystemAccountManageModal  ref={ref=>this.systemAccountManageModal=ref} {...modalProps}  />
        </div>
    );
  }
});

module.exports = SystemAccountManagePage;
