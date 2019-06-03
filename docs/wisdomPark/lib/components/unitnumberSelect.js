/**
 *   Create by Malson on 2018/7/24
 */

import React from 'react';
var Reflux = require('reflux');
import {Select,Spin} from 'antd';
import CommonStore from '../../../lib/data/CommonStore';
import CommonActions from '../../../lib/action/CommonActions';

let FloorSelect = React.createClass({
  getInitialState: function () {
    return {
        loading:false,
        recordSet:[],
    };
  },
    mixins: [Reflux.listenTo(CommonStore, 'onServiceComplete')],
    onServiceComplete: function(datas) {
        if(datas.operation == 'cell') {
            this.setState({
                loading: false,
                recordSet: datas.recordSet,
            });
        }
    },
    initDate: function () {
        this.setState({ loading:true});
        const {floor} = this.props;
        if(floor != undefined &&floor.length != 0){
            CommonActions.getCellByFloor({object:{'floorUuid':floor}});
        }else{
            this.setState({
                loading: false,
                recordSet: [],
            });
        }
    },
    rest:function(){
        this.setState({ recordSet:[]});
    },

    render: function () {
      const {
          ...attributes,
      } = this.props;
      let array = this.state.recordSet;
      const children = [];
      array.map(item=>{
          children.push(<Select.Option key={item.cellUuid}>{item.cellName}</Select.Option>);
      });

      let box= <Select
          mode="multiple"
          size='large'
          {...this.props}>
          {children}
      </Select>

      return this.state.loading ? <Spin>{box}</Spin> : box;
  }
});
module.exports = FloorSelect;