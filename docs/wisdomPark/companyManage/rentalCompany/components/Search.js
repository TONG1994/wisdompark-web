/**
 *   Created by chenhui on 2018/5/8
 **/
import { AutoComplete, Input,Icon } from 'antd';
const Option = AutoComplete.Option;
import React from 'react';
var Reflux = require('reflux');
let SettledCompanyStore = require('../../settledCompany/store/SettledCompanyStore.js');
let SettledCompanyActions = require('../../settledCompany/action/SettledCompanyActions');
var Validator = require('../../../../public/script/common');

var Search = React.createClass({
    getInitialState: function () {
        return {
            data: [],
            value: '',
            valueUuid: ''
        };
    },
    mixins: [Reflux.listenTo(SettledCompanyStore, 'onServiceComplete')],
    onServiceComplete: function (datas) {
        var data = [];
        if (datas.recordSet && datas.recordSet.length) {
            data = datas.recordSet;

        } else {
            data.push({ companyUuid: '无匹配结果', companyName: '无匹配结果' })
        }
        this.setState({ data });
    },
    changeValue:function(data){
        this.setState({
            value:data
        });
    },
    clear: function () {
        this.setState({ data: [], value: '' });
    },
    handleChange: function (value) {
        var value = value.split(',')[0].replace(/(^\s*)/g, "");
        if (value == '无匹配结果' || value == '' ) {
            this.setState({
                data: [],
                value: '',
            });
        } else {
            this.setState({ value });
            SettledCompanyActions.retrieveSettledCompany({ companyName: value },0,0);

        }
    },
    onFocus:function(){
        SettledCompanyActions.retrieveSettledCompany({ companyName: this.state.value},0,0);
    },
    onBlur: function () {
        var dataArr = this.state.data;
        let value = this.state.value;
        let index =  dataArr.findIndex(item => item.companyName == value);

        if (index === -1) {
            this.setState({
                data: [],
                value: '',
                valueUuid: ''
            });
            this.props.fromWhere('')
        } else {
            this.setState({
                data: [],
                valueUuid: dataArr[index].uuid
            });
            this.props.fromWhere({ companyName: dataArr[index].companyName,
                                     companyUuid: dataArr[index].uuid,
                                     buildingUuid: dataArr[index].buildingUuid,
                                     floorUuid: dataArr[index].floorUuid,
                                      cellUuid: dataArr[index].cellUuid,
                                     })
        }

    },
    clear: function () {
        this.setState({
            data: [],
            value: '',
            valueUuid: ''
        });
    },
    render() {
        const options = this.state.data.map(d => <Option key={[d.companyName,d.uuid]}>{d.companyName}</Option>);
        return (
            <AutoComplete
                {...this.props}
                mode="combobox"
                value={this.state.value}
                placeholder='输入企业名称并选择'
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                onChange={this.handleChange}
                onBlur={this.onBlur}
                onFocus={this.onFocus}
                size='large'
                dataSource={options}
            >
                <Input suffix={<Icon type="search" className="certain-category-icon" />} />
            </AutoComplete>
        );
    }
}
);
module.exports = Search;
