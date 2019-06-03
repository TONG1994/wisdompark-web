
// let corpStruct = '园区';	// 园区，多公司，单公司
var serviceIP = 'http://127.0.0.1:8009/';
// let serviceIP = 'http://10.10.10.201:1180/';
let utilConf = {
  checkRole: false,	// 检查权限
  localDict: true, //下拉列表本地获取
  wisdomparkUrl: serviceIP + 'wisdompark_s/',
  fileAddress:"http://gridfs.icerno.com/",
};

let commonConf = {
  // 公共变量
  resMode: false,
  
  // corpStruct: corpStruct,
  campusUuid: '',
  campusName: '',
  corpUuid: '',
  corpName: '',
  userDept: '',	// 用户是否划分部门
  
  // 公共变量
  wisdomParkHome: '/wisdomPark/desk/',
  
  iconAdd: 'plus',//新增
  iconRefresh: 'reload',//刷新
  iconBack: 'rollback',//返回
  iconUpdate: 'edit',//编辑
  iconRemove: 'delete',//删除
  iconUser: 'user',//用户
  iconAddChild: 'folder-add',//文件新增
  iconDetail: 'bars',//详情
  iconSearch: 'search',//搜索
  iconReset:'sync',//重置参数
  iconExport:'export',//导出
  iconImport:'upload',//导入
  iconDownload:'download',//下载
  iconMail:'mail',//发件
  
  tableBorder: false,
  modalWidth:'540px',
  modalForm:[0,0,0,5],
  tableHeight: '510px',
  searchWidth: '180px',
  
  // 日期格式
  dateFormat: 'YYYY-MM-DD',
  monthFormat: 'YYYY-MM',
  
  // 标题
  removeTitle: '删除确认',
  removeOkText: '确定',
  removeCancelText: '取消',
};
