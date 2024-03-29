import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, IndexRedirect, RouterContext, match, browserHistory, createMemoryHistory } from 'react-router';
import routes from './routes-app';
//antd 中文
import { LocaleProvider,message } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';

var Utils = require('../../public/script/utils');
const outlet = document.getElementById('app');
// Client render (optional):
//判断浏览器兼容性
let passFlag = !FileReader && typeof document !== 'undefined';
if(passFlag){
  ReactDOM.render(
      <div style={{
        textAlign:'center',
        width:'100%',
        top:'200px',
        fontSize:24,
        position:'absolute'
      }}>请升级至较新的浏览器！（推荐谷歌、360或者QQ浏览器）</div>,
      outlet
  );
}else {
    let Holder;
    window.addEventListener('DOMContentLoaded', () => {
        Holder = require('holderjs');
    });
    Utils.formatRoutes(routes);
    ReactDOM.render(
        <LocaleProvider locale={zh_CN}>
          <Router
              onUpdate={() => {
                  window.scrollTo(0, 0);
  
                  if (Holder) {
                      Holder.run();
                  }
              }}
              history={browserHistory}
              routes={routes}
          />
        </LocaleProvider>,
        outlet
    );
}
//全局提示样式修改
message.config({
  top: 50,
});

browserHistory.listen(()=>{
  message.destroy();
});
