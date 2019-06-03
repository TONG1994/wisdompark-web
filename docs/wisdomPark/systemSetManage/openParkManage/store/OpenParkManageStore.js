var Reflux = require('reflux');
var $ = require('jquery');
var OpenParkManageActions = require('../action/OpenParkManageActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var OpenParkManageStore = Reflux.createStore({
    listenables: [OpenParkManageActions],
    filter: {},
    recordSet: [],
    startPage : 0,
    pageRow : 0,
    totalRow : 0,
    parkLatitude:'',
    init: function() {},
    
    getServiceUrl: function(action){
      return Utils.wisdomparkUrl+action;
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
        errMsg: errMsg,
        parkLatitude:self.parkLatitude,
      });
  
      MsgActions.showError('sender', operation, errMsg);
  
    },
  
    // 查询园区
    onRetrievePark: function(filter, startPage, pageRow) {
      var self = this;
      var url = this.getServiceUrl('park/retrieve');
      Utils.doRetrieveService(url, filter, startPage, pageRow, self.totalRow).then(function(result) {
        if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
          self.recordSet = result.object.list;
          self.startPage = result.object.startPage;
          self.pageRow = result.object.pageRow;
          self.totalRow = result.object.totalRow;
          self.filter = filter;
          self.parkLatitude='';
          self.fireEvent('onRetrievePark', '', self);
        }
        else{
          self.fireEvent('onRetrievePark', result.errDesc, self);
        }
      }, function(value){
        self.fireEvent('onRetrievePark', '调用服务错误', self);
      });
    },

    // 增加园区
    onAddPark:function(form,data){
      let self=this;
      var url=this.getServiceUrl('park/create');
      self.doCreateService(url, data).then(function(result) {
          if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
            self.recordSet = result.object.list;
            self.startPage = result.object.startPage;
            self.pageRow = result.object.pageRow;
            self.totalRow = result.object.totalRow;
            self.parkLatitude = '',
            self.fireEvent('create', '', self);
          } else {
            self.fireEvent('create',  result.errDesc , self);
          }
      }, function(value) {
        self.fireEvent('create', util.getResErrMsg(value), self);
      });
    },

    // 新增方法
    doCreateService: function(url, data) {
      var record = {
          flowNo: '0',
          object: data
      };

      var req = Utils.ajaxBody(url, record);
      var promise = new Promise(function(resolve, reject) {
          $.ajax(req).done(resolve).fail(reject);
      });

      return promise;
  },

  // 编辑园区
  onUpdatePark: function(form,filter) {
      let $this = this;
      let url = this.getServiceUrl('park/update');
      Utils.doAjaxService(url, filter).then((result) => {
        if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
          $this.recordSet = result.object;
          $this.filter = filter;
          //执行方法
          $this.fireEvent('update','',$this);
        } else {
          self.fireEvent('update',  result.errDesc , self);
        }
      },(err)=>{
          //上面最后一个参数传入true时需要   其他时候不需要这个方法   错误公共处理
          this.trigger({
              errMsg: err.errDesc
          })
          console.log(err);
      });
  },

    // 删除园区
    onDeletePark:function(uuid){
      var url=this.getServiceUrl('park/remove');
      // 检测是否存在改数据
      let self=this;
      var idx=Utils.findRecord(self,uuid);
      if (idx < 0) {
        self.fireEvent('remove', '没有找到记录[' + uuid + ']', self);
        return;
      }
      // 删除操作
      this.recordDelete(uuid,url).then(function(result){
        if(Utils.checkServiceResult(result.errCode)){
          self.recordSet = result.object.list;
          self.startPage = result.object.startPage;
          self.pageRow = result.object.pageRow;
          self.totalRow = result.object.totalRow;
          self.fireEvent('remove','',self);
        }else{
          self.fireEvent('remove',result.errDesc,self);
        }
      },function(value){
        self.fireEvent('remove',Utils.getResErrMsg(value),self);
      });
    },

    // 获取地址定位
    onGetAddress:function(data){
      let self=this;
      let url=this.getServiceUrl('park/getParkLatitudebyParkAddress');
      this.onGetAddress2(url,data).then(function(result){
        if(Utils.checkServiceResult(result.errCode)){
          self.parkLatitude = result.object.parkLatitude;
          self.fireEvent('getAddress','',self);
        }else{
          self.fireEvent('getAddress',result.errDesc,self);
        }
      },function(value){
        self.fireEvent('getAddress',Utils.getResErrMsg(value),self);
      });

    },
    onGetAddress2:function(url,addressParam){
      let Param={
        flowNo:'0',
        object:addressParam
      };
      let req=Utils.ajaxBody(url,Param);
      let promise = new Promise(function(resolve, reject) {
        $.ajax(req).done(resolve).fail(reject);
      });
      return promise;
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

    //获取随机数
    onGetRandomData: function(){
      let self=this;
      let url=this.getServiceUrl('park/getEncryptionRuleWithOrder');
      Utils.doAjaxService(url).then((result) => {
        if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
          self.recordSet = result.object;
          //执行方法
          self.fireEvent('getRandomNum','',self);
        } else {
          self.fireEvent('getRandomNum',  result.errDesc , self);
        }
      },(value)=>{
        self.fireEvent('getRandomNum',Utils.getResErrMsg(value),self);
      });
    }

  });
  
  module.exports = OpenParkManageStore;