/**
 *   Create by Malson on 2018/4/19
 */
import React from 'react';
let Reflux = require('reflux');
import { Button, Table, Icon, Modal, Input} from 'antd';
const Search = Input.Search;

let Common = require('../../../public/script/common');
let Utils = require('../../../public/script/utils');

let RentalCompanyStore = require('./store/RentalCompanyStore.js');
let RentalCompanyActions = require('./action/RentalCompanyActions');

//person
import RentalCompanyModal from './components/RentalCompanyModal';
import AddBatchModal from './components/addBatchModal';
import Filter from './components/Filter';

import FormUtil from '../../../lib/Components/FormUtil';
import DictTable from '../../../lib/Components/DictTable';
const tableName = 'RentalCompanyTable';
var FormDef = require('./components/RentalCompanyForm');

// let data = [];
// for(let i=0;i<9;i++){
//   data.push({
//     key:i,
//     companyName:'名称'+i,
//     companyCode:i+111,
//     location:'大江南北',
//     assess:'权限',
//     uuid:'3131'+i
//   })
// }

let rentalCompany = React.createClass({
  getInitialState: function () {
    return {
      rentalCompanySet: {
        recordSet:[],
        errMsg: '',
        // startPage: 1,
        // pageRow: 10,
        // totalRow: data.length,
      },
      rentalCompany:{},
      loading: false,
      filter:{},
      actionType:'',
      doorActionType:''
    };
  },
  mixins: [Reflux.listenTo(RentalCompanyStore, 'onServiceComplete')],
  onServiceComplete: function (data) {
      this.setState({loading:false});
      if(data.errMsg){
          this.setState({errMsg:data.errMsg});
          return;
      }
      if (data.operation === 'retrieve') {
          this.setState({
              rentalCompanySet: Object.assign({}, this.state.rentalCompanySet, data)
          });
      }else if(data.operation === 'create' || data.operation === 'update' || data.operation === 'remove'){
          this.handleQueryClick();
      }
  },
  handleQueryClick: function () {
    let obj = this.filter.getFilter();
    if(obj){
      this.setState({ loading: true });
     // 根据条件调方法
     RentalCompanyActions.retrieveRentalCompany(obj,this.state.rentalCompanySet.startPage,this.state.rentalCompanySet.pageRow);
    }
  },
  componentDidMount: function () {
      var dataSet = this.state.rentalCompanySet;
      var conf = FormUtil.getTableConf(tableName);
      dataSet.pageRow = (conf.page !== true) ? 0 : conf.pageRow;
      dataSet.startPage = (conf.page !== true) ? 0 : 1;
      this.handleQueryClick();
  },
  filterSearch:function () {
      this.handleQueryClick();
    },
  onTableRefresh: function (current, pageRow) {
    this.state.rentalCompanySet.startPage = current;
    this.state.rentalCompanySet.pageRow = pageRow;
    this.handleQueryClick();
  },
  reset:function () {
    //this.filter.clear();
      let  filterInfo = {
          key:'companyName',
          value:''
      };
      this.filter.setState({filterInfo},()=>{this.handleQueryClick()});
  },
  add:function () {
    this.setState({actionType:'add'});
    this.rentalCompanyModal.showModal();
      this.rentalCompanyModal.initEditData();
  },
  edit:function (record) {
    this.setState({actionType:'edit'});
    this.rentalCompanyModal.showModal();
    this.rentalCompanyModal.initEditData(record);
  },
  delete:function (record) {
    let $this = this;
    Modal.confirm({
      title: '删除确认',
      content: '是否确定删除 【'+record.companyName+'】？',
      okText: '确定',
      cancelText: '取消',
      onOk: function () {
        $this.setState({ loading: true });
        RentalCompanyActions.deleteRentalCompany({uuid:record.uuid,fileId:record.fileId});
      }
    });
  },
  addBatch:function () {
    this.addBatchModal.showModal();
  },
  render: function () {
    let operCol = {
      title: '操作',
      key: 'action',
      width: 120,
      render: (text, record) => {
        return (
          <span>
            <a href="#" title='编辑' onClick={this.edit.bind(this,record)} ><Icon type="edit" /></a>
            <a href="#" title='删除' onClick={this.delete.bind(this,record)} className='btn-icon-margin'><Icon type="delete" /></a>
          </span>
        )
      }
    };
      //TODO display
    let leftButtons = [
      <Button icon={Common.iconAdd} title="添加企业" type='primary' onClick={this.add}
              key='添加企业'>添加租赁信息</Button>,
      <Button icon={Common.iconAdd} title="批量添加" onClick={this.addBatch} className='btn-margin' style={{display:'none'}}
              key="批量添加">批量添加</Button>,
      <Button icon={Common.iconReset} title="重置" onClick={this.reset} className='btn-margin'
              key="重置"></Button>,
    ];
    let attrProps = {
      self: this,
      tableName: tableName,
      primaryKey: 'uuid',
      fixedTool: false,    // 固定按钮，不滚动
      buttons: leftButtons,
      btnPosition: 'top',
      operCol: operCol,
      tableForm: FormDef,
      editCol: false,
      editTable: false,
      defView: 'RentalCompanyTable',
      totalPage: this.state.rentalCompanySet.totalRow,
      currentPage: this.state.rentalCompanySet.startPage,
      onRefresh: this.onTableRefresh,
    };
    let modalProps = {
      actionType:this.state.actionType
    };
    let doorModalProps = {
      doorActionType:this.state.doorActionType
    };
    let recordSet = this.state.rentalCompanySet.recordSet;
    return (
        <div className="grid-page content-wrap">
          <div className='table-filter'>
            <Filter key='filter' ref={ref=>this.filter=ref}  filterSearch={this.filterSearch}/>
          </div>
          <DictTable dataSource={recordSet} loading={this.state.loading} attrs={ attrProps } locale={{emptyText:'未检索到相关企业租赁信息，请确认公司是否已经入驻并添加公司租赁信息。'}}/>
          <RentalCompanyModal  ref={ref=>this.rentalCompanyModal=ref} {...modalProps}  />
          <AddBatchModal ref={ref=>this.addBatchModal=ref} />
        </div>
    );
  }
});

module.exports = rentalCompany;
