var Reflux = require('reflux');
var ControllorInfoActions = require('../action/ControllorInfoActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var ControllorInfoStore = Reflux.createStore({
  listenables: [ControllorInfoActions],
  filter: {},
  recordSet: [],
  startPage: 0,
  pageRow: 0,
  totalRow: 0,
  doorStatus:'',
  doorSet:[],
  assignDoorSet:[],

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
      doorStatus:self.doorStatus,
      doorSet:self.doorSet,
      assignDoorSet:self.assignDoorSet,
    });

    MsgActions.showError('controllor', operation, errMsg);

  },
//查询控制器列表信息
  onRetrieve: function (filter) {
    var self = this;
    var url = this.getServiceUrl('controller/getControllerDetailList');
    Utils.doAjaxService(url, filter).then(function (result) {
      if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
        self.recordSet = result.object;
        self.filter = filter;
        self.fireEvent('retrieve', '', self);
      } else {
        self.fireEvent('retrieve', '处理错误[' + result.errCode + '][' + result.errDesc + ']', self);
      }
    }, function (value) {
      self.fireEvent('retrieve', '调用服务错误', self);
    });
  },
//获取未分配受控门
  onRetrieveDoor:function(filter){
    //console.log(filter);
    var self=this;
    var url = this.getServiceUrl('door/getFreeDoorList');
    Utils.doAjaxService(url, filter).then(function (result) {
      if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
        let list = result.object;
        self.doorSet = [];
        list.map((item, index)=>{
           let door = {
             doorUuid: item.uuid ? item.uuid : index,
             doorName:item.doorName,
           };
           self.doorSet.push(door);
        });
       
        self.filter = filter;
        self.fireEvent('getFreeDoorList', '', self);
      } else {
        self.fireEvent('getFreeDoorList', '处理错误[' + result.errCode + '][' + result.errDesc + ']', self);
      }
    }, function (value) {
      self.fireEvent('getFreeDoorList', '调用服务错误', self);
    });
  },

  onGetDoorStatus: function (data) {

  },
  //增加控制器
  onSaveController: function (filter) {
    let $this = this;
    let url = this.getServiceUrl('controller/create');
    Utils.doAjaxService(url, filter).then((result) => {
        $this.recordSet = result.object;
        $this.filter = filter;
        $this.fireEvent('create','',$this);
    },(err)=>{
        this.trigger({
            errMsg: err.errDesc
        })
        console.log(err);
    });

  },
  //修改控制器
  onUpdateController: function (filter) {
    let $this = this;
    let url = this.getServiceUrl('controller/update');
    Utils.doAjaxService(url, filter).then((result) => {
        $this.recordSet = result.object;
        $this.filter = filter;
        $this.fireEvent('update','',$this);
    },(err)=>{
        this.trigger({
            errMsg: err.errDesc
        })
        console.log(err);
    });
  },
  onAssignDoor: function (filter) {
    let $this = this;
    let url = this.getServiceUrl('controller/distributionDoor');
    Utils.doAjaxService(url, filter).then((result) => {
        let updateController = result.object;
        $this.assignDoorSet = result.object.controllerDoorList;
        $this.updateAssignDoor(updateController);
        $this.fireEvent('distributionDoor','',$this);
    },(err)=>{
        this.trigger({
            errMsg: err.errDesc
        })
        console.log(err);
    });
  },
  updateAssignDoor: function(newData){
     let obj = newData;
     let recordSet = this.recordSet;
     if(recordSet && recordSet.length){
       if(obj){
          for(let i=0;i<recordSet.length;i++){
            if(obj.uuid === recordSet[i].uuid){
              recordSet[i].controllerDoorList = Utils.deepCopyValue(obj.controllerDoorList);
              break;
            }
          }
       }
     }
  }
});

module.exports = ControllorInfoStore;
