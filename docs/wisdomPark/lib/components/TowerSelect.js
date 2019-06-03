/**
 *   Create by Malson on 2018/7/24
 */

import React from 'react';
var Reflux = require('reflux');
import {Select,Spin} from 'antd';
import CommonStore from '../../../lib/data/CommonStore';
import CommonActions from '../../../lib/action/CommonActions';
var Common = require('../../../public/script/common');

let TowerSelect = React.createClass({
  getInitialState: function () {
    return {
        loading:false,
        recordSet:[],
    };
  },
    mixins: [Reflux.listenTo(CommonStore, 'onServiceComplete')],
    onServiceComplete: function(datas) {
      if(datas.operation == 'building'){
          this.setState({
              loading: false,
              recordSet:datas.recordSet,
          });
      }


    },
    componentDidMount:function(){
      this.initDate();
    },
    initDate: function () {
      this.setState({ loading:true});
      CommonActions.getBuildingByPark({object:{'parkUuid':Common.getSelectedParkUuid()}});
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
                      return <Select.Option key={lvl.uuid} value={lvl.uuid}>{lvl.buildingName}</Select.Option>
                  })
              }
          </Select>
      }
      else {
          box = <Select {...this.props} size='large'>
              <Select.Option  value=''>-请选择 -</Select.Option>
              {
                  array.map((lvl, i) => {
                      return <Select.Option  key={lvl.uuid}  value={lvl.uuid}>{lvl.buildingName}</Select.Option>
                  })
              }
          </Select>
      }

      return this.state.loading ? <Spin>{box}</Spin> : box;
  }
});

module.exports = TowerSelect;