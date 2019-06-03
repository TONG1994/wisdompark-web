
import React from 'react';
let Reflux = require('reflux');
import { Button, Table, Icon, Modal, Input, Tabs } from 'antd';
const Search = Input.Search;

let Common = require('../../../public/script/common');
let Utils = require('../../../public/script/utils');

let RegisteredUserStore = require('./store/RegisteredUserStore.js');
let RegisteredUserActions = require('./action/RegisteredUserActions');

// import AddBatchModal from './components/addBatchModal';
import Filter from './components/Filter';

import FormUtil from '../../../lib/Components/FormUtil';
import DictTable from '../../../lib/Components/DictTable';
const tableName = 'RegisteredUserTable';
var FormDef = require('./components/RegisteredUserForm');


let registeredUserPage = React.createClass({
  getInitialState: function () {
    return {
      personnelSet: {
        recordSet: [],
        errMsg: '',
        startPage: 1,
        pageRow: 10,
        totalRow: 0,
      },
      personnel: {},
      loading: false,
      filter: {},
      actionType: '',
      doorActionType: '',
      key: '1'
    };
  },
  mixins: [Reflux.listenTo(RegisteredUserStore, 'onServiceComplete')],
  onServiceComplete: function (data) {
    this.setState({
      loading: false,
      personnelSet: data
    });
  },
  handleQueryClick: function () {
    let obj = this.filter?this.filter.getFilter():{};
    obj.userType = 0;
    this.setState({ loading: true });
    console.log(obj);
    RegisteredUserActions.queryUser(obj, this.state.personnelSet.startPage, this.state.personnelSet.pageRow);
  },
  //初始化
  componentDidMount: function () {
    var dataSet = this.state.personnelSet;
    var conf = FormUtil.getTableConf(tableName);
    dataSet.pageRow = (conf.page !== true) ? 0 : conf.pageRow;
    dataSet.startPage = (conf.page !== true) ? 0 : 1;
    this.handleQueryClick();
  },
  //搜索
  filterSearch: function () {
    this.handleQueryClick();
  },

  onTableRefresh :function(current, pageRow){
    this.state.personnelSet.startPage = current;
    this.state.personnelSet.pageRow = pageRow;
    this.handleQueryClick();
  },

  render: function () {
    let leftButtons = [],
         operCol='';
   
    let attrProps = {
      self: this,
      tableName: tableName,
      primaryKey: 'uuid',
      fixedTool: false,    // 固定按钮，不滚动
      buttons: this.state.key === '3' ? leftButtons : null,
      btnPosition: 'top',
      //搜索框rightButtons,
      operCol: operCol,
      tableForm: FormDef,
      editCol: false,
      editTable: false,
      defView: 'RegisteredUserTable',
      totalPage: this.state.personnelSet.totalRow,
      currentPage: this.state.personnelSet.startPage,
      onRefresh: this.onTableRefresh,
    };
    let modalProps = {
      actionType: this.state.actionType
    };
    let doorModalProps = {
      doorActionType: this.state.doorActionType
    };
    let recordSet = this.state.personnelSet.recordSet;
    return (
        <div className="grid-page">
          <div style={{padding:'5px 10px', textAlign:'right', marginTop:'15px',marginBottom:'7px'}}>
            <Filter key='filter' ref={ref=>this.filter=ref}  filterSearch={this.filterSearch}/>
          </div>
          <DictTable dataSource={recordSet} loading={this.state.loading} attrs={ attrProps } locale={{emptyText:'暂无数据'}}/>
        </div>
    );
  }
});

module.exports = registeredUserPage;
