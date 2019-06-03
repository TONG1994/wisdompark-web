/**
 *   Create by Malson on 2018/4/19
 */
import React from 'react';
import LeftMenu from '../../lib/Components/LeftMenu';
let wisdomParkMenu = require('./menus');

const propTypes = {
  children: React.PropTypes.node
};

var ExpresscontrolledDoorManageMenu = React.createClass({
  getInitialState: function () {
    return {
      navItems: wisdomParkMenu.menus().controlledDoorManageMenus
    }
  },
  
  render: function () {
    let pathname = this.props.location.pathname||"/wisdomPark/controlledDoorManage/ControlledDoorPage/";
    return (
        <LeftMenu navItems={this.state.navItems} activeNode={pathname} children={this.props.children} />
    );
  }
});

ExpresscontrolledDoorManageMenu.propTypes = propTypes;
module.exports = ExpresscontrolledDoorManageMenu;