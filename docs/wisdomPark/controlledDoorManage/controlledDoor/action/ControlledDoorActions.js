var Reflux = require('reflux');

var ExpressActions = Reflux.createActions([
    'retrieve',
    'delete',
    'update',
    'create',
    'createDoor'
]);

module.exports = ExpressActions;