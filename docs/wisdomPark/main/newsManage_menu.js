/**
 *   Create by Malson on 2018/4/19
 */
import React from 'react';
import LeftMenu from '../../lib/Components/LeftMenu';
let wisdomParkMenu = require('./menus');

const propTypes = {
  children: React.PropTypes.node
};

var newsManageMenu = React.createClass({
  getInitialState: function () {
    return {
      navItems: wisdomParkMenu.menus().newsManageMenus
    }
  },
  
  render: function () {
    let pathname = this.props.location.pathname||"";
    return (
        <LeftMenu navItems={this.state.navItems} activeNode={pathname} children={this.props.children} />
    );
  }
});

newsManageMenu.propTypes = propTypes;
module.exports = newsManageMenu;