
let Reflux = require('reflux');
let DoorLogsActions = require('../action/DoorLogsActions');
let Utils = require('../../../../public/script/utils');
let MsgActions = require('../../../../lib/action/MsgActions');

let DoorLogsStore = Reflux.createStore({
  listenables: [DoorLogsActions],

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
    let self = this;
    self.startPage = startPage ? startPage:0, self.pageRow = pageRow?pageRow:10,self.flag=flag ? flag :'';
    let url = this.getServiceUrl('entranceLog/retrieve');
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
    //楼宇
    onGetBuildingByPark: function (filter) {
      let $this = this;
      let url = this.getServiceUrl('building/getListByParkUuid');
      Utils.doAjaxService(url, filter).then((result) => {
        //成功
        $this.recordSet = result.object.list;
        $this.filter = filter;
        //执行方法
        $this.fireEvent('building', '', $this);
      }, (err) => {
        //上面最后一个参数传入true时需要   其他时候不需要这个方法   错误公共处理
        console.log(err);
        this.trigger({
          errMsg: err.errDesc
        })
      });
    },
    //楼层
    onGetFloorByBuilding: function (filter) {
      let $this = this;
      let url = this.getServiceUrl('floor/getListByBuildingUuid');
      Utils.doAjaxService(url, filter).then((result) => {
        //成功
        $this.recordSet = result.object.list;
        $this.filter = filter;
        //执行方法
        $this.fireEvent('floor', '', $this);
      }, (err) => {
        //上面最后一个参数传入true时需要   其他时候不需要这个方法   错误公共处理
        console.log(err);
        this.trigger({
          errMsg: err.errDesc
        })
      });
    },
    //单元
    onGetCellByFloor: function (filter) {
      let $this = this;
      let url = this.getServiceUrl('cell/getCellByFloorUuid');
      Utils.doAjaxService(url, filter).then((result) => {
        //成功
        $this.recordSet = result.object.list;
        $this.filter = filter;
        //执行方法
        $this.fireEvent('cell', '', $this);
      }, (err) => {
        //上面最后一个参数传入true时需要   其他时候不需要这个方法   错误公共处理
        console.log(err);
        this.trigger({
          errMsg: err.errDesc
        })
      });
    },
    //单元门
    onGetDoorByCell: function (filter) {
      let $this = this;
      let url = this.getServiceUrl('door/getListByCellUuid');
      Utils.doAjaxService(url, filter).then((result) => {
        //成功
        $this.recordSet = result.object.list;
        $this.filter = filter;
        //执行方法
        $this.fireEvent('door', '', $this);
      }, (err) => {
        //上面最后一个参数传入true时需要   其他时候不需要这个方法   错误公共处理
        console.log(err);
        this.trigger({
          errMsg: err.errDesc
        })
      });
    },
  
 
  //下载所有
  downloadAll:function(){
    let url = this.getServiceUrl('entranceLog/exportXls');
    
  },
});

module.exports = DoorLogsStore;
