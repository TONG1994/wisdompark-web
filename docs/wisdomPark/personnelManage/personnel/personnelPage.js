
import React from 'react';
let Reflux = require('reflux');
import { Button, Table, Icon, Modal, Input, Tabs } from 'antd';
const Search = Input.Search;
const TabPane = Tabs.TabPane;



let Common = require('../../../public/script/common');
let Utils = require('../../../public/script/utils');

let PersonnelStore = require('./store/PersonnelStore.js');
let PersonnelActions = require('./action/PersonnelActions');

//person
import PersonnelModal from './components/PersonnelModal';
import PersonnelDoorModal from './components/PersonnelDoorModal';
import AddBatchModal from './components/addBatchModal';
import Filter from './components/Filter';

import FormUtil from '../../../lib/Components/FormUtil';
import DictTable from '../../../lib/Components/DictTable';
const tableName = 'PersonnelTable';
var FormDef = require('./components/PersonnelForm');


let personnelPage = React.createClass({
  getInitialState: function () {
    return {
      personnelSet: {
        recordSet: [],
        errMsg: '',
        
      },
      personnel: {},
      loading: false,
      filter: {},
      actionType: '',
      doorActionType: '',
      key: '2'
    };
  },
  mixins: [Reflux.listenTo(PersonnelStore, 'onServiceComplete')],
  onServiceComplete: function (data) {
    this.setState({
      loading: false
    });
    if (data.operation === 'retrieve') {
     
      this.setState({
        personnelSet: Object.assign({}, this.state.personnelSet, data)
      });
    } else if (data.operation === 'create' || data.operation === 'update' || data.operation === 'remove' || data.operation === 'lock') {
      this.handleQueryClick();
    }else  if (data.operation === 'getSettledPersonnelSelectDoor' && this.state.doorActionType!='edit') {
      if(data.recordSet.list.length != 0){
          this.PersonnelDoorModal.showModal();
      }else{
          Common.warnMsg('未设置门禁权限');
          return;
      }

  }

  },
  handleQueryClick: function () {
    this.setState({ loading: true });
    //let obj = '';
    //if(obj){
    // this.setState({ loading: true });
    // let belongsOrgNo = Common.getLoginData()?Common.getLoginData().staffInfo.orgNo:'';
    // let {name,phone,belongsOrgNo} = obj;
    // 根据条件调方法
    let userType = this.state.key;
    let parkUuid=Common.getSelectedParkUuid();
    PersonnelActions.retrieveAddress({ userType ,parkUuid}, this.state.personnelSet.startPage, this.state.personnelSet.pageRow);
    // }
  },
  componentDidMount: function () {
    var dataSet = this.state.personnelSet;
    var conf = FormUtil.getTableConf(tableName);
    dataSet.pageRow = (conf.page !== true) ? 0 : conf.pageRow;
    dataSet.startPage = (conf.page !== true) ? 0 : 1;
    this.handleQueryClick();
  },
  //搜索
  filterSearch: function () {
    let obj = this.filter.getFilter();
    if (obj) {
      this.setState({ loading: true });
      // 根据条件调方法
      obj.userType = this.state.key;
      obj.parkUuid =Common.getSelectedParkUuid();
      PersonnelActions.retrieveAddress(obj, this.state.personnelSet.startPage, this.state.personnelSet.pageRow);
    }
  },
  onTableRefresh: function (current, pageRow) {
    this.state.personnelSet.startPage = current;
    this.state.personnelSet.pageRow = pageRow;
    this.handleQueryClick();
  },
  reset: function () {
    //this.filter.clear();
    let filterInfo = {
      key: "companyName,姓名",
      value: ''
    };
    this.filter.setState({ filterInfo, placeholder: '请输入姓名' }, () => { this.handleQueryClick() });
  },
  add: function () {
    this.setState({ actionType: 'add' });
    this.personnelModal.showModal();
    this.personnelModal.clear();
  },
  //编辑
  edit: function (record) {
    this.setState({ actionType: 'edit' });
    this.personnelModal.showModal();
    this.personnelModal.initEditData(record);
  },
  //删除
  delete: function (record) {
    let $this = this;
    Modal.confirm({
      title: '删除确认',
      content: '是否确定删除 【' + record.userName + '】？',
      okText: '确定',
      cancelText: '取消',
      onOk: function () {
        $this.setState({ loading: true });
        PersonnelActions.deleteUser({"uuid":record.uuid,"companyUuid":record.companyUuid});
      }
    });
  },
  //锁定
  lock: function (record) {
    let $this = this;
    Modal.confirm({
      title: record.state == '1' ? '解锁确认' : '锁定确认',
      content: record.state == '1' ? '是否确定解锁 【' + record.userName + '】？' : '是否确定锁定 【' + record.userName + '】？',
      okText: '确定',
      cancelText: '取消',
      onOk: function () {
        if (record.state == '1') {
          PersonnelActions.unLock(record.uuid);
        } else {
          PersonnelActions.lock(record.uuid);
        }

      }
    });
  },
  //查看身份图片
  showPicture: function (record, type) {
    this.setState({ doorActionType: type });
    this.PersonnelDoorModal.initEditDatas(record);
    this.PersonnelDoorModal.showModal();
   
  },
  //查看门禁权限
  doorOperate: function (record, type) {
    this.setState({ doorActionType: type });
    PersonnelActions.getSettledPersonnelSelectedDoor({object:{uuid:record.uuid}})
  },
  addBatch: function () {
    this.addBatchModal.showModal();
  },
  callback: function (key) {
    this.state.personnelSet.startPage = 1;
    this.state.personnelSet.pageRow = 10;
    this.setState({ key }, () => {
      this.handleQueryClick();
    });

  },
  render: function () {
    //企业员工操作菜单
    let operCol1 = {
      title: '操作',
      key: 'action',
      width: 120,
      render: (text, record) => {
        return (
          <span>
            <a href="#" title='编辑' onClick={this.edit.bind(this, record)} ><Icon type="edit" /></a>
            <a href="#" title='删除' onClick={this.delete.bind(this, record)} className='btn-icon-margin'><Icon type="delete" /></a>
            <a href="#" style={{color:record.state == '1' ? '#009900' : '#FFA851'}} title={record.state == '1' ? '解锁' : '锁定'} onClick={this.lock.bind(this, record)} className='btn-icon-margin'><Icon type={record.state == '1' ? 'unlock' : 'lock'} /></a>
          </span>
        )
      }
    };
    //企业门禁管理员操作菜单
    let operCol2 = {
      title: '操作',
      key: 'action',
      width: 120,
      render: (text, record) => {
        return (
          <span>
            <a href="#" title='编辑' onClick={this.edit.bind(this, record)} ><Icon type="edit" /></a>
            <a href="#" title='删除' onClick={this.delete.bind(this, record)} className='btn-icon-margin'><Icon type="delete" /></a>
          </span>
        )
      }
    };
    let leftButtons = [
      <Button icon={Common.iconAdd} title="添加企业门禁管理员" type='primary' onClick={this.add}
        key='添加企业门禁管理员'>添加企业门禁管理员</Button>,
      // <Button icon={Common.iconAdd} title="批量添加" onClick={this.addBatch} className='btn-margin'
      //         key="批量添加">批量添加</Button>,
      //<Button icon={Common.iconReset} title="重置" onClick={this.reset} className='btn-margin'
      //  key="重置">重置</Button>,
    ],
      rightButtons = [<Filter key='filter' ref={ref => this.filter = ref} />];
    let attrProps = {
      self: this,
      tableName: tableName,
      primaryKey: 'uuid',
      fixedTool: false,    // 固定按钮，不滚动
      buttons: this.state.key === '3' ? leftButtons : null,
      btnPosition: 'top',
      //搜索框rightButtons,
      operCol: this.state.key === '3' ? operCol2 : operCol1,
      tableForm: FormDef,
      editCol: false,
      editTable: false,
      defView: 'PersonnelTable',
      totalPage: this.state.personnelSet.totalRow,
      currentPage: this.state.personnelSet.startPage,
      onRefresh: this.onTableRefresh,
    };
    let modalProps = {
      actionType: this.state.actionType
    };
    let doorModalProps = {
      doorActionType: this.state.doorActionType
    };
    let recordSet = this.state.personnelSet.recordSet;
    
    return (
      <div className="grid-page">
        <Tabs defaultActiveKey="1" onChange={this.callback}>
          <TabPane tab="企业员工" key="2">
            {<div style={{ position: 'absolute', right: '20px', top: '6px', zIndex: '1' }}>
              <Filter key='filter' ref={ref => this.filter = ref} filterSearch={this.filterSearch} />
            </div>}
            <DictTable dataSource={recordSet} loading={this.state.loading} attrs={attrProps} />
            <PersonnelModal ref={ref => this.personnelModal = ref} {...modalProps} />
            {<PersonnelDoorModal ref={ref => this.PersonnelDoorModal = ref} {...doorModalProps} />}
            <AddBatchModal ref={ref => this.addBatchModal = ref} />
          </TabPane>
          <TabPane tab="企业门禁管理员" key="3">
            {<div style={{ position: 'absolute', right: '20px', top: '6px', zIndex: '1' }}>
              <Filter key='filter' ref={ref => this.filter = ref} filterSearch={this.filterSearch} />
            </div>}
            <DictTable dataSource={recordSet} loading={this.state.loading} attrs={attrProps} />
            <PersonnelModal ref={ref => this.personnelModal = ref} {...modalProps} />
            {/* <PersonnelDoorModal ref={ref => this.PersonnelDoorModal = ref} {...doorModalProps} /> */}
            <AddBatchModal ref={ref => this.addBatchModal = ref} />
          </TabPane>
        </Tabs>
      </div>
    );
  }
});

module.exports = personnelPage;
