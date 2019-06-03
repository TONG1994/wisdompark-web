var Reflux = require('reflux');
var ParkMenuActions = require('../action/ParkMenuActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/Components/ServiceMsg');

var ParkMenuStore = Reflux.createStore({
	listenables: [ParkMenuActions],
	parkUuid: '',
	recordSet: [],
	startPage : 0,
	pageRow : 0,
	totalRow : 0,
	init: function() {
	},
	getServiceUrl: function(action)
	{
		return Utils.wisdomparkUrl+action;
	},
	
	fireEvent: function(operation, errMsg, self)
	{
		self.trigger({
			parkUuid: self.parkUuid,
			recordSet: self.recordSet,
			operation: operation,
			errMsg: errMsg
		});
	},
	
	onRetrieveParkMenu: function(parkUuid) {
		var self = this;
		var filter = {};
		filter.parkUuid = parkUuid;
		var url = this.getServiceUrl('park/getParkDetailByParkUuid');
		Utils.doAjaxService(url, parkUuid).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = result.object.threeMenuItemList;
				self.parkUuid = parkUuid;
				self.fireEvent('getParkDetailByParkUuid', '', self);
			}
			else{
				self.fireEvent('getParkDetailByParkUuid', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('getParkDetailByParkUuid', "调用服务错误", self);
		});
	},
});

module.exports = ParkMenuStore;

