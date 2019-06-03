/**
 *   Create by Malson on 2018/4/19
 */
import React from 'react';
import LeftMenu from '../../lib/Components/LeftMenu';
let wisdomParkMenu = require('./menus');

const propTypes = {
  children: React.PropTypes.node
};

var parkManageMenu = React.createClass({
  getInitialState: function () {
    return {
      navItems: wisdomParkMenu.menus().parkManageMenus
    }
  },
  
  render: function () {
    let pathname = this.props.location.pathname||"/wisdomPark/parkManage/ParkManagePage/";
    return (
        <LeftMenu navItems={this.state.navItems} activeNode={pathname} children={this.props.children} />
    );
  }
});

parkManageMenu.propTypes = propTypes;
module.exports = parkManageMenu;