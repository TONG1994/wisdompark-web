import Common from '../../public/script/common';
function ModuleMenus(MenuCtx) {
  //  controlledDoorManageMenus   受控门管理
  this.controlledDoorManageMenus = [
    {
      name: '受控门管理',
      to: '/wisdomPark/controlledDoorManageMenu',
      icon: 'home',
      childItems: Common.getFilterList([
        {
          name: '受控门管理',
          to: '/wisdomPark/controlledDoorManage/ControlledDoorPage/'
        },
        {
          name: '受控门二维码下载',
          to: '/wisdomPark/controlledDoorManage/ControlledCodePage/'
        },
      ])
    },
  ];
  //企业管理
  this.companyManageMenus = [{
    name: '企业管理',
    to: '/wisdomPark/companyManageMenu',
    icon: 'home',
    childItems: Common.getFilterList([
      {
        name: '入驻企业管理',
        to: '/wisdomPark/companyManage/settledCompanyPage/'
      },
      {
        name: '企业租赁信息',
        to: '/wisdomPark/companyManage/rentalCompanyPage/'
      },
      {
        name:'企业回收站',
        to:'/wisdomPark/companyManage/trashCompanyPage/'
      },
    ])
  }];

  //人员管理
  this.personnelManageMenus = [{
    name: '人员管理',
    to: '/wisdomPark/personnelManageMenu',
    icon: 'home',
    childItems: Common.getFilterList([
      {
        name: '企业员工',
        to: '/wisdomPark/personnelManage/personnelPage/'
      },
    ])
  }];
  
  //门禁日志
  this.doorLogMenus = [{
    name: '门禁日志',
    to: '/wisdomPark/doorLogMenu',
    icon: 'home',
    childItems: Common.getFilterList([
      {
        name: '门禁日志管理',
        to: '/wisdomPark/doorLog/doorLogPage/'
      },
    ])
  }];
  
  //资讯管理
  this.newsManageMenus = [{
    name: '资讯管理',
    to: '/wisdomPark/newsManageMenu',
    icon: 'home',
    childItems: Common.getFilterList([
      {
        name: '资讯管理',
        to: '/wisdomPark/newsManage/newsManagePage/'
      },
      {
        name: '分类管理',
        to: '/wisdomPark/newsManage/NewsTypeManagePage/'
      },
    ])
  }];
  
  //园区管理
  this.parkManageMenus = [{
    name: '园区管理',
    to: '/wisdomPark/parkManageMenu',
    icon: 'home',
    childItems: Common.getFilterList([
      {
        name: '园区信息管理',
        to: '/wisdomPark/parkManage/ParkManagePage/'
      },
      {
        name: '园区管理员管理',
        to: '/wisdomPark/parkManage/ParkAdministratorPage/'
       },
      {
        name: '远程开门',
        to: '/wisdomPark/parkManage/OpenDoorRemotelyPage/'
      },
      {
        name: '操作日志',
        to: '/wisdomPark/parkManage/ParkLogsPage/'
      },
    ])
  }];
  
  
  //系统设置
  this.systemSetManageMenus = [{
    name: '系统设置',
    to: '/wisdomPark/systemSetManageMenu',
    icon:'home',
    childItems: Common.getFilterList([
      {
        name: '园区开设',
        to: '/wisdomPark/systemSetManage/OpenParkManagePage/'
      },
      {
        name: '系统账户管理',
        to: '/wisdomPark/systemSetManage/SystemAccountManagePage/'
      },
      {
        name: '管理日志',
        to: '/wisdomPark/systemSetManage/LogManagePage/'
      },
      {
        name: '注册用户',
        to: '/wisdomPark/systemSetManage/registeredUserPage/'
      },
      {
        name: '控制器管理',
        to: '/wisdomPark/systemSetManage/ControllorInfoPage/'
      },
    ])
  }];

   // 完整菜单，用于授权
   let menuLists = Common.getMenuList() || [],
   menuArr = menuLists.map(item=>item.path),
   newMenusArr = [],
   moudleMenusArr = [
    {
      name: '受控门管理',
      to: '/wisdomPark/controlledDoorManage/ControlledDoorPage/',
      path: '/wisdomPark/controlledDoorManage/',
      nextMenus: this.controlledDoorManageMenus
    },
    {
      name: '企业管理',
      to: '/wisdomPark/companyManage/settledCompanyPage/',
      path: '/wisdomPark/companyManage/',
      nextMenus: this.companyManageMenus
    },
    {
      name: '人员管理',
      to: '/wisdomPark/personnelManage/personnelPage/',
      path: '/wisdomPark/personnelManage/',
      nextMenus: this.personnelManageMenus
    },
    {
      name: '门禁日志',
      to: '/wisdomPark/doorLog/doorLogPage/',
      path: '/wisdomPark/doorLog/',
      nextMenus: this.doorLogMenus
    },
    {
      name: '资讯管理',
      to: '/wisdomPark/newsManage/newsManagePage/',
      path: '/wisdomPark/newsManage/',
      nextMenus: this.newsManageMenus
    },
    {
      name: '园区管理',
      to: '/wisdomPark/parkManage/ParkManagePage/',
      path: '/wisdomPark/parkManage/',
      nextMenus: this.parkManageMenus
    },
  ];
  moudleMenusArr.map(item=>{
    let basePath = '';
    for(let i=0;i<menuArr.length;i++){
      if(menuArr[i].indexOf(item.path)!==-1&&menuArr[i]!==item.path){
        basePath = menuArr[i];
        break;
      }
    }
    if(basePath){
      item.to = basePath;
      newMenusArr.push(item);
    }
  });
  this.moduleMenus = newMenusArr;
}

module.exports = {
  menus: function () {
    return new ModuleMenus(this);
  }
};    
