'use strict';

import React from 'react';
import { Form, Input } from 'antd';
const FormItem = Form.Item;

let Common = require('../../../../public/script/common');
let Utils = require('../../../../public/script/utils');
import FormUtil from '../../../../lib/Components/FormUtil';
import SearchPhone from './SearchPhone';

module.exports = {
	layout: 'horizontal',
	colWidth: [6, 12, 18, 24],
	
	tableViews: [
		{ name: 'SystemAccountManageTable', cols: ['accountName','userName','phone','parkName'], func: 'getSystemAccountManageTableColumns' }
	],
	
	getSystemAccountManageTableColumns: function (form) {
		var columns = [
			{
				title: '用户名',
				dataIndex: 'accountName',
				key: 'accountName',
				width: 80,
			},
			{
				title: '姓名',
				dataIndex: 'userName',
				key: 'userName',
				width: 130
			},
			{
				title: '手机',
				dataIndex: 'phone',
				key: 'phone',
				width: 120,
			},
			{
				title: '所属园区',
				dataIndex: 'parkName',
				key: 'parkName',
				width: 200,
			},
		];

		return columns;
	},

	initSystemAccountManageForm(data){
      	data.parkName = '';
      	data.accountName = '';
				data.phone='';
				data.userName='';
	},

	getSystemAccountManageFormRule: function (form, attrList)
	{
		var attrMap = {};
		if (attrList) {
			var count = attrList.length;
			for (var x = 0; x < count; x++) {
				var {
					name,
					...attrs
				} = attrList[x];

				if (attrs) attrMap[name] = attrs;
			}
		}

		var rules = [
			{ id: 'parkName', desc: '所属园区', required: true, ...attrMap.parkName },
			{ id: 'accountName', desc: '用户名' , max:20, required: true, ...attrMap.accountName },
			{ id: 'phone', desc: '手机号', required: true, ...attrMap.phone ,max:11 },
			{ id: 'userName', desc: '姓名', required: true, ...attrMap.userName },
		];

		return rules;
	},
	
	getSystemAccountManageForm: function (form, data, attrList, labelWidths, layout) {
		if (!labelWidths) {
			labelWidths = [16, 8, 6, 5];
		}
		
		var attr = FormUtil.getParam(form, attrList);
		var attrMap = attr.attrMap;

		if (!layout) {
			layout = this.layout;
		}

		var layoutItem = 'form-item-' + layout;
		var itemLayouts = FormUtil.getItemLayout(layout, labelWidths);
		
		var hints = form.state.hints;
		var items = [
			<FormItem {...itemLayouts[3] } key='parkName' label='所属园区' required='true' colon={true} help={hints.parkNameHint} validateStatus={hints.parkNameStatus}  className={layoutItem} >
					{attr.objMap.parkName}
			</FormItem >,
			<FormItem {...itemLayouts[3] } key='accountName' label='用户名' required='true' colon={true} help={hints.accountNameHint} validateStatus={hints.accountNameStatus}  className={layoutItem} >
				<Input type='text' name='accountName' id='accountName' value={data.accountName} onChange={form.RewriteHandleOnChange}    {...attrMap.accountName} placeholder='输入用户名' size='large'/>
			</FormItem >,
			<FormItem {...itemLayouts[3] } key='phone' label='手机号' required='true' colon={true} help={hints.phoneHint} validateStatus={hints.phoneStatus}  className={layoutItem} >
				<SearchPhone name="phone" id="phone" ref = {ref=>form.searchPhone = ref} onChange={form.handleSelectPhone} value={form.state.systemAccount.phone}/>
			</FormItem >,
			<FormItem {...itemLayouts[3] } key='userName' label='姓名' required='true' colon={true} help={hints.userNameHint} validateStatus={hints.userNameStatus}  className={layoutItem} >
				<Input type='text' name='userName' id='userName' value={form.state.systemAccount.userName} onChange={form.handleOnChange}    {...attrMap.userName} placeholder='输入姓名' size='large' disabled/>
			</FormItem >,
		];
		
		return FormUtil.adjuestForm(items, attr.showMap, this.colWidth);
	},
	
};

