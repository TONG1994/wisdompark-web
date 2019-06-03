
let Reflux = require('reflux');
let ParkLogsActions = require('../action/ParkLogsActions');
let Utils = require('../../../../public/script/utils');
let MsgActions = require('../../../../lib/action/MsgActions');

let ParkLogsStore = Reflux.createStore({
  listenables: [ParkLogsActions],

  filter: '',
  recordSet: [],
  startPage: 0,
  pageRow: 0,
  totalRow: 0,
  flag:'',
  company:[],
  phone:[],

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
      flag:self.flag,
      company:self.company,
      phone:self.phone,
    });

    MsgActions.showError('user', operation, errMsg);
  },
//查询
  onGetAddress: function (filter, startPage, pageRow, flag) {
    filter.grade='1';
    let self = this;
    self.startPage = startPage ? startPage:0, self.pageRow = pageRow?pageRow:10,self.flag=flag ? flag :'';
    let url = this.getServiceUrl('accessLog/retrieve');
    Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow,true).then((result) => {
      if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
        if(flag === 'company'){
          self.company = result.object.list;
        } else if(flag === 'phone'){
          self.phone = result.object.list;
        } else{
          self.recordSet = result.object.list;
          self.startPage = result.object.startPage;
          self.pageRow = result.object.pageRow;
          self.totalRow = result.object.totalRow;
          self.filter = filter;
        }
       
        self.fireEvent('retrieve', '', self);
      } else {
        self.fireEvent('retrieve', '处理错误[' + result.errCode + '][' + result.errDesc + ']', self);
      }
    }, (value) => {
      self.fireEvent('retrieve', '调用服务错误', self);
    });
  },
});

module.exports = ParkLogsStore;
