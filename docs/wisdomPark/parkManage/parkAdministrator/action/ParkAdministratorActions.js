var Reflux = require('reflux');

var ParkAdministratorActions = Reflux.createActions([
    'retrieveParkAdministrator',
    'saveParkAdministrator',
    'deleteParkAdministrator',
    'getAssess',
    'getAssessSelf',
    'saveParkAdministratorAssess'
]);

module.exports = ParkAdministratorActions;