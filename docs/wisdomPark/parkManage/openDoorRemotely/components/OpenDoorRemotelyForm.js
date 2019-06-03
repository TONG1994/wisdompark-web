'use strict';

import React from 'react';
import { Form, Input ,Radio  } from 'antd';
const RadioGroup = Radio.Group;
const FormItem = Form.Item;

let Common = require('../../../../public/script/common');
let Utils = require('../../../../public/script/utils');
import FormUtil from '../../../../lib/Components/FormUtil';


//components
module.exports = {
	layout: 'horizontal',
	colWidth: [6, 12, 18, 24],
    tableViews: [
		{ name: 'OpenDoorRemotelyTable', cols: ['doorName','cellName','doorNo','controllerNo','port'], func: 'getOpenDoorRemotelyTableColumns' }
	],
	  getOpenDoorRemotelyTableColumns: function (form) {
		var columns = [
		  {
			title: '受控门名称',
			dataIndex: 'doorName',
			key: 'doorName',
			width: 140,
		  },
		  {
			title: '所属单元',
			dataIndex: 'cellName',
			key: 'cellName',
			width: 140
		  },
		  {
			title: '受控门编号',
			dataIndex: 'doorNo',
			key: 'doorNo',
			width: 140
		  },
		  {
			title: '控制器编号',
			dataIndex: 'controllerNo',
			key: 'controllerNo',
			width: 140,
		  },
		  {
			title: '端口号',
			dataIndex: 'port',
			key: 'port',
			width: 140,
		  },
		];

		return columns;
		},
		initOpenDoorRemotelyForm(data){
			data.password = '';
		},

		getOpenDoorRemotelyFormRule: function (form, attrList)
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
				{ id: 'password', desc: '远程开门系统验证码',required:true, max: '16', ...attrMap.password },
			];

			return rules;
		},

		getOpenDoorRemotelyForm: function (form, data, attrList, labelWidths, layout) {
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
				<FormItem {...itemLayouts[3] } key='password' label='开门验证码'  required="true" colon={true} help={hints.passwordHint} validateStatus={hints.passwordStatus}  className={layoutItem} >
					<Input autoComplete='off' type='password' name='passwordOpenDoor' id='password' value={data.password} onChange={form.handleOnChange}   onPaste={(e)=>{e.preventDefault()}}  {...attrMap.password} placeholder='请输入远程开门系统验证码' size='large'/>
				</FormItem>,
			];

			return FormUtil.adjuestForm(items, attr.showMap, this.colWidth);
		},
};
