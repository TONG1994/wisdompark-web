import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
var Common = require('../../public/script/common');
var Utils = require('../../public/script/utils');
var FormUtil = require('./FormUtil');

import { Form, Modal, Button, Input, Table, Tabs } from 'antd';
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

var EditTable = React.createClass({
    getInitialState: function () {
        return {
            modal: false,
            tableConf: {},
            activeTab: '',
            tableName: '',
            columns: [],
            selectedRowKeys: [],
            activeTable: {
                name: '',
                columns: []
            },
        };
    },

    // 第一次加载
    componentDidMount: function () {
    },

    initPage: function (tableName, columns) {
        // 读取配置信息
        var str = window.localStorage[tableName];
        if (str) {
            this.state.tableConf = JSON.parse(str);
        }

        var activeName = null;
        var recordSet = this.state.tableConf.tables;
        var conf2 = FormUtil.getTableConf(tableName);
        var aName = conf2.activeName;
        if (aName) {
            var len = recordSet.length;
            for (var i = 0; i < len; i++) {
                if (recordSet[i].name === aName) {
                    activeName = aName;
                    break;
                }
            }
        }

        if (!activeName) {
            if (recordSet && recordSet.length > 0) {
                activeName = recordSet[0].name;
            }
        }

        // 当前选中的表格
        this.setActiveTable(activeName);

        var cols = [];
        var len = columns.length;
        for (var i = 0; i < len; i++) {
            var c2 = columns[i];
            var c = { name: c2.key, title: c2.title, width: c2.width };
            cols.push(c);
        }

        this.setState({
            tableName: tableName,
            columns: cols,
            activeTab: activeName
        });
    },

    onClickSave: function () {
        var tableName = this.state.tableName;
        var recordSet = this.state.tableConf.tables;
        if (!recordSet) {
            window.localStorage[tableName] = null;
            this.toggle();
            return;
        }

        for (var i = recordSet.length - 1; i >= 0; i--) {
            if (recordSet[i].name === '') {
                alert('名称不能空');
                return;
            }
        }

        // 保存列信息
        this.saveColumns();

        // 保存
        window.localStorage[this.state.tableName] = JSON.stringify(this.state.tableConf);
        this.toggle();

        if (this.props.onTableChange) {
            this.props.onTableChange();
        }
    },
    onClickDelete: function () {
        if (!this.state.activeTable) {
            return;
        }

        var recordSet = this.state.tableConf.tables;
        if (!recordSet || recordSet.length === 0) {
            return;
        }

        var idx = -1;
        for (var i = recordSet.length - 1; i >= 0; i--) {
            if (recordSet[i] === this.state.activeTable) {
                idx = i;
                break;
            }
        }

        if (idx < 0) {
            return;
        }

        recordSet.splice(idx, 1);

        this.state.activeTable = {};
        if (recordSet.length > 0) {
            this.state.activeTable = recordSet[0];
            this.state.activeTab = this.state.activeTable.name;
        }

        this.setState({
            modal: this.state.modal
        });
    },
    toggle: function () {
        this.setState({
            modal: !this.state.modal
        });
    },
    handleOnChange: function (e) {
        var id = parseInt(e.target.id);
        this.state.columns[id].width = e.target.value;

        this.setState({
            modal: this.state.modal
        });
    },
    //选项变化
    onSelectChange: function (selectedRowKeys) {
        // console.log(selectedRowKeys)
        this.setState({ selectedRowKeys: selectedRowKeys });
    },
    onNameChange: function (e) {
        var conf = this.state.tableConf;
        if (!conf.tables || conf.tables.length === 0){
            conf.tables = [this.state.activeTable];
        }

        var value = '' + e.target.value;
        var conf = this.state.activeTable;
        conf.name = value;
        this.state.activeTab = value;
        this.setState({ activeTable: conf });
    },
    onClickTab: function (activeKey) {
        this.setActiveTable(activeKey);
        this.setState({ activeTab: activeKey });
    },
    saveColumns: function () {
        if (this.state.activeTable) {
            var colMap = {};
            for (var i = this.state.selectedRowKeys.length - 1; i >= 0; i--) {
                var name = this.state.selectedRowKeys[i];
                colMap[name] = 1;
            }

            var selCols = [];
            var len = this.state.columns.length;
            for (var i = 0; i < len; i++) {
                var c = this.state.columns[i];
                if (colMap[c.name]) {
                    selCols.push(c);
                }
            }

            this.state.activeTable.columns = selCols;
        }
    },
    setActiveTable: function (confName) {
        this.saveColumns();

        this.state.selectedRowKeys = [];
        var recordSet = this.state.tableConf.tables;
        if (!recordSet) {
            return;
        }

        var len = recordSet.length;
        for (var i = 0; i < len; i++) {
            if (recordSet[i].name === confName) {
                this.state.activeTable = recordSet[i];
                var cols = recordSet[i].columns;
                if (cols) {
                    for (var x = 0; x < cols.length; x++) {
                        this.state.selectedRowKeys.push(cols[x].name);
                    }
                }

                break;
            }
        }
    },
    onClickAdd: function () {
        var recordSet = this.state.tableConf.tables;
        if (!recordSet) {
            recordSet = [];
            this.state.tableConf.tables = recordSet;
        }

        var id = '' + (recordSet.length + 1);
        var table = { name: '表格' + id };
        recordSet.push(table);

        this.state.activeTab = table.name;
        this.setActiveTable(table.name);
        this.setState({
            modal: this.state.modal
        });
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

        const columns = [
            {
                title: '名称',
                dataIndex: 'title',
                key: 'title',
                width: 140,
            },
            {
                title: '宽度',
                dataIndex: 'width',
                key: 'width',
                width: 140,
                render: (text, record, index) => {
                    return (<Input id={index} type='text' style={{ width: '100%' }} value={text} onChange={this.handleOnChange}></Input>);
                },
            },
        ];

        const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys: selectedRowKeys,
            onChange: this.onSelectChange,
            onSelectAll: (selected, selectedRows, changeRows) => {
                this.state.selectedRows = selectedRows;
            },
            onSelect: (record, selected, selectedRows) => {
                this.state.selectedRows = selectedRows;
            },
        };

        // tabs
        var tagList = [];
        var recordSet = this.state.tableConf.tables;
        var count = recordSet ? recordSet.length : 0;
        for (var i = 0; i < count; i++) {
            var t = recordSet[i];
            tagList.push(<TabPane tab={t.name} key={t.name} style={{ width: '100%' }}></TabPane>);
        }

        var tabs = null;
        if (tagList.length > 0) {
            tabs = <Tabs activeKey={this.state.activeTab} onChange={this.onClickTab} tabBarExtraContent={<Button key="btnAdd" size="large" onClick={this.onClickAdd}>增加</Button>}
                tabBarStyle={{ paddingLeft: '4px', margin: '-36px 0 0' }} style={{ width: '100%', padding: '36px 0 0' }}>
                {tagList}
            </Tabs>;
        }
        else {
            tabs = <Button key="btnAdd" size="large" onClick={this.onClickAdd}>增加</Button>
        }

        var cs = Common.getGridMargin(this);
        var recordSet = this.state.columns;
        return (
            <Modal visible={this.state.modal} width='540px' title="编辑表格" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
                footer={[
                    <div key="footerDiv" style={{ display: 'block', textAlign: 'right' }}>
                        <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} >保存</Button>{' '}
                        <Button key="btnClear" type="danger" size="large" onClick={this.onClickDelete}>删除</Button>{' '}
                        <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
                    </div>
                ]}
            >
                <div>
                    {tabs}
                    <Form layout={layout} style={{ paddingTop: '16px' }}>
                        <FormItem {...formItemLayout} label="名称" required={false} colon={true} className={layoutItem}>
                            <Input type="text" name="name" id="name" value={this.state.activeTable.name} onChange={this.onNameChange} />
                        </FormItem>
                    </Form>

                    <div style={{ height: '320px', overflowY: 'auto' }}>
                        <Table columns={columns} dataSource={recordSet} rowKey={record => record.name} rowSelection={rowSelection} pagination={false} showHeader={false} size='small' bordered={Common.tableBorder} />
                    </div>
                </div>
            </Modal>
        );
    }
});

export default EditTable;

