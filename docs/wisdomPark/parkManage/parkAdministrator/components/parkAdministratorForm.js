'use strict';
import React from 'react';
import FormUtil from '../../../../lib/Components/FormUtil';
import { Form, Input, Icon } from 'antd';
const FormItem = Form.Item;
let sessionData =window.sessionStorage.loginData?JSON.parse(window.sessionStorage.loginData):'';
module.exports = {
	layout: 'horizontal',
	colWidth: [6, 12, 18, 24],

	tableViews: [
		{ name: 'ParkAdminTable', cols: ['accountName','userName', 'phone', 'assess'], func: 'getParkAdminTableColumns' }
	],

	initParkAdminForm(data) {
		data.accountName = '';
		data.userName = '';
		data.phone = '';
	},

	getParkAdminFormRule: function (form, attrList) {
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
			{ id: 'accountName', desc: '用户名', required: true, max: '20', ...attrMap.accountName },
			// { id: 'userName', desc: '姓名', required: true, ...attrMap.userName },
            { id: 'phone', desc: '手机号码', required: true, dataType:'mobile',max:11,min:11, ...attrMap.phone },
		];

		return rules;
	},

	getParkAdminForm: function (form, data, attrList, labelWidths, layout) {
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
			<FormItem {...itemLayouts[3]} key='accountName' label='用户名' required={true} colon={true} help={hints.accountNameHint} validateStatus={hints.accountNameStatus} className={layoutItem} >
				<Input type='text' name='accountName' id='accountName' value={data.accountName} onChange={form.handleOnChange}    {...attrMap.accountName} size='large' />
			</FormItem >,
			<FormItem {...itemLayouts[3]} key='phone' label='手机号' required={true} colon={true} help={hints.phoneHint} validateStatus={hints.phoneStatus} className={layoutItem} >
				<Input   suffix={<Icon type="search" className="certain-category-icon" />} type='text' name='phone' id='phone' value={data.phone} onChange={form.phoneOnChange}    {...attrMap.phone} size='large' disabled={false} maxLength={11}/>
				</FormItem >,
			<FormItem {...itemLayouts[3]} key='userName' label='姓名' colon={true} help={hints.userNameHint} validateStatus={hints.userNameStatus} className={layoutItem} >
				<Input type='text' name='userName' id='userName' value={data.userName} onChange={form.handleOnChange}    {...attrMap.userName} size='large' disabled={true} />
			</FormItem >,
			<FormItem {...itemLayouts[3]} key='names' label='' colon={true} className={layoutItem} >
				<span style={{paddingLeft:45}}>注:管理后台登录密码与该用户APP端登录的密码相同！</span>
			</FormItem >,

		];

		return FormUtil.adjuestForm(items, attr.showMap, this.colWidth);
	},
	getParkAdminTableColumns: function (form) {
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
                width: 80
            },
            {
                title: '手机',
                dataIndex: 'phone',
                key: 'phone',
                width: 200
            },
            {
                title: '管理权限',
                dataIndex: 'assess',
                key: 'assess',
                width: 80,
                render: function (text, record) {
                    if (record.creator == '系统管理员') {
                        return (<span></span>)
                    } else {
                        return (<span>
							<a href="#" title='编辑' onClick={() => {
                                form.adminAssess(record, 'edit', false)
                            }}>编辑</a>
						</span>)
                    }
                }
            },
        ];
        var columnss = [
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
                width: 80
            },
            {
                title: '手机',
                dataIndex: 'phone',
                key: 'phone',
                width: 200
            }
        ];
        if(sessionData.userInfo.parkUuid == "" || sessionData.userInfo.parkUuid == null){
        return columnss;
        }else{
           return columns;
        }
    }
};