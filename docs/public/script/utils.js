import {Modal,message} from 'antd';
var $ = require('jquery');
var Promise = require('promise');
var FindNameActions = require('../../lib/action/FindNameActions');
var fetch = require('isomorphic-fetch');
module.exports = {
    initConf: function(conf) {
        this.hostList = [];
        for (var name in conf) {
            try {
                var value = conf[name];
                this[name] = value;

                if (value.startsWith('http')) {
                    this.hostList.push(value);
                }
            } catch (E) {}
        }

        // console.log(this);
    },

    // 服务器地址
    hostList: [],

    // 调用服务的序号
    actionFlowNo: 1,

    // LzSelect 选择项
    lzOptions: {},
    lzOptionsWait: {},
    loadOptions: function(appName2, optName, callback) {
        var opt = this.lzOptions[appName2];
        if (opt === null || typeof(opt) === 'undefined') {
            var lst = this.lzOptionsWait[appName2];
            if (lst !== null && typeof(lst) !== 'undefined') {
                lst.push({ name: optName, func: callback });
                return;
            }

            lst = [{ name: optName, func: callback }];
            this.lzOptionsWait[appName2] = lst;

            var self = this;
            var fileName = '';
            if (this.localDict) {
                fileName = this.paramUrl + '../dict/' + appName2 + '.js';
            } else {
                fileName = this.paramUrl + 'app-info/dict?appName=' + encodeURI(appName2);
            }

            $.getScript(fileName, function() {
                var itemMap = {};
                if (dict !== null) {
                    dict.map((node, i) => {
                        itemMap[node.indexName] = node;
                    });
                }

                // console.log(itemMap);
                self.lzOptions[appName] = itemMap;

                lst = self.lzOptionsWait[appName2];
                lst.map((nd, i) => {
                    var values = itemMap[nd.name];
                    if (nd.func !== null) {
                        nd.func((values === null || typeof(values) === 'undefined') ? [] : values, nd.name);
                    }
                });

                self.lzOptionsWait[appName2] = null;
            });
        } else {
            var values = opt[optName];
            if (callback !== null) {
                callback((values === null || typeof(values) === 'undefined') ? [] : values);
            }

            return values;
        }
    },
      loginService: function(url, data) {
        var self = this;
        var promise = new Promise(function(resolve, reject) {
          var record = {
            flowNo: self.getFlowNo(),
            term: 'web',
            object: data
          };
          
          $.ajax({
            type: 'post',
            url: url,
            contentType: 'application/json; charset=UTF-8',
            data: JSON.stringify(record),
            dataType: 'json',
            success: function(result, status, xhr) {
              self.saveSessionID(result, self);
            },
            xhrFields: {
              withCredentials: true
            },
            crossDomain: true
          }).done(resolve).fail(reject);
        });
        
        return promise;
      },
    sessionID: '',
    saveSessionID: function(result, self) {
        // console.log(result);
        if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
            self.sessionID = result.object.sessionId;
            window.sessionStorage.setItem('sessionID', self.sessionID);
            window.localStorage.setItem('sessionID', self.sessionID);
            window.localStorage.setItem('ssoToken', result.object.ssoToken);
        }
    },
    getSessionID: function() {
        if (this.sessionID === '') {
            this.sessionID = window.sessionStorage.getItem('sessionID');
        }

        return this.sessionID;
    },
    fz_setCookie: function(name, value, daysExpire) {
        var e = '';
        if (daysExpire) {
            var expires = new Date();
            expires.setTime(expires.getTime() + 1000 * 60 * 60 * 24 * daysExpire);
            e = ';expires=' + expires.toGMTString();
        }

        document.cookie = name + '=' + ((value == null) ? '' : escape(value)) + e + ';path=/';
    },
    fmtGetUrl: function(url) {
        var idx = url.indexOf('corp');
        if (idx >= 0) {
            return url;
        }

        if (window.loginData === undefined) {
            return url;
        }

        var compUser = window.loginData.compUser;
        if (compUser === null || compUser.corpUuid === '' || compUser.corpUuid === undefined) {
            return url;
        }

        idx = url.indexOf('?');
        if (idx >= 0) {
            url = url + '&corp=' + compUser.corpUuid;
        } else {
            url = url + '?corp=' + compUser.corpUuid;
        }

        return url;
    },
    getFlowNo: function() {
        var id = window.sessionStorage.getItem('serialID');
        if (id) {
            id = '' + (parseInt(id) + 1);
        } else {
            id = '100000';
        }

        window.sessionStorage.setItem('serialID', id);
        return id;
    },
    ajaxBody: function(url, data, self) {
        /*var sid = this.getSessionID();
        if( sid !== null ){
        	this.fz_setCookie('SESSION', sid, 1);
        }*/

        data.term = 'web';
        data.flowNo = this.getFlowNo();
        data.corp = window.sessionStorage.corpUuid || '127V0A3L79AVP001';
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

    fetch: function(url) {
        var promise = new Promise(function(resolve, reject) {
            $.get(url).done(resolve).fail(reject);
        });

        return promise;
    },

    doJsonService: function(url, data) {
        var req = this.ajaxBody(url, data);
        var promise = new Promise(function(resolve, reject) {
            $.ajax(req).done(resolve).fail(reject);
        });

        return promise;
    },

    doGetService: function(url) {
        url = this.fmtGetUrl(url);
        var promise = new Promise(function(resolve, reject) {
            $.get(url).done(resolve).fail(reject);
        });

        return promise;
    },
    /****************************正常查询接口*******************************/
    /**
     *  errorFlag见下个方法注释
    */
    doRetrieveService: function(url, filter, startPage, pageRow, totalRow,errorFlag) {
        let $this = this;
        let query = {
            pageRow: pageRow,
            startPage: startPage,
            totalRow: totalRow,
            object: filter
        };
        let filterObj = {
            flowNo: '0',
            object: query
        };
        let req = this.ajaxBody(url, filterObj);
        let promise = new Promise(function(resolve, reject) {
            $.ajax(req).done(
                (result)=>{
                  message.destroy();
                  if($this.checkServiceResult(result.errCode)){//请求成功
                    resolve(result)
                  }else{
                    errorFlag || $this.handleServiceError();
                    reject(result);
                  }
                }
            ).fail(
                (result)=>{
                  message.destroy();
                  errorFlag || $this.handleServiceError();
                  reject(result)
                }
            );
        });
        return promise;
    },
    /****************************正常请求接口*******************************/
    /**
     *  errorFlag 在参数的最后一个传入   true 为自行处理报错  直接通过reject传出去
     *  不传或者传false则默认全局处理报错
    */
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
              if($this.checkServiceResult(result.errCode)){//请求成功
                resolve(result)
              }else{
                errorFlag || $this.handleServiceError(result);
                reject(result);
              }
            }
        ).fail(
          (result)=>{
            message.destroy();
            errorFlag || $this.handleServiceError();
            reject(result)
          }
        );
      });
      return promise;
    },
    checkServiceResult:function (errCode) {
      let flag = false;
      if(errCode === null || errCode === '' || errCode === '000000'){
        flag = true;
      }
      return flag;
    },
    handleServiceError:function (err={errCode:'000001',errDesc:'接口请求错误！'}) {
      if(err.errCode==='AUTH09'){
        message.error('请重新登录！正在跳转登录页...',2);
        window.setTimeout(function () {
          window.location.href = window.location.origin +'/index.html';
        },2000)
      }else{
        message.error(`[${err.errCode}]-处理错误，${err.errDesc}!`,2);
      }
    },
    copyValue: function(fromObj, toObj) {
        for (var name in fromObj) {
            try {
                toObj[name] = fromObj[name];
            } catch (E) {}
        }
    },
    copyStrValue: function(fromObj, toObj) {
        for (var name in fromObj) {
            try {
                var str = fromObj[name];
                if (typeof str !== 'object') {
                    toObj[name] = str;
                }
            } catch (E) {}
        }
    },
    //深度拷贝对象
    deepCopyValue: function(source) {
        var sourceCopy = source instanceof Array ? [] : {};
        for (var item in source) {
            if (source[item] !== null) {
                sourceCopy[item] = typeof source[item] === 'object' ? this.deepCopyValue(source[item]) : source[item];
            } else {
                sourceCopy[item] = source[item] = null;
            }
        }
        return sourceCopy;
    },
    compareTo: function(fromObj, toObj) {
        if (typeof fromObj === 'string' || typeof toObj === 'string') {
            return (fromObj === toObj);
        }

        for (var name in fromObj) {
            try {
                if (toObj[name] !== fromObj[name]) {
                    return false;
                }
            } catch (E) {
                return false;
            }
        }

        for (var name in toObj) {
            try {
                if (toObj[name] !== fromObj[name]) {
                    return false;
                }
            } catch (E) {
                return false;
            }
        }

        return true;
    },

    findRecord: function(store, uuid) {
        // console.log(store, uuid);
        for (var x = store.recordSet.length - 1; x >= 0; x--) {
            if (store.recordSet[x].uuid === uuid) {
                return x;
            }
        }

        return -1;
    },

    getResErrMsg: function(value) {
        if (value !== undefined && value !== null) {
            var res = value.responseJSON;
            if (res !== undefined && res !== null) {
                var msg = res.message;
                if (msg !== undefined && msg !== null) {
                    return msg;
                }
            }
        }

        return '调用服务错误';
    },
    // 菜单权限
    selModName: '', // 查找菜单
    selectedApp: null, // 查找角色
    menuMap: {},
    getAppMenu: function(appName) {
        // 先检查菜单是否已经下载
        var loadedMenu = window.sessionStorage.getItem('loadedMenu');
        if (loadedMenu === null || loadedMenu === undefined || loadedMenu === '') {
            return null;
        }

        var isLoaded = false;
        var list = loadedMenu.split(',');
        for (var x = list.length - 1; x >= 0; x--) {
            if (appName === list[x]) {
                isLoaded = true;
                break;
            }
        }

        if (!isLoaded) {
            return null;
        }

        var m = this.menuMap[appName];
        if (m !== undefined && m !== null) {
            return m;
        }

        var ms = window.sessionStorage.getItem('menu.' + appName);
        if (ms !== undefined && ms !== null) {
            m = JSON.parse(ms);
            this.menuMap[appName] = m;

            this.selModName = appName;
            window.sessionStorage.setItem('activeMenu', appName);
            return m;
        }

        return null;
    },
    setSelectedApp: function(appCode) {
        this.selectedApp = null;

        if (typeof(window.loginData) === 'undefined') {
            return;
        }

        var appList = null;
        var compUser = window.loginData.compUser;
        if (compUser === null) {
            var user = window.loginData.authUser;
            if (user.userName === 'admin') {
                appList = [{ appCode: 'MA' }];
            } else {
                return;
            }
        } else {
            appList = compUser.appAuthList;
        }

        if (appList !== null) {
            if (appCode.charAt(0) === '*') {
                appCode = appCode.substr(1);
            }

            var len = appList.length;
            for (var x = 0; x < len; x++) {
                var app2 = appList[x];
                if (app2.appCode === appCode) {
                    this.selectedApp = app2;
                    window.sessionStorage.setItem('activeApp', appCode);
                    break;
                }
            }
        }
    },
    saveAppMenu: function(appName, menuList) {
        if (menuList === undefined || menuList === null) {
            menuList = [];
        }

        var m = {};
        menuList.map((node, i) => {
            m[node.menuPath] = node.roleName;
        });

        this.menuMap[appName] = m;
        window.sessionStorage.setItem('menu.' + appName, JSON.stringify(m));

        var loadedMenu = window.sessionStorage.getItem('loadedMenu');
        if (loadedMenu === null || loadedMenu === undefined || loadedMenu === '') {
            loadedMenu = appName;
        } else {
            loadedMenu = loadedMenu + ',' + appName;
        }

        window.sessionStorage.setItem('loadedMenu', loadedMenu);
    },
    setActiveMenuName: function(menuName) {
        this.selModName = menuName;
        window.sessionStorage.setItem('activeMenu', menuName);
    },
    // 检查权限：0=生产没有，1=有，2=测试没有
    checkMenuPriv: function(menuPath) {
        if (this.selectedApp === null) {
            // 页面刷新
            var appCode = window.sessionStorage.getItem('activeApp');
            if (appCode !== null && appCode !== undefined) {
                this.setSelectedApp(appCode);
            }

            var menuName = window.sessionStorage.getItem('activeMenu');
            if (menuName !== null && menuName !== undefined) {
                this.getAppMenu(menuName);
            }
        }

        if (this.selModName === '') {
            // 首页面
            return 1;
        }

        var m = this.menuMap[this.selModName];
        if (m === undefined || m === null) {
            return this.checkRole ? 0 : 2;
        }

        var role = m[menuPath];
        if (role === undefined || role === null) {
            // console.log('menuPath', menuPath)
            //            return 1;   // 禁止权限
            return this.checkRole ? 0 : 2;
        }

        if (role.indexOf('*') >= 0) {
            return 1;
        }

        // APP授权
        if (this.selectedApp === null) {
            return this.checkRole ? 0 : 2;
        }

        // 维护功能
        var compUser = window.loginData.compUser;
        if (compUser === null) {
            if ('MA' === this.selectedApp.appCode) {
                var user = window.loginData.authUser;
                if (user.userName === 'admin') {
                    return 1;
                }
            }
        }

        // 用户权限
        var roles = this.selectedApp.roleList;
        if (roles === null || roles === undefined) {
            return this.checkRole ? 0 : 2;
        }

        var list = roles.split(',');
        for (var x = list.length - 1; x >= 0; x--) {
            var rn = ',' + list[x] + ',';
            if (role.indexOf(rn) >= 0) {
                return 1;
            }
        }

        return this.checkRole ? 0 : 2;
    },
    checkAppPriv: function(appCode) {
        // console.log('this.checkRole', this.checkRole)
        if (typeof(window.loginData) === 'undefined') {
            return this.checkRole ? 0 : 2;
        }

        var compUser = window.loginData.compUser;
        if (compUser === null) {
            if ('MA' === appCode) {
                var user = window.loginData.authUser;
                if (user.userName === 'admin') {
                    return 1;
                }
            }

            return this.checkRole ? 0 : 2;
        }

        if (appCode.charAt(0) === '*') {
            // 无权限控制
            return 1;
        }

        // console.log('compUser.appAuthList', compUser.appAuthList)
        if (compUser.appAuthList !== null) {
            var len = compUser.appAuthList.length;
            for (var x = 0; x < len; x++) {
                var app2 = compUser.appAuthList[x];
                // console.log('app2', app2, appCode)
                if (app2.appCode === appCode) {
                    return 1;
                }
            }
        }

        //        return 1;
        return this.checkRole ? 0 : 2;
    },

    // 下载菜单
    downAppMenu: function(menuName, roleApp) {
        var self = this;
        var promise = new Promise(function(resolve, reject) {
            var m = self.getAppMenu(menuName);
            if (m) {
                self.setSelectedApp(roleApp);
                self.setActiveMenuName(menuName);
                resolve(m);
                return;
            }

            // 先下载菜单
            var url = self.authUrl + 'fnt-app-menu/appName';
            self.doCreateService(url, menuName).then(function(result) {
                if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                    self.saveAppMenu(menuName, result.object);

                    self.setSelectedApp(roleApp);
                    self.setActiveMenuName(menuName);
                    resolve(result.object);
                } else {
                    reject('下载菜单错误[' + result.errCode + '][' + result.errDesc + ']');
                }
            }, function(value) {
                reject('下载菜单错误');
            });
        });

        return promise;
    },

    formatRoutes: function(routes) {
        var url = window.location.href;
        if (url.startsWith('file:///')) {
            var pos = url.lastIndexOf('/');
            url = url.substr(0, pos);
            window.rootPath = url;

            var url2 = url.substr(7);
            routes.map((item, i) => {
                item.path = url2 + item.path;
            });
        } else {
            var pos = url.indexOf('?href=');
            var pos2 = url.indexOf('?linkid=');
            if (pos > 0 && pos2 > 0) {
                // alert('formatRoutes==' + url);
                routes.map((item, i) => {
                    if (!item.path.endsWith('.html')) {
                        item.path = '/safe' + item.path;

                        if (item.childRoutes) {
                            item.childRoutes.map((item2, i) => {
                                if (item2.path.charAt(0) === '/') {
                                    item2.path = '/safe' + item2.path;
                                }
                            });
                        }
                    }
                });
            }

            // console.log('routes', routes)
        }
    },
    showPage: function(href) {
        var url = window.location.href;
        if (window.rootPath) {
            if (href.startsWith('/index.html')) {
                href = href.replace(/index.html/g, 'electron.html');
            }

            document.location.href = window.rootPath + href;
        } else {
            document.location.href = href;
        }
    },

    downAppJson: function(appPage) {
        var self = appPage;
        var file = '/app.json';
        if (window.rootPath) {
            file = window.rootPath + file;
        }

        var util = this;
        var promise = new Promise(function(resolve, reject) {
            $.get(file).then(function(result) {
                resolve(result.appList);
            }, function(value) {
                reject('下载[' + file + ']错误');
            });
        });

        return promise;
    },

    // 下载菜单
    loadAuthMenu: function(modCode) {
        var file = '/auth/' + modCode + '.json';
        if (window.rootPath) {
            file = window.rootPath + file;
        }

        var util = this;
        var promise = new Promise(function(resolve, reject) {
            $.get(file).then(function(result) {
                resolve(result);
            }, function(value) {
                reject('下载[' + file + ']错误');
            });
        });

        return promise;
    },

    // 通过fetch方式处理文件流
    downloadExcelFile: function(url, params, callback, $this) {
        let formData = new FormData();

        var req = {
            flowNo: '0',
            object: params
        };

        req.term = 'web';
        if (typeof(window.loginData) !== 'undefined') {
            var compUser = window.loginData.compUser;
            req.corp = (compUser === null) ? '' : compUser.corpUuid;
        } else {
            req.corp = '';
        }

        formData.append('reqObject', JSON.stringify(req));

        let filename = '';

        fetch(this.fmtGetUrl(url), {
            method: 'POST',
            // 携带cookie信息
            credentials: 'include',
            body: formData,
            cache: 'no-cache'
        }).then(response => {
            if (response.ok) {

                // 后台返回的response有两种类型，文件流和json数据，只有导出出错的时候才会返回json
                let disp = response.headers.get('content-disposition');
                if (disp && disp.search('attachment') !== -1) {
                    let t = disp.split(';');

                    // content-disposition中包含文件名信息
                    // 格式为:attachment; filename=details.xls
                    if (t.length === 2 && t[1].indexOf('=') !== -1) {
                        try {
                            filename = decodeURIComponent(t[1].split('=')[1].split('.')[0].substring(1)) + '.xlsx';
                        } catch (err) {}
                    }


                    // 处理filename取不到或者扩展名不对的情况
                    // 如果扩展名为xls时，用Excel打开文件会出现警告，所以统一处理为xlsx
                    if (filename && filename.indexOf('xlsx') === -1) {
                        filename = '文件.xlsx';
                    }
                    return response.blob();
                } else {
                    return response.json();
                }
            } else {
                throw `服务通信异常status:${response.status}`;
            }
        }).then(resolve => {
            // 如果是blob类型，必然会有type属性
            if (resolve.type != null) {
                // 处理IE浏览器的情况
                if (navigator.msSaveBlob) {
                    $this.setState({ loading: false });
                    return navigator.msSaveBlob(resolve, filename);
                }

                let a = document.createElement('a');
                a.href = URL.createObjectURL(resolve);
                a.download = filename;
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();
                //去除主页面的按钮loading
                $this.setState({ loading: false });
                a.remove();
                // 记得释放对象，否则会影响性能
                URL.revokeObjectURL(a.href);
            } else {
                $this.setState({ loading: false });
                // 说明当前返回json，导出异常，通过回调函数处理错误信息
                callback(resolve);
            }

        }).catch(err => {
            // 服务器通讯异常
            console.error(err);
        });
    },
    
    //change 度  to 度分
    ChangeToDFM:function (val) {
      let str1 = val.split(".");
      let du1 = str1[0];
      let tp = "0."+str1[1]
      tp = new String(tp*60);		//这里进行了强制类型转换
      let str2 = tp.split(".");
      let fen =str2[0];
      tp = "0."+str2[1];
      tp = tp*60;
      let miao = parseInt(tp);
      let reternVal = du1+"°"+fen+"'"+miao+"\"";
      return reternVal;
    },
    now:function () {
      let D = new Date();
      let year = D.getFullYear(),
          month = D.getMonth()+1,
          day = D.getDate();
      month = month<10?'0'+month:month;
      day = day<10?'0'+day:day;
      return year+'-'+month+'-'+day;
    }
  
};