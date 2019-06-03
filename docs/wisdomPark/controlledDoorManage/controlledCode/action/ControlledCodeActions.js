var Reflux = require('reflux');

var ControlledCodeActions = Reflux.createActions([
  'retrieve',
  'downloadPatch',
  'download'
]);

module.exports = ControlledCodeActions;
