/**
 *   Create by Malson on 2018/4/26
 */
import React from 'react';
import { Button,Input,Select  } from 'antd';
let Common = require('../../../../public/script/common');
const Search = Input.Search;
const Option = Select.Option;

let Filter = React.createClass({
  getInitialState: function () {
    return {
      hints: {},
      validRules: [],
      filterInfo: {
        key:'companyName'
      },
    }
  },
  getFilter:function () {
    if(Common.validator(this,this.state.filterInfo)){
     // let obj = Object.assign(this.state.filterInfo);
        let obj = {[this.state.filterInfo.key]:this.state.filterInfo.value,parkUuid:Common.getSelectedParkUuid()};
      return obj;
    }
  },
  componentDidMount: function () {
  },
  clear:function(){
    let  filterInfo = {
      key:'companyName',
      value:''
    };
    this.setState({filterInfo});
  },
  selectChange:function (key) {
    this.setState({filterInfo:Object.assign({},this.state.filterInfo,{key,value:''})});
  },
  search:function (value) {
      this.props.filterSearch();
  },
  change:function (e) {
    let value = e.target.value;
    this.setState({filterInfo:Object.assign({},this.state.filterInfo,{value})});
  },
  render: function () {
    let { key,value } = this.state.filterInfo;
    return (
        <div>
          <Select value={key} style={{ width: 120 }} onChange={this.selectChange}>
            <Option key="companyName" value="companyName">公司名称</Option>
            {/*<Option key="companyCode" value="companyCode">公司编号</Option>*/}
            {/*<Option value="place">所在位置</Option>*/}
          </Select>
          <Search
              value={value}
              placeholder="请输入企业名称"
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