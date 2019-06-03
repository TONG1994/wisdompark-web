import React from 'react';
let Reflux = require('reflux');
import { Button, Table, Icon, Modal, Input } from 'antd';
const Search = Input.Search;

let Common = require('../../../public/script/common');
let Utils = require('../../../public/script/utils');
let OpenParkManageStore = require('./store/OpenParkManageStore');
let OpenParkManageActions = require('./action/OpenParkManageActions');

import CreateOpenParkPage from './components/CreateOpenParkPage';
import UpdateOpenParkPage from './components/UpdateOpenParkPage';

//table
let  FormDef = require('./components/OpenParkForm');
const tableName = 'openParkTable';
import DictTable from '../../../lib/Components/DictTable'
import FormUtil from '../../../lib/Components/FormUtil';

class openParkManagePage extends React.Component{

    constructor(props){
        super(props);
        this.state={
            openParkSet:{
                recordSet:[],
                errMsg : '',  
            },
            loading: false,
            filter:'',
            oldData:[]
        }
    }
    // 第一次加载
    componentDidMount(){
        this.unsubcribe=OpenParkManageStore.listen(this.onServiceChange);
       
        // 更新新组建
        if (typeof(this.refs.mxgBox) != 'undefined') {
            this.refs.mxgBox.clear();
        }
        this.handleQueryClick();
    }
      // 刷新
    handleQueryClick=()=> {
        let obj={};
        let dataSet = this.state.openParkSet;
        let conf = FormUtil.getTableConf(tableName);
        dataSet.pageRow = (conf.page !== true) ? 0 : conf.pageRow;
        dataSet.startPage = (conf.page !== true) ? 0 : 1;
        // FIXME 查询条件
        this.setState({loading: true});
        OpenParkManageActions.retrievePark(obj,dataSet.startPage,dataSet.pageRow);
    }

    // 解绑监听
    componentWillUnmount() {
        this.unsubcribe();
    }

    // 获取监听数据
    onServiceChange=(data)=>{
        if (data.operation === 'onRetrievePark') {
            // 这是浅复制和深复制的知识
            // let data2=Utils.deepCopyValue(data);
            // let changeData=this.transformAddress(data2);
            this.transformAddress(data);
            this.setState({
              loading: false,
              openParkSet: Object.assign({}, this.state.openParkSet, data)
            });
        }else if(data.operation === 'remove'){
            if( data.errMsg=='' || data.errMsg==null ){
                this.handleQueryClick();
            }else{
                Common.infoMsg(data.errMsg);
            }
            this.setState({
                loading: false,
            })
        }else if(data.operation === 'create'){
            if(data.errMsg=='' || data.errMsg==null){
                this.handleQueryClick();
            }else{
                Common.errMsg(data.errMsg);
            }
            this.setState({
                loading: false,
            })
        }else if(data.operation === 'update'){
            if(data.errMsg=='' || data.errMsg==null){
                this.handleQueryClick();
            }else{
                Common.errMsg(data.errMsg);
            }
            this.setState({
                loading: false,
            })
        }
    }

    // 转换数据
    transformAddress=(data)=>{
        let ownData=JSON.parse(window.sessionStorage.address);
        let len1=data.recordSet.length;
        let len2=ownData.length;
        for(let i=0;i<len1;i++){
            this.state.oldData.push({uuid:data.recordSet[i].uuid,useForAddress:data.recordSet[i].parkLocation});
            let arr=data.recordSet[i].parkLocation.split(',');
            let addressArray='';
            outer:
            for(let j=0;j<len2;j++){
                if(arr[0]==ownData[j].value){
                    addressArray+=ownData[j].label+'-';
                    for(let m=0;m<ownData[j].children.length;m++){
                        if(arr[1]==ownData[j].children[m].value){
                            addressArray+=ownData[j].children[m].label+'-';
                            for(let n=0;n<ownData[j].children[m].children.length;n++){
                                if(arr[2]==ownData[j].children[m].children[n].value){
                                    addressArray+=ownData[j].children[m].children[n].label;
                                    data.recordSet[i].parkLocation=addressArray;
                                    break outer;
                                }
                            }
                        }
                    }
                }
            }
        }
        return data;
    }

    // 删除
    delete =(record) =>{
        let $this = this;
        Modal.confirm({
          title: '删除确认',
          content: '是否确定删除 【'+record.parkName+'】？',
          okText: '确定',
          cancelText: '取消',
          onOk: function () {
            $this.setState({ loading: true });
            OpenParkManageActions.deletePark(record.uuid);
          }
        });
    }

    onTableRefresh =(current, pageRow)=>{
        // let filterObj = this.filter.state.organizationInfo;
        let filterObj ={};
        this.state.openParkSet.startPage = current;
        this.state.openParkSet.pageRow = pageRow;
        OpenParkManageActions.retrievePark(filterObj,current,pageRow);
    }
    
    // 打开增加界面
    handleOpenCreateWindow () {
        this.createOpenPark.clear();
        this.createOpenPark.toggle();
    }

    // 打开编辑界面
    handleOpenUpdateWindow (record) {
        this.updateOpenPark.clear(record,this.state.oldData);
        this.updateOpenPark.toggle();
    }

    render(){
        let recordSet=this.state.openParkSet.recordSet;
        let leftButtons = [
            <Button icon={Common.iconAdd}  title="增加园区" key='增加园区' type='primary' onClick={this.handleOpenCreateWindow.bind(this)} >增加园区</Button>,
            <Button icon={Common.iconReset} title="刷新数据" key="刷新数据" onClick={this.handleQueryClick.bind(this)} className='btn-margin'></Button>
        ],
        operCol = {
            title: '操作',
            key: 'action',
            width: 200,
            render: (text, record) => (
                <span>
                    <a href="#" onClick={this.handleOpenUpdateWindow.bind(this, record)} title='编辑信息' className='btn-opera-margin'><Icon type="edit" /></a>
                    <a href="#" title='删除' onClick={this.delete.bind(this,record)} className='btn-icon-margin'><Icon type="delete" /></a>
                </span>
            ),
        };
        // 表格属性
        let attrs = {
            self: this,
            tableName: tableName,
            primaryKey: 'uuid',
            fixedTool: false,    // 固定按钮，不滚动
            buttons: leftButtons,
            btnPosition: 'top',
            rightButtons: null,
            operCol: operCol,
            tableForm: FormDef,
            editCol: false,
            editTable: false,
            defView: 'openParkTable',//tableForm的 tableView的一个name
            totalPage: this.state.openParkSet.totalRow,//修改state
            currentPage: this.state.openParkSet.startPage,//修改state
            onRefresh: this.onTableRefresh,// 选页数是调用回调函数重新查询
            // onRefresh: false,//不分页
        };
        return (
            <div className='grid-page content-wrap' style={{paddingTop:'20px',fontSize:'16px',fontWight:'500px'}}>
                <DictTable dataSource={recordSet} loading={this.state.loading} attrs={attrs} />
                <CreateOpenParkPage ref ={ref=>this.createOpenPark=ref} Action="create"/>
                <UpdateOpenParkPage ref ={ref=>this.updateOpenPark=ref} Action="update"/>
            </div>
        )
    }

}
export default openParkManagePage;