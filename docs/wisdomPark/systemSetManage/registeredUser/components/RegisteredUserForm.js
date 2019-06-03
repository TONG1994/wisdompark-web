'use strict';

import React from 'react';
import { Form, Input, Upload, Button, Icon } from 'antd';
const FormItem = Form.Item;

let Common = require('../../../../public/script/common');
let Utils = require('../../../../public/script/utils');
import FormUtil from '../../../../lib/Components/FormUtil';


//components
// import Component from './Component';

module.exports = {
	layout: 'horizontal',
	colWidth: [6, 12, 18, 24],

	tableViews: [
		{ name: 'RegisteredUserTable', cols: ['userName', 'userCode', 'phone'], func: 'getRegUserTableColumns' }
	],
	initSettledCompanyForm(data) {
		data.userName = '';
		data.userCode = '';
		data.phone = '';
		data.userType = '';//员工类型：0：注册用户1：企业员工2：企业访客3：公司门禁管理员4：园区门禁管理员5：超级管理员

	},
    //列表标题
	getRegUserTableColumns: function (form) {
		var columns = [
			{
				title: '姓名',
				dataIndex: 'userName',
				key: 'userName',
				width: 20,
			},
			{
				title: '人员编号',
				dataIndex: 'userCode',
				key: 'userCode',
				width: 20
			},
			{
				title: '手机',
				dataIndex: 'phone',
				key: 'phone',
				width: 140
			},
			<render />
		];

		return columns;
	}
};

