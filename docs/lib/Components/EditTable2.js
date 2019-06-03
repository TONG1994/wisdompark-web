import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
var Common = require('../../public/script/common');
var Utils = require('../../public/script/utils');
var FormUtil = require('./FormUtil');

import { Form, Modal, Button, Input, Switch, Radio } from 'antd';
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const FormItem = Form.Item;

var EditTable = React.createClass({
    getInitialState: function () {
        return {
            modal: false,
            tableConf: {},
            tableName: '',
            mustPage: false,
            enableExport: true,
        };
    },

    // 第一次加载
    componentDidMount: function () {
    },

    // mustPage=必须分页, export=导出XLS
    initPage: function (tableName, mustPage, enableExport) {
        // 读取配置信息
        this.state.tableConf = FormUtil.getTableConf(tableName);
        if (mustPage === true) {
            this.state.tableConf.page = true;
        }

        this.setState({
            mustPage: mustPage,
            enableExport: enableExport,
            tableName: tableName
        });
    },

    onClickSave: function () {
        // 保存
        window.localStorage[this.state.tableName + 'Conf'] = JSON.stringify(this.state.tableConf);
        this.toggle();

        if (this.props.onTableChange) {
            this.props.onTableChange();
        }
    },
    toggle: function () {
        this.setState({
            modal: !this.state.modal
        });
    },
    onSizeChange: function (e) {
        var value = '' + e.target.value;
        var conf = this.state.tableConf;
        conf.size = value;
        this.setState({ tableConf: conf });
    },
    onShowLineChange: function (checked) {
        var conf = this.state.tableConf;
        conf.showLine = checked;
        this.setState({ tableConf: conf });
    },
    onWrapChange: function (checked) {
        var conf = this.state.tableConf;
        conf.wrap = checked;
        this.setState({ tableConf: conf });
    },
    onPageChange: function (checked) {
        var conf = this.state.tableConf;
        conf.page = checked;
        this.setState({ tableConf: conf });
    },
    onClickExport: function () {
        if (this.props.onExportFile) {
            this.props.onExportFile();
        }
    },

    render: function () {
        var layout = 'horizontal';
        var layoutItem = 'form-item-' + layout;
        const formItemLayout = {
            labelCol: ((layout == 'vertical') ? null : { span: 3 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 21 }),
        };
        const formItemLayout2 = {
            labelCol: ((layout == 'vertical') ? null : { span: 6 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 18 }),
        };

        var disablePage = (this.state.mustPage === true);
        var disableExport = (this.state.export === false);
        return (
            <Modal visible={this.state.modal} width='540px' title="编辑表格" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
                footer={[
                    <div key="footerDiv" style={{height:'34px'}}>
                        <div style={{ float: 'left', paddingLeft:'26px' }}>
                            <Button key="btnExport" size="large" onClick={this.onClickExport}>导出Excel文件</Button>
                        </div>
                        <div style={{ float: 'right', textAlign: 'right' }}>
                            <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} >保存</Button>{' '}
                            <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
                        </div>
                    </div>
                ]}
            >
                <div>
                    <Form layout={layout} style={{ paddingTop: '16px' }}>
                        <FormItem {...formItemLayout} label="行高" required={false} colon={true} className={layoutItem}>
                            <RadioGroup onChange={this.onSizeChange} value={this.state.tableConf.size}>
                                <RadioButton value="small">small</RadioButton>
                                <RadioButton value="middle">middle</RadioButton>
                                <RadioButton value="large">large</RadioButton>
                            </RadioGroup>
                        </FormItem>
                        <FormItem {...formItemLayout} label="竖线" required={false} colon={true} className={layoutItem}>
                            <Switch id='line' checkedChildren="显示" unCheckedChildren="隐藏" checked={this.state.tableConf.showLine} onChange={this.onShowLineChange} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="折行" required={false} colon={true} className={layoutItem}>
                            <Switch id='line' checkedChildren="折行" unCheckedChildren="不折行" checked={this.state.tableConf.wrap} onChange={this.onWrapChange} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="分页" required={false} colon={true} className={layoutItem}>
                            <Switch id='line' checkedChildren="分页" unCheckedChildren="不分页" disabled={disablePage} checked={this.state.tableConf.page} onChange={this.onPageChange} />
                        </FormItem>
                    </Form>
                </div>
            </Modal>
        );
    }
});

export default EditTable;

