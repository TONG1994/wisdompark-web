import React from 'react';
import {Button} from 'antd';
let Reflux= require('reflux');
let Common = require('../../../public/script/common');
var FormDef = require('./components/TrashCompanyForm');

import Filter from './components/Filter';
import TrashCompanyModal from './components/TrashCompanyModal';
let TrashCompanyStore = require('./store/TrashCompanyStore');
let TrashCompanyAction = require('./action/TrashCompanyAction');

import FormUtil from '../../../lib/Components/FormUtil';
import DictTable from '../../../lib/Components/DictTable';
const tableName = 'SettledCompanyTable';
let trashCompanyPage = React.createClass({
    getInitialState: function () {
    return {
      trashCompanySet: {
        recordSet:[],
        errMsg: '',
      },
      trashCompany:{},
      loading: false,
      filter:{},
      actionType:'',
    };
  },
  mixins: [Reflux.listenTo(TrashCompanyStore, 'onServiceComplete')],
  onServiceComplete: function (data) {
      this.setState({loading:false});
      if(data.errMsg){
          this.setState({errMsg:data.errMsg});
          return;
      }
      if (data.operation === 'retrievedeletecompany') {
          this.setState({
            trashCompanySet: Object.assign({}, this.state.trashCompanySet, data)
          });
      }
  },
  handleQueryClick: function () {
    let obj = this.filter.getFilter();
    if(obj){
      this.setState({ loading: true });
     // 根据条件调方法
     TrashCompanyAction.retrieveTrashCompany(obj,this.state.trashCompanySet.startPage,this.state.trashCompanySet.pageRow);
    }
  },
  componentDidMount: function () {
      var dataSet = this.state.trashCompanySet;
      var conf = FormUtil.getTableConf(tableName);
      dataSet.pageRow = (conf.page !== true) ? 0 : conf.pageRow;
      dataSet.startPage = (conf.page !== true) ? 0 : 1;
      this.handleQueryClick();
  },
  filterSearch:function () {
      this.handleQueryClick();
    },
  onTableRefresh: function (current, pageRow) {
    this.state.trashCompanySet.startPage = current;
    this.state.trashCompanySet.pageRow = pageRow;
    this.handleQueryClick();
  },
  reset:function () {
      let  filterInfo = {
          key:"companyName,公司名称",
          value:''
      };
      this.filter.setState({filterInfo,placeholder:'请输入公司名称'},()=>{this.handleQueryClick()});
  },
 
  select:function (record) {
    this.setState({actionType:'select'});
    this.trashCompanyModal.showModal();
    this.trashCompanyModal.initEditData(record);
  },
  render: function () {
    let operCol = {
      title: '操作',
      key: 'action',
      width: 120,
      render: (text, record) => {
        return (
          <span>
            <a href="#" title='查看' onClick={this.select.bind(this,record)} >查看</a>
          </span>
        )
      }
    };
    let leftButtons = [
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
      defView: 'SettledCompanyTable',
      totalPage: this.state.trashCompanySet.totalRow,
      currentPage: this.state.trashCompanySet.startPage,
      onRefresh: this.onTableRefresh,
    };
    let modalProps = {
      actionType:this.state.actionType
    };
    let recordSet = this.state.trashCompanySet.recordSet;
    return (
        <div className="grid-page content-wrap">
          <div className='table-filter'>
            <Filter key='filter' ref={ref=>this.filter=ref}  filterSearch={this.filterSearch}/>
          </div>
          <DictTable dataSource={recordSet} loading={this.state.loading} attrs={ attrProps } locale={{emptyText:'未检索到企业回收站信息，请确认企业回收站里存在公司列表信息。'}}/>
          <TrashCompanyModal  ref={ref=>this.trashCompanyModal=ref} {...modalProps}  />
        </div>
    );
  }
});
module.exports = trashCompanyPage;
