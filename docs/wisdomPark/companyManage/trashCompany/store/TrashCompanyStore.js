/**
 *   Create by Malson on 2018/4/25
 */
let Reflux = require('reflux');
let TrashCompanyAction = require('../action/TrashCompanyAction');
let Utils = require('../../../../public/script/utils');
let MsgActions = require('../../../../lib/action/MsgActions');

let TrashCompanyStore = Reflux.createStore({
  listenables: [TrashCompanyAction],

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
      errMsg: errMsg
    });

    MsgActions.showError('trashCompany', operation, errMsg);
  },
  //查询企业回收站列表
  onRetrieveTrashCompany: function (filter, startPage, pageRow) {
    let self = this;
    let url = this.getServiceUrl('company/retrievedeletecompany');
      Utils.doRetrieveService(url, filter, startPage, pageRow, self.totalRow).then((result) => {
      if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
        self.recordSet = result.object.list;
        self.startPage = result.object.startPage;
        self.pageRow = result.object.pageRow;
        self.totalRow = result.object.totalRow;
        self.filter = filter;
        self.fireEvent('retrievedeletecompany', '', self);
      } else {
        self.fireEvent('retrievedeletecompany', '处理错误[' + result.errCode + '][' + result.errDesc + ']', self);
      }
    }, (value) => {
      self.fireEvent('retrievedeletecompany', '调用服务错误', self);
    });
  },
});

module.exports = TrashCompanyStore;
