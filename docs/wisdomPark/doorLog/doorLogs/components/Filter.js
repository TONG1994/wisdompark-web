import React from 'react';
import { Button, Input, DatePicker, Select } from 'antd';
import Common from '../../../../public/script/common';
import moment from 'moment';
let DoorLogsStore = require('../store/DoorLogsStore.js');
let DoorLogsActions = require('../action/DoorLogsActions');
var Reflux = require('reflux');
const dateFormat = 'YYYY-MM-DD';
const Search = Input.Search;
const Option = Select.Option;
const { MonthPicker, RangePicker } = DatePicker;
let Utils = require('../../../../public/script/utils');

let Filter = React.createClass({
  getInitialState: function () {
    return {
      loading: false,
      recordSetBuilding: [],
      recordSetFloor: [],
      recordSetCell: [],
      recordSetDoor: [],
      buildingName: '',
      floorName: '',
      cellName: '',
      doorName: '',
      fromDate: '',
      toDate: '',
      hints: {},
      validRules: [],
      filterInfo: {
        key: 'userName'
      },
      dateString:[]
    }
  },
  getFilter: function () {
    if (Common.validator(this, this.state.filterInfo)) {
      let obj = this.state.filterInfo.value ?  { [this.state.filterInfo.key]: this.state.filterInfo.value } : {};
      if(this.state.buildingName){
        obj.buildingUuid = this.state.buildingName;
      }
      if(this.state.floorName){
        obj.floorUuid = this.state.floorName;
      }
      if(this.state.cellName){
        obj.cellUuid = this.state.cellName;
      }
      if(this.state.doorName){
        obj.doorNo = this.state.doorName;
      }
      if(this.state.dateString[0]){
        obj.fromDate = this.state.fromDate;
      }
      if(this.state.dateString[1]){
        obj.toDate = this.state.toDate;
      }
      return obj;
    }
  },
  mixins: [Reflux.listenTo(DoorLogsStore, 'onServiceComplete')],
  onServiceComplete: function (datas) {
    if (datas.operation == 'building') {
      this.setState({
        loading: false,
        recordSetBuilding: datas.recordSet,
        buildingName: '',
        floorName: '',
        cellName: '',
        doorName: '',
      });

    }
    if (datas.operation == 'floor') {
      this.setState({
        loading: false,
        recordSetFloor: datas.recordSet,
        floorName: '',
        cellName: '',
        doorName: '',
      });
    }
    if (datas.operation == 'cell') {
      this.setState({
        loading: false,
        recordSetCell: datas.recordSet,
        cellName: '',
        doorName: '',
      });
    }
    if (datas.operation == 'door') {
      this.setState({
        loading: false,
        recordSetDoor: datas.recordSet,
        doorName: '',
      });
    }
  },
  //初始化
  componentDidMount: function () {
    this.initDate();
  },
  initDate: function () {
    this.setState({ loading: true });
    DoorLogsActions.getBuildingByPark({ 'active': '1', 'parkUuid': '127V0A3L79AVP001' });
    //DoorLogsActions.getFloorByBuilding({ 'active': '1', 'buildingUuid': '12811LEP64QSS001' });
    //DoorLogsActions.getCellByFloor({ 'active': '1', 'floorUuid': '12811LG9FHQSS001' });
    //DoorLogsActions.getDoorByCell({ 'active': '1', 'cellUuid': '12811LGLS9QSS001' });
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
  search: function () {
    let obj = this.getFilter();
    this.setState({ loading: true });
    DoorLogsActions.getAddress(obj, '1', '10');
  },
  change: function (e) {
    let value = e.target.value;
    this.setState({ filterInfo: Object.assign({}, this.state.filterInfo, { value }) });
  },
  //楼宇切换
  handleTower: function (value) {
    this.setState({ buildingName: value });
    DoorLogsActions.getFloorByBuilding({ 'active': '1', 'buildingUuid': value });
    this.setState({ recordSetFloor: [] });
    this.setState({ recordSetCell: [] });
    this.setState({ recordSetDoor: [] });
  },
  //楼层切换
  handleFloor: function (value) {
    this.setState({ floorName: value });
    DoorLogsActions.getCellByFloor({ 'active': '1', 'floorUuid': value });
    this.setState({ recordSetCell: [] });
    this.setState({ recordSetDoor: [] });
  },
  //单元切换
  handleCell: function (value) {
    this.setState({ cellName: value });
    DoorLogsActions.getDoorByCell({ 'active': '1', 'cellUuid': value });
    this.setState({ recordSetDoor: [] });
  },
  //单元门切换
  handleDoor: function (value) {
    this.setState({ doorName: value });
  },
  //日期切换
  handleDate: function (value, dateString) {
    this.setState({
       fromDate: dateString[0] + ' 00:00:00', 
       toDate: dateString[1] + ' 23:59:59' ,
       dateString});
  },
  render: function () {
    let { key, value } = this.state.filterInfo;
    let array1 = this.state.recordSetBuilding;
    let array2 = this.state.recordSetFloor;
    let array3 = this.state.recordSetCell;
    let array4 = this.state.recordSetDoor;
    const {
      required,
      ...attributes,
    } = this.props;
    return (
      <div className='toolbar-table' style={{ textAlign: 'right' }}>
        <Select {...this.props} name='tower' value={this.state.buildingName} style={{ width: 110, }} onChange={this.handleTower}>
          <Select.Option value=''>选择楼宇</Select.Option>
          {
            array1.map((lvl, i) => {
              return <Select.Option key={lvl.uuid} value={lvl.uuid}>{lvl.buildingName}</Select.Option>
            })
          }
        </Select>
        <Select {...this.props} className='btn-margin' name='floor' value={this.state.floorName} style={{ width: 110, }} onChange={this.handleFloor}>
          <Select.Option value=''>选择楼层</Select.Option>
          {
            array2.map((lvl, i) => {
              return <Select.Option key={lvl.uuid} value={lvl.uuid}>{lvl.floorName}</Select.Option>
            })
          }
        </Select>
        <Select {...this.props} className='btn-margin' name="cell" value={this.state.cellName} style={{ width: 110, }} onChange={this.handleCell}>
          <Select.Option value=''>选择单元</Select.Option>
          {
            array3.map((lvl, i) => {
              return <Select.Option key={lvl.uuid} value={lvl.uuid}>{lvl.cellName}</Select.Option>
            })
          }
        </Select>
        <Select {...this.props} className='btn-margin' name='door' value={this.state.doorName} style={{ width: 110, }} onChange={this.handleDoor}>
          <Select.Option value=''>选择门禁</Select.Option>
          {
            array4.map((lvl, i) => {
              return <Select.Option key={lvl.uuid} value={lvl.uuid}>{lvl.doorName}</Select.Option>
            })
          }
        </Select>
        <RangePicker style={{ width: 280 }} className='btn-margin' format='YYYY-MM-DD' onChange={this.handleDate} />
        <Select value={key} className='btn-margin' style={{ width: 120 }} onChange={this.selectChange}>
          <Option key='userName' value="userName">姓名</Option>
          <Option key="phone" value="phone">手机号码</Option>
          <Option key="companyName" value="companyName">公司名称</Option>
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
