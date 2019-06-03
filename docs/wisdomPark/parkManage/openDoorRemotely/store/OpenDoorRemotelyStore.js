var Reflux = require('reflux');
var OpenDoorRemotelyActions = require('../action/OpenDoorRemotelyActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var OpenDoorRemotelyStore = Reflux.createStore({
  listenables: [OpenDoorRemotelyActions],
  filter: {},
  recordSet: [],
  startPage: 0,
  pageRow: 0,
  totalRow: 0,

  init: function () {},
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

    MsgActions.showError('opendoor', operation, errMsg);

  },

  onRetrieve: function (filter, startPage, pageRow) {
    this.startPage = startPage;
    this.pageRow = pageRow;
    var self = this;

    var url = this.getServiceUrl('opendoor/retrieve');
    Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function (result) {
      if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
        self.recordSet = result.object.list;
        console.log(self.recordSet);
        self.startPage = result.object.startPage;
        self.pageRow = result.object.pageRow;
        self.totalRow = result.object.totalRow;
        self.filter = filter;
        self.fireEvent('retrieve', '', self);
      } else {
        self.fireEvent('retrieve', '处理错误[' + result.errCode + '][' + result.errDesc + ']', self);
      }
    }, function (value) {
      self.fireEvent('retrieve', '调用服务错误', self);
    });
  },



  onOpenDoor: function (data) {

  },
  onOpenBatchDoor: function (data) {
    let $this = this;
    let url = this.getServiceUrl('park/openDoorFromRomote');
    Utils.doAjaxService(url, data).then((result) => {
        //成功
        $this.recordSet = result.object.list;
        //console.log($this.recordSet);
        $this.filter = data;
        //执行方法
        $this.fireEvent('onOpenBatchDoor','',$this);
    },(err)=>{
        //上面最后一个参数传入true时需要   其他时候不需要这个方法   错误公共处理
        this.trigger({
            errMsg: err.errDesc
        })
        console.log(err);
    });
  },
  //远程开门验证
  onOpenDoorLogin: function (filter) {
    var filter1={};
    filter1.openVerificationCode=filter.password;
    filter1.uuid=filter.parkUuid;
    let $this = this;
    let url = this.getServiceUrl('park/checkRemotevVerificationCode');
    Utils.doAjaxService(url, filter1).then((result) => {
        //成功
        $this.recordSet = result.object;
        $this.filter = filter;
        //执行方法
        $this.fireEvent('getSettledCompanySelectDoor','',$this);
    },(err)=>{
        //上面最后一个参数传入true时需要   其他时候不需要这个方法   错误公共处理
        this.trigger({
            errMsg: err.errDesc
        })
        console.log(err);
    });
  },
  //查询受控们信息
  onRetrievePark:function(filter,startPage,pageRow){
     this.startPage = startPage;
     this.pageRow = pageRow;
     var self = this;
     var filter1={};
     var url;
     if(filter.type==='PARK'){
       filter1.parkUuid=filter.itemUuid;
       url = this.getServiceUrl('park/getParkDoorInfoByCondition');
     }if(filter.type==='BUILDING'){
       filter1.parkUuid=filter.rootId;
       filter1.buildingUuid=filter.itemUuid;
      url = this.getServiceUrl('park/getBuildingDoorInfoByCondition');
    }if(filter.type==='FLOOR'){
        filter1.parkUuid=filter.rootId;
        filter1.buildingUuid=filter.parentId;
       filter1.floorUuid=filter.itemUuid;
       url = this.getServiceUrl('park/getFloorDoorInfoByCondition');
     }
     Utils.doRetrieveService(url, filter1, self.startPage, self.pageRow, self.totalRow).then(function (result) {
       if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
         self.recordSet = result.object.list;
         self.startPage = result.object.startPage;
         self.pageRow = result.object.pageRow;
         self.totalRow = result.object.totalRow;
         self.filter = filter;
         self.fireEvent('retrievePark', '', self);
       } else {
         self.fireEvent('retrievePark', '处理错误[' + result.errCode + '][' + result.errDesc + ']', self);
       }
     }, function (value) {
       self.fireEvent('retrievePark', '调用服务错误', self);
     });
   }
});

module.exports = OpenDoorRemotelyStore;
