/**
 *   Create by Malson on 2018/4/25
 */
let Reflux = require('reflux');
let ParkManageActions = require('../action/ParkManageActions');
let Utils = require('../../../../public/script/utils');
let MsgActions = require('../../../../lib/action/MsgActions');

let ParkManageStore = Reflux.createStore({
    listenables: [ParkManageActions],

    filter: '',
    recordSet: [],
    startPage: 0,
    pageRow: 0,
    totalRow: 0,
    parkLatitude:'',
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
            parkLatitude:self.parkLatitude,
        });

        MsgActions.showError('settledCompany', operation, errMsg);
    },
    // 获取园区基础信息
    getParkByUuid: function(filter) {
        let $this = this;
        let url = this.getServiceUrl('park/get-by-uuid');
        Utils.doAjaxService(url, filter).then((result) => {
            //成功
            $this.recordSet = result.object;
            $this.filter = filter;
            //执行方法
            $this.fireEvent('getbyuuid','',$this);
        },(err)=>{
            //上面最后一个参数传入true时需要   其他时候不需要这个方法   错误公共处理
            this.trigger({
                errMsg: err.errDesc
            })
            console.log(err);
        });
    },
    //编辑园区信息
    onUpdatePark: function(filter) {
        console.log(filter);
        let $this = this;
        let url = this.getServiceUrl('park/update');
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
    // // 获取地址定位
    // onGetAddress:function(data){
    //     console.log(data);
    //     let self=this;
    //     let url=this.getServiceUrl('park/getParkLatitudebyParkAddress');
    //     this.onGetAddress2(url,data).then(function(result){
    //       console.log('55555555555555555555555555555555555');
    //       if(Utils.checkServiceResult(result.errCode)){
    //         self.parkLatitude = result.object.parkLatitude;
    //         console.log(self.parkLatitude);
            
    //         self.fireEvent('getAddress','',self);
    //       }else{
    //         self.fireEvent('getAddress',result.errDesc,self);
    //       }
    //     },function(value){
    //       self.fireEvent('getAddress',Utils.getResErrMsg(value),self);
    //     });
  
    //   },
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
});

module.exports = ParkManageStore;
