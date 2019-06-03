/**
 *   Create by Malson on 2018/4/26
 */
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
      placeholder:'请输入姓名',
      filterInfo: {
        key:'userName,姓名'
      },
    }
  },
  getFilter:function () {
    if(Common.validator(this,this.state.filterInfo)){
      //let obj = Object.assign(this.state.filterInfo);
      let obj = {[this.state.filterInfo.key.split(',')[0]]:this.state.filterInfo.value};
      return obj;
    }
  },
  componentDidMount: function () {
  },
  clear:function(){
    let  filterInfo = {
      key:'userName,姓名',
      value:''
    };
    this.setState({filterInfo,placeholder:'请输入姓名',});
  },
  selectChange:function (key) {
    this.setState({filterInfo:Object.assign({},this.state.filterInfo,{key,value:''}),placeholder:'请输入'+key.split(',')[1]});
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
            <Option key='userName,姓名'>姓名</Option>
            <Option key="userCode,人员编号">人员编号</Option>
            <Option key="phone,手机号码">手机号码</Option>
            <Option key="companyName,所属公司">所属公司</Option>
          </Select>
          <Search
              value={value}
              placeholder={this.state.placeholder}
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