/**
 *   Create by Malson on 2018/4/25
 */
let Reflux = require('reflux');
var $ = require('jquery');
var Promise = require('promise');
var fetch = require('isomorphic-fetch');
import {message} from 'antd';
let NewsTypeManageActions = require('../action/NewsTypeManageActions');
let Utils = require('../../../../public/script/utils');
let MsgActions = require('../../../../lib/action/MsgActions');

let NewsTypeManageStore = Reflux.createStore({
  listenables: [NewsTypeManageActions],

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

    MsgActions.showError('settledCompany', operation, errMsg);
  },
  onRetrieveNewsTypeManage: function (filter, startPage, pageRow) {
    let self = this;
    let url = this.getServiceUrl('newsOption/retrieve');
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

    onSaveNewsTypeManage: function(filter) {
        let $this = this;
        let url = this.getServiceUrl('newsOption/create');
        this.doAjaxService(url, filter).then((result) => {
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
    doAjaxService:function (url,filter,errorFlag) {
      let filter2 = {
        flowNo: '0',
        object: filter
      };
      let req = this.ajaxBody(url, filter2);
      let $this = this;
      let promise = new Promise(function(resolve, reject) {
        $.ajax(req).done(
            (result)=>{
              message.destroy();
              if(Utils.checkServiceResult(result.errCode)){//请求成功
                resolve(result)
              }else{
                errorFlag || Utils.handleServiceError(result);
                reject(result);
              }
            }
        ).fail(
          ()=>{
            message.destroy();
            errorFlag || Utils.handleServiceError();
            reject()
          }
        );
      });
      return promise;
    },
    ajaxBody: function(url, data, self) {
        data.term = 'web';
        data.flowNo = Utils.getFlowNo();
        if (typeof(window.loginData) !== 'undefined') {
            data.corp = (data.object.corpUuid===''
            ||data.object.corpUuid===null||data.object.corpUuid===undefined) ? '' :data.object.corpUuid;
        } else {
            data.corp = '';
        }

        return {
            type: 'post',
            url: url,
            contentType: 'application/json; charset=UTF-8',
            data: JSON.stringify(data),
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true
        };
    },
    onUpdateNewsTypeManage: function(filter) {
        let $this = this;
        let url = this.getServiceUrl('newsOption/update');
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
    onDeleteNewsTypeManage: function(filter) {
      let $this = this;
      let url = this.getServiceUrl('newsOption/remove');
      Utils.doAjaxService(url, filter).then((result) => {
          $this.recordSet = result.object;
          $this.filter = filter;
          $this.fireEvent('remove','',$this);
      },(err)=>{
          this.trigger({
              errMsg: err.errDesc
          })
          console.log(err);
      });
    },
    onGetNewsByTypeUuid:function(filter,optionName){
      var $this=this;
      var filter1={};
      filter1.uuid=filter;
      filter1.optionName=optionName;
      var url=this.getServiceUrl('newsInfo/getNewsByTypeUuid');
      Utils.doAjaxService(url, filter).then((result) => {
          $this.recordSet = result.object;
          $this.filter = filter1;
          $this.fireEvent('getNewsByTypeUuid','',$this);
      },(err)=>{
          this.trigger({
              errMsg: err.errDesc
          })
          console.log(err);
      });
    },
});

module.exports = NewsTypeManageStore;
