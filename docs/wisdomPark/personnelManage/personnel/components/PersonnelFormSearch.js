/**
 *   Created by chenhui on 2018/5/8
 **/
import { AutoComplete, Input, Icon } from 'antd';
const Option = AutoComplete.Option;
import React from 'react';
var Reflux = require('reflux');
import PersonnelFormSearchStore from '../store/PersonnelStore';
import PersonnelFormSearchActions from '../action/PersonnelActions';

var PersonnelFormSearchSelect = React.createClass({
    getInitialState: function () {
        return {
            data: [],
            value: '',
            valueUuid: '',
            isDisabled: false,
        };
    },
    mixins: [Reflux.listenTo(PersonnelFormSearchStore, 'onServiceComplete')],
    onServiceComplete: function (datas) {
        var data = [];
        if (datas.personnelSet && datas.personnelSet.length) {
            data = datas.personnelSet;

        } else {
            data.push({ companyUuid: '无匹配结果', companyName: '无匹配结果', companyCode: '' })
        }
        this.setState({ data });


    },
    changeDisabled: function (value) {
        this.setState({ isDisabled: value });
    },

    handleChange: function (values) {
         var value = values.split(',')[0].replace(/(^\s*)/g, "");
        if (value == '无匹配结果' || value == '') {
            this.setState({
                data: [],
                value: '',
            });
        } else {
            if(values.split(',')[1] != undefined){
                value= value+"("+values.split(',')[1] +")";
            }
            this.setState({ value });
            PersonnelFormSearchActions.retrieveCompany({ companyName: values.split(',')[0] }, 0, 0);
        }

    },
    onFocus:function(){
        PersonnelFormSearchActions.retrieveCompany({ companyName: this.state.value.split('(')[0]},0,0);
    },
    onBlur: function () {
        var dataArr = this.state.data;
        let value = this.state.value.split('(')[0];
        let index = dataArr.findIndex(item => item.companyName == value);
        if (index === -1) {
            this.setState({
                data: [],
                value: '',
                valueUuid: ''
            });
            this.props.fromWhere('')
        } else {
            if(this.state.value.split('(')[1] == undefined){
                value = this.state.value+"("+ dataArr[index].companyCode +")";
                this.setState({value});
            }
            this.setState({
                data: [],
                valueUuid: dataArr[index].uuid
            });
            this.props.fromWhere({ 
                companyName: dataArr[index].companyName, 
                companyUuid: dataArr[index].uuid
             })
        }

    },
    changeValue:function(data){
        this.setState({
            value:data
        });
    },
    clear: function () {
        this.setState({
            data: [],
            value: '',
            valueUuid: ''
        });
    },
    render() {
        let options = [];
        this.state.data.map(d => {
            d.companyCode != '' ?
                options.push(<Option key={[d.companyName,d.companyCode,d.uuid]}>{d.companyName}({d.companyCode})</Option>) :
                options.push(<Option key={[d.companyName,d.companyCode,d.uuid]}>{d.companyName}</Option>)
        });
        return (
            <AutoComplete
                {...this.props}
                mode="combobox"
                value={this.state.value}
                placeholder='输入数据来源并选择'
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                onChange={this.handleChange}
                onBlur={this.onBlur}
                onFocus={this.onFocus}
                size='large'
                dataSource={options}
                disabled={this.state.isDisabled}
            >
                <Input suffix={<Icon type="search" className="certain-category-icon" />} />
            </AutoComplete>
        );
    }
}
);
module.exports = PersonnelFormSearchSelect;
