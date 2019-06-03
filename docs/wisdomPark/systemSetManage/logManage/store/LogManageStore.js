
let Reflux = require('reflux');
let LogManageActions = require('../action/LogManageActions');
let Utils = require('../../../../public/script/utils');
let MsgActions = require('../../../../lib/action/MsgActions');

let LogManageStore = Reflux.createStore({
  listenables: [LogManageActions],

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

  fireEvent: function (operation, errMsg, self) {
    self.trigger({
      filter: self.filter,
      recordSet: self.recordSet,
      startPage: self.startPage,
      pageRow: self.pageRow,
      totalRow: self.totalRow,
      operation: operation,
      errMsg: errMsg,
    });

    MsgActions.showError('user', operation, errMsg);
  },

  //查询日志列表
  onQueryUser: function (filter, startPage, pageRow) {
    let self = this;
    let url = this.getServiceUrl('accessLog/retrieve');
    Utils.doRetrieveService(url, filter, startPage, pageRow, self.totalRow).then((result) => {
      if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
        self.recordSet = result.object.list;
        self.startPage = result.object.startPage;
        self.pageRow = result.object.pageRow;
        self.totalRow = result.object.totalRow;
        self.filter = filter;
        self.fireEvent('retrieve', '', self);
      } else {
        self.fireEvent('retrieve', '处理错误[' + result.errCode + '][' + result.errDesc + ']', self);
      }
    }, (value) => {
      self.fireEvent('retrieve', '调用服务错误', self);
    });
  },
 

});

module.exports = LogManageStore;
