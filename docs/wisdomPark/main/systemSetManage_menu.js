import React from 'react';
import LeftMenu from '../../lib/Components/LeftMenu';
let wisdomParkMenu =require('./menus');

const propTypes = {
    children: React.PropTypes.node
};

var systemSetManageMenu=React.createClass({
    getInitialState: function () {
        return {
          navItems: wisdomParkMenu.menus().systemSetManageMenus
        }
    },

    render: function () {
        let pathname = this.props.location.pathname||"/wisdomPark/systemSetManage/OpenParkManagePage/";
        return (
            <LeftMenu navItems={this.state.navItems} activeNode={pathname} children={this.props.children} />
        );
      }
});

systemSetManageMenu.propTypes = propTypes;
module.exports = systemSetManageMenu;