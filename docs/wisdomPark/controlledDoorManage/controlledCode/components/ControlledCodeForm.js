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
		{ name: 'ControlledCodeTable', cols: ['doorName','buildingName','floorName','cellName'], func: 'getControlledCodeTableColumns' }
	],
	  getControlledCodeTableColumns: function (form) {
		var columns = [
		  {
			title: '受控门名称',
			dataIndex: 'doorName',
			key: 'doorName',
			width: 140,
		  },
		  {
			title: '所在楼宇',
			dataIndex: 'buildingName',
			key: 'buildingName',
			width: 140
		  },
		  {
			title: '所在楼层',
			dataIndex: 'floorName',
			key: 'floorName',
			width: 140
		  },
		  {
			title: '所在单元',
			dataIndex: 'cellName',
			key: 'cellName',
			width: 140,
		  },
		];

		return columns;
	  }
};
