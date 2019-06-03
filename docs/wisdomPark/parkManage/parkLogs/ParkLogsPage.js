
import React from 'react';
let Reflux = require('reflux');
import { Button, Table, Icon, Modal, Input, Tabs, DatePicker } from 'antd';
const Search = Input.Search;

let Common = require('../../../public/script/common');
let Utils = require('../../../public/script/utils');

let ParkLogsStore = require('./store/ParkLogsStore.js');
let ParkLogsActions = require('./action/ParkLogsActions');

import UnitnumberSelect from '../../lib/components/unitnumberSelect';
import moment from 'moment';


// import AddBatchModal from './components/addBatchModal';
import Filter from './components/Filter';

import FormUtil from '../../../lib/Components/FormUtil';
import DictTable from '../../../lib/Components/DictTable';
const tableName = 'ParkLogsTable';
var FormDef = require('./components/ParkLogsForm');

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  getCheckboxProps: record => ({
    disabled: record.name === 'Disabled User', // 禁止选中
    name: record.name,
  }),
};

let parkLogsPage = React.createClass({
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
      parkActionType: '',
      key: '1'
    };
  },
  mixins: [Reflux.listenTo(ParkLogsStore, 'onServiceComplete')],
  onServiceComplete: function (data) {
    this.setState({
      loading: false,
      personnelSet: data
    });
  },
  handleQueryClick: function () {
    let obj = this.filter.getFilter();
    if (obj) {
      this.setState({ loading: true });
      ParkLogsActions.getAddress(obj, this.state.personnelSet.startPage, this.state.personnelSet.pageRow);
    }
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
    let obj = this.filter.getFilter();
    if (obj) {
      this.setState({ loading: true });

      obj.userType = this.state.key;
      ParkLogsActions.getAddress(obj, this.state.personnelSet.startPage, this.state.personnelSet.pageRow);
    }
  },
  //不写的话底部分页没有生成
  onTableRefresh: function (current, pageRow) {
    this.state.personnelSet.startPage = current;
    this.state.personnelSet.pageRow = pageRow;
    this.handleQueryClick();
  },
  handleTower: function (val, e) {
    let building = e.props.children;
    let settledCompany = Object.assign({}, this.state.settledCompany);
    settledCompany.tower = val;
    settledCompany.floor = [];
    settledCompany.unitnumber = [];
    //this.unitnumber.rest();
    //Validator.validator(this, {'tower':val}, 'tower');
    this.setState({ settledCompany, building }, () => {
      //this.floorSelect.initDate();
    });
  },
  //设置起止时间
  getDate: function () {
    var date = new Date;
    return { "fromDate": date.getFullYear() + '/' + date.getMonth() + '/' + date.getDate(), "toDate": date.toLocaleDateString() }
  },
  render: function () {
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
      defView: 'ParkLogsTable',
      totalPage: this.state.personnelSet.totalRow,
      currentPage: this.state.personnelSet.startPage,
      onRefresh: this.onTableRefresh,
    };
    let modalProps = {
      actionType: this.state.actionType
    };
    let parkModalProps = {
      parkActionType: this.state.parkActionType
    };
    let recordSet = this.state.personnelSet.recordSet;
    return (
      <div className="grid-page">
        <div className="content-wrap">
          <div className='toolbar-table' style={{ textAlign: 'right' }}>
            <Filter key='filter' ref={ref => this.filter = ref} filterSearch={this.filterSearch} />
          </div>
        </div>
        <DictTable dataSource={recordSet} loading={this.state.loading} attrs={attrProps} locale={{ emptyText: '暂无数据' }} />
      </div>
    );
  }
});

module.exports = parkLogsPage;
