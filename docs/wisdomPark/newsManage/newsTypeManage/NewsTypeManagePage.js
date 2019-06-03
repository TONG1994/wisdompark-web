import React from 'react';
let Reflux = require('reflux');
import { Button, Table, Icon, Modal, Input } from 'antd';

let Common = require('../../../public/script/common');
let Utils = require('../../../public/script/utils');

let NewsTypeManageStore = require('./store/NewsTypeManageStore.js');
let NewsTypeManageActions = require('./action/NewsTypeManageActions');

import NewsTypeManageModal from './components/NewsTypeManageModal';

import FormUtil from '../../../lib/Components/FormUtil';
import DictTable from '../../../lib/Components/DictTable';
const tableName = 'NewsTypeManageTable';
var FormDef = require('./components/NewsTypeManageForm');
let NewsTypeManagePage = React.createClass({
  getInitialState: function () {
    let parkUuid = Common.getSelectedParkUuid() ? Common.getSelectedParkUuid():'';
    return {
      newsTypeManageSet: {
        recordSet:[],
        errMsg: '',
      },
      parkUuid,
      settledCompany:{},
      loading: false,
      filter:{},
      actionType:'',
    };
  },
  mixins: [Reflux.listenTo(NewsTypeManageStore, 'onServiceComplete')],
  onServiceComplete: function (data) {
    console.log(data);
      this.setState({loading:false});
      if(data.errMsg){
          this.setState({errMsg:data.errMsg});
          return;
      }
      if (data.operation === 'retrieve') {
          this.setState({
              newsTypeManageSet: Object.assign({}, this.state.newsTypeManageSet, data)
          });
      }else if(data.operation === 'create' || data.operation === 'update'||data.operation==='remove'){
          this.handleQueryClick();
      }else if(data.operation==='getNewsByTypeUuid'){
        this.deleteOKorNo(data);
      }
  },
  deleteOKorNo:function(data){
    if(data.recordSet!='0'){
        Common.warnMsg('该分类下有资讯信息，请先删除相关的资讯信息，再进行删除操作！');
    }else{
      let $this = this;
      Modal.confirm({
        title: '删除确认',
        content: '是否确定删除 【'+data.filter.optionName+'】？',
        okText: '确定',
        cancelText: '取消',
        onOk: function () {
          $this.setState({ loading: true });
          NewsTypeManageActions.deleteNewsTypeManage(data.filter.uuid);
        }
      });
    }
  },
  handleQueryClick: function () {
    this.setState({ loading: true });
    var filter={};
    filter.corpUuid=this.state.parkUuid;
    NewsTypeManageActions.retrieveNewsTypeManage(filter,this.state.newsTypeManageSet.startPage,this.state.newsTypeManageSet.pageRow);
  },
  componentDidMount: function () {
      var dataSet = this.state.newsTypeManageSet;
      var conf = FormUtil.getTableConf(tableName);
      dataSet.pageRow = (conf.page !== true) ? 0 : conf.pageRow;
      dataSet.startPage = (conf.page !== true) ? 0 : 1;
      this.handleQueryClick();
  },

  onTableRefresh: function (current, pageRow) {
    this.state.newsTypeManageSet.startPage = current;
    this.state.newsTypeManageSet.pageRow = pageRow;
    this.handleQueryClick();
  },
  reset:function () {
    this.handleQueryClick();
  },
  add:function () {
    this.setState({actionType:'add'});
    this.NewsTypeManageModal.showModal();
    this.NewsTypeManageModal.initEditData();
  },
  edit:function (record) {
    this.setState({actionType:'edit'});
    this.NewsTypeManageModal.showModal();
    this.NewsTypeManageModal.initEditData(record);
  },
  delete:function (record) {
    NewsTypeManageActions.getNewsByTypeUuid(record.uuid,record.optionName);
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
      <Button icon={Common.iconAdd} title="添加分类" type='primary' onClick={this.add}
              key='添加分类'>添加分类</Button>,
      <Button icon={Common.iconReset} title="刷新" onClick={this.reset} className='btn-margin'
              key="刷新"></Button>,
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
      defView: 'NewsTypeManageTable',
      totalPage: this.state.newsTypeManageSet.totalRow,
      currentPage: this.state.newsTypeManageSet.startPage,
      onRefresh: this.onTableRefresh,
    };
    let modalProps = {
      actionType:this.state.actionType
    };

    let recordSet = this.state.newsTypeManageSet.recordSet;
    return (
        <div className="grid-page content-wrap">
          <DictTable dataSource={recordSet} loading={this.state.loading} attrs={ attrProps } locale={{emptyText:'未检索到相关资讯分类信息，请确认是否已经添加资讯分类信息。'}}/>
          <NewsTypeManageModal  ref={ref=>this.NewsTypeManageModal=ref} {...modalProps}  />
        </div>
    );
  }
});

module.exports = NewsTypeManagePage;
