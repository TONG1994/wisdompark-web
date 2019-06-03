import wisdomParkLayout from './wisdomParkLayout';
import Home from '../login2/LoginPage2';
import Common from '../public/script/common';
// ControlledDoor
import ControlledDoorPage from './controlledDoorManage/controlledDoor/ControlledDoorPage';
import ControlledCodePage from './controlledDoorManage/controlledCode/ControlledCodePage';

//companyManage
import settledCompanyPage from './companyManage/settledCompany/settledCompanyPage';
import rentalCompanyPage from './companyManage/rentalCompany/rentalCompanyPage';
import trashCompanyPage from './companyManage/trashCompany/trashCompanyPage';

//personnelManage
import personnelPage from './personnelManage/personnel/personnelPage';

//informationManage
// import informationPage from './informationManage/information/informationPage';

//systemSet
import OpenParkManagePage from './systemSetManage/openParkManage/OpenParkManagePage';
import registeredUserPage from './systemSetManage/registeredUser/registeredUserPage';
import ControllorInfoPage from './systemSetManage/controllorInfo/ControllorInfoPage';
import SystemAccountManagePage from './systemSetManage/systemAccountManage/SystemAccountManagePage';
import LogManagePage from './systemSetManage/logManage/LogManagePage';


//doorLog
import DoorLogsPage from './doorLog/doorLogs/DoorLogsPage';

//newsManage
import NewsManagePage from './newsManage/newsManage/NewsManagePage';
import NewsTypeManagePage from './newsManage/newsTypeManage/NewsTypeManagePage';


//parkManage
import ParkAdministratorPage from './parkManage/parkAdministrator/ParkAdministratorPage';
import ParkManagePage from './parkManage/parkManage/ParkManagePage';
import OpenDoorRemotelyPage from './parkManage/OpenDoorRemotely/OpenDoorRemotelyPage';
import ParkLogsPage from './parkManage/parkLogs/ParkLogsPage';


/***************   受控门管理    *********************/
let controlledDoorManageRoutes = [
  {
    path: 'controlledDoorManage/ControlledDoorPage/',
    component: ControlledDoorPage
  },
  {
    path: 'controlledDoorManage/ControlledCodePage/',
    component: ControlledCodePage
  },
];

/***************   企业管理    *********************/
let companyManageRoutes = [
  {
    path: 'companyManage/settledCompanyPage/',
    component: settledCompanyPage
  },
  {
    path: 'companyManage/rentalCompanyPage/',
    component: rentalCompanyPage
  },
  {
    path:'companyManage/trashCompanyPage/',
    component: trashCompanyPage
  }
];
/***************   系统设置    *********************/
let openParkManageRoutes = [
  {
    path: 'systemSetManage/OpenParkManagePage/',
    component: OpenParkManagePage
  },
  {
    path: 'systemSetManage/SystemAccountManagePage/',
    component: SystemAccountManagePage
  },
  {
    path: 'systemSetManage/LogManagePage/',
    component: LogManagePage
  },
  {
    path: 'systemSetManage/registeredUserPage/',
    component: registeredUserPage
  },
  {
    path: 'systemSetManage/ControllorInfoPage/',
    component: ControllorInfoPage
  },
]
/***************   人员管理    *********************/
let personnelManageRoutes = [
  {
    path: 'personnelManage/personnelPage/',
    component: personnelPage
  },
];
/***************   门禁日志    *********************/
let doorLogRoutes = [
  {
    path: 'doorLog/doorLogPage/',
    component: DoorLogsPage
  },
];

/***************   资讯管理    *********************/
let newsManageRoutes = [
  {
    path: 'newsManage/newsManagePage/',
    component: NewsManagePage
  },
  {
    path: 'newsManage/NewsTypeManagePage/',
    component: NewsTypeManagePage
  },
];
/***************   园区管理    *********************/
let parkManageRoutes = [
  {
    path: 'parkManage/ParkManagePage/',
    component: ParkManagePage
  },
  {
    path: 'parkManage/ParkAdministratorPage/',
    component: ParkAdministratorPage
  },
  {
    path: 'parkManage/OpenDoorRemotelyPage/',
    component: OpenDoorRemotelyPage
  },
  {
    path: 'parkManage/ParkLogsPage/',
    component: ParkLogsPage
  },

];



let controlledDoorManageRoutesArr=getGivenMenuList(controlledDoorManageRoutes), 
companyManageRoutesArr=getGivenMenuList(companyManageRoutes), 
openParkManageRoutesArr=getGivenMenuList(openParkManageRoutes),
personnelManageRoutesArr=getGivenMenuList(personnelManageRoutes), 
doorLogRoutesArr=getGivenMenuList(doorLogRoutes), 
newsManageRoutesArr=getGivenMenuList(newsManageRoutes), 
parkManageRoutesArr=getGivenMenuList(parkManageRoutes);

function getGivenMenuList(menuListSource){
 let menuLists = Common.getMenuList() || [], menuListGiven=[], menuArr=[]; 
  menuLists.map(item=>{
  if(item && item.path){
   menuArr.push(item.path);
  }
 });
 if(menuArr.length != menuLists.length){
   console.error('菜单数据列表数据有无效数据，请检查！');
   console.log(menuLists);
 }
 menuListSource.map(item =>{
   // if(menuArr.includes(item.path)){
   //    menuListGiven.push(item);
   // }

   let f = false;
   for(let i=0;i<menuArr.length;i++){
     if(menuArr[i].indexOf(item.path)!==-1){
       f = true;
       break;
     }
   }
   if(f){
     menuListGiven.push(item)
   };
 });
 return menuListGiven;
}

/***************   总路由    *********************/
let topRoutes = [
 //受控门管理
{
 path: '/wisdomPark/',
 component: require('./main/controlledDoorManage_menu'),
 indexRoute: {component: ControlledDoorPage},
 childRoutes: controlledDoorManageRoutesArr
},
 //企业管理
{
 path: '/wisdomPark/',
 component: require('./main/companyManage_menu'),
 indexRoute: {component: settledCompanyPage},
 childRoutes: companyManageRoutesArr
},
//   //系统设置
{
 path: '/wisdomPark/',
 component: require('./main/systemSetManage_menu'),
 indexRoute: { component: OpenParkManagePage },
 childRoutes: openParkManageRoutesArr
},
 //人员管理
{
 path: '/wisdomPark/',
 component: require('./main/personnelManage_menu'),
 indexRoute: { component: personnelPage },
 childRoutes: personnelManageRoutesArr
},
 //门禁日志
{
 path: '/wisdomPark/',
 component: require('./main/doorLog_menu'),
 indexRoute: { component: DoorLogsPage },
 childRoutes: doorLogRoutesArr
},
 //资讯管理
{
 path: '/wisdomPark/',
 component: require('./main/newsManage_menu'),
 indexRoute: { component: NewsManagePage },
 childRoutes: newsManageRoutesArr
},
 //园区管理
{
 path: '/wisdomPark/',
 component: require('./main/parkManage_menu'),
 indexRoute: { component: ParkManagePage },
 childRoutes: parkManageRoutesArr
},
];

module.exports = {
  path: '/wisdomPark',
  component: wisdomParkLayout,
  indexRoute: {component: Home},
  childRoutes: topRoutes
};

