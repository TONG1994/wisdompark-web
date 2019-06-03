
import React from 'react';
let Reflux = require('reflux');
import { Button, Table, Icon, Modal, Input, Tabs } from 'antd';
const Search = Input.Search;

let Common = require('../../../public/script/common');
let Utils = require('../../../public/script/utils');

let LogManageStore = require('./store/LogManageStore');
let LogManageActions = require('./action/LogManageActions');

// import AddBatchModal from './components/addBatchModal';
import Filter from './components/Filter';

import FormUtil from '../../../lib/Components/FormUtil';
import DictTable from '../../../lib/Components/DictTable';
const tableName = 'LogManageTable';
var FormDef = require('./components/LogManageForm');


let LogManage = React.createClass({
  getInitialState: function () {
    return {
      logManageSet: {
        recordSet: [],
        errMsg: '',
      },
      objFilter:{
        grade:''
      },
      loading: false,
      filter: {},
      actionType: '',
      // selectedRowKeys: []
    };
  },
  mixins: [Reflux.listenTo(LogManageStore, 'onServiceComplete')],
  onServiceComplete: function (data) {
    this.setState({
      loading: false,
      logManageSet: Object.assign({},this.state.logManageSet,data)
    });
  },
  handleQueryClick: function () {
    this.setState({ loading: true });
    LogManageActions.queryUser(this.state.objFilter,this.state.logManageSet.startPage, this.state.logManageSet.pageRow);
  },

  //初始化
  componentDidMount: function () {
    var dataSet = this.state.logManageSet;
    var conf = FormUtil.getTableConf(tableName);
    dataSet.pageRow = (conf.page !== true) ? 0 : conf.pageRow;
    dataSet.startPage = (conf.page !== true) ? 0 : 1;
    this.handleQueryClick();
  },

  //搜索
  makeSearch: function (value) {
    let obj={};
    switch(value.selectValue){
      case 'accountName':
        obj.accountName=value.searchValue;
        break;
      case 'operation':
        obj.operation=value.searchValue;
        break;
      case 'moduleName':
        obj.moduleName=value.searchValue;
        break;
    }
    if(value.startValue && value.endValue){
      obj.fromDate=value.startValue.format('YYYY-MM-DD')+" 00:00:00";
      obj.toDate=value.endValue.format('YYYY-MM-DD')+" 24:00:00";
      if(obj.fromDate>obj.toDate){
        Common.errMsg("日期选择错误");
        return;
      }
    }else if(value.startValue && !value.endValue){
      obj.fromDate=value.startValue.format('YYYY-MM-DD')+" 00:00:00";
    }else if(!value.startValue && value.endValue){
      obj.toDate=value.endValue.format('YYYY-MM-DD')+" 24:00:00";
    }
    obj.grade='';
    this.setState({
      objFilter: Object.assign({},this.state.objFilter,obj),
      loading: true
    })
    LogManageActions.queryUser(obj,this.state.logManageSet.startPage, this.state.logManageSet.pageRow);
  },
  

  onTableRefresh: function(current,pageRow){
    this.state.logManageSet.startPage = current;
    this.state.logManageSet.pageRow = pageRow;
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
      defView: 'LogManageTable',
      totalPage: this.state.logManageSet.totalRow,
      currentPage: this.state.logManageSet.startPage,
      onRefresh: this.onTableRefresh,
    };
    let {recordSet} = this.state.logManageSet;
    return (
        <div className="grid-page logManage">
          <div style={{padding:'5px 10px', textAlign:'right', marginTop:'15px',marginBottom:'7px'}}>
            <Filter key='filter' ref={ref=>this.filter=ref}  onChange={this.makeSearch} />
          </div>
          <DictTable dataSource={recordSet} loading={this.state.loading}  attrs={ attrProps } locale={{emptyText:'暂无数据'}}/>
        </div>
    );
  }
});

module.exports = LogManage;
