/**
 *   Create by Malson on 2018/4/25
 */
let Reflux = require('reflux');
import $ from 'jquery';
let SystemAccountManageAction = require('../action/SystemAccountManageAction');
let Utils = require('../../../../public/script/utils');
let MsgActions = require('../../../../lib/action/MsgActions');

let SettledCompanyStore = Reflux.createStore({
  listenables: [SystemAccountManageAction],

  filter: '',
  recordSet: [],
  startPage: 0,
  pageRow: 0,
  totalRow: 0,
  dataSource: [],

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
      dataSource:self.dataSource,
    });

    MsgActions.showError('SystemAccountManage', operation, errMsg);
  },
  //查询管理人员列表
  onRetrieveSystemAccount: function (filter, startPage, pageRow) {
    let self = this;
    let url = this.getServiceUrl('user/retrieve-park-manager');
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
    
    // //测试数据
    // self.recordSet=data;
    // self.startPage = startPage;
    // self.pageRow = pageRow;
    // self.totalRow = data.length;
    // self.filter = filter;
    // self.fireEvent('retrieve', '', self);
  },

    // 增加管理人员
    onSaveSystemAccount: function(filter,form) {
        let $this = this;
        let url = this.getServiceUrl('user/add-park-user');
        Utils.doAjaxService(url, filter).then((result) => {
          if(result.errCode == null || result.errCode == '' || result.errCode == '000000'){
            $this.recordSet = result.object;
            $this.filter = filter;
            $this.fireEvent('create','',$this);
          }else{
            self.fireEvent('create', '处理错误[' + result.errCode + '][' + result.errDesc + ']', self);
          }
        },(err)=>{
            self.fireEvent('create', '调用服务错误', self);
        });
    },
    // 编辑管理人员
    onUpdateSystemAccount: function(filter,form) {
        let $this = this;
        let url = this.getServiceUrl('company/update');
        form.setState({
          modal: false,
        })
        // Utils.doAjaxService(url, filter).then((result) => {
        //     //成功
        //     $this.recordSet = result.object;
        //     $this.filter = filter;
        //     //执行方法
        //     $this.fireEvent('update','',$this);
        // },(err)=>{
        //     //上面最后一个参数传入true时需要   其他时候不需要这个方法   错误公共处理
        //     this.trigger({
        //         errMsg: err.errDesc
        //     })
        //     console.log(err);
        // });
    },

    //检索出所有的园区
    onGetAllPark: function (filter) {
        let self = this;
        let url = this.getServiceUrl('park/retrieve');
        Utils.doAjaxService(url, filter).then((result) => {
          if(result.errCode == null || result.errCode == '' || result.errCode == '000000'){
            //成功
            self.recordSet = result.object.list;
            self.filter = filter;
            //执行方法
            self.fireEvent('getAllPark','',self);
          }else{
            self.fireEvent('getAllPark', '处理错误[' + result.errCode + '][' + result.errDesc + ']', self);
          }
        },(err)=>{
            console.log(err);
            self.fireEvent('getAllPark', '调用服务错误', self);
        });
    },

    //检索手机号
    onCheckPhone: function(filter){
      let self=this;
      let url = this.getServiceUrl('user/retrieve');
      Utils.doAjaxService(url,filter).then((result) =>{
        if(result.errCode == null || result.errCode == '' || result.errCode == '000000'){
          self.recordSet=result.object.list;
          self.filter=filter;
          self.fireEvent('checkPhone','',self);
        }else{
        self.fireEvent('checkPhone', '处理错误[' + result.errCode + '][' + result.errDesc + ']', self);
        }
      },(err)=>{
        self.fireEvent('checkPhone', '调用服务错误', self);
      })
    },

    //删除管理人员
    onDeleteAccount:function(uuid){
      var url=this.getServiceUrl('user/remove-park-manager');
      // 检测是否存在改数据
      let self=this;
      var idx=Utils.findRecord(self,uuid);
      if (idx < 0) {
        self.fireEvent('remove', '没有找到记录[' + uuid + ']', self);
        return;
      }
      let obj={
        uuid:uuid
      }
      // 删除操作
      self.recordDelete(obj,url).then(function(result){
        if(result.errCode == null || result.errCode == '' || result.errCode == '000000'){
          self.recordSet = result.object.list;
          self.fireEvent('remove','',self);
        }else{
          self.fireEvent('remove', '处理错误[' + result.errCode + '][' + result.errDesc + ']', self);
        }
      },(err)=>{
        console.log(err);
        self.fireEvent('remove', '调用服务错误', self);
      });
    },

    recordDelete:function(uuid,url){
      // 对数据做处理
      let deleteParam={
        flowNo:'0',
        object: uuid,
      };
      var req=Utils.ajaxBody(url,deleteParam);
      let promise = new Promise(function(resolve, reject) {
        $.ajax(req).done(resolve).fail(reject);
      });
      return promise;
    },
    
});

module.exports = SettledCompanyStore;
