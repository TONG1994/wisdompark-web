'use strict';

import React from 'react';
import { Form, Input ,Button} from 'antd';
import FormUtil from '../../../../lib/Components/FormUtil';

//地图组件
import AMapComponent from '../../../lib/components/AMapComponent';
import EncryptionRule from './EncryptionRule';

var Common = require('../../../../public/script/common.js');
var Utils = require('../../../../public/script/utils.js');
const FormItem = Form.Item;

let a=true;
module.exports = {
	layout: 'horizontal',
	colWidth: [6, 12, 18, 24],
	
	tableViews: [
		{ name: 'openParkTable', cols: ['parkName','parkLocation','parkAddress','enterEnterpriseAmount','parkStaffNumber','buildingNumber','doorSwitchNumber'], func: 'getOpenParkTableColumns' }
	],
	
	getOpenParkTableColumns: function (form) {
		var columns = [
			{
				title: '园区名称',
				dataIndex: 'parkName',
				key: 'parkName',
				width: 160
			},
			{
				title: '所在省市区',
				dataIndex: 'parkLocation',
				key: 'parkLocation',
				width: 240
			},
			{
				title: '地址',
				dataIndex: 'parkAddress',
				key: 'parkAddress',
				width: 240
			},
			{
				title: '入住企业数',
				dataIndex: 'enterEnterpriseAmount',
				key: 'enterEnterpriseAmount',
				width: 100
            },
            {
				title: '员工数',
				dataIndex: 'parkStaffNumber',
				key: 'parkStaffNumber',
				width: 100
            },
            {
				title: '楼宇数',
				dataIndex: 'buildingNumber',
				key: 'buildingNumber',
				width: 100
            },
            {
				title: '门禁数',
				dataIndex: 'doorSwitchNumber',
				key: 'doorSwitchNumber',
				width: 100
			},
		];

		return columns;
	},

	//表单
	initOpenParkPrintForm(data){
		data.parkName = '';
		data.parkLocation = '';
		data.parkAddress = '';
		data.openVerificationCode = '';
		data.parkLatitude = '';
		data.encryptionRule	= '';
	},

	getCreateOpenParkFormRule: function (form, attrList)
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
			{ id: 'parkName', desc: '园区名称', required: true, max: '50', ...attrMap.parkName },
			{ id: 'parkLocation', desc: '所在地理位置', required : true, max: '50', ...attrMap.parkLocation },
			{ id: 'parkAddress', desc: '详细地址',required : true, max: '50', ...attrMap.parkAddress },
			{ id: 'openVerificationCode', desc: '远程开门校验密码',required: true, min: '6',max: '20',...attrMap.openVerificationCode},
			{ id: 'parkLatitude', desc: '经纬度', required : true, allowSpecialChar : true},
			{ id: 'encryptionRule', desc: '钥匙加密规则', required : true , allowSpecialChar:'false'},
		];

		return rules;
	},
	
	getCreateOpenParkForm: function (form, data, attrList, labelWidths, layout) {
		if (!labelWidths) {
			labelWidths = [16, 8, 6, 7];
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
			<FormItem {...itemLayouts[3]} key='parkName' label='园区名称' required={true} colon={true} help={hints.parkNameHint} validateStatus={hints.parkNameStatus} newLine={true} className={layoutItem} >
				<Input type='text' size="large" name='parkName' id='parkName' value={data.parkName} onChange={form.handleOnChange}    placeholder='园区名称' {...attrMap.parkName}/>
			</FormItem>,
			<FormItem {...itemLayouts[3] } key='parkLocation' label='所在地理位置' required={true} colon={true} help={hints.parkLocationHint} validateStatus={hints.parkLocationStatus} newLine={true} className={layoutItem} >
				 {attr.objMap.parkLocation}
			</FormItem >,
			<FormItem {...itemLayouts[3] } key='parkAddress' label='详细地址' required={true} colon={true} help={hints.parkAddressHint} validateStatus={hints.parkAddressStatus} newLine={true} className={layoutItem} >
				<Input type='text' size="large" name='parkAddress' id='parkAddress' value={data.parkAddress} onChange={form.handleOnChange}    placeholder='详细地址' {...attrMap.parkAddress}/>
			</FormItem >,
			<FormItem {...itemLayouts[3] } key='parkLatitude' label='经纬度' required={true} help={hints.parkLatitudeHint} validateStatus={hints.parkLatitudeStatus}  className={layoutItem} >
				<AMapComponent ref={ref=>form.AMapComponent=ref} value={data.parkLocation?form.transformAddress(data.parkLocation)+data.parkAddress:''} handlemapok={form.handlemapok} position={data.parkLatitude} lngType={a} />
			</FormItem >,
			<FormItem {...itemLayouts[3] } key='openVerificationCode' label='远程开门校验密码' required={true} colon={true} help={hints.openVerificationCodeHint} validateStatus={hints.openVerificationCodeStatus}  newLine={true} className={layoutItem} >
				<Input type='text' size="large" name='openVerificationCode' id='openVerificationCode' value={data.openVerificationCode} onChange={form.handleOnChange}    placeholder='远程开门校验密码' {...attrMap.openVerificationCode}/>
			</FormItem >,
			<FormItem {...itemLayouts[3] } key='encryptionRule' label='钥匙加密规则' required={true} colon={true} help={hints.encryptionRuleHint} validateStatus={hints.encryptionRuleStatus}  newLine={true} className={layoutItem} >
				<EncryptionRule ref={ref=>form.EncryptionRule=ref} onChange={form.encryptionRuleChange} value={form.state.openParkInfo.encryptionRule} actionType={form.state.actionType}/>
			</FormItem>
		];
		
		return FormUtil.adjuestForm(items, attr.showMap, this.colWidth);
	},

};

