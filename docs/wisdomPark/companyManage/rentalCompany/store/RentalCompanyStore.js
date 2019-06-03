/**
 *   Create by Malson on 2018/4/25
 */
let Reflux = require('reflux');
let RentalCompanyActions = require('../action/RentalCompanyActions');
let Utils = require('../../../../public/script/utils');
let MsgActions = require('../../../../lib/action/MsgActions');

let RentalCompanyStore = Reflux.createStore({
  listenables: [RentalCompanyActions],

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

    MsgActions.showError('rentalCompany', operation, errMsg);
  },
  //查询企业列表
  onRetrieveRentalCompany: function (filter, startPage, pageRow) {
    let self = this;
    let url = this.getServiceUrl('company/retrieverentinfo');
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

    // 增加企业
    onSaveRentalCompany: function(filter) {
        let $this = this;
        let url = this.getServiceUrl('company/createcompanyrent');
        Utils.doAjaxService(url, filter).then((result) => {
            //成功
            $this.recordSet = result.object;
            $this.filter = filter;
            //执行方法
            $this.fireEvent('create','',$this);
        },(err)=>{
            //上面最后一个参数传入true时需要   其他时候不需要这个方法   错误公共处理
            this.trigger({
                errMsg: err.errDesc
            })
            console.log(err);
        });
    },
    // 修改企业
    onUpdateRentalCompany: function(filter) {
        let $this = this;
        let url = this.getServiceUrl('company/updatecompanyrent');
        Utils.doAjaxService(url, filter).then((result) => {
            //成功
            $this.recordSet = result.object;
            $this.filter = filter;
            //执行方法
            $this.fireEvent('update','',$this);
        },(err)=>{
            //上面最后一个参数传入true时需要   其他时候不需要这个方法   错误公共处理
            this.trigger({
                errMsg: err.errDesc
            })
            console.log(err);
        });
    },
    // 删除企业
    onDeleteRentalCompany: function(filter) {
        let $this = this;
        let url = this.getServiceUrl('company/removecompanyrent');
        Utils.doAjaxService(url, filter).then((result) => {
            //成功
            $this.recordSet = result.object;
            $this.filter = filter;
            //执行方法
            $this.fireEvent('remove','',$this);
        },(err)=>{
            //上面最后一个参数传入true时需要   其他时候不需要这个方法   错误公共处理
            this.trigger({
                errMsg: err.errDesc
            })
            console.log(err);
        });
    },
    // 删除压缩包
    onDeleteRentalCompanyFile: function(filter) {
        let $this = this;
        let url = this.getServiceUrl('/gridfs/deleteCompanyFile');
        Utils.doAjaxService(url, filter).then((result) => {
            //成功
            $this.recordSet = result.object;
            $this.filter = filter;
            //执行方法
            $this.fireEvent('removes','',$this);
        },(err)=>{
            //上面最后一个参数传入true时需要   其他时候不需要这个方法   错误公共处理
            this.trigger({
                errMsg: err.errDesc
            })
            console.log(err);
        });
    },
});

module.exports = RentalCompanyStore;
