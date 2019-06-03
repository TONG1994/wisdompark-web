/**
 *   Create by Malson on 2018/4/25
 */

var Reflux = require('reflux');

var NewsTypeManageActions = Reflux.createActions([
  'retrieveNewsTypeManage',
  'saveNewsTypeManage',
  'updateNewsTypeManage',
  'deleteNewsTypeManage',
  'getNewsByTypeUuid'
]);

module.exports = NewsTypeManageActions;
