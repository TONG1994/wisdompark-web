import React from 'react';
let Reflux = require('reflux');
import { Form, Modal, Button, Input, Select, Row, Col } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

let Common = require('../../../../public/script/common');
let Utils = require('../../../../public/script/utils');

let OpenParkManageStore = require('../store/OpenParkManageStore');
let OpenParkManageActions = require('../action/OpenParkManageActions');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';

// table
let FormDef = require('./OpenParkForm');
import AreaPosition from '../AreaPosition/components/AreaPosition';

let CreateOpenParkPage = React.createClass({

    getInitialState: function() {
        return {
            openParkSet: {},
            loading: false,
            modal: false,
            openParkInfo:{},
            hints: {},
            validRules: [],
            newStyle:{display:'none'},
        };
    },

    mixins: [Reflux.listenTo(OpenParkManageStore, 'onServiceComplete'), ModalForm('openParkInfo')],

    onServiceComplete: function (data) {
        if (this.state.modal && data.operation === 'create') {
          if (data.errMsg === '') {
            // 成功，关闭窗口
            this.setState({
              modal: false
            });
          } else {
            // 失败
            this.setState({
              loading: false,
              openParkSet: data,
              modal: false,
            });
          }
        }else if(this.state.modal && data.operation == 'getAddress'){
            if(data.errMsg == ''){
                // this.checkParkLatitude(data.parkLatitude);
                // this.setState({parkLatitude:data.parkLatitude});
            }
        }else if(this.state.modal && data.operation == 'create'){
            // if(data.errMsg == ''){
            //     this.setState({parkLatitude:''})
            // }
        }else if(this.state.modal && data.operation == 'onRetrievePark'){
            // if(data.errMsg == ''){
            //     this.setState({parkLatitude:''})
            // }
        }else if(!this.state.modal){
            // if(data.errMsg == ''){
            //     this.setState({parkLatitude:''})
            // }
        }
      },

    checkOpenVerificationCode:function(value){
        // let test=/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z_]{6,16}$/;
        let test=/^[\d]{6,16}$/;
        let testValue=test.test(value);
        if (!testValue) {
            // return '请输入6~16位字母、数字二者组合!';
            return '请输入纯数字!';
        }
    },
    
    // 第一次加载
    componentDidMount: function () {
        let attrList = [{
            name: 'openVerificationCode',
            validator: this.checkOpenVerificationCode,
        },{
            name: 'parkLocation',
            allowSpecialChar:true,
        }];
        this.state.validRules = FormDef.getCreateOpenParkFormRule(this,attrList);
        // this.state.afterChange=this.afterChange;
    },

    afterChange:function () {
          let data = this.state.openParkInfo;
          data.lng = '';
          data.longitude='';
          data.latitude='';
          this.forceUpdate();
    },

    clear: function () {
        FormDef.initOpenParkPrintForm(this.state.openParkInfo);
    
        // FIXME 输入参数，对象初始化
        this.state.hints = {};
        this.state.openParkInfo.uuid = '';
        this.state.openParkInfo.filter = '';
        this.state.openParkInfo.encryptionRule="2,3,4,5,6";
         //去除地理位置报错选择
        this.AMapComponent && this.AMapComponent.cancleError();
        //刷新引入组件
        this.setState({
            loading: false,
            actionType:this.props.Action,
        });
        if(this.EncryptionRule){
            this.EncryptionRule.initData();
        }
        if (!this.state.modal && typeof (this.refs.mxgBox) !== 'undefined') {
          this.refs.mxgBox.clear();
        }
    },

    onClickSave: function() {
        let {openParkInfo}=this.state;
        let objFilter={
            parkName: openParkInfo.parkName,
            parkLocation: openParkInfo.parkLocation,
            parkAddress: openParkInfo.parkAddress,
            parkLatitude: openParkInfo.parkLatitude,
            openVerificationCode: openParkInfo.openVerificationCode,
            encryptionRule: openParkInfo.encryptionRule.toString()
        }
        if (Common.formValidator(this, objFilter)) {
            this.setState({ loading: true });
            OpenParkManageActions.addPark(this,objFilter);
        }
    },

     //地区选择回调
    areaPosition:function (val) {
        this.handleOnSelected('parkLocation',val.toString());
    },

    //获取经纬度后
    handlemapok:function (location) {
        let openParkInfo = Object.assign({},this.state.openParkInfo,{longitude:location[0],latitude:location[1],parkLatitude:location.toString()});
        this.setState({openParkInfo});
        Common.validator(this,openParkInfo,'parkLatitude');
    },

    // 转换数据
    transformAddress:function(data){
        let ownData=JSON.parse(window.sessionStorage.address);
        let len2=ownData.length;
        let arr=data.split(',');
        let addressArray='';
        outer:
        for(let j=0;j<len2;j++){
            if(arr[0]==ownData[j].value){
                addressArray+=ownData[j].label;
                for(let m=0;m<ownData[j].children.length;m++){
                    if(arr[1]==ownData[j].children[m].value){
                        addressArray+=ownData[j].children[m].label;
                        for(let n=0;n<ownData[j].children[m].children.length;n++){
                            if(arr[2]==ownData[j].children[m].children[n].value){
                                addressArray+=ownData[j].children[m].children[n].label;
                                data=addressArray;
                                break outer;
                            }
                        }
                    }
                }
            }
        }
        return data;
    },

    encryptionRuleChange: function(value){
        // console.log(value);
    },

    beforeClose: function(){
        this.EncryptionRule.clear();
    },
  
    render:function(){
        let attrList = [
            {
              name:'parkLocation',
              id:'parkLocation',
              object:<AreaPosition
                        name='parkLocation'
                        id='parkLocation'
                        onChange={this.areaPosition}
                        value={this.state.openParkInfo['parkLocation']}
                    />
            }
          ];
        let items = FormDef.getCreateOpenParkForm(this, this.state.openParkInfo, attrList);
        let layout = 'horizontal';
        return(
            <Modal
                style={{fontSize:'16px',fontWight:'550px'}}
                visible={this.state.modal}
                title="增加园区"
                width="550px"
                maskClosable={false} onOk={this.onClickSave}
                onCancel={this.toggle}
                footer={[
                <div key="footerDiv" style={{ display: 'block', textAlign: 'right' }}>
                    <ServiceMsg ref="mxgBox" svcList={['openParkInfo/create']} />
                    <Button
                    key="btnOK" title="保存" type="primary" size="large" onClick={this.onClickSave}
                    loading={this.state.loading} 
                    >保存</Button>{' '}
                    <Button key="btnClose" title="取消" size="large" onClick={this.toggle}>取消</Button>
                </div>
                ]}
            >
                <Form layout={layout}>
                {items}
                </Form>
            </Modal>
        )
    }

});
export default CreateOpenParkPage;