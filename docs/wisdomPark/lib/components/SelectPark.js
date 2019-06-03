import React from 'react';
var Reflux = require('reflux');

var SelectParkActions = require('../action/SelectParkActions.js');
var SelectParkStore = require('../store/SelectParkStore');
let Utils = require('../../../public/script/utils');
let Common = require('../../../public/script/common');
import { Select, Spin, message} from 'antd';
const Option = Select.Option;
import emitter from './events';
var Park = React.createClass({
  getInitialState: function () {
    return {
      opts: [],
      loading: false,
      optData:{
        uuid:'',
        parkName:'',
        parkLocation:''
      }
    };
  },

  showOptions: function (opts) {
    var values = opts;
    if (values === null || typeof (values) === 'undefined') {
      values = [];
    }

    this.setState({
      opts: values,
      loading: false
    });
  },
  mixins: [Reflux.listenTo(SelectParkStore, 'onServiceComplete')],
  onServiceComplete: function(data) {
    if(data.errMsg){
      message.destroy();
       message.warn(data.errMsg);
       return;
    }
    let selectParkData = Utils.deepCopyValue(data.recordSet);
    window.selectParkData = selectParkData;
    window.sessionStorage.setItem('selectParkData', JSON.stringify({selectParkData}));
    this.setState({
      loading: false,
      opts: data.recordSet,
    });
    this.showOptions(data.recordSet);
    emitter.emit('TopBarCallMe',JSON.stringify({selectParkData}));
  },
  componentWillMount: function () {
     this.init();
  },
  init:function(){
    // let data = Common.getParkList();
    // if(data){
    //   let parkList = data.selectParkData ? data.selectParkData :[];
    //   this.setState({
    //     loading: false,
    //     opts: parkList,
       
    //   },()=>{
    //     this.showOptions(parkList);
    //     emitter.emit('TopBarCallMe','');
    //   });
      
    // }else{
    //   this.state.loading = true;
    //   SelectParkActions.retrieve({});
    // }
    this.state.loading = true;
    SelectParkActions.retrieve({});
  },
  onSelect:function(value, option){
    var dataArr  = this.state.opts;
    if(value === ''){
      this.state.optData = {
        uuid:'',
        parkName:'',
        parkLocation:''
      };
    }else{
      for(var i in dataArr){
        let optData = {};
        if(value === dataArr[i].uuid){
          this.state.optData = dataArr[i];
          optData={
            uuid: dataArr[i].uuid,
            parkName:dataArr[i].parkName,
            parkLocation:dataArr[i].parkLocation
          };
          this.setState({optData});
          break;
        }
      }
      
    }
    if(this.props.onSelect){
      this.props.onSelect(this.state.optData);
    }
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
        return <Option key={item.uuid} value={item.uuid}>{item.uuid}-{item.parkName}</Option>;
      });
    }
    else {
      opts = this.state.opts.map((item, i) => {
        return <Option key={item.uuid} value={item.uuid}>{item.parkName}</Option>;
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
                    {/* <Option value=''>--</Option> */}
                    {opts}
                </Select>;
      }
    }

    return this.state.loading ? <Spin>{obj}</Spin> : obj;
  }
});

export default Park;
