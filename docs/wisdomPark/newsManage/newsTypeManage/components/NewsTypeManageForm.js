'use strict';

import React from 'react';
import { Form, Input } from 'antd';
const FormItem = Form.Item;

let Common = require('../../../../public/script/common');
let Utils = require('../../../../public/script/utils');
import FormUtil from '../../../../lib/Components/FormUtil';



module.exports = {
	layout: 'horizontal',
	colWidth: [6, 12, 18, 24],

	tableViews: [
		{ name: 'NewsTypeManageTable', cols: ['optionName'], func: 'getNewsTypeManageTableColumns' }
	],

	initNewsTypeManageForm(data){
		data.optionName = '';
		delete data._id;
		delete data.uuid;
		delete data.updateDate;
		delete data.createDate;
	},

	getNewsTypeManageFormRule: function (form, attrList)
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
			{ id: 'optionName', desc: '资讯分类',required:true, max: '30',min:'2', ...attrMap.newsType },
		];

		return rules;
	},

	getNewsTypeManageForm: function (form, data, attrList, labelWidths, layout) {
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
			<FormItem required {...itemLayouts[3] } key='optionName' label='资讯分类'  colon={true} help={hints.optionNameHint} validateStatus={hints.optionNameStatus}  className={layoutItem} >
				<Input type='text' name='optionName' id='optionName' value={data.optionName} onChange={form.handleOnChange}    {...attrMap.optionName} placeholder='输入资讯分类名称' size='large'/>
			</FormItem>,
		];

		return FormUtil.adjuestForm(items, attr.showMap, this.colWidth);
	},
	getNewsTypeManageTableColumns: function (form) {
		var columns = [
			{
				title: '资讯分类',
				dataIndex: 'optionName',
				key: 'optionName',
				width: 720,
			},

		];

		return columns;
	}
};
