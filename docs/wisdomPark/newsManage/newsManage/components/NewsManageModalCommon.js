/**
 *   Create by Malson on 2018/8/14
 */
import React from 'react';

let Reflux = require('reflux');
import {Form, Modal, Spin, Button, Input, Select, Row, Col, Tabs, Radio, Upload, Icon, message} from 'antd';
import ModalForm from '../../../../lib/Components/ModalForm';
import DocTemplate from './DocTemplate';
import '../style/index.scss';

// 引入编辑器以及编辑器样式
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/braft.css'

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;

let Common = require('../../../../public/script/common');
let Utils = require('../../../../public/script/utils');
const TabPane = Tabs.TabPane;
let NewsManageStore = require('../store/NewsManageStore.js');
let NewsManageActions = require('../action/NewsManageActions');

//获取资讯分类
let NewsManageTypeActions = require('../../newsTypeManage/action/NewsTypeManageActions');
let NewsManageTypeStore = require('../../newsTypeManage/store/NewsTypeManageStore');

let FormDef = require('./NewsManageForm');

let NewsManageDoorModal = React.createClass({
  getInitialState: function () {
    return {
      loading: false,
      newsManage: {},
      newsTypeArr: [],
      hints: {},
      validRules: [],
      tabIndex: '2',
      previewVisible: false,
      previewImage: '',
      fileList: [],
      doneUuidArr: [],
      wrapLoading: false
    }
  },
  
  mixins: [Reflux.listenTo(NewsManageStore, 'onServiceComplete'), Reflux.listenTo(NewsManageTypeStore, 'onNewsTypeServiceComplete'), ModalForm('newsManage')],
  onNewsTypeServiceComplete(data) {
    this.setState({loading: false});
    if (data.errMsg) {
      this.setState({errMsg: data.errMsg});
      return;
    }
    if (data.operation === "retrieve") {
      let newsTypeArr = data.recordSet || [];
      this.setState({newsTypeArr});
    }
  },
  onServiceComplete: function (data) {
    this.setState({loading: false});
    if (data.errMsg || data.errMsg === null) {
      this.setState({errMsg: data.errMsg});
      return;
    }
    switch (data.operation) {
      case 'create':
      case 'update':
        this.setState({loading: false});
        this.goBack();
        break;
      case 'get-by-uuid':
        this.addData();
        let newsManage = data.recordSet;
        let raw = newsManage.raw;
        try {
          raw = JSON.parse(raw);
        } catch (err) {
        }
        this.braftEditor.setContent(raw);
        newsManage.content = "value";//跳过校验  不需要传入过量的字符串
        let fileList = newsManage.covers || [];
        let doneUuidArr = [];
        fileList.map(item => {
          item.response.object = item.response.object.id?item.response.object.id:item.response.object;
          doneUuidArr.push(item.response.object);
          item.thumbUrl = item.url;
          item.type = 'image';
        });
        this.setState({newsManage, fileList, doneUuidArr}, () => {
          this.setState({wrapLoading: false});
        });
        break;
      default:
        break;
    }
  },
  componentDidMount: function () {
    this.state.validRules = FormDef.getNewsManageFormRule(this);
    this.clear();
  },
  showModal: function () {
    this.clear();
  },
  goBack() {
    this.clear();
    this.props.goBack()
  },
  addData() {
    NewsManageTypeActions.retrieveNewsTypeManage({}, 0, 200);
  },
  initEditData: function (uuid) {
    this.clear();
    this.setState({wrapLoading: true});
    NewsManageActions.getNewsByUuid(uuid);
  },
  clear: function () {
    FormDef.initNewsManageForm(this.state.newsManage);
    // FIXME 输入参数，对象初始化
    this.state.hints = {};
    this.setState({loading: false, wrapLoading: false});
  },
  onClickSave: function () {
    let {newsManage, doneUuidArr} = this.state;
    this.setEditData();
    if (Common.formValidator(this, newsManage)) {
      let picLength = doneUuidArr.length;
      if (picLength) {//上传图片的情况
        if (newsManage.coverType === '2' && picLength !== 3) {
          Common.errMsg("请上传正确数量图片！");
          return;
        }
      }
      this.getHTML(this.props.actionType);
    }
  },
  tabsChange(key) {
    if (key === '1') {
      this.goBack();
    } else {
      this.setState({tabIndex: key});
    }
  },
  handleCover(e) {
    let val = e.target.value;
    this.setState({
      newsManage: Object.assign({}, this.state.newsManage, {coverType: val}),
      fileList: this.state.fileList.slice(0, 1),
      doneUuidArr: this.state.doneUuidArr.slice(0, 1),
    });
  },
  handleTypeChange(val) {
    let newsManage = Object.assign({}, this.state.newsManage, {typeUuid: val});
    this.setState({newsManage});
    Common.validator(this, newsManage, 'typeUuid');
  },
  validateFn: function (file) {
    Common.errMsg('文件太大！')
    return file.size < 1024 * 1024 * 10
  },
  getHTML: function (type) {
    let {newsManage, doneUuidArr} = this.state;
    let sendObj = Utils.deepCopyValue(newsManage);
    let userName = Common.getUserInfo() && Common.getUserInfo().userName;
    let htmlInfo = {
      html:this.braftEditor.getHTMLContent(),
      title:sendObj.title,
      userName,
      publishDate:sendObj.publishDate?sendObj.publishDate.split(' ')[0]:Utils.now()
    };
    let innerHtml = DocTemplate(htmlInfo);
    let rawContent = this.braftEditor.getRawContent();
    sendObj.raw = JSON.stringify(rawContent);
    sendObj.content = innerHtml;
    sendObj.publishType = 1;
    sendObj.coverUuids = doneUuidArr.toString();
    this.setState({loading: true});
    if (type === 'add') {
      NewsManageActions.create(sendObj);
    } else if (type === 'edit') {
      NewsManageActions.update(sendObj);
    }
  },
  handleCancel() {
    this.setState({previewVisible: false});
  },
  handlePreview(file) {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  },
  beforeUpload(file, fileList) {
    let flag;
    if (!this.judgeFile(file)) {
      Common.errMsg('文件格式不正确！');
      flag = false
    } else {
      flag = true;
    }
    return flag;
  },
  judgeFile(file) {
    let type = file.type;
    if (type === 'image/png'  ||
        type === 'image/jpeg' ||
        type === 'image/bmp'  ||
        type === 'image/jpg'  ||
        type === 'image/gif'  ||
        type === 'image') {
      if (file.size < 10 * 1024 * 1024) {
        return true
      } else {
        Common.errMsg('文件太大！')
      }
    }
    return false;
  },
  handleChange(info) {
    let fileList = info.fileList;
    let doneUuidArr = [];
    fileList = fileList.filter(item => this.judgeFile(item));
    for (let i = 0; i < fileList.length; i++) {
      if (fileList[i].status === 'done') {
        if (fileList[i].response.errDesc) {
          fileList[i].status = 'error';
        } else {
          let id =  fileList[i].response.object;
          doneUuidArr.push(id)
        }
      }
    }
    fileList = fileList.splice(0, 3);
    this.setState({fileList, doneUuidArr})
  },
  //失去焦点塞值
  setEditData: function () {
    let flag = this.braftEditor.isEmpty();
    let content = flag ? "" : "value";//躲过空值校验
    this.state.newsManage.content = content;
    this.setState({loading: this.state.loading});
    if (!flag) {
      Common.validator(this, this.state.newsManage, 'content')
    }
  },
  uploadFn(param) {
    // let reader = new FileReader();
    // reader.readAsDataURL(param.file);
    // reader.onloadend = function (e) {
    //   param.success({url: reader.result})
    // };
    const serverURL = Utils.wisdomparkUrl + 'gridfs/upload';
    const xhr = new XMLHttpRequest;
    const fd = new FormData();
    const successFn = (event) => {
      // 假设服务端直接返回文件上传后的地址
      // 上传成功后调用param.success并传入上传后的文件地址
      let thisTarget = event.target;
      if(thisTarget.status===200 || thisTarget.statusText==="OK"){
        let response = thisTarget.response;
        try { response = JSON.parse(response)}catch (err){}
        let url = response.object,
            id = response.object.split("=")[1];
        param.success({
          url,
          meta: {
            id,
            alt: '图片',
          }
        })
      }
      else{
        param.error({
          msg: '上传错误！'
        })
      }
    };
  
    const progressFn = (event) => {
      // 上传进度发生变化时调用param.progress
      param.progress(event.loaded / event.total * 100)
    };
  
    const errorFn = (response) => {
      // 上传发生错误时调用param.error
      param.error({
        msg: '上传错误！'
      })
    };
    xhr.upload.addEventListener("progress", progressFn, false);
    xhr.addEventListener("load", successFn, false);
    xhr.addEventListener("error", errorFn, false);
    xhr.addEventListener("abort", errorFn, false);
    fd.append('file', param.file);
    xhr.open('POST', serverURL, true);
    xhr.send(fd);
  },
  render: function () {
    let tabIndex = this.state.tabIndex;
    let {newsManage} = this.state;
    let imageLength = newsManage.coverType === '2' ? 3 : newsManage.coverType === '1' ? 1 : 0;
    const editorProps = {
      height: 300,//编辑器高度,
      tabIndents: 4,
      contentFormat: 'raw',
      placeholder: '请输入内容',
      fontSizes: [12, 16, 20, 24],
      media: {
        allowPasteImage: true, // 是否允许直接粘贴剪贴板图片（例如QQ截图等）到编辑器
        image: true, // 开启图片插入功能
        uploadFn: this.uploadFn, // 指定上传函数，说明见下文
      },
      controls: [
        'undo', 'redo', 'split', 'font-size',
        'text-color', 'bold', 'italic', 'underline', 'strike-through',
        'remove-styles', 'text-align', 'split', 'list_ul',
        'list_ol', 'blockquote', 'split', 'link', 'split', 'media', 'clear'
      ],
      allowPasteImage: false,
      imageControls: {
        floatLeft: false,
        floatRight: false,
        alignLeft: false,
        alignCenter: false,
        alignRight: false,
        link: false,
        size: false
      },
      colors:[
        '#000000', '#333333', '#999999', '#cccccc',
        '#61a951', '#16a085', '#07a9fe', '#003ba5', '#8e44ad', '#f32784',
        '#c0392b', '#f39c12',
      ],
    };
    const {previewVisible, previewImage, fileList, hints, wrapLoading, newsTypeArr} = this.state;
    const uploadButton = (
        <div>
          <Icon type="plus"/>
          <div className="ant-upload-text">上传</div>
        </div>
    );
    let formLayout = {
      labelCol: {span: 2},
      wrapperCol: {span: 20},
      style: {
        marginTop: 10
      }
    };
    let newTypeOptions = newsTypeArr.map(item => {
      return <Option value={item.uuid} key={item.uuid}>{item.optionName}</Option>
    });
    let noTypeOption = newsTypeArr.filter(item => item.uuid === newsManage.typeUuid).length || this.props.actionType === 'add' ? '' :
        <Option value={newsManage.typeUuid} key={newsManage.typeUuid}>其他</Option>
    let uploadProps = {
      name: 'file',
      // action: Utils.wisdomparkUrl + 'newsInfo/uploadFile',
      action: Utils.wisdomparkUrl + 'gridfs/uploadFile',
      listType: "picture-card",
      fileList: fileList,
      onPreview: this.handlePreview,
      onChange: this.handleChange,
      beforeUpload: this.beforeUpload
    };
    return (
        <Spin spinning={wrapLoading}>
          <div style={{display: 'none'}} id='formatEdit'/>
          <Tabs activeKey={tabIndex} onChange={this.tabsChange} style={{paddingBottom: 40}}>
            <TabPane tab="返回" key="1"/>
            <TabPane tab='发布文章' key="2">
              <Form layout='horizontal'>
                <FormItem {...formLayout} style={{marginTop: 0}} key='title' label='设置标题' required colon={false}
                          help={hints.titleHint} validateStatus={hints.titleStatus}>
                  <div className='input-wrap'>
                    <Input placeholder='请输入标题'
                           className='add-input'
                           id='title'
                           onChange={this.handleOnChange}
                           value={newsManage.title}
                    />
                    <div className='count'><span>{newsManage.title ? newsManage.title.length : 0}</span>/30</div>
                  </div>
                </FormItem>
                <FormItem {...formLayout} key='content' label='资讯内容' required colon={false} help={hints.contentHint}
                          validateStatus={hints.contentStatus}>
                  <BraftEditor
                      ref={ref => this.braftEditor = ref}
                      {...editorProps}
                  />
                </FormItem>
                <FormItem {...formLayout} key='coverType' label='设置封面' colon={false} help={hints.coverTypeHint}
                          validateStatus={hints.coverTypeStatus}>
                  <RadioGroup value={newsManage.coverType} onChange={this.handleCover}>
                    <Radio value="1">单图</Radio>
                    <Radio value="2">三图</Radio>
                  </RadioGroup>
                  <div style={{marginTop: 10}}>
                    <div className="clearfix">
                      <Upload {...uploadProps}>
                        {fileList.length >= imageLength ? null : uploadButton}
                      </Upload>
                      <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                        <img alt="example" style={{width: '100%'}} src={previewImage}/>
                      </Modal>
                    </div>
                  </div>
                </FormItem>
                <FormItem {...formLayout} key='typeUuid' label='设置分类' required colon={false} help={hints.typeUuidHint}
                          validateStatus={hints.typeUuidStatus}>
                  <Select value={newsManage.typeUuid} style={{width: 200}} onChange={this.handleTypeChange}>
                    <Option value="" disabled>请选择分类</Option>
                    {newTypeOptions}
                    {noTypeOption}
                  </Select>
                </FormItem>
                <FormItem {...formLayout} key='origin' label='信息来源' required colon={false} help={hints.originHint}
                          validateStatus={hints.originStatus}>
                  <Input placeholder='请输入信息来源'
                         id='origin'
                         name='origin'
                         value={newsManage.origin}
                         onChange={this.handleOnChange}
                  />
                </FormItem>
                <div style={{textAlign: 'center', marginTop: 20}}>
                  <Button type='primary' loading={this.state.loading} onClick={this.onClickSave}
                          style={{width: 100}}>发布</Button>
                </div>
              </Form>
            </TabPane>
            {/*<TabPane tab="发布图集" key="3" disabled />*/}
            {/*<TabPane tab="发布视频" key="4" disabled />*/}
          </Tabs>
        </Spin>
    );
  }
});

export default NewsManageDoorModal;
