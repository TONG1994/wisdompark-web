'use strict';

import React from 'react';
import { Form, Input, Upload, message, Button, Icon, Modal } from 'antd';
const FormItem = Form.Item;
import PersonnelFormSearchSelect from './PersonnelFormSearch';

let Common = require('../../../../public/script/common');
let Utils = require('../../../../public/script/utils');
import FormUtil from '../../../../lib/Components/FormUtil';

//components
import Component from './Component';

module.exports = {
	layout: 'horizontal',
	colWidth: [6, 12, 18, 24],

	tableViews: [
		{ name: 'PersonnelTable', cols: ['userName', 'picture', 'userCode', 'phone', 'companyName', 'assess'], func: 'getPersonnelTableColumns' }
	],

	initSettledCompanyForm(data) {
		data.userName = '';
		// data.userCode = '';
		data.phone = '';
		data.companyName = '';
		data.userType = '3';
	},
	getPersonnelFormRule: function (form, attrList) {
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
			{ id: 'userName', desc: '姓名', required: true, max: '50', ...attrMap.name },
			// { id: 'userCode', desc: '人员编号', required: true, max: '50', ...attrMap.name },
			{ id: 'phone', desc: '手机号码', required: true, dataType: 'mobile', max: 11, min: 11, ...attrMap.phone },
			{ id: 'companyName', desc: '所属公司', required: true, ...attrMap.company },
		];

		return rules;
	},

	getPersonnelForm: function (form, data, attrList, labelWidths, layout) {
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
		let uploadProps = {
			name: 'file',
			action: Utils.wisdomparkUrl + 'gridfs/uploadFile',
			listType: "picture",
			fileList: form.state.fileList,
			beforeUpload: form.beforeUpload,
			onRemove: form.onRemoveImage,
			onPreview: form.onPreviewImage,
			onChange: form.upload,
		};
		const uploadButton = (
			<Button key="upload" size="default">上传图片</Button>
		);
		var items = [
			<FormItem {...itemLayouts[3]} key='companyName' label='所属公司' colon={true} help={hints.companyNameHint} validateStatus={hints.companyNameStatus} className={layoutItem} >
				<PersonnelFormSearchSelect ref={ref => form.company = ref} fromWhere={form.getCompany} />
			</FormItem>,
			<FormItem {...itemLayouts[3]} key='phone' label='手机号' colon={true} help={hints.phoneHint} validateStatus={hints.phoneStatus} className={layoutItem} >
				<Input type='text' name='phone' id='phone' value={data.phone} onChange={form.phoneOnChange}    {...attrMap.phone} size='large' disabled={form.state.isDisabled1} />
			</FormItem>,
			<FormItem {...itemLayouts[3]} key='userName' label='姓名' colon={true} help={hints.userNameHint} validateStatus={hints.userNameStatus} className={layoutItem} >
				<Input type='text' name='userName' id='userName' value={data.userName} onChange={form.handleOnChange}    {...attrMap.name} size='large' disabled={form.state.isDisabled2} />
			</FormItem>,
			<FormItem {...itemLayouts[3]} key='userType' label='人员类型' colon={true} help={hints.typeHint} validateStatus={hints.typeStatus} className={layoutItem} >
				<Input type='text' name='userType' id='userType' value={data.userType == '2' ? '企业员工' : '门禁管理员'} onChange={form.handleOnChange}    {...attrMap.type} size='large' disabled={form.state.isDisabled3} />
			</FormItem>,
			<FormItem {...itemLayouts[3]} key='picture' label='身份证文件' colon={true} help={hints.pictureHint} validateStatus={hints.pictureStatus} className={layoutItem} >

				<Upload accept="image/*" {...uploadProps}>
					{form.state.fileList.length >= 1 ? null : uploadButton}
				</Upload>
				<Modal visible={form.state.previewVisible} footer={null} onCancel={form.handleCancel}>
					<img alt="example" style={{ width: '100%' }} src={form.state.previewImage} />
				</Modal>

			</FormItem>,
		];

		return FormUtil.adjuestForm(items, attr.showMap, this.colWidth);
	},
	getPersonnelTableColumns: function (form) {
		var columns = [
			{
				title: '姓名',
				dataIndex: 'userName',
				key: 'userName',
				width: 80,
			},
			{
				title: '',
				dataIndex: 'picture',
				key: 'picture',
				width: 20,
				render: function(text, record){
					if(record.picture != null){
						return <a href='#' title='查看身份图片' onClick={() => { form.showPicture(record, 'showPicture') }}><img style={{width:'100%'}} src={Utils.fileAddress + 'gridfs/find?fileId=' + record.picture } /></a>
				
					}else{
						return "";
					}
					
				},
			},
			{
				title: '人员编号',
				dataIndex: 'userCode',
				key: 'userCode',
				width: 70
			},
			{
				title: '手机',
				dataIndex: 'phone',
				key: 'phone',
				width: 140
			},
			{
				title: '所属公司',
				dataIndex: 'companyName',
				key: 'companyName',
				width: 200
			},
			{
				title: '门禁权限',
				width: 80,
				dataIndex: 'assess',
				key: 'assess',
				render: function (text, record) {
					return (
						<span>
							<a href="#" title='查看' className='btn-margin' onClick={() => { form.doorOperate(record, 'check') }}>查看</a>
						</span>
					)
				}
			},
			<render />
		];

		return columns;
	}
};

