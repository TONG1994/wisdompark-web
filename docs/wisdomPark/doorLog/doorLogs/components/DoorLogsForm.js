'use strict';

import React from 'react';
import { Form, Input, Upload, Button, Icon } from 'antd';
const FormItem = Form.Item;

let Common = require('../../../../public/script/common');
let Utils = require('../../../../public/script/utils');
import FormUtil from '../../../../lib/Components/FormUtil';


module.exports = {
    layout: 'horizontal',
    colWidth: [6, 12, 18, 24],
    tableViews: [
        { name: 'DoorLogsTable', cols: ['createTime', 'doorFullName', 'userName', 'phone', 'companyName', 'userTypeDesc'], func: 'getDoorLogsTableColumns' }
    ],
    initSettledCompanyForm(data) {
        data.userName = '';
        data.userCode = '';
        data.phone = '';
        data.userType = '';//员工类型：0：注册用户1：企业员工2：企业访客3：公司门禁管理员4：园区门禁管理员5：超级管理员
    },
    //列表数据
    getDoorLogsTableColumns: function (form) {
        var columns = [
            {
                title: '开门时间',
                dataIndex: 'createTime',
                key: 'createTime',
                width: 20,
            },
            {
                title: '关联门禁',
                dataIndex: 'doorFullName',
                key: 'doorFullName',
                width: 60
            },
            {
                title: '姓名',
                dataIndex: 'userName',
                key: 'userName',
                width: 20
            },
            {
                title: '手机号',
                dataIndex: 'phone',
                key: 'phone',
                width: 20,
            },
            {
                title: '所属公司',
                dataIndex: 'companyName',
                key: 'companyName',
                width: 20
            },
            {
                title: '人员类型',
                dataIndex: 'userTypeDesc',
                key: 'userTypeDesc',
                width: 20
            },
            <render />
        ];

        return columns;
    }
};

