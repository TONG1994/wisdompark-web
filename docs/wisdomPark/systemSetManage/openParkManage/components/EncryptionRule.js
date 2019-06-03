import React from "react";
import '../style/index.scss';
import { Row, Col , Input , Button } from 'antd';
import { width } from "window-size";
let Reflux = require('reflux');
let OpenParkManageStore = require('../store/OpenParkManageStore');
let OpenParkManageActions = require('../action/OpenParkManageActions');

let EncryptionRule = React.createClass({
  
  getInitialState: function() {
    return {
      dataSet:[],
      errMsg:'',
    };
  },

  mixins: [Reflux.listenTo(OpenParkManageStore, 'onServiceComplete')],
  onServiceComplete:function(data){
    if(data.errMsg){
      this.setState({errMsg:data.errMsg});
      return;
    }
    if (data.operation === 'getRandomNum') {
      this.setState({
        dataSet:data.recordSet
      })
      this.props.onChange(data.recordSet);
    }
  },

  // 第一次加载
  componentDidMount: function () {
    this.initData();
  },

  initData:function(data){
    if(data){
      this.setState({
        dataSet: data.split(",")
      })
    }else{
      this.setState({
        dataSet: this.props.value.split(",")
      })
    }
  },

  getRandomData:function(){
    OpenParkManageActions.getRandomData();
  },

  clear: function(){
    // this.setState({
    //   dataSet:[]
    // })
  },

  render(){
    return(
      <div >
        <Input value= {this.state.dataSet[0]} style={{width:'45px', textAlign:'center'}} size="large"/>
        <Input value= {this.state.dataSet[1]} style={{width:'45px', marginLeft:'10px' , textAlign:'center'}} size="large"/>
        <Input value= {this.state.dataSet[2]} style={{width:'45px', marginLeft:'10px' , textAlign:'center'}} size="large"/>
        <Input value= {this.state.dataSet[3]} style={{width:'45px', marginLeft:'10px' , textAlign:'center'}} size="large"/>
        <Input value= {this.state.dataSet[4]} style={{width:'45px', marginLeft:'10px' , textAlign:'center'}} size="large"/>
      {this.props.actionType=='update'?(
        <a style={{marginLeft:'10px'}} onClick={this.getRandomData}>随机一组</a>):''
      }
      </div>
    )
  }
});
export default EncryptionRule;