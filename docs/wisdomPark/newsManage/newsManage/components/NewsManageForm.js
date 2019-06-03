'use strict';

import React from 'react';
import { Form, Input ,Switch } from 'antd';
const FormItem = Form.Item;

let Common = require('../../../../public/script/common');
let Utils = require('../../../../public/script/utils');
import FormUtil from '../../../../lib/Components/FormUtil';

//person component
module.exports = {
	layout: 'horizontal',
	colWidth: [6, 12, 18, 24],
	
	tableViews: [
		{ name: 'NewsManageTable', cols: ['title','publisher','publishDate','pv','stick'], func: 'getNewsManageTableColumns' }
	],
	
	initNewsManageForm(data){
		data.title = '';
      	data.content = '';
      	data.coverType = '1';
      	data.typeUuid = '';
      	data.origin='O-Park';
	},

	getNewsManageFormRule: function (form, attrList)
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
			{ id: 'title', desc: '资讯标题',required:true, max: '30', ...attrMap.title },
          	{ id: 'typeUuid', desc: '设置分类',required:true,  ...attrMap.typeUuid },
            { id: 'content', desc: '资讯内容',required:true,  ...attrMap.content },
            { id: 'origin', desc: '信息来源',required:true,max: '10', ...attrMap.origin },
		];

		return rules;
	},
	
	getNewsManageTableColumns: function (form) {
		var columns = [
			{
				title: '标题',
				dataIndex: 'title',
				key: 'title',
				width: 350,
			},
			{
				title: '添加人',
				dataIndex: 'publisher',
				key: 'publisher',
				width: 120
			},
			{
				title: '添加时间',
				dataIndex: 'publishDate',
				key: 'publishDate',
				width: 120
			},
		    {
				title: '阅读量',
				dataIndex: 'pv',
				key: 'pv',
				width: 120
			},
			{
				title: '是否置顶',
				dataIndex: 'stick',
				key: 'stick',
				width: 120,
			  	render:function (text,record) {
				  let defaultChecked = text == 1;
				  let loading = record.uuid===form.state.loadingSwitchUuid;
                  return <Switch
						  checkedChildren="是"
						  unCheckedChildren="否"
						  checked={defaultChecked}
						  loading = {loading}
						  onChange={(checked)=>form.handleChange(checked,record)}
						/>;
				  
                }
			},
		];

		return columns;
	}
};

