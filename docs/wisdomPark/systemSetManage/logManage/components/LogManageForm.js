'use strict';

import React from 'react';
import { Form, Input, Upload, Button, Icon } from 'antd';
const FormItem = Form.Item;

let Common = require('../../../../public/script/common');
let Utils = require('../../../../public/script/utils');

module.exports = {
	layout: 'horizontal',
	colWidth: [6, 12, 18, 24],

	tableViews: [
		{ name: 'LogManageTable', cols: ['accountName', 'createTime', 'moduleName', 'operation'], func: 'getLogManageTableColumns' }
	],

  //列表标题
  getLogManageTableColumns: function (form) {
		var columns = [
			{
				title: '操作账户',
				dataIndex: 'accountName',
				key: 'accountName',
				width: 30,
			},
			{
				title: '操作时间',
				dataIndex: 'createTime',
				key: 'createTime',
				width: 50
			},
			{
				title: '操作模块',
				dataIndex: 'moduleName',
				key: 'moduleName',
				width: 40
			},
			{
				title: '操作类型',
				dataIndex: 'operation',
				key: 'operation',
				width: 130
			},
		];

		return columns;
	}
};

