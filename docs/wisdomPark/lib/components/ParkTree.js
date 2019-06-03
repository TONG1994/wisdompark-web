/**
 *   Create by Malson on 2018/7/26
 */

import React from 'react';
import { Tree } from 'antd';
const TreeNode = Tree.TreeNode;


let ParkTree = React.createClass({
  getInitialState: function () {
    return {
    };
  },
  onSelect:function (selectedKeys, info) {
    console.log('selected', selectedKeys, info)
  },
  render: function () {
    return (
        <Tree
            defaultExpandedKeys={['0-0-0']}
            defaultSelectedKeys={['0-0-0']}
            defaultCheckedKeys={['0-0-0']}
            onSelect={this.onSelect}
        >
            <TreeNode title="O-Park" key="0-0-0">
              <TreeNode title="一楼" key="0-0-0-0" />
              <TreeNode title="二楼" key="0-0-0-1" />
            </TreeNode>
            <TreeNode title="信息港" key="0-0-1">
              <TreeNode title="一楼" key="0-0-1-0" />
              <TreeNode title="停车场" key="0-0-1-1" />
            </TreeNode>
        </Tree>
    );
  }
});

module.exports = ParkTree;