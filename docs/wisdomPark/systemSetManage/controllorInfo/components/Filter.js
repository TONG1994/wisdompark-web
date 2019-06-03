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
      value:''
    }
  },
  getFilter:function () {
    return {
      value:this.state.value
    };
  },
  componentDidMount: function () {
  },
  clear:function(){
    this.setState({value:''});
  },
  search:function (value) {
      this.props.filterSearch();
  },
  change:function (e) {
    let value = e.target.value;
    this.setState({
      value
    });
  },
  render: function () {
    let value = this.state.value;
    return (
        <div>
          <Search
              value={value}
              placeholder="请输入控制器IP"
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