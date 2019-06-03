
import React from 'react';
let Reflux = require('reflux');
import DictTable from '../../../lib/Components/DictTable';
import FormUtil from '../../../lib/Components/FormUtil';
import { Button, Icon, Modal} from 'antd';

let FormDef = require('./components/parkAdministratorForm');
let Common = require('../../../public/script/common');
import ParkAdministratorModal from './components/ParkAdministratorModal';//es6写法
import ParkAdminSelectAssessModal from './components/ParkAdminSelectAssessModal';
let ParkAdministratorActions = require('./action/ParkAdministratorActions');
let ParkAdministratorStore = require('./store/ParkAdministratorStore');
const tableName = 'ParkAdminTable';
let parkAdministratorPage = React.createClass({
    getInitialState: function () {
        return {
            parkAdminSet: {
                recordSet: [],
                errMsg: '',
            },
            loading: false,
            actionType: '',
            adminAssessType:'',
        }
    },
    mixins: [Reflux.listenTo(ParkAdministratorStore, 'onServiceComplete')],
    onServiceComplete: function (data) {
        this.setState({loading:false});
        if(data.errMsg){
            this.setState({errMsg:data.errMsg});
            return;
        }
        if (data.operation === 'retrieve') {
           if(data.filter.userType){
               this.setState({
                   parkAdminSet: Object.assign({}, this.state.parkAdminSet, data)
               });
           }
        }else if(data.operation === 'create' || data.operation === 'update' || data.operation === 'remove'){
            this.handleQueryClick();
        }
    },
    handleQueryClick: function () {
        this.setState({
            loading:true
        })
        let obj={userType:'4',parkUuid:Common.getSelectedParkUuid()};
        ParkAdministratorActions.retrieveParkAdministrator(obj);
    },
    componentDidMount: function () {
        var dataSet = this.state.parkAdminSet;
        var conf = FormUtil.getTableConf(tableName);
        dataSet.pageRow = (conf.page !== true) ? 0 : conf.pageRow;
        dataSet.startPage = (conf.page !== true) ? 0 : 1;
        this.handleQueryClick();
    },
    adminAssess:function (record,type,isFlag) {
        this.setState({adminAssessType:type});
        if(type == 'edit'){
            this.ParkAdminSelectAssessModal.showModal();
            this.ParkAdminSelectAssessModal.initEditData(record,isFlag);
        }
      },
    addAdmin: function () {
        this.setState({ actionType: 'add' });
        this.parkAdministratorModal.showModal();
        this.parkAdministratorModal.clear();
    },
    reset: function () {
        this.handleQueryClick();
    },
    update: function (record) {
        this.setState({ actionType: 'edit' });
        this.parkAdministratorModal.showModal();
        this.parkAdministratorModal.initEditData(record);
    },
    delete: function (record) {
        let $this = this;
        Modal.confirm({
            title: '删除确认',
            content: '是否确定删除 【'+record.userName+'】？',
            okText: '确定',
            cancelText: '取消',
            onOk: function () {
                $this.setState({ loading: true });
                ParkAdministratorActions.deleteParkAdministrator({uuid:record.uuid});
            }
        });
    },
    render: function () {
        let sessionData =JSON.parse(window.sessionStorage.loginData);
        let operCol = '';
         if (sessionData.userInfo.parkUuid != "" && sessionData.userInfo.parkUuid != null) {
             operCol = {
                title: '操作',
                key: 'action',
                width: 100,
                render: (text, record) => {
                    if(record.creator == '系统管理员') {
                        return (<span></span>)
                    } else {
                        return (<span>
                       <a href="#" title='删除' onClick={this.delete.bind(this, record)} className='btn-icon-margin'><Icon
                           type="delete"/></a>
                       </span>)

                    }
                }
            };
        }
        let leftButtons;
        if(sessionData.userInfo.parkUuid == "" || sessionData.userInfo.parkUuid == null){
            leftButtons = [
                <Button icon={Common.iconReset} title="重置" key='重置' className='btn-margin' onClick={this.reset}></Button>
            ];
        }else{
            leftButtons = [
                <Button title="添加管理员" type='primary' key='添加管理员' onClick={this.addAdmin} >添加管理员</Button>,
                <Button icon={Common.iconReset} title="重置" key='重置' className='btn-margin' onClick={this.reset}></Button>
            ];
        }

        let attrPorps = {
            self: this,
            tableForm: FormDef,
            buttons: leftButtons,
            operCol: operCol,
            tableName: tableName,
            defView: 'ParkAdminTable',
            onRefresh: false,//不分页
        };
        let modalProps = {
            actionType: this.state.actionType,
            userName:this.state.userName,
            adminAssesss:this.adminAssess
        };
        let adminModalProps = {
            adminAssessType: this.state.adminAssessType
        };
        var recordSet = this.state.parkAdminSet.recordSet;
        return (
            <div className="grid-page content-wrap">
                <DictTable dataSource={recordSet} loading={this.state.loading} attrs={attrPorps} />
                <ParkAdministratorModal ref={ref => this.parkAdministratorModal = ref} {...modalProps} />
                <ParkAdminSelectAssessModal ref={ref=>this.ParkAdminSelectAssessModal=ref} {...adminModalProps} />
            </div>
        );
    }
});
module.exports = parkAdministratorPage;