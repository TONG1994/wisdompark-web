import React from 'react';
var Reflux = require('reflux');

var ControllorInfoActions = require('../action/ControllorInfoActions.js');
var ControllorInfoStore = require('../store/ControllorInfoStore');
let Utils = require('../../../../public/script/utils');
import { Select, Spin, message} from 'antd';
const Option = Select.Option;

var Door = React.createClass({
  getInitialState: function () {
    let opts = this.props.controlledDoors ? this.props.controlledDoors:[];
    let port = this.props.port;
    return {
      opts,
      port,
      loading: false,
      optData:{
        doorUuid:'',
        doorName:'',
      },
    };
  },

  showOptions: function () {
    let opts = this.props.controlledDoors;
    this.setOpts(opts);
  },
  setOpts:function(data){
    let port = this.props.port;
    let opts = Utils.deepCopyValue(data);
    if (opts === null || typeof (opts) === 'undefined') {
      opts = [];
    }
    if(port){
      for(var i=0;i<opts.length;i++){
        if(opts[i].doorUuid === port.doorUuid){
         opts[i].isDisabled = false;
         break;
        }
     }
    }
   this.setState({
     loading: false,
     opts
   });
  },
  componentDidMount: function () {
      this.showOptions();
  },
  onSelect:function(value, option){
    var dataArr  = this.state.opts;
    let oldOptData = this.state.optData;
    let optData = {};
    if(value === ''){
      optData = {
        doorUuid:'',
        doorName:'',
      };
    }else{
      for(var i in dataArr){
        if(value === dataArr[i].doorName){
          // dataArr[i].isDisabled=true;
          optData={
            doorUuid: dataArr[i].doorUuid,
            doorName:dataArr[i].doorName,
          };
          break;
        }
      }
    }
    let opts = Utils.deepCopyValue(dataArr);
    this.setState({optData, opts}, ()=>{
      if(this.props.onSelect){
            this.props.onSelect(oldOptData, this.state.optData,this.props.portType,this.state.opts);
      }
    });
   
  },
  render: function () {
    const {
            showCode,
            required,
            onSelect,
            mode,
            value,
            ...attributes
        } = this.props;

    var opts;
    if (showCode) {
      opts = this.state.opts.map((item, i) => {
        return <Option key={item.doorUuid} value={item.doorUuid} disabled={item.isDisabled}>{item.doorUuid}-{item.doorName}</Option>;
      });
    }
    else {
      opts = this.state.opts.map((item, i) => {
        return <Option style={{display: item.isDisabled ? 'none' : ''}} key={item.doorUuid} value={item.doorName} disabled={item.isDisabled}>{item.doorName}</Option>
      });
    }
    var obj;
    if (mode === 'multiple') {
      var list = value ? value.split(',') : [];
      obj =
                <Select mode="multiple" value={list} onSelect={this.selectMultiValue} onDeselect={this.deselectMultiValue} {...attributes}>
                    {opts}
                </Select>;
    }
    else {
      if (required) {
        obj = <Select value={value} onSelect={this.onSelect} {...attributes}>
                    {opts}
                </Select>;
      }
      else {
        obj = <Select value={value} onSelect={this.onSelect} {...attributes}>
                    <Option value='' key=''>请选择受控门</Option>
                    {opts}
                </Select>;
      }
    }

    return this.state.loading ? <Spin>{obj}</Spin> : obj;
  }
});

export default Door;
