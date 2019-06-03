import React from 'react';
let Reflux = require('reflux');
import SystemAccountManageStore from '../store/SystemAccountManageStore';
import SystemAccountManageAction from '../action/SystemAccountManageAction';
import { Icon, Button, Input, AutoComplete } from 'antd';
const Option = AutoComplete.Option;

let Filter = React.createClass({
  getInitialState: function () {
    return {
      dataSource: [],
      errMsg:'',
      userData:[],
      value:''
    }
  },
  
  mixins: [Reflux.listenTo(SystemAccountManageStore, 'onServiceComplete')],
  onServiceComplete: function (data) {
      this.setState({loading:false});
      if(data.errMsg){
          this.setState({errMsg:data.errMsg});
          return;
      }
      if (data.operation === 'checkPhone') {
        this.setState({
          userData:data.recordSet,
          dataSource: data.recordSet.length ? new Array(data.recordSet[0].phone):['未匹配到电话号码'],
        })
      }
  },

  initData: function(systemAccountsPhone){
    if(!systemAccountsPhone){
      this.setState({
        dataSource:[],
        errMsg:'',
        userData:'',
        value:''
      })
    }else{
      this.setState({
        value: systemAccountsPhone,
      })
    }
  },

  handleMakeData: function(){

  },

  handleSearch : function(value){
    if(value.length<11){
      this.setState({
        value:value
      })
    }else if(value.length==11){
      this.setState({
        value:value,
        lastValue:value
      })

      // 调用后台接口
      let obj={object:{"phone":value}};
      SystemAccountManageAction.checkPhone(obj);
    }else{
      this.setState({
        value:this.state.lastValue
      })
    }
  },

  handleSelect: function(val){
    var userData  = this.state.userData;
    if(userData.length==0){
      this.setState({
        dataSource:[],
        value:''
      });
    }else{
      this.setState({
        dataSource:[],
        value:val,
      });
      this.props.onChange(userData);
    }
  },

  clear: function(){
    this.setState({
      errMsg:'',
      userData:'',
      value:''
    })
  },

  render:function(){
    const { dataSource } = this.state;
    return (
      <div style={{ width: 390 }}>
        <AutoComplete
          size="large"
          style={{ width: '100%'}}
          dataSource={dataSource}
          onSelect={this.handleSelect}
          onSearch={this.handleSearch}
          value={this.state.value}
        >
          <Input
            suffix={(
              <Icon type="search" />
            )}
          />
        </AutoComplete>
      </div>
    );
  },
});
module.exports=Filter;