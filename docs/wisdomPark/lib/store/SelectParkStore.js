let Reflux = require('reflux');
let SelectParkActions = require('../action/SelectParkActions');
let Utils = require('../../../public/script/utils');

let SelectParkStore = Reflux.createStore({
  listenables: [SelectParkActions],
  recordSet:[],
  init: function() {
  },
  
  fireEvent: function(operation, errMsg, self)
  {
    self.trigger({
      filter: self.filter,
      recordSet: self.recordSet,
      operation: operation,
      errMsg: errMsg
    });
    
    MsgActions.showError('park', operation, errMsg);
  },
  getServiceUrl: function(action)
  {
      return Utils.wisdomparkUrl + action;
  },
  
    onRetrieve: function (filter) {
        let self = this;
        let url = this.getServiceUrl('park/retrieve');
        Utils.doRetrieveService(url, filter, null,null,null, true).then((result) => {
            if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                var arr = result.object.list;
                self.recordSet = arr;
                self.filter = filter;
                self.fireEvent('retrieve', '', self);
            } else {
                self.fireEvent('retrieve',`[${result.errCode}]${result.errDesc}`, self);
            }
        }, (result) => {
            self.fireEvent('retrieve', `[${result.errCode}]${result.errDesc}`, self);
        });
    },
});

module.exports = SelectParkStore;
