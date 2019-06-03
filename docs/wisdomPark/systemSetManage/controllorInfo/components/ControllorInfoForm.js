'use strict';

import React from 'react';
import { Form, Input ,Col,Row } from 'antd';
const FormItem = Form.Item;

let Common = require('../../../../public/script/common');
let Utils = require('../../../../public/script/utils');
import FormUtil from '../../../../lib/Components/FormUtil';
import SelectDoor from '../components/SelectDoor';
import { utc } from 'moment';

//components
module.exports = {
	layout: 'horizontal',
	colWidth: [6, 12, 18, 24],
    tableViews: [
		{ name: 'ControllorInfoTable', cols: ['controllerName','controllerIp','controllerNo'], func: 'getControllorInfoTableColumns' }
	],
	  getControllorInfoTableColumns: function (form) {

		var columns = [
		  {
			title: '名称',
			dataIndex: 'controllerName',
			key: 'controllerName',
			width: 140,
		  },
		  {
			title: '控制器IP',
			dataIndex: 'controllerIp',
			key: 'controllerIp',
			width: 140
		  },
		  {
			title: '控制器编号',
			dataIndex: 'controllerNo',
			key: 'controllerNo',
			width: 140,
			},
		];

		return columns;
		},
		initControllorInfoForm(data){
			data.controllerName = '';
			data.controllorIP1='';
			data.controllorIP2='';
			data.controllorIP3='';
			data.controllorIP4='';
		},
		initDoorListForm(data){
			data.port1 = '';
			data.port2 = '';
			data.port3 = '';
			data.port4 = '';
		},

		getControllorInfoFormRule: function (form, attrList)
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
				{ id: 'controllerName', desc: '控制器名称',required:true,max: '16', ...attrMap.controllorName },
				{ id: 'controllorIP1', desc: '控制器IP',required:true,dataType:'number', ...attrMap.controllorIP,max:255 ,min:0},
				{ id: 'controllorIP2', desc: '控制器IP',required:true,dataType:'number', ...attrMap.controllorIP,max:255 ,min:0},
				{ id: 'controllorIP3', desc: '控制器IP',required:true,dataType:'number', ...attrMap.controllorIP ,max:255,min:0},
				{ id: 'controllorIP4', desc: '控制器IP',required:true,dataType:'number', ...attrMap.controllorIP ,max:255,min:0},

			];

			return rules;
		},

		getControllorInfoForm: function (form, data, attrList, labelWidths, layout) {
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
				<FormItem {...itemLayouts[3] } key='controllerName' label='控制器名称' required="true" colon={true} help={hints.controllerNameHint} validateStatus={hints.controllerNameStatus}  className={layoutItem} >
					 <Col span="23"><Input type='controllerName' name='controllerName' id='controllerName' value={data.controllerName} onChange={form.handleOnChange}    {...attrMap.controllerName} placeholder='请输入控制器名称' size='large'/>
					 </Col>
				</FormItem>,
				<FormItem {...itemLayouts[3] } key='controllerIP' label='控制器IP' required="true"  colon={true}  className={layoutItem}>
				<Col span='6'>
					<FormItem {...itemLayouts[1] } key='controllorIP1' label=''  colon={true} help={hints.controllorIP1Hint} validateStatus={hints.controllorIP1Status}  >
						<Col span='22'>
						<Input defaultValue={255}  type='controllorIP1' name='controllorIP1' id='controllorIP1'  value={data.controllorIP1} onChange={form.handleOnChange}    {...attrMap.controllorIP1} ></Input>
						</Col>
						<Col style={{fontWeight:'bold'}} span="1">.</Col>
				    </FormItem>
				</Col>
				<Col span='6'>
					<FormItem  {...itemLayouts[1] } key='controllorIP2'   colon={true} help={hints.controllorIP2Hint} validateStatus={hints.controllorIP2Status}   >
						<Col span='22'><Input defaultValue={255} type='controllorIP2' name='controllorIP2' id='controllorIP2'  value={data.controllorIP2} onChange={form.handleOnChange}    {...attrMap.controllorIP2}  ></Input></Col>
						<Col  style={{fontWeight:'bold'}} span="1" >.</Col>
					</FormItem>
				</Col>
				<Col span='6'>
					<FormItem  {...itemLayouts[1] } key='controllorIP3'  colon={true} help={hints.controllorIP3Hint} validateStatus={hints.controllorIP3Status}  >
						<Col span='22'><Input defaultValue={255} type='controllorIP3' name='controllorIP3' id='controllorIP3'  value={data.controllorIP3} onChange={form.handleOnChange}    {...attrMap.controllorIP3}  ></Input></Col>
						<Col  style={{fontWeight:'bold'}} span="1">.</Col>
				   </FormItem>
				</Col>
				<Col span='5'>
					<FormItem  {...itemLayouts[1] } key='controllorIP4'   colon={true} help={hints.controllorIP4Hint} validateStatus={hints.controllorIP4Status}  >
						<Col><Input defaultValue={255} type='controllorIP4' name='controllorIP4' id='controllorIP4'  value={data.controllorIP4} onChange={form.handleOnChange}    {...attrMap.controllorIP4} ></Input></Col>
				    </FormItem>
				</Col>



			</FormItem>
			];

			return FormUtil.adjuestForm(items, attr.showMap, this.colWidth);
		},
		getPort:function(ports, index){
			let port = '';
          if(ports && ports.length){
			  if(ports[index]){
				  port = ports[index].doorName ? ports[index].doorName :'';
			  }
		  }
		  return port;
		},
		getDoorListForm: function (form, data, attrList, labelWidths, layout) {
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


			let ports = Utils.deepCopyValue(data.ports);
			let port1 = this.getPort(ports, 0),port2 = this.getPort(ports, 1),port3 = this.getPort(ports, 2),port4 = this.getPort(ports, 3);
			let controlledDoors = Utils.deepCopyValue(data.doors);
			let modalProps0={
				controlledDoors,
				port:ports[0]
			}, modalProps1={
				controlledDoors,
				port:ports[1]
			},modalProps2={
				controlledDoors,
				port:ports[2]
			},modalProps3={
				controlledDoors,
				port:ports[3]
			};

			var items = [
				<FormItem {...itemLayouts[3] } key='port1' label='P1端口'  colon={true}  className={layoutItem} >
			   	<SelectDoor ref={ref=>this.selectDoor1=ref} value={port1} portType="0" onSelect={form.onSelect} {...modalProps0}/>
				</FormItem>,
				<FormItem {...itemLayouts[3] } key='port2' label='P2端口'  colon={true}  className={layoutItem} >
			   <SelectDoor ref={ref=>this.selectDoor2=ref} value={port2} portType="1"  onSelect={form.onSelect}{...modalProps1}/>
				</FormItem>,
				<FormItem {...itemLayouts[3] } key='port3' label='P3端口'  colon={true}  className={layoutItem} >
			   	<SelectDoor ref={ref=>this.selectDoor3=ref} value={port3} portType="2"  onSelect={form.onSelect} {...modalProps2}/>
				</FormItem>,
				<FormItem {...itemLayouts[3] } key='port4' label='P4端口'  colon={true}  className={layoutItem} >
			   <SelectDoor ref={ref=>this.selectDoor4=ref} value={port4} portType="3" onSelect={form.onSelect} {...modalProps3}/>
				</FormItem>,

			];

			return FormUtil.adjuestForm(items, attr.showMap, this.colWidth);
		},
};
