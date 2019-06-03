/**
 *   Create by Malson on 2018/4/25
 */
import React from 'react';
let Reflux = require('reflux');
import { Form, Modal, Button, Checkbox,Spin } from 'antd';
const CheckboxGroup = Checkbox.Group;
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
let Common = require('../../../../public/script/common');
let Utils = require('../../../../public/script/utils');

let SettledCompanyStore = require('../store/SettledCompanyStore.js');
let SettledCompanyActions = require('../action/SettledCompanyActions');
import ParkMenuTree from '../../../lib/components/ParkMenuTree';

let FormDef = require('./SettledCompanyForm');

let temparray,temparrays ;

let SettledCompanyDoorModal = React.createClass({
  getInitialState: function () {
    return {
      loadings:false,
      loading: false,
      modal: false,
      settledCompanyDoor: {},
      hints: {},
      validRules: [],
      checkedList: [],
      plainOptions:[],
      indeterminate: false,
      checkAll: false,
        checkedListSelected: [],
        plainOptionsSelected:[],
        indeterminateSelected: false,
        checkAllSelected: false,

    };
  },

  mixins: [Reflux.listenTo(SettledCompanyStore, 'onServiceComplete'), ModalForm('settledCompanyDoor')],
  onServiceComplete: function (data) {
      this.setState({loading:false,loadings:false});
      if(data.errMsg){
          this.setState({errMsg:data.errMsg});
          return;
      }
    if (this.state.modal && data.operation === 'getSettledCompanyDoor') {
        this.setState({
            plainOptions: data.recordSet,
        });
    }
      if (this.state.modal && data.operation === 'saveSettledCompanyDoor') {
          // this.setState({
          //     modal:false
          // });
          this.setState({plainOptionsSelected:temparray});
      }
      if (this.state.modal && data.operation === 'deleteSettledCompanyDoor') {
          // this.setState({
          //     modal:false
          // });
          this.setState({plainOptionsSelected:temparrays,checkedListSelected:[],indeterminateSelected:false,checkAllSelected:false});
      }
      if (this.state.modal && data.operation === 'getSettledCompanySelectDoor') {
          this.setState({
              plainOptionsSelected: data.recordSet.list,
          });
      }
  },
  componentDidMount: function () {
    this.state.validRules = FormDef.getSettledCompanyFormRule(this);
  },
  showModal:function () {
    this.clear();
    this.setState({modal:true});
  },
  initEditData:function (settledCompanyDoor) {
    this.state.hints = {};
    Utils.copyValue(settledCompanyDoor, this.state.settledCompanyDoor);
    this.setState({loading:false},()=>{
        this.parkMenuTree.initTree(Common.getSelectedParkUuid());
        SettledCompanyActions.getSettledCompanyDoor({"parkUuid":Common.getSelectedParkUuid(),
            "attributionCategory":0})
    });
    if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
      this.refs.mxgBox.clear();
    }
      SettledCompanyActions.getSettledCompanySelectedDoor({object:{uuid:settledCompanyDoor.uuid}})

  },

  clear: function () {
    FormDef.initSettledCompanyForm(this.state.settledCompanyDoor);
    // FIXME 输入参数，对象初始化
    this.state.hints = {};
    this.setState({
        loadings:false,
        loading:false,
        checkedList: [],
        plainOptions:[],
        indeterminate: false,
        checkAll: false,
        checkedListSelected: [],
        plainOptionsSelected:[],
        indeterminateSelected: false,
        checkAllSelected: false,
    });
    if (!this.state.modal && typeof (this.refs.mxgBox) !== 'undefined') {
      this.refs.mxgBox.clear();
    }
  },

  onClickSave: function (arraydate) {
   // if (Common.formValidator(this, this.state.settledCompanyDoor)) {
      this.setState({ loading: true });
      let arrayDate=[];
      let cuuid = this.state.settledCompanyDoor.uuid;
      let arraydates = arraydate;
      if(arraydates.length == 0){
          arrayDate.push({'companyUuid':cuuid});
      }else{
          arraydates.map(item=>{
              let doorUuid = item.doorUuid?item.doorUuid:item.uuid;
              arrayDate.push({'companyUuid':cuuid,'doorUuid':doorUuid,'doorNo':item.doorNo});
          });
      }
      SettledCompanyActions.saveSettledCompanyDoor(arrayDate);
  },
    onClickDelete: function (arraydate) {
        // if (Common.formValidator(this, this.state.settledCompanyDoor)) {
        this.setState({ loading: true });
        let arrayDate=[];
        let arraydates = arraydate;
        let cuuid = this.state.settledCompanyDoor.uuid;
        if(arraydates.length == 0){
            arrayDate.push({'companyUuid':cuuid});
        }else{
            arraydates.map(item=>{
                let doorUuid = item.doorUuid?item.doorUuid:item.uuid;
                arrayDate.push({'companyUuid':cuuid,'doorUuid':doorUuid,'doorNo':item.doorNo});
            });
        }
        SettledCompanyActions.deleteSettledCompanyDoor(arrayDate);
    },
    onChange:function(checkedList){
        this.setState({
            checkedList,
            indeterminate: !!checkedList.length && (checkedList.length < this.state.plainOptions.length),
            checkAll: checkedList.length === this.state.plainOptions.length,
        });
    },

    onCheckAllChange:function(e){
        this.setState({
            checkedList: e.target.checked ? this.state.plainOptions : [],
            indeterminate: false,
            checkAll: e.target.checked,
        });
    },
    onChangeSelected:function(checkedListSelected){
        this.setState({
            checkedListSelected,
            indeterminateSelected: !!checkedListSelected.length && (checkedListSelected.length < this.state.plainOptionsSelected.length),
            checkAllSelected: checkedListSelected.length === this.state.plainOptionsSelected.length,
        });
    },

    onCheckAllChangeSelected:function(e){
        this.setState({
            checkedListSelected: e.target.checked ? this.state.plainOptionsSelected : [],
            indeterminateSelected: false,
            checkAllSelected: e.target.checked,
        });
    },
    changeClick:function(){
        let checkedValue = this.state.checkedList;
        let plainOptionsSelected=this.state.plainOptionsSelected;
        var temp = []; //临时数组1
        temparray = plainOptionsSelected;//临时数组2
        let arraydate = [];//添加传入的值
        for (var i = 0; i < plainOptionsSelected.length; i++) {
            let doorUuid = plainOptionsSelected[i].doorUuid?plainOptionsSelected[i].doorUuid:plainOptionsSelected[i].uuid;
            temp[doorUuid] = true;
        };
        for (var i = 0; i < checkedValue.length; i++) {
            if (!temp[checkedValue[i].uuid]) {
                temparray.push(checkedValue[i]);
                arraydate.push(checkedValue[i]);
            } ;
        };
       //this.setState({plainOptionsSelected:temparray});
        //添加的时候调用接口
        if(arraydate.length>0){
            this.onClickSave(arraydate);
        }
    },
    changeDelete:function(){
        let checkedListSelected = this.state.checkedListSelected;
        let plainOptionsSelected=this.state.plainOptionsSelected;
        var temp = []; //临时数组1
        temparrays = [];//临时数组2
        for (var i = 0; i < checkedListSelected.length; i++) {
            let doorUuid = checkedListSelected[i].doorUuid?checkedListSelected[i].doorUuid:checkedListSelected[i].uuid;
            temp[doorUuid] = true;
        };
        for (var i = 0; i < plainOptionsSelected.length; i++) {
            let doorUuid = plainOptionsSelected[i].doorUuid?plainOptionsSelected[i].doorUuid:plainOptionsSelected[i].uuid;
            if (!temp[doorUuid]) {
                temparrays.push(plainOptionsSelected[i]);
            } ;
        };
        if(temparrays.length==0){
            var $checkbox=document.getElementsByName("checkboxAll");
            $checkbox[0].parentElement.setAttribute("class",'ant-checkbox');
        }
       // this.setState({plainOptionsSelected:temparray,checkedListSelected:[],indeterminateSelected:false,checkAllSelected:false});
        //删除的时候调用接口
        if(checkedListSelected.length > 0 ){
            this.onClickDelete(checkedListSelected);
        }
    },
    onSelect:function(value){
        this.setState({
            loadings:true,
            checkedList: [],
            indeterminate: false,
            checkAll: false,
        });
        let obj;
        if(value.type == 'BUILDING'){
            obj ={
                "buildingUuid":value.itemUuid,
                "attributionCategory":value.level
            };
        }else if(value.type == 'PARK'){
            obj ={
                "parkUuid":value.itemUuid,
                "attributionCategory":value.level
            };
        }else if(value.type == 'FLOOR'){
            obj ={
                "floorUuid":value.itemUuid,
                // "attributionCategory":value.level
            };
        }

        SettledCompanyActions.getSettledCompanyDoor(obj)

    },
    beforeClose:function () {
        this.clear();
    },
  render: function () {
    let attrList = null;
   // let items = FormDef.getSettledCompanyForm(this, this.state.settledCompanyDoor, attrList);

    let title = this.props.doorActionType === 'check'?'查看门禁权限': this.props.doorActionType ==='edit'?'编辑门禁权限':'模态框';
      const childrens = [];
      this.state.plainOptions.map(item=>{
          let property = item.property==0?'公有':'私有';
          let cellName=item.cellName?item.cellName+'-':'';
          let doorName=item.doorName?item.doorName+'-':'';
          childrens.push(<span key={item.uuid}><Checkbox  key={item.uuid} value={item}>{cellName}{doorName}{property}</Checkbox><br/></span>);
      });
      const children = [];
      this.state.plainOptionsSelected.map(item=>{
        let property = item.property==0?'公有':'私有';
        let buildingName=item.buildingName?item.buildingName+'-':'';
        let cellName=item.cellName?item.cellName+'-':'';
        let floorName=item.floorName?item.floorName+'-':'';
          children.push(<span key={item.uuid}><Checkbox   key={item.uuid} value={item} > {item.doorName}<br/><span style={{paddingLeft:27}}>{buildingName}{floorName}{cellName}{property}</span></Checkbox><br/></span>);
      });

    return (
      <Modal
        visible={this.state.modal} width={630} title={title} maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
        footer={[
          <div key="footerDiv" style={{ display: 'block', textAlign: 'right' }}>
            <ServiceMsg ref="mxgBox" svcList={['settledCompanyDoor/create']} />
            {/*<Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}*/}
            {/*<Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>*/}
          </div>
        ]}
      >
        <Form layout='horizontal' style={{height:350,overflowX:'hidden',overflowY:'hidden'}} >
          <div style={{border:'1px solid #e8e8e8',width:'24%',height:350,float:'left'}}>
            <div style={{backgroundColor:'#e8e8e8',width:'100%',height:32,paddingTop:5,paddingLeft:5,}}>选择门禁所在位置</div>
              <div style={{height:309,overflow:'auto'}}>
              <ParkMenuTree  ref = {ref=>this.parkMenuTree = ref} onSelect={this.onSelect}></ParkMenuTree>
              </div>
          </div>
          <div style={{borderTop:'1px solid #e8e8e8',borderBottom:'1px solid #e8e8e8',width:'38%',float:'left',height:350}}>
            <div style={{backgroundColor:'#e8e8e8',width:'100%',height:32,paddingTop:5,paddingLeft:5}}>可选择的门禁</div>
            <div style={{height:276,marginTop:8,overflowY:'auto',borderBottom:'1px solid #e8e8e8',paddingLeft:7}}>
                <Spin  spinning={this.state.loadings}></Spin>
                {
                    this.state.plainOptions.length==0?<div >暂时没有数据</div>:<CheckboxGroup onChange={this.onChange} value={this.state.checkedList}>{childrens}</CheckboxGroup>
                }
            </div>
            <div style={{marginLeft:20,marginTop:5}}>
            <Button  size="small" ><Checkbox
                indeterminate={this.state.indeterminate}
                onChange={this.onCheckAllChange}
                checked={this.state.checkAll}
            ></Checkbox>全选</Button>
            <Button  size="small" onClick={this.changeClick} style={{marginLeft:10}}>添加</Button>
            </div>
          </div>
          <div style={{border:'1px solid #e8e8e8',width:'38%',float:'left',height:350}}>
            <div style={{backgroundColor:'#e8e8e8',width:'100%',height:32,paddingTop:5,paddingLeft:5}}>已选择的门禁</div>
            <div style={{height:276,marginTop:8,overflowY:'auto',borderBottom:'1px solid #e8e8e8',paddingLeft:7}}>
                {
                    this.state.plainOptionsSelected.length==0?<div >暂时没有数据</div>: <CheckboxGroup onChange={this.onChangeSelected} value={this.state.checkedListSelected}>{children}</CheckboxGroup>
                }
            </div>
            <div style={{marginLeft:20,marginTop:5}}>
            <Button  size="small" > <Checkbox
                indeterminate={this.state.indeterminateSelected}
                onChange={this.onCheckAllChangeSelected}
                checked={this.state.checkAllSelected}
                name='checkboxAll'
            >
            </Checkbox>全选</Button>
            <Button  size="small" onClick={this.changeDelete} style={{marginLeft:10}}>删除</Button>
            </div>

          </div>
        </Form>
      </Modal>
    );
  }
});

export default SettledCompanyDoorModal;
