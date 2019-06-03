
import React from 'react';
import LeftMenu from '../../lib/Components/LeftMenu';
let wisdomParkMenu = require('./menus');

const propTypes = {
  children: React.PropTypes.node
};

var personnelManageMenu = React.createClass({
  getInitialState: function () {
    return {
      navItems: wisdomParkMenu.menus().personnelManageMenus
    }
  },
  
  render: function () {
    let pathname = this.props.location.pathname||"/wisdomPark/personnelManage/personnelPage/";
    return (
        <LeftMenu navItems={this.state.navItems} activeNode={pathname} children={this.props.children} />
    );
  }
});

personnelManageMenu.propTypes = propTypes;
module.exports = personnelManageMenu;