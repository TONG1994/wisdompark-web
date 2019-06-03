'use strict';

//地图组件
import AMapComponent from '../../../lib/components/AMapComponent';

import React from 'react';
import { Form, Input ,Radio ,Icon} from 'antd';
const RadioGroup = Radio.Group;
const FormItem = Form.Item;

let Common = require('../../../../public/script/common');
let Utils = require('../../../../public/script/utils');
import FormUtil from '../../../../lib/Components/FormUtil';


//components
module.exports = {
	layout: 'horizontal',
	colWidth: [6, 12, 18, 24],
 
	initControlledDoorForm(data){
		data.doorName = '';
      	data.property = '0';
	},

	getControlledDoorFormRule: function (form, attrList)
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
			{ id: 'doorName', desc: '受控门名称',required:true, max:32, ...attrMap.name },
		    { id: 'property', desc: '受控门属性',required:true, ...attrMap.property },
		];

		return rules;
	},
	
	getControlledDoorForm: function (form, data, attrList, labelWidths, layout) {
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
			<FormItem {...itemLayouts[3] } key='doorName' required label='受控门名称'  colon={true} help={hints.doorNameHint} validateStatus={hints.doorNameStatus}  className={layoutItem} >
				<Input type='text' name='doorName' id='doorName' value={data.doorName} onChange={form.handleOnChange}    {...attrMap.doorName} placeholder='输入受控门名称' size='large'/>
			</FormItem >,
			<FormItem {...itemLayouts[3] } key='property' required label='受控门属性'  colon={true} help={hints.propertyHint} validateStatus={hints.propertyStatus}  className={layoutItem} >
				<RadioGroup onChange={form.onRadioChange} value={data.property} id="property" name='property'>
					<Radio value='0'>公共门</Radio>
					<Radio value='1'>私有门</Radio>
				</RadioGroup>
			</FormItem >,
		];
		
		return FormUtil.adjuestForm(items, attr.showMap, this.colWidth);
	},
  
	  initBuildingForm(data){
		data.buildingName = '';
        data.floorName = '';
        data.cellName = '';
        data.roomName = '';
		data.authRadius = '';
		data.buildingAddress = '';
		data.lng = '';
        data.longitude='';
        data.latitude='';
	  },
	  
	  getBuildingFormRule: function (form, attrList,type)
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
		//根据当前页面类型来的 可随时改动
		let rules = [];
		switch (type){
		  case 'park':
            rules = [
              { id: 'buildingName', desc: '楼宇名称',required:true,max:32,...attrMap.buildingName },
              { id: 'authRadius', desc: '门禁权限半径',required:true,dataType:'number',max:9999, ...attrMap.authRadius },
              { id: 'buildingAddress', desc: '楼宇地址',required:true,max:100, ...attrMap.buildingAddress },
              { id: 'lng', desc: '经纬度',required:true,allowSpecialChar:true},
            ];
		  	break;
          case 'building':
            rules = [
              { id: 'floorName', desc: '楼层名称',required:true,...attrMap.floorName,max:32,},
            ];
            break;
          case 'floor':
            rules = [
              { id: 'cellName', desc: '单元名称',required:true,...attrMap.cellName,max:32, },
            ];
            break;
          case 'cell':
            rules = [
              { id: 'roomName', desc: '房间名称',required:true,...attrMap.roomName,max:32 },
            ];
            break;
		  default:
		  	break;
		}
		return rules;
	  },
	  
	  getBuildingForm: function (form, data, attrList, labelWidths, layout,type) {
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
		
		
		//判断分支
        var items = [];
		
		switch (type){
		  case 'park':
            items = [
				<FormItem {...itemLayouts[3] } key='buildingName' label='楼宇名称' required  colon={true} help={hints.buildingNameHint} validateStatus={hints.buildingNameStatus}  className={layoutItem} >
					<Input type='text' name='buildingName' id='buildingName' value={data.buildingName} onChange={form.handleOnChange}    {...attrMap.buildingName} placeholder='输入楼宇名称' size='large'/>
				</FormItem >,
				<FormItem {...itemLayouts[3] } key='authRadius' label='门禁权限半径' required  colon={true} help={hints.authRadiusHint} validateStatus={hints.authRadiusStatus}  className={layoutItem} >
					<Input type='text' addonAfter="米" name='authRadius' id='authRadius' value={data.authRadius} onChange={form.handleOnChange}    {...attrMap.authRadius} placeholder='输入门禁权限半径' size='large'/>
				</FormItem >,
				<FormItem {...itemLayouts[3] } key='buildingAddress' label='楼宇地址' required  colon={true} help={hints.buildingAddressHint} validateStatus={hints.buildingAddressStatus}  className={layoutItem} >
					<Input type='text' name='buildingAddress' id='buildingAddress' value={data.buildingAddress} onChange={form.handleOnChange}    {...attrMap.buildingAddress} placeholder='输入楼宇地址' size='large'/>
				</FormItem >,
				<FormItem {...itemLayouts[3] } key='lng' label='获取经纬度' help={hints.lngHint} required validateStatus={hints.lngStatus}  className={layoutItem} >
					<AMapComponent ref={ref=>form.AMapComponent=ref} value={data.buildingAddress} handlemapok={form.handlemapok} position={data.lng} lngType />
				</FormItem >,
            ];
		  	break;
		  case 'building':
            items = [
				<FormItem {...itemLayouts[3] } key='floorName' label='楼层名称' required  colon={true} help={hints.floorNameHint} validateStatus={hints.floorNameStatus}  className={layoutItem} >
					<Input type='text' name='floorName' id='floorName' value={data.floorName} onChange={form.handleOnChange}    {...attrMap.floorName} placeholder='输入楼层名称' size='large'/>
				</FormItem >,
            ];
		  	break;
		  case 'floor':
            items = [
				<FormItem {...itemLayouts[3] } key='cellName' label='单元名称' required  colon={true} help={hints.cellNameHint} validateStatus={hints.cellNameStatus}  className={layoutItem} >
					<Input type='text' name='cellName' id='cellName' value={data.cellName} onChange={form.handleOnChange}    {...attrMap.cellName} placeholder='输入单元名称' size='large'/>
				</FormItem >,
            ];
		  	break;
		  case 'cell':
            items = [
				<FormItem {...itemLayouts[3] } key='roomName' label='房间名称' required  colon={true} help={hints.roomNameHint} validateStatus={hints.roomNameStatus}  className={layoutItem} >
					<Input type='text' name='roomName' id='roomName' value={data.roomName} onChange={form.handleOnChange}    {...attrMap.roomName} placeholder='输入房间名称' size='large'/>
				</FormItem >,
            ];
		  	break;
		  default :
		  	break
		}
		return FormUtil.adjuestForm(items, attr.showMap, this.colWidth);
	  },
};

