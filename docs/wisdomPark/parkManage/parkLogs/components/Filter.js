import React from 'react';
import { Button, Input, Select, DatePicker } from 'antd';
import Common from '../../../../public/script/common';
const Search = Input.Search;
const Option = Select.Option;
const { MonthPicker, RangePicker } = DatePicker;
let ParkLogsActions = require('../action/ParkLogsActions');

let Filter = React.createClass({
  getInitialState: function () {
    return {
      hints: {},
      validRules: [],
      filterInfo: {
        key: 'accountName'
      },
    }
  },
  getFilter: function () {
    if (Common.validator(this, this.state.filterInfo)) {
      //let obj = Object.assign(this.state.filterInfo);
      let obj = { [this.state.filterInfo.key]: this.state.filterInfo.value };
      return obj;
    }
  },
  componentDidMount: function () {
  },
  clear: function () {
    let filterInfo = {
      key: 'userName',
      value: ''
    };
    this.setState({ filterInfo });
  },
  selectChange: function (key) {
    this.setState({ filterInfo: Object.assign({}, this.state.filterInfo, { key, value: '' }) });
  },
  search: function (value) {
    //this.props.filterSearch();
    let obj = this.getFilter();
    obj.fromDate = this.state.fromDate;
    obj.toDate = this.state.toDate;
    this.setState({ loading: true });
    ParkLogsActions.getAddress(obj, '1', '10');
  },
  change: function (e) {
    let value = e.target.value;
    this.setState({ filterInfo: Object.assign({}, this.state.filterInfo, { value }) });
  },
  //日期切换
  handleDate: function (value, dateString) {
    this.setState({ fromDate: dateString[0] + ' 00:00:00' });
    this.setState({ toDate: dateString[1] + ' 23:59:59' });
  },

  render: function () {
    let { key, value } = this.state.filterInfo;
    return (
      <div>
        <RangePicker format='YYYY-MM-DD' onChange={this.handleDate} />
        <Select className='btn-margin' value={key} style={{ width: 120 }} onChange={this.selectChange}>
          <Option key='accountName' value="accountName">操作账户</Option>
          <Option key='moduleName' value="moduleName">操作模块</Option>
          <Option key="operation" value="operation">操作类型 </Option>
        </Select>
        <Search
          value={value}
          placeholder="输入内容"
          onSearch={this.search}
          style={{ width: 200 }}
          className='btn-margin'
          onChange={this.change}
        />
      </div>
    );
  }
});

module.exports = Filter;
