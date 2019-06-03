'use strict';

import React from 'react';
import { Form, Input, DatePicker } from 'antd';
const FormItem = Form.Item;
const {RangePicker} = DatePicker;
import moment from 'moment';
let Common = require('../../../../public/script/common');
let Utils = require('../../../../public/script/utils');
import FormUtil from '../../../../lib/Components/FormUtil';

//person component
import TowerSelect from '../../../lib/components/TowerSelect';
import FloorSelect from '../../../lib/components/FloorSelect';
import UnitnumberSelect from '../../../lib/components/unitnumberSelect';
import Search from './Search';

module.exports = {
	layout: 'horizontal',
	colWidth: [6, 12, 18, 24],
	
	tableViews: [
		{ name: 'RentalCompanyTable', cols: ['companyName','companyCode','location','time','assess'], func: 'getRentalCompanyTableColumns' }
	],
	
	initRentalCompanyForm(data){
		data.companyName = '';
      	data.park = Common.getLoginData().userInfo.parkName == '' ||Common.getLoginData().userInfo.parkName == null ?'O-Park园区':Common.getLoginData().userInfo.parkName;
      	data.tower = '';
      	data.floor = undefined;
      	data.unitnumber=undefined;
	},
	getRentalCompanyFormRule: function (form, attrList)
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
            { id: 'fromDate', desc: '租房起止日期', required: true, ...attrMap.fromDate },
            // { id: 'tower', desc: '所在楼宇',required:true,  ...attrMap.tower },
            // { id: 'floor', desc: '所在楼层',required:true,allowSpecialChar:true, ...attrMap.floor },
            // { id: 'unitnumber', desc: '单元号',required:true,allowSpecialChar:true, ...attrMap.unitnumber },
		];

		return rules;
	},
	
	getRentalCompanyForm: function (form, data, attrList, labelWidths, layout) {
		if (!labelWidths) {
			labelWidths = [16, 8, 6,7];
		}
		
		var attr = FormUtil.getParam(form, attrList);
		var attrMap = attr.attrMap;

		if (!layout) {
			layout = this.layout;
		}
        var itemLayouts = FormUtil.getItemLayout(layout, labelWidths);

        var hints = form.state.hints;

        var filter = form.state.rentalCompany;

		var layoutItem = 'form-item-' + layout;
        const dateFormat='YYYY/MM/DD';
        var startDate = filter.fromDate===''|| filter.fromDate==undefined ? undefined:moment(filter.fromDate, dateFormat);
        var endDate = filter.toDate===''|| filter.toDate==undefined ? undefined:moment(filter.toDate, dateFormat);
        var items = [
			<FormItem {...itemLayouts[3] } key='companyName' label='企业名称' required={true} colon={true} help={hints.companyNameHint} validateStatus={hints.companyNameStatus}  className={layoutItem} >
				<Search ref={ref=> form.search = ref} fromWhere={form.getCompany} disabled={form.props.actionType ==='edit'}></Search>
			</FormItem >,
			<FormItem {...itemLayouts[3] } key='park' label='所在园区'  colon={true} help={hints.parkHint} validateStatus={hints.parkStatus}  className={layoutItem} >
				<Input type='text' name='park' id='park' value={data.park} onChange={form.handleOnChange}    {...attrMap.park} placeholder='输入所在园区' size='large' disabled={true}/>
			</FormItem >,
			<FormItem {...itemLayouts[3] } key='tower' label='所在楼宇'  colon={true} help={hints.towerHint} validateStatus={hints.towerStatus}  className={layoutItem} >
				<TowerSelect name="tower" id="tower" value={form.state.rentalCompany['tower']} ref = {ref=>form.towerSelect = ref} onChange={form.handleTower} disabled={true}/>
			</FormItem >,
			<FormItem {...itemLayouts[3] } key='floor' label='所在楼层'  colon={true} help={hints.floorHint} validateStatus={hints.floorStatus}  className={layoutItem} >
				<FloorSelect name="floor" id="floor" value={form.state.rentalCompany['floor']} onChange={form.handleFloor} placeholder="请选择楼层(可多选)" ref = {ref=>form.floorSelect = ref} tower={form.state.rentalCompany.tower} disabled={true}/>
			</FormItem >,
			<FormItem {...itemLayouts[3] } key='unitnumber' label='单元号'  colon={true} help={hints.unitnumberHint} validateStatus={hints.unitnumberStatus}  className={layoutItem} >
				<UnitnumberSelect name="unitnumber" id="unitnumber" value={form.state.rentalCompany['unitnumber']} onChange={form.handleUnitnumber} placeholder="请选择单元号(可多选)" ref = {ref=>form.unitnumber = ref} floor={form.state.rentalCompany.floor} disabled={true}/>
			</FormItem >,
			<FormItem {...itemLayouts[3] } key='fromDate' label='企业租房起止日期'  required={true} colon={true} help={hints.fromDateHint} validateStatus={hints.fromDateStatus}  className={layoutItem} >
				<RangePicker value={[startDate, endDate]} onChange={form.onChange} size='large'/>
			</FormItem >,
		];
		return FormUtil.adjuestForm(items, attr.showMap, this.colWidth);
	},
	getRentalCompanyTableColumns: function (form) {
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
                    if(text != '' && text.length>30){
                        return (	<span title={text}>
						{text.substring(0,30)}...
						</span>)
                    }else if(text != ''){
                        return (	<span title={text}>
						{text}
						</span>)
                    }
                }
			},
            {
                title: '合同起止时间',
                dataIndex: 'time',
                key: 'time',
                width: 140,
                render:function (text,record) {
                    let datas = new Date(moment(record.endTime,'YYYY/MM/DD'));
                    let datass =new Date(moment().format('L'));
                    if(datas>=datass){
                       let data =datass.getTime() +15*24*60*60*1000;
						if(datas.getTime()<=data){
                       	return (<span style={{color:'#ff9224'}}>{record.startTime.replace(new RegExp('-','gi'),'.')} - {record.endTime.replace(new RegExp('-','gi'),'.')}</span>)
						}else{
                            return (
								<span>{record.startTime.replace(new RegExp('-','gi'),'.')} - {record.endTime.replace(new RegExp('-','gi'),'.')}</span>
                            )
						}
					}else{
                		return (<span style={{color:'red'}}>已过期</span>)
					}

                }
            },
			{
				title: '资料包',
				dataIndex: 'assess',
				key: 'assess',
				width: 80,
			  	render:function (text,record) {
					if(record.fileId != ''){
						let url = Utils.fileAddress + 'gridfs/download?fileIds=' + record.fileId;
                        return (
							<span>
						<a href={url}  title='下载'>下载</a>
					  </span>
                        )
					}else{
						return <span></span>
					}
                }
			},
		];

		return columns;
	}
};

