/**
 *   Create by Malson on 2018/4/25
 */
let Reflux = require('reflux');
let ParkAdministratorActions = require('../action/ParkAdministratorActions');
let Utils = require('../../../../public/script/utils');
let MsgActions = require('../../../../lib/action/MsgActions');

let ParkAdministratorStore = Reflux.createStore({
    listenables: [ParkAdministratorActions],

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

        MsgActions.showError('parkAdministrator', operation, errMsg);
    },
    //查询园区管理员列表
    onRetrieveParkAdministrator: function (filter, startPage, pageRow) {
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
    },

    // 增加园区管理员
    onSaveParkAdministrator: function(filter) {
        let $this = this;
        let url = this.getServiceUrl('user/add-park-user');
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
    // 得到全部菜单
    onGetAssess: function(filter) {
        let $this = this;
        let url = this.getServiceUrl('menu/getOptionalMenus');
        Utils.doAjaxService(url, filter).then((result) => {
            //成功
            $this.recordSet = result.object;
            $this.filter = filter;
            //执行方法
            $this.fireEvent('getAssess','',$this);
        },(err)=>{
            //上面最后一个参数传入true时需要   其他时候不需要这个方法   错误公共处理
            this.trigger({
                errMsg: err.errDesc
            })
            console.log(err);
        });
    },
    // 删除园区管理员
    onDeleteParkAdministrator: function(filter) {
        let $this = this;
        let url = this.getServiceUrl('user/remove-park-manager');
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
    // 查询当前管理员的权限
    onGetAssessSelf: function(filter) {
        let $this = this;
        let url = this.getServiceUrl('menu/getUserOptionalMenus');
        Utils.doAjaxService(url, filter).then((result) => {
            //成功
            $this.recordSet = result.object;
            $this.filter = filter;
            //执行方法
            $this.fireEvent('getAssessSelf','',$this);
        },(err)=>{
            //上面最后一个参数传入true时需要   其他时候不需要这个方法   错误公共处理
            this.trigger({
                errMsg: err.errDesc
            })
            console.log(err);
        });
    },
    // 保存
    onSaveParkAdministratorAssess: function(filter) {
        let $this = this;
        let url = this.getServiceUrl('menu/updUserMenus');
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
});

module.exports = ParkAdministratorStore;
