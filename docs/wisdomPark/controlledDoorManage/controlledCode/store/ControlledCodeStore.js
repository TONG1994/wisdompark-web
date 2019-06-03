var Reflux = require('reflux');
var ControlledCodeActions = require('../action/ControlledCodeActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var ControlledCodeStore = Reflux.createStore({
  listenables: [ControlledCodeActions],
  filter: {},
  recordSet: [],
  init: function() {
  },
  getServiceUrl: function(action)
    {
    return Utils.wisdomparkUrl+action;
  },

  fireEvent: function(operation, errMsg, self)
    {
    self.trigger({
      filter: self.filter,
      recordSet: self.recordSet,
      operation: operation,
      errMsg: errMsg,
    });
    MsgActions.showError('door', operation, errMsg);
  },

  onRetrieve: function(filter) {
    var self = this;
    var url = this.getServiceUrl('door/getDoorList');
    Utils.doAjaxService(url, filter).then(function(result) {
      if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
        self.recordSet = result.object;
        self.filter = filter;
        self.fireEvent('getDoorList', '', self);
      }
      else{
        self.fireEvent('getDoorList', '处理错误['+result.errCode+']['+result.errDesc+']', self);
      }
    }, function(value){
      self.fireEvent('getDoorList', '调用服务错误', self);
    });
  },
});

module.exports = ControlledCodeStore;
