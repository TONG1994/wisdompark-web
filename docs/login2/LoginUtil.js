'use strict';
var $ = require('jquery');

var Common = require('../public/script/common');
var Utils = require('../public/script/utils');


module.exports = {
    loadContext: function () {
        // 安全连接
        var data = this.getHrefData();
        if (data.linkid) {
            return false;
        }

        // session内转移
        var loginData = window.sessionStorage.getItem('loginData');
        if (loginData !== null && typeof (loginData) !== 'undefined') {
            var utilConf = window.sessionStorage.getItem('utilConf');
            var commonConf = window.sessionStorage.getItem('commonConf');
            if (utilConf !== null && typeof (utilConf) !== 'undefined' &&
                commonConf !== null && typeof (commonConf) !== 'undefined') {
                var uConf = JSON.parse(utilConf);
                var cConf = JSON.parse(commonConf);
                Utils.initConf(uConf);
                Common.initConf(cConf);

                window.loginData = JSON.parse(loginData);
                return true;
            }
        }

        return false;
    },

    downConfig: function (loginPage) {
        var self = loginPage;

        var file = '/config.js';
        var href = window.location.href;
        if (href.startsWith('https:')) {
            file = '/config-s.js';
        }

        if (window.rootPath) {
            file = window.rootPath + file;
        }

        var promise = new Promise(function (resolve, reject) {
            self.setState({ loading: true });
            $.getScript(file, function (response, status) {

                if (status === 'success' || status === 'notmodified') {
                    Utils.initConf(utilConf);
                    Common.initConf(commonConf);
                    window.sessionStorage.setItem('utilConf', JSON.stringify(utilConf));
                    window.sessionStorage.setItem('commonConf', JSON.stringify(commonConf));

                    self.setState({ loading: false });
                    resolve(response);
                }
                else {
                    reject(response);
                }
            })
        });

        return promise;
    },

    getHrefData: function () {
        var href = window.location.href;
        // console.log('href', href)
        var pos = href.indexOf('?href=');
        if (pos < 0) {
            return { linkid: null };
        }

        var page = href.substr(pos + 6);
        pos = page.indexOf('?linkid=');
        if (pos < 0) {
            return { linkid: null};
        }

        var param = page.substr(pos + 8);
        page = page.substr(0, pos);
        pos = param.indexOf('&');
        var linkid = null;

        if (pos >= 0) {
            linkid: param.substr(0, pos);
            param = param.substr(1 + pos);
        }
        else {
            linkid = param;
            param = null;
        }

        if (page.charAt(0) !== '/') {
            page = '/' + page;
        }

        return { page: page, linkid: linkid, param: param };
    },

    // 检查是否安全导航
    isSafetyLogin: function (loginPage) {
        var data = this.getHrefData();
        if (!data.linkid) {
            return false;
        }

        loginPage.onSafetyNavi(null);
        return true;
    },

    safeNavi: function (loginPage, loginData) {
        var data = this.getHrefData();
        if (!data.linkid) {
            return false;
        }
        
        // 导航
        // console.log('data', data)
        Common.isShowMenu = false;
        loginPage.props.router.push({
            pathname: '/safe'+data.page,
            state: { from: 'safe' }
        });
    },

    saveLoginData: function (loginData, corpUuid) {
        try {
            // var corp = null;
            // var len = loginData.compUser.length;
            // for (var i = 0; i < len; i++) {
            //     if (loginData.compUser[i].corpUuid === corpUuid) {
            //         corp = loginData.compUser[i];
            //         break;
            //     }
            // }

            // loginData.compUser = corp;
            // console.log(loginData);
            window.loginData = loginData;
            window.sessionStorage.setItem('loginData', JSON.stringify(loginData));
            var  selectedParkUuid = loginData.userInfo.parkUuid;
            if(selectedParkUuid){
                window.selectedParkUuid = selectedParkUuid;
                window.sessionStorage.setItem('selectedParkUuid', selectedParkUuid);
            }
        }
        catch (err) {
            console.log(err);
        }

        try {
            // 清空缓存的菜单
            window.sessionStorage.setItem('loadedMenu', '');
        }
        catch (err) {
            console.log(err);
        }
    }

}
