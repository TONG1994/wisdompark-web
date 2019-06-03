
import React from 'react';
let Reflux = require('reflux');
import { Table, Icon, Modal, Input, Tabs, Select } from 'antd';
const Search = Input.Search;

let Common = require('../../../public/script/common');
let Utils = require('../../../public/script/utils');

let DoorLogsStore = require('./store/DoorLogsStore.js');
let DoorLogsActions = require('./action/DoorLogsActions');
import ExportExcel from './Components/ExportExcel';
import emitter from '../../lib/components/events';


// import AddBatchModal from './components/addBatchModal';
import Filter from './components/Filter';

import FormUtil from '../../../lib/Components/FormUtil';
import DictTable from '../../../lib/Components/DictTable';
const tableName = 'DoorLogsTable';
var FormDef = require('./components/DoorLogsForm');



let doorLogsPage = React.createClass({
  getInitialState: function () {
    return {
      settledCompany: {
        park: 'O-Park园区',
        tower: '',
      },
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
      key: '1',
      logNoList: [],
      disabled: true,
      display: 'none'
    };
  },
  mixins: [Reflux.listenTo(DoorLogsStore, 'onServiceComplete')],
  onServiceComplete: function (data) {
    if (data.operation == 'retrieve') {
      if (data.recordSet.length != 0) {
        this.setState({ display: 'block' });
      }else{
          this.setState({ display: 'none' });
      }
      this.setState({
        loading: false,
        personnelSet: data
      });
    }
  },

  onChange: (selectedRowKeys, selectedRows) => {
    let arr = [];
    selectedRows.map(item => {
      arr.push(item.logNo);
    });
    this.setState({ logNoList: arr });

  },
  getCheckboxProps: record => ({
    disabled: record.name === 'Disabled User', // 禁止选中
    name: record.name,
  }),

  handleQueryClick: function () {
    let obj = this.filter.getFilter();
    if (obj) {
      this.setState({ loading: true });
      DoorLogsActions.getAddress(obj, this.state.personnelSet.startPage, this.state.personnelSet.pageRow);
    }
  },
  //初始化
  componentDidMount: function () {
    var dataSet = this.state.personnelSet;
    var conf = FormUtil.getTableConf(tableName);
    dataSet.pageRow = (conf.page !== true) ? 0 : conf.pageRow;
    dataSet.startPage = (conf.page !== true) ? 0 : 1;
    this.handleQueryClick();
    this.eventEmitter = emitter.addListener('GetFilter', (msg)=>{
      let filter = this.getFilters();
      emitter.emit('SetFilter', JSON.stringify({filter}));
    });
  },
  componentWillUnmount:function(){
    emitter.removeListener('GetFilter', (msg)=>{

    });
  },
  //搜索
  filterSearch: function () {
    let obj = this.filter.getFilter();
    if (obj) {
      this.setState({ loading: true });
    }
  },
  //不写的话底部分页没有生成
  onTableRefresh: function (current, pageRow) {
    this.state.personnelSet.startPage = current;
    this.state.personnelSet.pageRow = pageRow;
    this.handleQueryClick();
  },
  //下载选中
  getFilter: function () {
    let obj = { logNoList: this.state.logNoList };
    return obj;
  },
  //下载所有
  getFilters: function () {
    if (this.filter) {
      let obj = this.filter.getFilter();
      return obj;
    }
  },
  render: function () {
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        let arr = [];
        selectedRows.map(item => {
          arr.push(item.logNo);
        });
        this.setState({ logNoList: arr });

        if (arr.length == '0') {
          this.setState({ disabled: true });
        } else {
          this.setState({ disabled: false });
        }
      },
      getCheckboxProps: this.getCheckboxProps
    };

    let leftButtons = [],
      operCol = '';

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
      defView: 'DoorLogsTable',
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
        <div className='content-wrap'>
          <Filter key='filter' ref={ref => this.filter = ref} filterSearch={this.filterSearch} />
        </div>
        <DictTable rowSelection={rowSelection} dataSource={recordSet} loading={this.state.loading} attrs={attrProps} locale={{ emptyText: '暂无数据' }} />
        <div style={{ position: 'absolute', left: '40px', bottom: '25px', display: this.state.display }}>
          <ExportExcel module='doorLogs' filter={this.getFilter()} title="导出选中" disabled={this.state.disabled} />
          <ExportExcel module='doorLogs' filter={this.getFilters()} title="导出所有" disabled={false} />
        </div>
      </div>
    );
  }
});

module.exports = doorLogsPage;
