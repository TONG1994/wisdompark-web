
let Reflux = require('reflux');
let PersonnelActions = require('../action/PersonnelActions');
let Utils = require('../../../../public/script/utils');
let MsgActions = require('../../../../lib/action/MsgActions');
let Common = require('../../../../public/script/common');

let AddressStore = Reflux.createStore({
  listenables: [PersonnelActions],

  filter: '',
  recordSet: [],
  startPage: 0,
  pageRow: 0,
  totalRow: 0,
  flag: '',
  company: [],
  phone: [],

  init: function () {
  },
  getServiceUrl: function (action) {
    return Utils.wisdomparkUrl + action;
  },

  fireEvent: function (operation, errMsg, self) {
    self.trigger({
      filter: self.filter,
      recordSet: self.recordSet,
      personnelSet: self.personnelSet,
      startPage: self.startPage,
      pageRow: self.pageRow,
      totalRow: self.totalRow,
      operation: operation,
      errMsg: errMsg,
      flag: self.flag,
      company: self.company,
      phone: self.phone,
    });

    MsgActions.showError('user', operation, errMsg);
  },
  //查询员工列表
  onRetrieveAddress: function (filter, startPage, pageRow, flag) {
    let self = this;
    self.startPage = startPage ? startPage : 0, self.pageRow = pageRow ? pageRow : 10, self.flag = flag ? flag : '';
    let url = this.getServiceUrl('user/retrieve');
    Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow, true).then((result) => {
      if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
        if (flag === 'company') {
          self.company = result.object.list;
        } else if (flag === 'phone') {
          self.phone = result.object.list;
        } else {
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
  //搜索公司
  onRetrieveCompany: function (filter, startPage, pageRow) {
    let self = this;
    self.startPage = startPage ? startPage : 0, self.pageRow = pageRow ? pageRow : 10;
    let url = this.getServiceUrl('company/retrieve');
    Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow, true).then((result) => {
      if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
        self.personnelSet = result.object.list;
        self.startPage = result.object.startPage;
        self.pageRow = result.object.pageRow;
        self.totalRow = result.object.totalRow;
        self.filter = filter;

        self.fireEvent('retrieves', '', self);
      } else {
        self.fireEvent('retrieves', '处理错误[' + result.errCode + '][' + result.errDesc + ']', self);
      }
    }, (value) => {
      self.fireEvent('retrieves', '调用服务错误', self);
    });
  },
  //添加门禁管理员
  onAddUser: function (user) {
    let self = this;
    let url = this.getServiceUrl('user/add-company-user');
    Utils.doAjaxService(url, user, true).then((result) => {
      if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
        var type = typeof (result.object.list);
        if (type === 'object' && result.object.list.constructor === Array) {
          var len = result.object.list.length;
          for (var i = 0; i < len; i++) {
            self.recordSet.push(result.object.list[i]);
          }
        } else {
          self.recordSet.push(result.object);
        }
        self.totalRow = self.totalRow + 1;
        self.fireEvent('update', '', self);
      } else {
        self.fireEvent('update', '处理错误[' + result.errCode + '][' + result.errDesc + ']', self);
      }
    }, (value) => {
      Common.warnMsg(value.errDesc);
    }

    );
  },
  // 查询门禁权限
  onGetSettledPersonnelSelectedDoor: function (filter) {
    let $this = this;
    let url = this.getServiceUrl('user/get-door-by-user');
    Utils.doAjaxService(url, filter).then((result) => {
      //成功
      $this.recordSet = result.object;
      $this.filter = filter;
      //执行方法
      $this.fireEvent('getSettledPersonnelSelectDoor', '', $this);
    }, (err) => {
      //上面最后一个参数传入true时需要   其他时候不需要这个方法   错误公共处理
      this.trigger({
        errMsg: err.errDesc
      })
      console.log(err);
    });
  },
  //编辑
  onEdit: function (filter) {
    let $this = this;
    let url = this.getServiceUrl('user/updateCompanyUser');
    Utils.doAjaxService(url, filter).then((result) => {
      //成功
      $this.recordSet = result.object;
      $this.filter = filter;
      //执行方法
      $this.fireEvent('update', '', $this);
    }, (err) => {
      //上面最后一个参数传入true时需要   其他时候不需要这个方法   错误公共处理
      this.trigger({
        errMsg: err.errDesc
      })
      console.log(err);
    });
  },
  // 删除用户
  onDeleteUser: function (filter) {
    let $this = this;
    let url = this.getServiceUrl('user/remove-manager');
    Utils.doAjaxService(url, filter).then((result) => {
      //成功
      $this.recordSet = result.object;
      $this.filter = filter;
      //执行方法
      $this.fireEvent('remove', '', $this);
    }, (err) => {
      //上面最后一个参数传入true时需要   其他时候不需要这个方法   错误公共处理
      this.trigger({
        errMsg: err.errDesc
      })
      console.log(err);
    });
  },
  //锁定
  onLock: function (filter) {
    let $this = this;
    let url = this.getServiceUrl('user/lock-user');
    Utils.doAjaxService(url, { 'uuid': filter }).then((result) => {
      //成功
      $this.recordSet = result.object;
      $this.filter = filter;
      //执行方法
      $this.fireEvent('lock', '', $this);
    }, (err) => {
      //上面最后一个参数传入true时需要   其他时候不需要这个方法   错误公共处理
      this.trigger({
        errMsg: err.errDesc
      })
      console.log(err);
    });
  },

  //解锁
  onUnLock: function (filter) {
    let $this = this;
    let url = this.getServiceUrl('user/lock-user-out');
    Utils.doAjaxService(url, { 'uuid': filter }).then((result) => {
      //成功
      $this.recordSet = result.object;
      $this.filter = filter;
      //执行方法
      $this.fireEvent('lock', '', $this);
    }, (err) => {
      //上面最后一个参数传入true时需要   其他时候不需要这个方法   错误公共处理
      this.trigger({
        errMsg: err.errDesc
      })
      console.log(err);
    });
  },
});

module.exports = AddressStore;
