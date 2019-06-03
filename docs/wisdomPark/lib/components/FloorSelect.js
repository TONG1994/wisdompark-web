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
        if(datas.operation == 'floor') {
            this.setState({
                loading: false,
                recordSet: datas.recordSet,
            });
        }
    },
    initDate: function () {
        this.setState({ loading:true});
        const {tower} = this.props;
       CommonActions.getFloorByBuilding({object:{'buildingUuid':tower}});
    },
    rest:function(){
        this.setState({ recordSet:[]});
    },
  render: function () {
      let array =  this.state.recordSet;
      const children = [];
      array.map(item=>{
          children.push(<Select.Option  key={item.uuid} value={item.uuid} >{item.floorName}</Select.Option>);
      });
      let box;
       box= (<Select mode="multiple" size='large'{...this.props}>
           {children}
      </Select>)

      return this.state.loading ? <Spin>{box}</Spin> : box;
  }
});
module.exports = FloorSelect;