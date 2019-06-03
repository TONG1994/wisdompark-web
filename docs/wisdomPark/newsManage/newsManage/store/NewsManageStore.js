/**
 *   Create by Malson on 2018/4/25
 */
let Reflux = require('reflux');
let NewsManageActions = require('../action/NewsManageActions');
let Utils = require('../../../../public/script/utils');
let MsgActions = require('../../../../lib/action/MsgActions');

let NewsManageStore = Reflux.createStore({
  listenables: [NewsManageActions],

  filter: '',
  recordSet: [],
  startPage: 0,
  pageRow: 0,
  totalRow: 0,

  init: function () {
  },
  getServiceUrl: function (action) {
      return Utils.wisdomparkUrl + action;
  },

  fireEvent: function (operation, self,errMsg) {
    self.trigger({
      filter: self.filter,
      recordSet: self.recordSet,
      startPage: self.startPage,
      pageRow: self.pageRow,
      totalRow: self.totalRow,
      operation: operation,
      errMsg: errMsg
    });
  },
  
  onRetrieveNewsManage: function (filter,startPage,pageRow,totalRow=0) {
    let $this = this;
    let url = this.getServiceUrl('newsInfo/retrieve');
    Utils.doRetrieveService(url, filter,startPage,pageRow,totalRow).then((result) => {
      //先赋值
      $this.recordSet = result.object.list;
      $this.startPage = result.object.startPage;
      $this.pageRow = result.object.pageRow;
      $this.totalRow = result.object.totalRow;
      //执行方法
      $this.fireEvent('retrieve',$this);
    },(result)=>{
      //上面最后一个参数传入true时需要   其他时候不需要这个方法   错误公共处理
      $this.fireEvent('retrieve',$this,result.errDesc);
    });
  },
  
  onDelete: function (filter) {
    let $this = this;
    let url = this.getServiceUrl(`newsInfo/remove`);
    Utils.doAjaxService(url, filter).then((result) => {
      //成功
      $this.recordSet = result.object;
      $this.filter = filter;
      //执行方法
      $this.fireEvent('delete',$this);
    },(result)=>{
      //上面最后一个参数传入true时需要   其他时候不需要这个方法   错误公共处理
      $this.fireEvent('delete',$this,result.errDesc);
    });
  },
  
  onCreate: function (filter) {
    let $this = this;
    let url = this.getServiceUrl('newsInfo/create');
    Utils.doAjaxService(url, filter).then((result) => {
      //成功
      $this.recordSet = result.object;
      $this.filter = filter;
      //执行方法
      $this.fireEvent('create',$this);
    },(result)=>{
      $this.fireEvent('create',$this,result.errDesc);
    });
  },
  onUpdate: function (filter) {
    let $this = this;
    let url = this.getServiceUrl('newsInfo/update');
    Utils.doAjaxService(url, filter).then((result) => {
      //成功
      $this.recordSet = result.object;
      $this.filter = filter;
      //执行方法
      $this.fireEvent('update',$this);
    },(result)=>{
      $this.fireEvent('update',$this,result.errDesc);
    });
  },
  
  onGetNewsByUuid: function (filter) {
    let $this = this;
    let url = this.getServiceUrl('newsInfo/get-by-uuid');
    Utils.doAjaxService(url, filter).then((result) => {
      //成功
      $this.recordSet = result.object;
      $this.filter = filter;
      //执行方法
      $this.fireEvent('get-by-uuid',$this);
    },(result)=>{
      $this.fireEvent('get-by-uuid',$this,result.errDesc);
    });
  },
  
  onOpenStick:function (filter) {
    let $this = this;
    let url = this.getServiceUrl('newsInfo/openStick');
    Utils.doAjaxService(url, filter).then((result) => {
      //成功
      $this.recordSet = result.object;
      $this.filter = filter;
      //执行方法
      $this.fireEvent('openStick',$this);
    },(result)=>{
      $this.fireEvent('openStick',$this,result.errDesc);
    });
  },
  onCloseStick:function (filter) {
    let $this = this;
    let url = this.getServiceUrl('newsInfo/closeStick');
    Utils.doAjaxService(url, filter).then((result) => {
      //成功
      $this.recordSet = result.object;
      $this.filter = filter;
      //执行方法
      $this.fireEvent('closeStick',$this);
    },(result)=>{
      $this.fireEvent('closeStick',$this,result.errDesc);
    });
  },
  
});

module.exports = NewsManageStore;
