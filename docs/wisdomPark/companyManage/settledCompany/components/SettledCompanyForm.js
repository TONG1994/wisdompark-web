'use strict';

import React from 'react';
import { Form, Input } from 'antd';
const FormItem = Form.Item;

let Common = require('../../../../public/script/common');
let Utils = require('../../../../public/script/utils');
import FormUtil from '../../../../lib/Components/FormUtil';

//person component
import TowerSelect from '../../../lib/components/TowerSelect';
import FloorSelect from '../../../lib/components/FloorSelect';
import UnitnumberSelect from '../../../lib/components/unitnumberSelect';

module.exports = {
	layout: 'horizontal',
	colWidth: [6, 12, 18, 24],
	
	tableViews: [
		{ name: 'SettledCompanyTable', cols: ['companyName','companyCode','location','assess'], func: 'getSettledCompanyTableColumns' }
	],
	
	initSettledCompanyForm(data){
		data.companyName = '';
      	data.park = Common.getLoginData().userInfo.parkName == '' ||Common.getLoginData().userInfo.parkName == null ?'O-Park园区':Common.getLoginData().userInfo.parkName;
      	data.tower = '';
      	data.floor = undefined;
      	data.unitnumber=undefined;
	},

	getSettledCompanyFormRule: function (form, attrList)
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
			{ id: 'companyName', desc: '企业名称',required:true, max: '32', ...attrMap.companyName },
            { id: 'tower', desc: '所在楼宇',required:true,  ...attrMap.tower },
            { id: 'floor', desc: '所在楼层',required:true,allowSpecialChar:true, ...attrMap.floor },
            { id: 'unitnumber', desc: '单元号',required:true,allowSpecialChar:true, ...attrMap.unitnumber },
		];

		return rules;
	},
	
	getSettledCompanyForm: function (form, data, attrList, labelWidths, layout) {
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
			<FormItem {...itemLayouts[3] } key='companyName' label='企业名称' required={true} colon={true} help={hints.companyNameHint} validateStatus={hints.companyNameStatus}  className={layoutItem} >
				<Input type='text' name='companyName' id='companyName' value={data.companyName} onChange={form.handleOnChange}    {...attrMap.companyName} placeholder='输入企业名称' size='large'/>
			</FormItem >,
			<FormItem {...itemLayouts[3] } key='park' label='所在园区'  colon={true} help={hints.parkHint} validateStatus={hints.parkStatus}  className={layoutItem} >
				<Input type='text' name='park' id='park' value={data.park} onChange={form.handleOnChange}    {...attrMap.park} placeholder='输入所在园区' size='large' disabled={true}/>
			</FormItem >,
			<FormItem {...itemLayouts[3] } key='tower' label='所在楼宇' required={true} colon={true} help={hints.towerHint} validateStatus={hints.towerStatus}  className={layoutItem} >
                {attr.objMap.tower}
			</FormItem >,
			<FormItem {...itemLayouts[3] } key='floor' label='所在楼层' required={true}  colon={true} help={hints.floorHint} validateStatus={hints.floorStatus}  className={layoutItem} >
                {attr.objMap.floor}
			</FormItem >,
			<FormItem {...itemLayouts[3] } key='unitnumber' label='单元号'  required={true} colon={true} help={hints.unitnumberHint} validateStatus={hints.unitnumberStatus}  className={layoutItem} >
                {attr.objMap.unitnumber}
			</FormItem >,
		];
		
		return FormUtil.adjuestForm(items, attr.showMap, this.colWidth);
	},
	getSettledCompanyTableColumns: function (form) {
		var columns = [
			{
				title: '公司名称',
				dataIndex: 'companyName',
				key: 'companyName',
				width: 100,
			},
			{
				title: '公司编号',
				dataIndex: 'companyCode',
				key: 'companyCode',
				width: 80
			},
			{
				title: '所在位置',
				dataIndex: 'location',
				key: 'location',
				width: 240,
                render:function (text,record) {
					if(text != '' && text.length> 43){
						return (	<span title={text}>
						{text.substring(0,43)}...
						</span>)
					}else if(text != ''){
                        return (	<span title={text}>
						{text}
						</span>)
					}
                }
			},
			{
				title: '门禁权限',
				dataIndex: 'assess',
				key: 'assess',
				width: 80,
			  	render:function (text,record) {
                  return (
					  <span>
						<a href="#" title='编辑' onClick={()=>{form.doorOperate(record,'edit')}}>编辑</a>
						<a href="#" title='查看' className='btn-margin' onClick={()=>{form.doorOperate(record,'check')}}>查看</a>
					  </span>
				  )
                }
			},
		];

		return columns;
	}
};

