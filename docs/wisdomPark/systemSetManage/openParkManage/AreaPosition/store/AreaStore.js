let Reflux = require('reflux');
let AreaActions = require('../action/AreaActions');
let Utils = require('../../../../../public/script/utils.js');

let AreaStore = Reflux.createStore({
  listenables: [AreaActions],
  recordSet:[],
  init: function() {
  },
  
  fireEvent: function(operation, errMsg, self)
  {
    self.trigger({
      filter: self.filter,
      recordSet: self.recordSet,
      startPage: self.startPage,
      pageRow: self.pageRow,
      totalRow: self.totalRow,
      operation: operation,
      errMsg: errMsg
    });
    
    MsgActions.showError('openPark', operation, errMsg);
  },
  getServiceUrl: function(action)
  {
    return Utils.xilaimanagerUrl+action;
  },
  //获取地址
  onGetAddressData: function(openPark) {
    var url = this.getServiceUrl('provinceCityRegion/getAllProvinceCityRegion');
    
    var self = this;
    Utils.doCreate(url, openPark).then(function (result) {
      // 修改下面的程序
      self.recordSet = [];
      self.recordSet.push(result);
      self.fireEvent('getAddress', '', self);
    }, function(errMsg){
      self.fireEvent('getAddress', errMsg, self);
    });
  },
});

module.exports = AreaStore;
