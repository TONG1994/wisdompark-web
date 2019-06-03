import React from 'react';
var Reflux = require('reflux');
import {Select,Spin} from 'antd';
import SystemAccountManageStore from '../store/SystemAccountManageStore';
import SystemAccountManageAction from '../action/SystemAccountManageAction';

let ParkSelect = React.createClass({
    getInitialState: function () {
        return {
            loading:false,
            recordSet:[],
        };
    },

    mixins: [Reflux.listenTo(SystemAccountManageStore, 'onServiceComplete')],
    onServiceComplete: function(datas) {
        if(datas.operation == 'getAllPark'){
            this.setState({
                loading: false,
                recordSet:datas.recordSet,
            });
        }
    },

    componentDidMount:function(){
        this.initData();
    },

    initData: function () {
        let obj={
        "object":{}
        } 
        this.setState({ loading:true});
        SystemAccountManageAction.getAllPark(obj);
    },

    render: function () {
        const {
            required,
            ...attributes,
        } = this.props;
        let array = this.state.recordSet;
        var box;
        if (required) {
            box = <Select {...this.props} size='large'>
                {
                    array.map((lvl, i) => {
                        return <Select.Option key={lvl.uuid} value={lvl.uuid}>{lvl.parkName}</Select.Option>
                    })
                }
            </Select>
        }else {
            box = <Select {...this.props} size='large'>
                <Select.Option  value=''>-请选择 -</Select.Option>
                {
                    array.map((lvl, i) => {
                        return <Select.Option  key={lvl.uuid}  value={lvl.uuid}>{lvl.parkName}</Select.Option>
                    })
                }
            </Select>
        }

        return this.state.loading ? <Spin>{box}</Spin> : box;
    }
    });

module.exports = ParkSelect;