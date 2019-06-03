'use strict';

import React from 'react';

var Reflux = require('reflux');
import { Tree, Spin } from 'antd';
const TreeNode = Tree.TreeNode;

var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
import emitter from './events';
var ParkMenuStore = require('../store/ParkMenuStore');
var ParkMenuActions = require('../action/ParkMenuActions');

var expandedKeys2 = [];
var selectedKeys2 = [];
var MenuTree = React.createClass({
    getInitialState: function () {
        return {
            menuSet: {
                recordSet: [],
            },
            loading: false,
            rootNodes: [],
            menuMap: {},
            selectedKeys2Value:{},
            expandedKeys:[],
            defaultExpandedKeys:[]
            
        }
    },
    mixins: [Reflux.listenTo(ParkMenuStore, "onServiceComplete")],
    onServiceComplete: function (data) {
        var rootNodes = [], defaultExpandedKeys = [],menuMap = {}, selectedKeys2Value= {};
        if (data.errMsg === '') {
            if(data.recordSet && data.recordSet.length > 1){
                rootNodes = Common.initTreeNodes(data.recordSet, this.preCrtNode);
                data.recordSet.map((data, i) => {
                    menuMap[data.itemUuid] = data;
                    if(data.level === '0'){
                        defaultExpandedKeys.push(data.itemUuid);
                    }
                });
                for(var key in menuMap){
                    if(key===selectedKeys2[0]){
                    //   this.setState({selectedKeys2Value:menuMap[key]});
                        selectedKeys2Value = menuMap[key];
                        break;
                    }
                  }
            }
        }
        this.state.expandedKeys = Utils.deepCopyValue(defaultExpandedKeys);
        this.setState({
            loading: false,
            menuSet: data,
            rootNodes: rootNodes,
            menuMap: menuMap,
            defaultExpandedKeys,
            selectedKeys2Value
        }, ()=>{
            if(defaultExpandedKeys.length){
                emitter.emit('ReviewTableCallMe',JSON.stringify({defaultExpandedKeys}));
            }
        });
    },
    initTree: function (parkUuid) {
        expandedKeys2 = [];
        selectedKeys2 = [];
        selectedKeys2[0]=parkUuid;
        if (parkUuid) {
            this.setState({ loading: true,expandedKeys:[]});
            ParkMenuActions.retrieveParkMenu(parkUuid);
        }
        else {
            this.setState({
                rootNodes: [],
                menuMap: {},
                expandedKeys:[]
            });
        }
    },

    // 第一次加载
    componentDidMount: function () {
        expandedKeys2 = [];
        selectedKeys2 = [];
    },

    onSelect: function (selectedKeys, e) {
        selectedKeys2 = selectedKeys;
        if (e.node != null) {
            var po = e.node.props;
            if (!po.expanded && typeof (po.children) !== 'undefined') {
                expandedKeys2.push(po.eventKey);
            }
            var selUuid = e.node.props.eventKey;
            var selNode = this.state.menuMap[selUuid];
            if (typeof (selNode) != 'undefined') {
                this.props.onSelect(selNode);
            }
        }
    },

    onExpand: function (expandedKeys, info) {
        expandedKeys2 = expandedKeys;
        this.setState({
            expandedKeys,
        });
    },

    preCrtNode: function (data, recordSet) {
        var node = {};
        node.key = data.itemUuid;
        node.pid = data.parentId;
        node.title = data.name;
        return node;
    },
    
    render: function () {
        if (this.state.rootNodes.length === 0) {
            if (this.state.loading) {
                return (<Spin tip="正在努力加载数据..." style={{ minHeight: '200px' }}></Spin>);
            }
            else {
                return (<div style={{ margin: '16px 0 0 16px' }}>暂时没有数据</div>);
            }
        }
        var tree =
            <Tree
                defaultExpandedKeys={this.state.defaultExpandedKeys}
                defaultSelectedKeys={selectedKeys2}
                onSelect={this.onSelect}
                onExpand={this.onExpand}
                selectedKeys={selectedKeys2}
                expandedKeys={this.state.expandedKeys}
            >
                {
                    this.state.rootNodes.map((data, i) => {
                        return Common.prepareTreeNodes(data);
                    })
                }
            </Tree>;

        return (
            (this.state.loading) ?
                <Spin tip="正在努力加载数据..." style={{ minHeight: '200px' }}>{tree}</Spin> :
                tree
        );
    }

});

module.exports = MenuTree;
