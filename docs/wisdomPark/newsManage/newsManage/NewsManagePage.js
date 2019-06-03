/**
 *   Create by Malson on 2018/8/14
 */
import React from 'react';
let Reflux = require('reflux');
import { Button, Table, Icon, Modal, Input } from 'antd';
const Search = Input.Search;

let Common = require('../../../public/script/common');
let Utils = require('../../../public/script/utils');

let NewsManageStore = require('./store/NewsManageStore');
let NewsManageActions = require('./action/NewsManageActions');

//person
import NewsManageModal from './components/NewsManageModalCommon';
import Filter from './components/Filter';

import FormUtil from '../../../lib/Components/FormUtil';
import DictTable from '../../../lib/Components/DictTable';
const tableName = 'NewsManageTable';
let FormDef = require('./components/NewsManageForm');

let NewsManagePage = React.createClass({
  getInitialState: function () {
    return {
      newsManageSet: {
        recordSet:[],
        errMsg: '',
        startPage: 1,
        pageRow: 10,
        totalRow: 1,
      },
      newsManage:{},
      loading: false,
      filter:{},
      actionType:'retrieve',
      selectArr:[],
      loadingSwitchUuid:''
    };
  },
  mixins: [Reflux.listenTo(NewsManageStore, 'onServiceComplete')],
  onServiceComplete: function (data) {
      this.setState({loading:false,loadingSwitchUuid:''});
      if(data.errMsg){
          this.setState({errMsg:data.errMsg});
          return;
      }
      switch (data.operation){
        case 'retrieve':
          this.setState({newsManageSet: Object.assign({}, this.state.newsManageSet, data)});
          break;
        case 'delete':
          this.setState({selectArr:[]});
          this.handleQueryClick();
          break;
        case 'openStick':
        case 'closeStick':
          this.handleQueryClick();
          break;
        default:
          break;
      }
  },
  handleQueryClick: function () {
    let obj = this.filter?this.filter.getFilter():{};
    obj.corpUuid = window.sessionStorage.corpUuid;
    this.setState({ loading: true });
    NewsManageActions.retrieveNewsManage(obj,this.state.newsManageSet.startPage,this.state.newsManageSet.pageRow);
  },
  componentDidMount: function () {
      var dataSet = this.state.newsManageSet;
      var conf = FormUtil.getTableConf(tableName);
      dataSet.pageRow = (conf.page !== true) ? 0 : conf.pageRow;
      dataSet.startPage = (conf.page !== true) ? 0 : 1;
      this.handleQueryClick();
  },
  filterSearch:function () {
      this.handleQueryClick();
  },
  onTableRefresh: function (current, pageRow) {
    this.state.newsManageSet.startPage = current;
    this.state.newsManageSet.pageRow = pageRow;
    this.handleQueryClick();
  },
  reset:function () {
      this.filter.setState({value:''},()=>{this.handleQueryClick()});
  },
  add:function () {
    this.setState({actionType:'add'},()=>{
      this.newsManageModal.addData();
    });
  },
  edit:function (record) {
    this.setState({actionType:'edit'},()=>{
      this.newsManageModal.initEditData(record.uuid);
    });
  },
  delete:function (record) {
    let $this = this;
    Modal.confirm({
      title: '删除确认',
      content: '是否确定删除 【'+record.title+'】？',
      okText: '确定',
      cancelText: '取消',
      onOk: function () {
        $this.setState({ loading: true });
        NewsManageActions.delete([record.uuid]);
      }
    });
  },
  //返回
  goBack(){
    this.setState({actionType:'retrieve'});
    this.handleQueryClick();
  },
  //rowselect
  tableSelectChange(selectedRowKeys, selectedRows){
    this.setState({selectArr:selectedRowKeys});
    // console.log(selectedRowKeys, selectedRows);
  },
  //table checkbox
  handleChange(checked,record){
    this.setState({loadingSwitchUuid:record.uuid});
    if(checked){
      NewsManageActions.openStick(record.uuid);
    }else{
      NewsManageActions.closeStick(record.uuid);
    }
  },
  batchDelete(){
    let $this = this,
        selectArr = this.state.selectArr;
    Modal.confirm({
      title: '删除确认',
      content: '是否确定删除选中的【'+selectArr.length+'】条信息？',
      okText: '确定',
      cancelText: '取消',
      onOk: function () {
        $this.setState({ loading: true });
        NewsManageActions.delete(selectArr);
      }
    });
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
    let leftButtons = [
      <Button icon={Common.iconAdd} title="添加资讯" type='primary' onClick={this.add}
              key='添加资讯'>添加资讯</Button>,
      <Button icon={Common.iconReset} title="重置" onClick={this.reset} className='btn-margin'
              key="重置" />,
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
      defView: 'NewsManageTable',
      totalPage: this.state.newsManageSet.totalRow,
      currentPage: this.state.newsManageSet.startPage,
      onRefresh: this.onTableRefresh,
    };
    let rowSelection = {
      rowSelection:{
        onChange:this.tableSelectChange
      }
    };
    let actionType = this.state.actionType;
    let modalProps = {
      actionType,
      goBack:this.goBack
    };
    let recordSet = this.state.newsManageSet.recordSet;
    return (
        <div className="grid-page news" >
          {
            actionType === 'retrieve'?(
                <div className="content-wrap">
                  <div className='table-filter'>
                    <Filter key='filter' ref={ref=>this.filter=ref}  filterSearch={this.filterSearch}/>
                  </div>
                  <DictTable dataSource={recordSet} {...rowSelection} loading={this.state.loading} attrs={ attrProps } />
                  <div style={recordSet.length?{ marginTop:-56,marginLeft:20}:{marginLeft:20}}>
                    <Button onClick={this.batchDelete} disabled={!this.state.selectArr.length}>批量删除</Button>
                  </div>
                </div>
                ):
                <div style = {{paddingLeft:20}}>
                  <NewsManageModal
                      ref={ref=>this.newsManageModal=ref}
                      {...modalProps}
                  />
                </div>
          }
        </div>
    )
  }
});

module.exports = NewsManagePage;
