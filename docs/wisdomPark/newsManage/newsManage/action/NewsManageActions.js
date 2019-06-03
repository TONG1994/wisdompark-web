/**
 *   Create by Malson on 2018/8/14
 */

var Reflux = require('reflux');

var NewsManageActions = Reflux.createActions([
  'retrieveNewsManage',
  'create',
  'update',
  'delete',
  'getNewsByUuid',
  'changeStick',
  'openStick',
  'closeStick',
]);

module.exports = NewsManageActions;