import React from 'react';
let Reflux = require('reflux');
import { Form, Modal, Button, Input, Select, Row, Col } from 'antd';
import ModalForm from '../../../../lib/Components/ModalForm';
let Common = require('../../../../public/script/common');
let Utils = require('../../../../public/script/utils');
let ParkAdministratorActions = require('../action/ParkAdministratorActions');
let ParkAdministratorStore = require('../store/ParkAdministratorStore');

let FormDef = require('./parkAdministratorForm');
var Validator = require('../../../../public/script/common');

let ParkAdministratorModal = React.createClass({
    getInitialState: function () {
        return {
            loading: false,
            modal: false,
            parkAdministrator: {

            },
            hints: {},
            validRules: [],
            flag:false,
            isFlag:false,
        };
    },
    mixins: [Reflux.listenTo(ParkAdministratorStore, 'onServiceComplete'), ModalForm('parkAdministrator')],
    onServiceComplete: function (data) {
        this.setState({loading:false});
        if(data.errMsg){
            this.setState({errMsg:data.errMsg});
            return;
        }
        if (this.state.modal && data.operation === 'retrieve') {
            let parkAdministrator = Object.assign({},this.state.parkAdministrator);
            if(data.recordSet.length == 0){
                this.setState({flag:true,isFlag:true},()=>{this.set('phone',parkAdministrator)});
            }else{
                parkAdministrator.userName = data.recordSet[0].userName;
                parkAdministrator.uuid = data.recordSet[0].uuid;
                //根据手机号查找
                this.setState({parkAdministrator,flag:false,isFlag:true});
            }

        }
        if (this.state.modal && data.operation === 'create') {
            this.setState({
                modal: false,
            });
            //打开编辑权限
            this.props.adminAssesss({}, 'edit');
        }
    },
    componentDidMount: function () {
        let attrList = [
            {
                name: 'phone',
                validator: this.checkPhone
            },
            {
                name: 'accountName',
                validator: this.checkAccountName
            }
        ];
        this.state.validRules = FormDef.getParkAdminFormRule(this,attrList);
    },
    set:function (id,val,f) {
        let parkAdministrator = Object.assign({},this.state.parkAdministrator);
        Common.validator(this,parkAdministrator,id);
    },
    //手机号
    checkPhone: function(value) {
        if(this.state.isFlag &&this.state.flag){
            this.setState({isFlag:false});
            return '该手机号码还未注册账户，请用户在APP端注册账户!'
        }
    },
    checkAccountName:function(value){
        let re=/^[A-Za-z]{6,20}$/;
        if(!re.test(value)){
            return '请输入6-20位英文字母!'
        }
    },
    beforeClose: function () {
        this.clear();
    },
    showModal: function () {
        this.setState({ modal: true });
    },
    initEditData: function (parkAdministrator) {
        this.state.hints = {};
        if (parkAdministrator) {
            Utils.copyValue(parkAdministrator, this.state.parkAdministrator);
        } else {
            this.clear();
        }
        this.setState({
            loading: false,
        });
        if (!this.state.modal && typeof (this.refs.mxgBox) != 'undefined') {
            this.refs.mxgBox.clear();
        }
    },

    clear: function () {
        FormDef.initParkAdminForm(this.state.parkAdministrator);
        // FIXME 输入参数，对象初始化
        this.state.hints = {};
        this.setState({ loading: false });
        if (!this.state.modal && typeof (this.refs.mxgBox) !== 'undefined') {
            this.refs.mxgBox.clear();
        }
    },
    phoneOnChange:function(e){
        let parkAdministrator = this.state.parkAdministrator;
        let s = e.target.value.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
        parkAdministrator[e.target.id]= s;
        let id = e.target.id;
        this.setState({
            loading:true,
            parkAdministrator
        }, ()=>{
            if(Common.validator(this, parkAdministrator, id)){
                let phone = this.state.parkAdministrator.phone;
                ParkAdministratorActions.retrieveParkAdministrator({'phone':phone});
            }else{
                this.state.parkAdministrator.userName='';
                this.setState({
                    loading:false,
                    parkAdministrator
                });
            }
        });
    },
    onClickSave: function () {
        let parkAdministrator = Object.assign({}, this.state.parkAdministrator);
        this.setState({ parkAdministrator });
        if(this.state.hints.phoneHint){
            this.setState({isFlag:true},()=>{this.set('phone',parkAdministrator)});
            return;
        }
        if (Common.formValidator(this, this.state.parkAdministrator)) {
            if(parkAdministrator.userName === ''){
                Common.warnMsg('该手机号码还未注册账户，请用户在APP端注册账户！');
                return;
            }
            let sendData = Utils.deepCopyValue(this.state.parkAdministrator);
            sendData.userType='4';
            sendData.parkUuid=Common.getSelectedParkUuid();
            // this.setState({ loading: true });
            // ParkAdministratorActions.saveParkAdministrator(sendData);
            this.setState({
                modal: false,
            });
            //打开编辑权限
            this.props.adminAssesss(sendData, 'edit',true);
        }
    },
    render: function () {
        let items = FormDef.getParkAdminForm(this, this.state.parkAdministrator, null, Common.modalForm);
        let title = this.props.actionType === 'add' ? '添加管理员' : this.props.actionType === 'edit' ? '修改管理员' : '模态框';
        return (
            <Modal
                visible={this.state.modal} width={Common.modalWidth} title={title} maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
                footer={[
                    <div key="footerDiv" style={{ display: 'block', textAlign: 'right' }}>
                        <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
                        <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
                    </div>
                ]}
            >
                <Form layout='horizontal' >
                    {items}
                </Form>
            </Modal>
        );
    }
});
// module.exports = ParkAdministratorModal;
export default ParkAdministratorModal;
