/**
 *   Create by Malson on 2018/8/14
 */
import React from 'react';
let Reflux= require('reflux');
import {Form,Input,Button,Icon, Upload,Spin,Modal,message} from 'antd';
const { TextArea } = Input;
const FormItem = Form.Item;

import FormUtil from '../../../lib/Components/FormUtil';
import ModalForm from '../../../lib/Components/ModalForm';
import FileRequest from '../../../lib/Components/FileRequest';
let Utils = require('../../../public/script/utils');
let Common = require('../../../public/script/common');
let ParkManageStore = require('./store/ParkManageStore');
let ParkManageActions = require('./action/ParkManageActions');
var length = 0;
//地图组件
import AMapComponent from '../../lib/components/AMapComponent';
let ParkManagePage = React.createClass({
  getInitialState: function () {
    return {
      parkSet: {},
      hints: {},
      validRules: [],
      loading:false,
      selectPark:{
        parkUuid : ''
      },
      parkLocationAddress:'',
      parkLocation:[],
      park:{},
      fileList:[],
      previewImage:'',
      previewVisible: false,
    };
  },
  mixins:[Reflux.listenTo(ParkManageStore,"onServiceComplete"),ModalForm('park')],
  onServiceComplete:function(data){
    this.setState({loading:false});
    if(data.errMsg){
      this.setState({errMsg:data.errMsg});
      return;
    }
    if(data.operation === "getbyuuid"){
      this.state.parkLocation=this.transformAddress(data.recordSet.parkLocation);
      for(var i=0;i<this.state.parkLocation.length;i++) {
          this.state.parkLocationAddress += this.state.parkLocation[i];
      }
      let arr = [];
      if(data.recordSet.parkSymbol){
           arr.push({uid:data.recordSet.parkSymbol,name:'',status:'done',url:Utils.fileAddress + 'gridfs/find?fileId='+data.recordSet.parkSymbol});
          this.state.fileList=arr;
      }else{
          this.state.fileList=[];
      }
      this.setState({
        park: Object.assign({}, this.state.park, data.recordSet),
      });
    }if(data.operation==='update'){
        if(data.errMsg===''){
            message.success('编辑园区信息成功');
        }else{
            message.error('编辑园区信息失败');
        }
    }
  },
  componentDidMount : function(){
    this.state.validRules=[
      { id: 'parkName', desc: '园区名称', required: true, max: 36,},
      { id: 'parkAddress', desc: '园区地址', required: true, max: 24,},
       { id: 'doorSwitchRange', desc: '开门半径', required: true,dataType:'number'},
    ];
    this.state.selectPark.parkUuid=Common.getSelectedParkUuid() ? Common.getSelectedParkUuid():'';
    this.setState({loading: true});
    // FIXME 查询条件
    ParkManageActions.getParkByUuid(this.state.selectPark);
  },

  // 转换省市区数据
  transformAddress:function(data){
    let ownData=JSON.parse(window.sessionStorage.address);
    let len2=ownData.length;
    let arr=data.split(',');
    let addressArray=[];
    outer:
    for(let j=0;j<len2;j++){
        if(arr[0]==ownData[j].value){
            addressArray.push(ownData[j].label);
            for(let m=0;m<ownData[j].children.length;m++){
                if(arr[1]==ownData[j].children[m].value){
                  addressArray.push(ownData[j].children[m].label);
                    for(let n=0;n<ownData[j].children[m].children.length;n++){
                        if(arr[2]==ownData[j].children[m].children[n].value){
                          addressArray.push(ownData[j].children[m].children[n].label);
                            break outer;
                        }
                    }
                }
            }
        }
    }
    return addressArray;
  },
  //获取经纬度后
  handlemapok:function (location) {
    this.state.park.parkLatitude=location.toString();
    this.setState({
        loading:false
    });
  },
  onClickUpdate:function(){
    if(Common.formValidator(this, this.state.park)){
      this.setState({loading: true});
      ParkManageActions.updatePark( this.state.park );
    }
  },
    onPreviewImage: function(file) {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    },
    handleCancel: function (){
        this.setState({ previewVisible: false })
    },
    onRemoveImage:function(file){
        if(length===5){
            length=length-2;
        }
        else{
            length--;
        }

        /*if(typeof file.response=='object'){
          var imgId=file.response.object[0].id;
          this.setState({isRemove:true});
          ProductActions.deleteImage(imgId);
        }*/
        return true;
    },


    beforeUpload: function(file) {
        const isImage = (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/gif' || file.type === 'image/png'||file.type==='image/bmp');
        if(!isImage){
            Common.warnMsg('请选择图片文件');
            return false;
        }
        if(file.size/1024/1024>10){
            Common.warnMsg('请选择小于10M的图片文件');
            return false;
        }
        length++;
        if(length>4){
            length=4;
            return false;
        }
        else{
            this.setState({fileName:file.name});
            return true;
        }

    },
    upload:function(info){
        let failedImgName=[];
        let fileId = '';
        for(let i=0;i<info.fileList.length;i++){
            info.fileList[i].name = '';
            if(typeof info.fileList[i].response=='object'){
                let result=info.fileList[i].response;
                if(result){
                    fileId = result.object
                }
            }
        }
        let park = Object.assign({},this.state.park);
        park.parkSymbol = fileId;
        const isImage = (info.file.type === 'image/jpeg' || info.file.type === 'image/jpg' || info.file.type === 'image/gif' || info.file.type === 'image/png'||info.file.type==='image/bmp');
        if(!isImage && info.file.status!='removed'){
            return false;
        }
        if(info.file.size/1024/1024>10 && info.file.status!='removed'){
            return false;
        }
        this.setState({fileList:info.fileList,park});
    },
  render: function () {
      let formLayout = {
          labelCol:{span:2},
          wrapperCol:{span:18},
          style:{
            margin:15
          }
      };
      let selectParkAddress=this.state.parkLocationAddress+this.state.park.parkAddress;
      let hints = this.state.hints;
      var actionUrl =Utils.wisdomparkUrl+'gridfs/uploadFile';
      var fileList=this.state.fileList;
      const { previewVisible, previewImage } = this.state;
      const uploadButton = (
          <div>
              <Button size="large">
                  <Icon type="upload" /> upload
              </Button>
          </div>
      );

      const uploadBox = (
          <Upload
              name="file"
              listType="picture"
              fileList={fileList}
              action={actionUrl}
              ustomRequest={FileRequest}
              beforeUpload={this.beforeUpload}
              onRemove={this.onRemoveImage}
              onPreview={this.onPreviewImage}
              onChange={this.upload}
              multiple={false}
              accept="image/*"
          >
              {fileList.length >= 1? null : uploadButton}
          </Upload>
      );
    return (
       
            (
            <Form layout='horizontal'  style={{marginTop:30}}>
          <FormItem {...formLayout} key='parkName' label='园区名称'  required={true} colon={true} help={hints.parkNameHint} validateStatus={hints.parkNameStatus} >
            <Input type='text' name='parkName' id='parkName' value={this.state.park.parkName} onChange={this.handleOnChange}  size='large' style={{width:'50%'}} />
          </FormItem>
          <FormItem  {...formLayout} key='parkSymbol' label='园区标志' colon={true} help={hints.parkSymbolHint} validateStatus={hints.parkSymbolStatus}  >
             <div style={{width:'50%'}}>
             {uploadBox}
              <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                  <img alt="example" style={{ width: '100%' }} src={previewImage} />
              </Modal>
             </div>
          </FormItem>
          <FormItem  {...formLayout} key='parkLocation' label='园区地址' required={true} colon={true} help={hints.parkLocationHint} validateStatus={hints.parkLocationStatus}  >
            <div style={{width:'50%',overflow:'hidden',marginRight: '-30px'}}>
            {/* <div key="btnClose" size="large" style={{marginRight:50,border:'1px solid #d9d9d9',borderRadius:4,width:100,display:'inline-block',textAlign:'center'}}>{this.state.parkLocation[0]}</div>
            <div key="btnCloses" size="large"  style={{marginRight:50,border:'1px solid #d9d9d9',borderRadius:4,width:100,display:'inline-block',textAlign:'center'}}>{this.state.parkLocation[1]}</div>
            <div key="btnClosess" size="large"  style={{border:'1px solid #d9d9d9',borderRadius:4,width:100,display:'inline-block',textAlign:'center'}}>{this.state.parkLocation[2]}</div> */}
            <div key="btnClose" size="large" style={{float: 'left', width: 'calc(33.333% - 10px)',border:'1px solid #d9d9d9',textAlign:'center',borderRadius:4,marginRight: '10px' }}>{this.state.parkLocation[0]}</div>
            <div key="btnCloses" size="large"  style={{float: 'left', width: 'calc(33.333% - 10px)',border:'1px solid #d9d9d9',textAlign:'center',borderRadius:4,marginRight: '10px'}}>{this.state.parkLocation[1]}</div>
            <div key="btnClosess" size="large"  style={{float: 'left', width: 'calc(33.333% - 0px)',border:'1px solid #d9d9d9',textAlign:'center',borderRadius:4,marginRight: '0px'}}>{this.state.parkLocation[2]}</div>
            </div>
          </FormItem>
          {/* <FormItem  {...formLayout} key='parkAddress' label='    ' colon={false} help={hints.parkAddressHint} validateStatus={hints.parkAddressStatus}  >
            <div style={{width:'50%'}}>
            <div style={{display:'inline-block'}}>
            <Input type='text' name='parkAddress' id='parkAddress' value={this.state.park.parkAddress} onChange={this.handleOnChange}  size='large'/>
            </div>
            <div style={{display:'inline-block'}}>
            <AMapComponent ref={ref=>this.AMapComponent=ref} value={selectParkAddress} handlemapok={this.handlemapok} position={this.state.park.parkLatitude===undefined?"":this.state.park.parkLatitude} lngType/>
            </div>
            </div>
           </FormItem> */}
           <FormItem  {...formLayout} key='parkAddress' label='    ' colon={false} help={hints.parkAddressHint} validateStatus={hints.parkAddressStatus}>
            <Input type='text' name='parkAddress' id='parkAddress' value={this.state.park.parkAddress} onChange={this.handleOnChange}  size='large' style={{width:'50%'}}/>
           </FormItem>
           <FormItem  {...formLayout} key='parkLatitude' label='    ' colon={false} help={hints.parkLatitudesHint} validateStatus={hints.parkLatitudeStatus}>
            <AMapComponent ref={ref=>this.AMapComponent=ref} value={selectParkAddress} handlemapok={this.handlemapok} position={this.state.park.parkLatitude===undefined?"":this.state.park.parkLatitude} lngType/>
           </FormItem>
          <FormItem {...formLayout} key='doorSwitchRange' label='开门半径' required={true} colon={true} help={hints.doorSwitchRangeHint} validateStatus={hints.doorSwitchRangeStatus} >
            <Input type='text' addonAfter="米" name='doorSwitchRange' id='doorSwitchRange' value={this.state.park.doorSwitchRange} onChange={this.handleOnChange}  size='large' style={{width:'50%'}} />
          </FormItem>
          <FormItem {...formLayout} key='parkDesc' label='园区介绍' colon={true} help={hints.parkDescHint} validateStatus={hints.parkDescStatus} >
            <TextArea rows={8} id='parkDesc' name='parkDesc' value={this.state.park.parkDesc} onChange={this.handleOnChange} style={{width:'50%'}}/>
          </FormItem>
          <FormItem {...formLayout} key='parkWebsite' label='官方网站' colon={true} help={hints.parkWebsiteHint} validateStatus={hints.parkWebsiteStatus} >
            <Input type='text' name='parkWebsite' id='parkWebsite' value={this.state.park.parkWebsite} onChange={this.handleOnChange}  size='large' style={{width:'50%'}} />
          </FormItem>
          <FormItem {...formLayout} key='save' label='    ' colon={false} help={hints.userNameHint} validateStatus={hints.userNameStatus} >
            <div style={{width:'50%'}}><Button key="btnOK" type="primary"  size="large" onClick={this.onClickUpdate} loading={this.state.loading} style={{float:'right'}}>保存</Button></div>
          </FormItem>
        </Form>
        )
    );
  }
});

module.exports = ParkManagePage;