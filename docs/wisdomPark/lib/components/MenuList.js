import React from 'react';
import ReactMixin from 'react-mixin';

var Reflux = require('reflux');
import { Checkbox,Row, Col, Collapse} from 'antd';

const CheckboxGroup = Checkbox.Group;

var Common = require('../../../public/script/common');
let Utils = require('../../../public/script/utils');

var MenuList = React.createClass({
  getInitialState: function () {
    return {
      menuListSet: {
        recordSet: [],
        errMsg: '',
      },
      loading: false,
      checkedList: [],
    }
  },
  // 第一次加载
  componentDidMount: function () {
    this.setState({loading: true});
  },
  filterData: function () {
    let menuList = Common.getLoginData().userInfo.menus;
    let noAssesPathArr = ["/xilai/baseConfig/PrintTemplatePage/"];//不显示菜单
    let data = menuList;
    let list = data.filter(item=>!item.parentUuid);
    let filterData = [];
    /**
     *  注释掉的信息是为了 兼容3级菜单
    */
    // let twoLevelFlag = false;//是否有2级菜单  没有即是子账号登录的
    list.map(item=>{
      // if(!twoLevelFlag&&item.grade==2){
      //   twoLevelFlag = true
      // }
      item.children = data.filter(jtem=>jtem.parentUuid===item.uuid);
    });
    // if(!twoLevelFlag){
      list.map(item=>{
        let obj = {
          parent:item,
          children:[]
        };
        obj.children = data.filter(jtem=>jtem.path.indexOf(item.path)!==-1&&jtem.path!==item.path&&noAssesPathArr.indexOf(jtem.path)===-1);
        filterData.push(obj)
      });
      return filterData;
    // }
    // list.map(item=>{
    //   let obj = {
    //     parent:item,
    //     children:[]
    //   };
    //   item.children.map(jtem=>{
    //     jtem.children = data.filter(ktem=>ktem.parentUuid===jtem.uuid&&ktem.path!==noAssesPath3);
    //     if(jtem.children.length){//有第三级菜单
    //       obj.children = obj.children.concat(jtem.children);
    //     }else{//没有第三级菜单
    //       obj.children = obj.children.concat(jtem);
    //     }
    //   });
    //   filterData.push(obj)
    // });
    
    // return filterData;
  },
  clear:function(){
      this.setState({checkedList:[]});
  },
  onCheckChange:function (checkedList) {
    let filterData = this.filterData();
    let oldCheckedList = Utils.deepCopyValue(this.state.checkedList);
    let newKey;
    if(checkedList.length>oldCheckedList.length){//增加
      newKey = checkedList[checkedList.length-1];
      let selectArr = [];
      filterData.map(item=>{
        if(newKey===item.parent.uuid){
          selectArr.push(item.parent.uuid);
          item.children.map(jtem=>{
            selectArr.push(jtem.uuid);
          });
        }else{
          item.children.map(jtem=>{
            if(jtem.uuid===newKey){
              selectArr.push(item.parent.uuid);
            }
          });
          selectArr.push(newKey)
        }
      });
      checkedList = [...checkedList,...selectArr];
      let onlyArr = [];
      checkedList.map(item=>{
        if(onlyArr.indexOf(item)===-1){
          onlyArr.push(item);
        }
      })
      checkedList = onlyArr;
    }else{//减少
      oldCheckedList.map(item=>{
        if(checkedList.indexOf(item)===-1){
          newKey = item;
        }
      });
      let newCheckList = [],flag=false;
      filterData.map(item=>{
        if(newKey===item.parent.uuid){
          flag = true;
          item.children.map(jtem=>{
            let indexOf = checkedList.indexOf(jtem.uuid);
            if(indexOf>-1){
              checkedList.splice(indexOf,1)
            }
          });
          newCheckList = checkedList;
        }
      });
      if(!flag){
        let pFlag = false;
        filterData.map(item=>{
          if(checkedList.indexOf(item.parent.uuid)>-1){
            pFlag = true;
            let thisFlag = false;
            item.children.map(jtem=>{
              if(checkedList.indexOf(jtem.uuid)>-1){
                thisFlag  =  true
              }
            })
            if(!thisFlag){
              checkedList.splice(checkedList.indexOf(item.parent.uuid),1)
            }
          }
        })
      }
    }
    this.setState({checkedList});
  },
  getCheckListText:function(checkedList){
    let data = Common.getLoginData().menuList, filterData=this.filterData();
    let childMenuArr = [],parentMenuArr=[];
    checkedList.map(item=>{
      let menu = data.find(menuItem => menuItem.uuid === item);
      if(menu){
        if(!menu.parentUuid && menu.grade === '1'){
          let parentObj = filterData.find(jtem=>jtem.parent.uuid === item);
          parentMenuArr.push(parentObj);
        }else{
          childMenuArr.push(menu);
        }
      }
    });
    let menuStr='';
    parentMenuArr.map(parentMenu =>{
         let parentMenuParent = parentMenu.parent;
         let parentMenuChildren = parentMenu.children;
         let  resultArr=[];
         childMenuArr.map(child=>{
          let result = parentMenuChildren.find(childMenu=> childMenu.uuid === child.uuid);
          if(result){
            resultArr.push(result.name);
          }else{
            parentMenuChildren.map(childObj=>{
              if(childObj.children && childObj.children.length){
                result = childObj.children.find(ktem => ktem.uuid === child.uuid);
                if(result){
                  resultArr.push(result.name);
                }else{
                  resultArr.push(`${child.uuid}暂无菜单`);
                }
              }
            });
          }
         });
        menuStr += parentMenuParent.name + ': ' + resultArr.join(', ') + ';'; 
    });
    return menuStr;
  },
  selectAll:function (a) {
    // console.log(a);
  },
  render: function () {
    let {disabled} = this.props;
    if(!disabled){
        disabled = false;
    }
    let filterData = this.filterData();
    let optionsAll = [];
    filterData.map(item=>{
      optionsAll.push(
          <Checkbox
              disabled={disabled}
              style={{marginLeft:-20,fontWeight:600,marginTop:4}}
              value={item.parent.uuid}
              key={item.parent.uuid}
              // onChange={this.selectAll}
          >{item.parent.name}</Checkbox>);
      let options = [];
      item.children.map(jtem=>{
        options.push(<Col span={9} key={jtem.uuid}><Checkbox value={jtem.uuid} disabled={disabled}>{jtem.name}</Checkbox></Col>);
      });
      optionsAll.push(<Row key={item.parent.uuid+0}>{options}</Row>);
    });
    let checkBoxHtml = <CheckboxGroup onChange={this.onCheckChange} value={this.state.checkedList} disabled={disabled}>{optionsAll}</CheckboxGroup>;
    return (
        <div style={{paddingLeft:20}}>
          {checkBoxHtml}
        </div>
    )
  }
});

export default MenuList;
