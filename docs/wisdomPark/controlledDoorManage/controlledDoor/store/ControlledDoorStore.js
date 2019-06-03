var Reflux = require('reflux');
var ControlledDoorActions = require('../action/ControlledDoorActions');
var Utils = require('../../../../public/script/utils');
// var MsgActions = require('../../../../lib/action/MsgActions');

var ProductStore = Reflux.createStore({
  listenables: [ControlledDoorActions],
  filter: {},
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
      errMsg: errMsg,
    });
    
    // MsgActions.showError('sender', operation, errMsg);
  },
  
  onRetrieve: function (filter) {
    let $this = this;
    let type = filter.type || 'park';
    let url = this.getServiceUrl(`${type}/getDetailByUuid`);
    Utils.doAjaxService(url, filter.uuid).then((result) => {
      //成功
      $this.recordSet = result.object || [];
      $this.filter = filter;
      //执行方法
      $this.fireEvent('retrieve',$this);
    },(result='')=>{
      //上面最后一个参数传入true时需要   其他时候不需要这个方法   错误公共处理
      let errMsg = result.errDesc || "错误";
      $this.fireEvent('retrieve',$this,errMsg);
    });
  },
  onDelete: function (filter) {
    let $this = this;
    let type = filter.type;
    let url = this.getServiceUrl(`${type}/remove`);
    Utils.doAjaxService(url, filter.uuid).then((result) => {
      //成功
      $this.recordSet = result.object || [];
      $this.filter = filter;
      //执行方法
      $this.fireEvent('delete',$this);
    },(result)=>{
      //上面最后一个参数传入true时需要   其他时候不需要这个方法   错误公共处理
      let errMsg = result.errDesc || "错误";
      $this.fireEvent('delete',$this,errMsg);
    });
  },
  onCreate: function (filter) {
    let $this = this;
    let type = filter.type;
    let url = this.getServiceUrl(`${type}/create`);
    Utils.doAjaxService(url, filter.data).then(() => {
      //执行方法
      $this.fireEvent('create',$this);
    },(result)=>{
      //上面最后一个参数传入true时需要   其他时候不需要这个方法   错误公共处理
      let errMsg = result.errDesc || "错误";
      $this.fireEvent('create',$this,errMsg);
    });
  },
  onUpdate: function (filter) {
    let $this = this;
    let type = filter.type;
    let url = this.getServiceUrl(`${type}/update`);
    Utils.doAjaxService(url, filter.data).then(() => {
      //执行方法
      $this.fireEvent('update',$this);
    },(result)=>{
      //上面最后一个参数传入true时需要   其他时候不需要这个方法   错误公共处理
      let errMsg = result.errDesc || "错误";
      $this.fireEvent('update',$this,errMsg);
    });
  }
});

module.exports = ProductStore;