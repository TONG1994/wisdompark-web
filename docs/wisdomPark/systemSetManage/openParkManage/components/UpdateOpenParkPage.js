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

// person
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
        };
    },

    mixins: [Reflux.listenTo(OpenParkManageStore, 'onServiceComplete'), ModalForm('openParkInfo')],

    onServiceComplete: function (data) {
        if (this.state.modal && data.operation === 'update') {
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
        }
      },

    checkOpenVerificationCode:function(value){
        // let test=/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z_]{6,16}$/;
        let test=/^[\d]{6,16}$/;
        let testValue=test.test(value);
        if (!testValue) {
            // return '请输入6~16位字母、数字二者组合!';
            return '请输入6~16位纯数字!';
        }
    },
    
    // 第一次加载
    componentDidMount: function () {
        let attrList = [{
            name: 'openVerificationCode',
            // dataType:'passwd',
            validator: this.checkOpenVerificationCode,
        },{
            name: 'parkLocation',
            allowSpecialChar:true,
        }];
        this.state.validRules = FormDef.getCreateOpenParkFormRule(this,attrList);
    },

    clear: function (openParkInfo,oldData) {
        openParkInfo = Utils.deepCopyValue(openParkInfo);
        this.changeData(openParkInfo,oldData);
        this.state.hints = {};
        Utils.copyValue(openParkInfo, this.state.openParkInfo);
        this.setState({
          loading: false,
          actionType:this.props.Action
        });
        if (!this.state.modal && typeof (this.refs.mxgBox) !== 'undefined') {
          this.refs.mxgBox.clear();
        }
        if(this.EncryptionRule){
          this.EncryptionRule.initData(openParkInfo.encryptionRule);
        }
    },

    changeData: function(openParkInfo,oldData){
      let oldDataLength=oldData.length;
      for(let i=0;i<oldDataLength;i++){
        if(oldData[i].uuid==openParkInfo.uuid){
          openParkInfo.parkLocation=oldData[i].useForAddress;
        }
      }
    },

    onClickSave: function() {
        let checkFields=this.state.openParkInfo;
        if (Common.formValidator(this, checkFields)) {
            this.setState({ loading: true });
            OpenParkManageActions.updatePark(this,this.state.openParkInfo);
        }
    },


     //地区选择回调
    areaPosition:function (val) {
        this.handleOnSelected('parkLocation',val.toString());
    },

    //获取经纬度后
    handlemapok:function (location) {
        let openParkInfo = Object.assign({},this.state.openParkInfo,{parkLatitude:location.toString()});
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
        let openParkInfo=Object.assign({},this.state.openParkInfo,{encryptionRule: value.toString()});
        this.setState({ openParkInfo });
    },

    beforeClose: function(){
        this.EncryptionRule.clear();
        this.setState({

        })
    },

    render:function(){
        let attrList = [
            {
              name:'parkLocation',
              id:'parkLocation',
              visible:'',
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
                style={{fontSize:'16px',fontWight:'500px'}}
                visible={this.state.modal} width="540px" title="修改园区"
                maskClosable={false} onOk={this.onClickSave}
                onCancel={this.toggle}
                footer={[
                <div key="footerDiv" style={{ display: 'block', textAlign: 'right' }}>
                    <ServiceMsg ref="mxgBox" svcList={['openParkInfo/update']} />
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