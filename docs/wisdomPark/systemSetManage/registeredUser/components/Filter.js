import React from 'react';
import { Button,Input,Select  } from 'antd';
import Common from '../../../../public/script/common';
const Search = Input.Search;
const Option = Select.Option;

let Filter = React.createClass({
  getInitialState: function () {
    return {
      hints: {},
      validRules: [],
      filterInfo: {
        key:'userName',
        value:''
      },
    }
  },
  getFilter:function () {
    if(Common.validator(this,this.state.filterInfo)){
      //let obj = Object.assign(this.state.filterInfo);
      let obj = {[this.state.filterInfo.key]:this.state.filterInfo.value};
      return obj;
    }
  },
  componentDidMount: function () {
  },
  clear:function(){
    let  filterInfo = {
      key:'userName',
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
            <Option key='userName' value="userName">姓名</Option>
            <Option key="phone" value="phone">手机号码</Option>
            {/* <Option key="companyName" value="companyName">所属公司</Option> */}
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
