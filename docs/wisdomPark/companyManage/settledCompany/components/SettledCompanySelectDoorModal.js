/**
 *   Create by Malson on 2018/4/25
 */
import React from 'react';
let Reflux = require('reflux');
import { Form, Modal, Spin } from 'antd';
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
let Common = require('../../../../public/script/common');
let Utils = require('../../../../public/script/utils');

let SettledCompanyStore = require('../store/SettledCompanyStore.js');
let SettledCompanyActions = require('../action/SettledCompanyActions');

let FormDef = require('./SettledCompanyForm');

let SettledCompanyDoorModal = React.createClass({
  getInitialState: function () {
    return {
      loading: false,
      modal: false,
      settledCompanyDoor: {},
      hints: {},
      validRules: [],
      park:[],
      building:[],
      floor:[],
    };
  },

  mixins: [Reflux.listenTo(SettledCompanyStore, 'onServiceComplete'), ModalForm('settledCompanyDoor')],
  onServiceComplete: function (data) {
    this.setState({loading:false});
    if(data.errMsg){
      this.setState({errMsg:data.errMsg});
      return;
    }
    if (this.state.modal && data.operation === 'getSettledCompanySelectDoors') {
         //0园区，1楼宇，2楼层，3单元，4房间
        // attributionCategory == 0 园区
        // parkName
        // 门doorName   property 0公有
        //
        // attributionCategory == 1楼宇
        // parkName，buildingName
        // 门doorName property 0公有
        //
        // attributionCategory == 2楼层
        // parkName，buildingName，floorName
        // cellName +  doorName + property 0公有
        //
        // attributionCategory == 3单元
        // parkName，buildingName，floorName
        // cellName +  doorName + property 0公有
        //
        // attributionCategory == 4房间
        // parkName，buildingName，floorName
        // cellName +  doorName + property 0公有
        let park = this.state.park;
        let parkName = [];
        let building = this.state.building;
        let buildingName = [];
        let floor = this.state.floor;
        let floorName = [];
        let floors = this.state.floors; // level == 2
        let floorNames = [];
        let floorss = this.state.floorss;// level == 3
        let floorNamess = [];
        let dataArray  = data.recordSet.list;
        dataArray.map(item=>{
            let property = item.property == '0'?'公有':'私有';
            let door = item.doorName +'-'+ property;
            let pName = item.parkName;
            let bName = item.buildingName;
            let fName = item.floorName;
          if(item.attributionCategory == '0'){
            if(parkName.indexOf(pName)==-1){
                //当前的parkName在park中不存在
                park.push({'parkName':item.parkName,'children':[door]});
                parkName.push(item.parkName);
            }else{
                let index = parkName.indexOf(pName);
                park[index].children.push(door)
            }
          }else if(item.attributionCategory == '1'){
              if(buildingName.indexOf(bName)==-1){
                  //当前的parkName在park中不存在
                  let str = item.parkName+'-'+item.buildingName;
                  building.push({'buildingName':str,'children':[door]});
                  buildingName.push(item.buildingName);
              }else{
                  let index = buildingName.indexOf(bName);
                  building[index].children.push(door)
              }
          }else if(item.attributionCategory == '4'){
              if(floorName.indexOf(fName)==-1){
                  //当前的parkName在park中不存在
                  let str = item.parkName+'-'+item.buildingName+'>'+item.floorName;
                  floor.push({'floorName':str,'children':[item.cellName+'-'+door]});
                  floorName.push(item.floorName);
              }else{
                  let index = floorName.indexOf(fName);
                  floor[index].children.push(item.cellName+'-'+door)
              }
          }else if(item.attributionCategory == '2'){
              let cellName = item.cellName == null ? '' : (item.cellName+'-');
                if(floorNames.indexOf(fName)==-1){
                    //当前的parkName在park中不存在
                    let str = item.parkName+'-'+item.buildingName+'>'+item.floorName;
                    floors.push({'floorName':str,'children':[cellName+door]});
                    floorNames.push(item.floorName);
                }else{
                    let index = floorNames.indexOf(fName);
                    floors[index].children.push(item.cellName+'-'+door)
                }
            }else if(item.attributionCategory == '3'){
              let cellName = item.cellName == null ? '' : (item.cellName+'-');
                if(floorNamess.indexOf(fName)==-1){
                    //当前的parkName在park中不存在
                    let str = item.parkName+'-'+item.buildingName+'>'+item.floorName;
                    floorss.push({'floorName':str,'children':[cellName+door]});
                    floorNamess.push(item.floorName);
                }else{
                    let index = floorNamess.indexOf(fName);
                    floorss[index].children.push(item.cellName+'-'+door)
                }
            }
        });
        this.setState({park,building,floor,floors,floorss});
    }
  },
  componentDidMount: function () {
    this.state.validRules = FormDef.getSettledCompanyFormRule(this);
  },
  showModal:function () {
    this.clear();
    this.setState({modal:true});
  },
  initEditData:function (dataArrays) {
    //this.state.hints = {};
    //Utils.copyValue(settledCompanyDoor, this.state.settledCompanyDoor);
    // this.setState({
    //   loading: false,
    // });
    if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
      this.refs.mxgBox.clear();
    }
      let park = this.state.park;
      let parkName = [];
      let building = this.state.building;
      let buildingName = [];
      let floor = this.state.floor;
      let floorName = [];
      let dataArray  = dataArrays;
      dataArray.map(item=>{
          let property = item.property == '0'?'公有':'私有';
          let door = item.doorName +'-'+ property;
          let pName = item.parkName;
          let bName = item.buildingName;
          let fName = item.floorName;
          if(item.attributionCategory == '0'){
              if(parkName.indexOf(pName)==-1){
                  //当前的parkName在park中不存在
                  park.push({'parkName':item.parkName,'children':[door]});
                  parkName.push(item.parkName);
              }else{
                  let index = parkName.indexOf(pName);
                  park[index].children.push(door)
              }
          }else if(item.attributionCategory == '1'){
              if(buildingName.indexOf(bName)==-1){
                  //当前的parkName在park中不存在
                  let str = item.parkName+'-'+item.buildingName;
                  building.push({'buildingName':str,'children':[door]});
                  buildingName.push(item.buildingName);
              }else{
                  let index = buildingName.indexOf(bName);
                  building[index].children.push(door)
              }
          }else if(item.attributionCategory == '4' || item.attributionCategory == '2' || item.attributionCategory == '3'){
              let cellName = item.cellName == null ? '' : (item.cellName+'-');
              if(floorName.indexOf(fName)==-1){
                  //当前的parkName在park中不存在
                  let str = item.parkName+'-'+item.buildingName+'>'+item.floorName;
                  floor.push({'floorName':str,'children':[cellName+door]});
                  floorName.push(item.floorName);
              }else{
                  let index = floorName.indexOf(fName);
                  floor[index].children.push(cellName+door)
              }
          }
      });
      this.setState({park,building,floor,loading: false,});


  },

  clear: function () {
    FormDef.initSettledCompanyForm(this.state.settledCompanyDoor);
    // FIXME 输入参数，对象初始化
    this.state.hints = {};
    this.setState({loading:false,park:[],building:[],floor:[]});
    if (!this.state.modal && typeof (this.refs.mxgBox) !== 'undefined') {
      this.refs.mxgBox.clear();
    }
  },

  onClickSave: function () {
    // if (Common.formValidator(this, this.state.settledCompanyDoor)) {
    //   this.setState({ loading: true });
    //   SettledCompanyDoorActions.createSettledCompanyDoor(this.state.settledCompanyDoor);
    // }
  },

  render: function () {
    let title = this.props.doorActionType === 'check'?'查看门禁权限': this.props.doorActionType ==='edit'?'编辑门禁权限':'模态框';

    return (
      <Modal
        visible={this.state.modal} width={570} title={title} maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
        footer={null}
      >
          {this.state.loading ? <Spin></Spin>:this.state.park.length==0&&this.state.building==0&&this.state.floor==0  ?<span>未设置门禁权限</span>:
        <Form layout='horizontal' style={{height:330,overflow:'auto'}}>
            {this.state.park.map((item,index)=>{
              return <span key={index}>{item.parkName}<br/>
                  {item.children.map((item,index)=>{
                      return <div style={{border:'1px solid #6495ED',height:'40px',display:'inline-block',marginLeft:'20px',marginTop:'10px'}} key={index}><div style={{paddingLeft:10,paddingTop:8,paddingRight:15,color:'#6495ED'}}>{item}</div></div>
                  })}<br/><br/></span>

            })}
            {this.state.building.map((item,index)=>{
                return <span key={index}>{item.buildingName}<br/>
                    {item.children.map((item,index)=>{
                        return <div style={{border:'1px solid #6495ED',height:'40px',display:'inline-block',marginLeft:'20px',marginTop:'10px'}} key={index}><div style={{paddingLeft:10,paddingTop:8,paddingRight:15,color:'#6495ED'}}>{item}</div></div>
                    })}<br/><br/></span>
             })}
            {this.state.floor.map((item,index)=>{
                return <span key={index}>{item.floorName}<br/>
                    {item.children.map((item,index)=>{
                        return <div style={{border:'1px solid #6495ED',height:'40px',display:'inline-block',marginLeft:'20px',marginTop:'10px'}} key={index}><div style={{paddingLeft:10,paddingTop:8,paddingRight:15,color:'#6495ED'}}>{item}</div></div>
                    })}<br/><br/></span>
            })}
        </Form>}
      </Modal>
    );
  }
});

export default SettledCompanyDoorModal;
