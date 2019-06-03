import React from 'react';
import Home from '../../login2/LoginPage2';
import DeskPage from './DeskPage';
let Common = require('../../public/script/common');
import NotFound from '../../lib/NotFound/index.js';


Common.getHomePage = function () {
  return {
    appGroup: 'XILAI',
    appName: '喜来快递',
    home: Common.wisdomParkHome
  };
};

const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/index.html',
    component: Home
  },
  {
    path: '/wisdomPark.html',
    component: Home
  },
  {
    path: '/wisdomPark/desk/',
    component: DeskPage
  },
  require('../routes'),
  { path: '*', component: NotFound }
];

export default routes;

