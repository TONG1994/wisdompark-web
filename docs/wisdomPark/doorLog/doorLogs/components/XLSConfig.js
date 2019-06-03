'use strict';
/**
 * Excel配置文件
 * 在使用Excel导出组件时，需要使用module字段来告知当前调用的模块名
 * @creator: gypsylu
 * @date: 2018/05/09 
 */
module.exports = {
    // 模块名定义（方便后期维护）
    doorLogs: {
        uploadUrl: 'logistics_price/upload-xls',
        downloadUrl: 'entranceLog/exportXls',
        option: {
            // 数据检查地址
            dataCheckUrl: 'entranceLog/exportXls'
        },
        downloadFields: [
            { "id": "A", "name": "createTime", "title": "开门时间", "width": "15" },
            { "id": "B", "name": "doorFullName", "title": "关联门禁", "width": "15" },
            { "id": "C", "name": "userName", "title": "姓名", "width": "15" },
            { "id": "D", "name": "phone", "title": "手机号", "width": "15" },
            { "id": "E", "name": "companyName", "title": "所属公司", "width": "20" },
            { "id": "F", "name": "userTypeDesc", "title": "人员类型", "width": "15" },
        ],

    }
  
}